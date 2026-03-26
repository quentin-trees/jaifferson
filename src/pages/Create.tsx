import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ArrowUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Step =
  | "welcome"
  | "email"
  | "topic"
  | "confirm_topic"
  | "visibility"
  | "max_participants"
  | "date"
  | "questions_review"
  | "review"
  | "publishing"
  | "done";

interface Message {
  role: "jaifferson" | "user";
  text: string;
}

const DEFAULT_QUESTIONS = [
  "What brings you to this topic, and what do you hope to leave with?",
  "What's the hardest thing you're working through right now?",
  "What's one question you'd want the group to wrestle with together?",
];

const Create = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("welcome");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Session data
  const [email, setEmail] = useState("");
  const [topicRaw, setTopicRaw] = useState("");
  const [topicRefined, setTopicRefined] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [maxParticipants, setMaxParticipants] = useState(8);
  const [scheduledAt, setScheduledAt] = useState("");
  const [questions, setQuestions] = useState<string[]>(DEFAULT_QUESTIONS);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Start conversation
  useEffect(() => {
    addJaiffersonMessage(
      "Welcome to Jaifferson. I'll help you create a session — a curated conversation around a topic that matters to you.\n\nLet's start. What's your email address?"
    );
    setStep("email");
  }, []);

  const addJaiffersonMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "jaifferson", text }]);
      setIsTyping(false);
    }, 600);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const value = input.trim();
    setInput("");
    addUserMessage(value);

    switch (step) {
      case "email":
        handleEmail(value);
        break;
      case "topic":
        handleTopic(value);
        break;
      case "confirm_topic":
        handleConfirmTopic(value);
        break;
      case "visibility":
        handleVisibility(value);
        break;
      case "max_participants":
        handleMaxParticipants(value);
        break;
      case "date":
        handleDate(value);
        break;
      case "questions_review":
        handleQuestionsReview(value);
        break;
      case "review":
        handleReview(value);
        break;
      default:
        break;
    }
  };

  const handleEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      addJaiffersonMessage("That doesn't look like a valid email. Could you try again?");
      return;
    }
    setEmail(value);
    setStep("topic");
    addJaiffersonMessage(
      `Got it, ${value.split("@")[0]}. Now — what's the topic you want to explore with your group?\n\nDescribe it in your own words. It can be rough — I'll help you refine it.`
    );
  };

  const handleTopic = (value: string) => {
    setTopicRaw(value);
    // Simple refinement — in production this would use AI
    const refined = value.charAt(0).toUpperCase() + value.slice(1);
    setTopicRefined(refined);
    setStep("confirm_topic");
    addJaiffersonMessage(
      `Here's how I'd frame that for your session:\n\n"${refined}"\n\nDoes that work for you? Type "yes" to confirm, or rephrase it and I'll use your version.`
    );
  };

  const handleConfirmTopic = (value: string) => {
    const lower = value.toLowerCase().trim();
    if (lower === "yes" || lower === "oui" || lower === "sí" || lower === "ok") {
      // Keep refined
    } else {
      setTopicRefined(value);
    }
    setStep("visibility");
    addJaiffersonMessage(
      "Should this session be public — visible in the Explore directory — or private, accessible only via a link you share?\n\nType "public" or "private"."
    );
  };

  const handleVisibility = (value: string) => {
    const lower = value.toLowerCase().trim();
    if (lower.includes("priv") || lower === "privé" || lower === "privée" || lower === "privada") {
      setIsPublic(false);
      addJaiffersonMessage(
        "Private it is. Only people with your link will see it.\n\nHow many seats at the table? Choose between 4 and 12."
      );
    } else {
      setIsPublic(true);
      addJaiffersonMessage(
        "Public — anyone can discover and apply.\n\nHow many seats at the table? Choose between 4 and 12."
      );
    }
    setStep("max_participants");
  };

  const handleMaxParticipants = (value: string) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 4 || num > 12) {
      addJaiffersonMessage("Please choose a number between 4 and 12.");
      return;
    }
    setMaxParticipants(num);
    setStep("date");
    addJaiffersonMessage(
      "When should this happen? Give me a date and time.\n\nFor example: \"April 15, 2026 at 7pm\" or \"2026-04-15 19:00\"."
    );
  };

  const handleDate = (value: string) => {
    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) {
      // Try a more flexible parse
      const now = new Date();
      addJaiffersonMessage(
        "I couldn't parse that date. Try something like \"April 15, 2026 at 7pm\" or \"2026-04-15 19:00\"."
      );
      return;
    }
    setScheduledAt(parsed.toISOString());
    setStep("questions_review");
    addJaiffersonMessage(
      `Noted — ${parsed.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at ${parsed.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}.\n\nNow, here are 3 onboarding questions that applicants will answer:\n\n1. ${questions[0]}\n2. ${questions[1]}\n3. ${questions[2]}\n\nType "ok" to keep them, or type your own questions (one per line).`
    );
  };

  const handleQuestionsReview = (value: string) => {
    const lower = value.toLowerCase().trim();
    if (lower !== "ok" && lower !== "oui" && lower !== "yes") {
      const lines = value.split("\n").filter((l) => l.trim());
      if (lines.length >= 1) {
        setQuestions(lines.slice(0, 3));
      }
    }
    setStep("review");

    const summary = `Here's your Jaifferson:\n\n**Topic:** ${topicRefined}\n**Visibility:** ${isPublic ? "Public" : "Private"}\n**Seats:** ${maxParticipants}\n**Date:** ${new Date(scheduledAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}\n**Questions:** ${questions.length}\n\nType "publish" to make it live. I'll send you a magic link to confirm your account.`;

    addJaiffersonMessage(summary);
  };

  const handleReview = async (value: string) => {
    const lower = value.toLowerCase().trim();
    if (lower !== "publish" && lower !== "publier" && lower !== "publicar" && lower !== "go") {
      addJaiffersonMessage("Type \"publish\" when you're ready, or tell me what you'd like to change.");
      return;
    }

    setStep("publishing");
    setIsPublishing(true);

    try {
      // Call edge function to create session
      const { data, error } = await supabase.functions.invoke("create-jaifferson-session", {
        body: {
          email,
          title: topicRefined,
          topic_raw: topicRaw,
          topic_refined: topicRefined,
          is_public: isPublic,
          max_participants: maxParticipants,
          scheduled_at: scheduledAt,
          questions,
        },
      });

      if (error) throw error;

      setSessionId(data?.session_id);
      setStep("done");
      addJaiffersonMessage(
        `Your Jaifferson is live.\n\nI've sent a magic link to ${email} — click it to access your host dashboard.\n\nIn the meantime, share this link with potential participants. They'll be able to see your topic and apply.\n\nGood luck with your session.`
      );
    } catch (err: any) {
      console.error("Error creating session:", err);
      setStep("review");
      addJaiffersonMessage(
        "Something went wrong while publishing. Let's try again — type \"publish\" once more."
      );
      toast.error("Failed to create session. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-border">
        <Link to="/">
          <Logo />
        </Link>
        <LanguageSwitcher />
      </nav>

      {/* Chat area */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 md:px-6">
        <div className="flex-1 overflow-y-auto py-8 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground px-4 py-3"
                    : "text-foreground"
                }`}
              >
                {msg.role === "jaifferson" && (
                  <p className="text-xs font-medium text-gold mb-1.5 uppercase tracking-widest">
                    Jaifferson
                  </p>
                )}
                <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                  {msg.text.split("**").map((part, j) =>
                    j % 2 === 1 ? (
                      <strong key={j} className="font-semibold">
                        {part}
                      </strong>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div>
                <p className="text-xs font-medium text-gold mb-1.5 uppercase tracking-widest">
                  Jaifferson
                </p>
                <div className="flex gap-1.5 py-2">
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {step !== "done" && step !== "publishing" && (
          <div className="border-t border-border py-4">
            <div className="flex items-center gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  step === "email"
                    ? "your@email.com"
                    : step === "topic"
                    ? "Describe your topic..."
                    : step === "max_participants"
                    ? "4–12"
                    : step === "date"
                    ? "April 15, 2026 at 7pm"
                    : "Type your response..."
                }
                className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
                disabled={isTyping || isPublishing}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping || isPublishing}
                size="icon"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
              >
                {isPublishing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Done state */}
        {step === "done" && sessionId && (
          <div className="border-t border-border py-6 text-center">
            <p className="text-muted-foreground text-sm mb-3">Session created successfully</p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/session/${sessionId}`
                  );
                  toast.success("Link copied!");
                }}
              >
                Copy session link
              </Button>
              <Button onClick={() => navigate("/dashboard")} className="bg-primary text-primary-foreground">
                Go to dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Create;
