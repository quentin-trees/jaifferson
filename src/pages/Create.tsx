import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ArrowUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

interface Choice {
  label: string;
  value: string;
}

interface UIBlock {
  type: "date_picker";
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/jaifferson-chat`;

/** Parse structured JSON blocks from Jaifferson's response */
function parseResponse(text: string) {
  let cleanText = text;
  let choices: Choice[] | null = null;
  let uiBlock: UIBlock | null = null;
  let sessionData: any = null;

  // Extract ```json:session { ... } ```
  const sessionMatch = text.match(/```json:session\s*\n([\s\S]*?)```/);
  if (sessionMatch) {
    try {
      sessionData = JSON.parse(sessionMatch[1]);
    } catch { /* ignore parse errors */ }
    cleanText = cleanText.replace(sessionMatch[0], "").trim();
  }

  // Extract ```json:choices [ ... ] ```
  const choicesMatch = text.match(/```json:choices\s*\n([\s\S]*?)```/);
  if (choicesMatch) {
    try {
      choices = JSON.parse(choicesMatch[1]);
    } catch { /* ignore */ }
    cleanText = cleanText.replace(choicesMatch[0], "").trim();
  }

  // Extract ```json:ui { ... } ```
  const uiMatch = text.match(/```json:ui\s*\n([\s\S]*?)```/);
  if (uiMatch) {
    try {
      uiBlock = JSON.parse(uiMatch[1]);
    } catch { /* ignore */ }
    cleanText = cleanText.replace(uiMatch[0], "").trim();
  }

  return { cleanText, choices, uiBlock, sessionData };
}

const Create = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [displayMessages, setDisplayMessages] = useState<{ role: "assistant" | "user"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [choices, setChoices] = useState<Choice[] | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages, isStreaming, choices, showDatePicker]);

  // Send initial greeting
  useEffect(() => {
    sendToAI([
      {
        role: "user",
        content:
          "I want to create a Jaifferson session. Start the conversation.",
      },
    ]);
  }, []);

  const sendToAI = async (msgs: ChatMessage[]) => {
    setIsStreaming(true);
    setChoices(null);
    setShowDatePicker(false);

    let assistantSoFar = "";

    // Add a placeholder assistant message for display
    setDisplayMessages((prev) => [...prev, { role: "assistant", text: "" }]);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: msgs }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error(`Stream failed: ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              const { cleanText } = parseResponse(assistantSoFar);
              setDisplayMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", text: cleanText };
                return updated;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) assistantSoFar += content;
          } catch { /* ignore */ }
        }
      }

      // Parse final response for structured blocks
      const { cleanText, choices: parsedChoices, uiBlock, sessionData } =
        parseResponse(assistantSoFar);

      // Update final display
      setDisplayMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", text: cleanText };
        return updated;
      });

      // Store the full conversation for context
      const newMessages: ChatMessage[] = [
        ...msgs,
        { role: "assistant", content: assistantSoFar },
      ];
      setMessages(newMessages);

      // Handle structured blocks
      if (parsedChoices) setChoices(parsedChoices);
      if (uiBlock?.type === "date_picker") setShowDatePicker(true);

      if (sessionData?.action === "publish") {
        await publishSession(sessionData);
      }
    } catch (err: any) {
      console.error("Streaming error:", err);
      setDisplayMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          text: "Something went wrong. Let's try that again.",
        };
        return updated;
      });
      toast.error("Connection issue — try again.");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isStreaming || isPublishing) return;
    const value = input.trim();
    setInput("");

    // Track email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value) && !email) {
      setEmail(value);
    }

    setDisplayMessages((prev) => [...prev, { role: "user", text: value }]);
    setChoices(null);
    setShowDatePicker(false);

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: value },
    ];
    sendToAI(newMessages);
  };

  const handleChoiceSelect = (choice: Choice) => {
    if (isStreaming || isPublishing) return;
    setDisplayMessages((prev) => [...prev, { role: "user", text: choice.label }]);
    setChoices(null);

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: choice.label },
    ];
    sendToAI(newMessages);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date || isStreaming) return;
    const formatted = format(date, "EEEE, MMMM d, yyyy");
    setShowDatePicker(false);
    setDisplayMessages((prev) => [...prev, { role: "user", text: formatted }]);

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: formatted },
    ];
    sendToAI(newMessages);
  };

  const publishSession = async (data: any) => {
    setIsPublishing(true);
    try {
      const { data: result, error } = await supabase.functions.invoke(
        "create-jaifferson-session",
        {
          body: {
            email: email || data.email,
            title: data.title || data.topic_refined,
            topic_raw: data.topic_raw,
            topic_refined: data.topic_refined,
            is_public: data.is_public,
            max_participants: data.max_participants,
            scheduled_at: data.scheduled_at,
            questions: data.questions,
          },
        }
      );

      if (error) throw error;
      setSessionId(result?.session_id);
      setIsDone(true);
      toast.success("Session published!");
    } catch (err: any) {
      console.error("Publish error:", err);
      toast.error("Failed to publish session.");
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

  const showTextInput = !showDatePicker && !isDone;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-border">
        <Link to="/">
          <Logo />
        </Link>
        <LanguageSwitcher />
      </nav>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 md:px-6">
        <div className="flex-1 overflow-y-auto py-8 space-y-6">
          {displayMessages.map((msg, i) => (
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
                {msg.role === "assistant" && (
                  <p className="text-xs font-medium text-gold mb-1.5 uppercase tracking-widest">
                    Jaifferson
                  </p>
                )}
                <div className="text-[15px] leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {/* Choices */}
          {choices && !isStreaming && (
            <div className="flex flex-wrap gap-2 pl-0">
              {choices.map((choice) => (
                <button
                  key={choice.value}
                  onClick={() => handleChoiceSelect(choice)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-border bg-background text-foreground text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {choice.label}
                </button>
              ))}
            </div>
          )}

          {/* Date picker */}
          {showDatePicker && !isStreaming && (
            <div className="flex justify-start">
              <Calendar
                mode="single"
                selected={undefined}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                className={cn("border border-border bg-background pointer-events-auto")}
              />
            </div>
          )}

          {/* Typing indicator */}
          {isStreaming && displayMessages.length > 0 && displayMessages[displayMessages.length - 1].text === "" && (
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

          {isPublishing && (
            <div className="flex justify-start items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Publishing your session...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {showTextInput && (
          <div className="border-t border-border py-4">
            <div className="flex items-center gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your response..."
                className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
                disabled={isStreaming || isPublishing}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming || isPublishing}
                className="p-2.5 bg-primary text-primary-foreground disabled:opacity-30 transition-opacity"
              >
                {isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        )}

        {isDone && sessionId && (
          <div className="border-t border-border py-6 text-center space-y-3">
            <button
              onClick={() => navigate(`/session/${sessionId}`)}
              className="px-6 py-3 bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              View your session →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Create;
