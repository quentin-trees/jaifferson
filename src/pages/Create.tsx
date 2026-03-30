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
      "I've heard your name come up a few times. Tell me something that didn't make it into the introduction.\n\nJust kidding — we haven't met yet. I'm Jaifferson.\n\nYou're here because you want to host a conversation that actually matters. Not a webinar. Not a panel. A room where the right people sit around one question and leave with something they didn't walk in with.\n\nI'll help you set that up. I'll ask pointed questions, push back where it matters, and make sure what you publish is worth someone's time.\n\nLet's start with your email — so I know who's hosting."
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
      addJaiffersonMessage("That doesn't look like an email. I need a real one — this is where your magic link goes.");
      return;
    }
    setEmail(value);
    setStep("topic");
    addJaiffersonMessage(
      "Good. Now the part that actually matters.\n\nWhat do you want the room to talk about?\n\nHere's what I've learned from dozens of these: the best sessions don't start with a polished thesis. They start with a tension — something you've been thinking about that you can't resolve alone.\n\nSo don't give me a conference title. Give me the version you'd say to a friend at 11pm over a drink. Raw is fine. I'll help you shape it."
    );
  };

  const handleTopic = (value: string) => {
    setTopicRaw(value);
    // Create a slightly more refined version
    const refined = value.charAt(0).toUpperCase() + value.slice(1).replace(/\.$/, "");
    setTopicRefined(refined);
    setStep("confirm_topic");
    addJaiffersonMessage(
      `Interesting. I can work with that.\n\nHere's how I'd frame it for the session page — the version strangers will read and decide whether this room is worth their evening:\n\n"${refined}"\n\nThis is what people will see before they apply. If it captures the tension you're after, say yes. If it's off, give me the version you'd actually want someone to read. I'd rather get it right than get it fast.`
    );
  };

  const handleConfirmTopic = (value: string) => {
    const lower = value.toLowerCase().trim();
    if (lower !== "yes" && lower !== "oui" && lower !== "sí" && lower !== "ok") {
      setTopicRefined(value);
    }
    setStep("visibility");
    addJaiffersonMessage(
      "Locked in.\n\nNow — who gets to see this?\n\n**Public** means anyone browsing Jaifferson can find your session and apply. You still approve every seat — nobody gets in without your say.\n\n**Private** means invite-only. You share the link with the people you want, and only they can apply.",
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
        ? "Public it is. The session will appear on Explore — but you still curate every seat.\n\nHow many people in the room? My recommendation: smaller is better. 4–5 is the sweet spot where everyone speaks and nobody hides. 6 works if you're confident in the group. 3 is intimate — almost confrontational in the best way."
        : "Private. Only people with the link will know it exists.\n\nHow many seats? Same advice applies: 4–5 is where the magic happens. Fewer means deeper.",
      SEAT_OPTIONS
    );
  };

  const handleMaxParticipantsChoice = (value: string) => {
    const num = parseInt(value);
    setMaxParticipants(num);
    setStep("date");
    addJaiffersonMessage(
      num <= 4
        ? `${num} seats. Tight room — that means every word counts. I like it.\n\nWhen should this happen? Pick a date.`
        : `${num} seats. Good size for a real exchange.\n\nWhen should this happen? Pick a date — ideally give people at least a few days to prepare. The best sessions happen when participants have had time to sit with the questions.`
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    addUserMessage(format(date, "EEEE, MMMM d, yyyy"));
    setStep("time");
    addJaiffersonMessage("Good. What time?\n\nEvening tends to work best — people are out of work mode and more willing to be honest. But you know your audience.", TIME_OPTIONS);
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
      `Almost there. This is the part most hosts underestimate.\n\nEvery applicant will answer three questions before they get a seat. These aren't just screening — they're preparation. The right questions make people think before they arrive, and that's what separates a good conversation from a great one.\n\nHere are the ones I'd use:\n\n1. ${questions[0]}\n2. ${questions[1]}\n3. ${questions[2]}\n\nThese are designed to surface intent, vulnerability, and curiosity — the three things that make a Jaifferson session work.\n\nKeep them as-is, or write your own (one per line). Your call.`
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

    const summary = `Here's what we've built:\n\n**Topic:** ${topicRefined}\n**Visibility:** ${isPublic ? "Public — listed on Explore" : "Private — invite only"}\n**Seats:** ${maxParticipants}\n**Date:** ${dateStr}\n**Onboarding questions:** ${questions.length}\n\nOnce you publish, this goes live. ${isPublic ? "People will be able to find it, read the topic, and apply." : "Share the link with the people you want in the room."} You approve every participant before they get a seat.\n\nThis looks ready to me. Publish?`;

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
