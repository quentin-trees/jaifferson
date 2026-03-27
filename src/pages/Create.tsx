import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ArrowUp, Loader2, CalendarIcon, Globe, Lock, Users } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Step =
  | "welcome"
  | "email"
  | "topic"
  | "confirm_topic"
  | "visibility"
  | "max_participants"
  | "date"
  | "time"
  | "questions_review"
  | "review"
  | "publishing"
  | "done";

interface Message {
  role: "jaifferson" | "user";
  text: string;
  choices?: Choice[];
}

interface Choice {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const DEFAULT_QUESTIONS = [
  "What brings you to this topic, and what do you hope to leave with?",
  "What's the hardest thing you're working through right now?",
  "What's one question you'd want the group to wrestle with together?",
];

const SEAT_OPTIONS: Choice[] = [
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
];

const TIME_OPTIONS: Choice[] = [
  { label: "12:00", value: "12:00" },
  { label: "14:00", value: "14:00" },
  { label: "17:00", value: "17:00" },
  { label: "18:00", value: "18:00" },
  { label: "19:00", value: "19:00" },
  { label: "20:00", value: "20:00" },
  { label: "21:00", value: "21:00" },
];

const Create = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("welcome");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [choicesVisible, setChoicesVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Session data
  const [email, setEmail] = useState("");
  const [topicRaw, setTopicRaw] = useState("");
  const [topicRefined, setTopicRefined] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [maxParticipants, setMaxParticipants] = useState(6);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [questions, setQuestions] = useState<string[]>(DEFAULT_QUESTIONS);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, choicesVisible]);

  useEffect(() => {
    addJaiffersonMessage(
      "I'm Jaifferson. You want to host a session — a curated conversation around something that actually matters to you.\n\nI'll need a few things. We'll move fast.\n\nFirst: your email."
    );
    setStep("email");
  }, []);

  const addJaiffersonMessage = (text: string, choices?: Choice[]) => {
    setIsTyping(true);
    setChoicesVisible(false);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "jaifferson", text, choices }]);
      setIsTyping(false);
      if (choices) setChoicesVisible(true);
    }, 600);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
    setChoicesVisible(false);
  };

  const handleChoiceSelect = (choice: Choice) => {
    addUserMessage(choice.label);

    switch (step) {
      case "visibility":
        handleVisibilityChoice(choice.value);
        break;
      case "max_participants":
        handleMaxParticipantsChoice(choice.value);
        break;
      case "time":
        handleTimeChoice(choice.value);
        break;
      default:
        break;
    }
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
      addJaiffersonMessage("That's not an email. Try again.");
      return;
    }
    setEmail(value);
    setStep("topic");
    addJaiffersonMessage(
      "Good.\n\nNow — what do you want the room to talk about?\n\nDon't polish it. Say it the way you'd say it to someone you trust."
    );
  };

  const handleTopic = (value: string) => {
    setTopicRaw(value);
    const refined = value.charAt(0).toUpperCase() + value.slice(1);
    setTopicRefined(refined);
    setStep("confirm_topic");
    addJaiffersonMessage(
      `Here's how I'd frame it:\n\n"${refined}"\n\nIf that works, say yes. If not, give me the version you actually want.`
    );
  };

  const handleConfirmTopic = (value: string) => {
    const lower = value.toLowerCase().trim();
    if (lower !== "yes" && lower !== "oui" && lower !== "sí" && lower !== "ok") {
      setTopicRefined(value);
    }
    setStep("visibility");
    addJaiffersonMessage(
      "Public or private?",
      [
        { label: "Public", value: "public", icon: <Globe className="h-4 w-4" /> },
        { label: "Private", value: "private", icon: <Lock className="h-4 w-4" /> },
      ]
    );
  };

  const handleVisibilityChoice = (value: string) => {
    const pub = value === "public";
    setIsPublic(pub);
    setStep("max_participants");
    addJaiffersonMessage(
      pub
        ? "Public. Anyone can find it and apply.\n\nHow many seats?"
        : "Private. Invite-only.\n\nHow many seats?",
      SEAT_OPTIONS
    );
  };

  const handleMaxParticipantsChoice = (value: string) => {
    setMaxParticipants(parseInt(value));
    setStep("date");
    addJaiffersonMessage("When?");
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    addUserMessage(format(date, "EEEE, MMMM d, yyyy"));
    setStep("time");
    addJaiffersonMessage("What time?", TIME_OPTIONS);
  };

  const handleTimeChoice = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      const [hours, minutes] = time.split(":").map(Number);
      const dt = new Date(selectedDate);
      dt.setHours(hours, minutes, 0, 0);
      setScheduledAt(dt.toISOString());
    }
    setStep("questions_review");
    addJaiffersonMessage(
      `Last thing. Every applicant will answer three questions before they get a seat. Here are the defaults:\n\n1. ${questions[0]}\n2. ${questions[1]}\n3. ${questions[2]}\n\nKeep them or replace them. Your call.`
    );
  };

  const handleQuestionsReview = (value: string) => {
    const lower = value.toLowerCase().trim();
    if (lower !== "ok" && lower !== "oui" && lower !== "yes" && lower !== "keep" && lower !== "garder") {
      const lines = value.split("\n").filter((l) => l.trim());
      if (lines.length >= 1) {
        setQuestions(lines.slice(0, 3));
      }
    }
    setStep("review");

    const dateStr = scheduledAt
      ? format(new Date(scheduledAt), "EEEE, MMMM d 'at' HH:mm")
      : "TBD";

    const summary = `Here's what we have:\n\n**Topic:** ${topicRefined}\n**Visibility:** ${isPublic ? "Public" : "Private"}\n**Seats:** ${maxParticipants}\n**Date:** ${dateStr}\n**Questions:** ${questions.length}\n\nIf this is right, publish it.`;

    addJaiffersonMessage(summary, [
      { label: "Publish", value: "publish" },
    ]);
  };

  const handleReview = async (value: string) => {
    const lower = value.toLowerCase().trim();
    if (lower !== "publish" && lower !== "publier" && lower !== "publicar" && lower !== "go") {
      addJaiffersonMessage("Tell me what to change. Or publish.", [
        { label: "Publish", value: "publish" },
      ]);
      return;
    }
    await publishSession();
  };

  const publishSession = async () => {
    setStep("publishing");
    setIsPublishing(true);

    try {
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
        `Done. Your session is live.\n\nA magic link has been sent to ${email}. Use it to access your host dashboard.\n\nShare the session link with the people you want in the room. They'll see the topic, answer your questions, and wait for your decision.\n\nThe room is set. Now fill it with the right people.`
      );
    } catch (err: any) {
      console.error("Error creating session:", err);
      setStep("review");
      addJaiffersonMessage(
        "Something broke. Let's try again.",
        [{ label: "Publish", value: "publish" }]
      );
      toast.error("Failed to create session.");
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

  // Determine if text input should be shown
  const showTextInput = !["visibility", "max_participants", "time", "date", "done", "publishing"].includes(step);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-border">
        <Link to="/"><Logo /></Link>
        <LanguageSwitcher />
      </nav>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 md:px-6">
        <div className="flex-1 overflow-y-auto py-8 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
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
                      <strong key={j} className="font-semibold">{part}</strong>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Inline choices */}
          {choicesVisible && messages.length > 0 && messages[messages.length - 1].choices && (
            <div className="flex flex-wrap gap-2 pl-0">
              {messages[messages.length - 1].choices!.map((choice) => (
                <button
                  key={choice.value}
                  onClick={() => {
                    if (choice.value === "publish") {
                      addUserMessage("Publish");
                      publishSession();
                    } else {
                      handleChoiceSelect(choice);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 border border-border bg-background text-foreground text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {choice.icon}
                  {choice.label}
                </button>
              ))}
            </div>
          )}

          {/* Date picker inline */}
          {step === "date" && !isTyping && (
            <div className="flex justify-start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                className={cn("border border-border bg-background pointer-events-auto")}
              />
            </div>
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div>
                <p className="text-xs font-medium text-gold mb-1.5 uppercase tracking-widest">Jaifferson</p>
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

        {/* Text input — only for free-text steps */}
        {showTextInput && (
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
                  navigator.clipboard.writeText(`${window.location.origin}/session/${sessionId}`);
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
