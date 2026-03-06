import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PARTICIPANTS = ["Nathan", "Yohan", "Guillaume", "François", "Mathieu", "Florian", "Thomas"];

interface FormData {
  name: string;
  location: string;
  background: string;
  current_focus: string;
  hardest_problem: string;
  ai_usage: string;
  ai_better: string;
  ai_worry: string;
  reaction_to_jaifferson: string;
  session_value: string;
  question_for_group: string;
}

const Onboard = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: searchParams.get("name") || "",
    location: "",
    background: "",
    current_focus: "",
    hardest_problem: "",
    ai_usage: "",
    ai_better: "",
    ai_worry: "",
    reaction_to_jaifferson: "",
    session_value: "",
    question_for_group: "",
  });

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canAdvance = () => {
    switch (step) {
      case 1: return form.name && form.location && form.background;
      case 2: return form.current_focus && form.hardest_problem;
      case 3: return form.ai_usage && form.ai_better && form.ai_worry;
      case 4: return form.reaction_to_jaifferson && form.session_value;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!canAdvance()) return;
    setSubmitting(true);

    try {
      // Find participant
      const { data: participant, error: pError } = await supabase
        .from("participants")
        .select("id")
        .eq("name", form.name)
        .single();

      if (pError || !participant) throw new Error("Participant not found");

      // Insert response
      const { error: rError } = await supabase.from("responses").insert({
        participant_id: participant.id,
        location: form.location,
        background: form.background,
        current_focus: form.current_focus,
        hardest_problem: form.hardest_problem,
        ai_usage: form.ai_usage,
        ai_better: form.ai_better,
        ai_worry: form.ai_worry,
        reaction_to_jaifferson: form.reaction_to_jaifferson,
        session_value: form.session_value,
        question_for_group: form.question_for_group || null,
      });

      if (rError) throw rError;

      // Mark completed
      await supabase
        .from("participants")
        .update({ completed: true })
        .eq("id", participant.id);

      setSubmitted(true);
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="px-6 py-8 md:px-16"><Logo /></header>
        <main className="px-6 md:px-16">
          <div className="mx-auto max-w-2xl py-24 text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">You're in.</h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
              We'll send you the call details once everyone has completed their onboarding. See you soon.
            </p>
            <p className="mt-8 text-sm text-muted-foreground italic">— Jaifferson</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-8 md:px-16"><Logo /></header>
      <main className="px-6 md:px-16">
        <div className="mx-auto max-w-2xl py-8 md:py-16">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-12">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 flex items-center justify-center text-sm border ${
                    s === step
                      ? "bg-primary text-primary-foreground border-primary"
                      : s < step
                      ? "bg-primary/10 text-foreground border-primary/30"
                      : "bg-background text-muted-foreground border-border"
                  }`}
                >
                  {s}
                </div>
                {s < 4 && <div className="w-8 h-px bg-border hidden sm:block" />}
              </div>
            ))}
          </div>

          {/* Personalized greeting */}
          {form.name && step > 1 && (
            <p className="text-sm text-muted-foreground mb-6">Welcome, {form.name}</p>
          )}

          {/* Step content */}
          {step === 1 && (
            <div className="space-y-8">
              <h2 className="font-serif text-3xl text-foreground">Let's start with who you are.</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>I am...</Label>
                  <Select value={form.name} onValueChange={(v) => update("name", v)}>
                    <SelectTrigger className="rounded-none">
                      <SelectValue placeholder="Select your name" />
                    </SelectTrigger>
                    <SelectContent>
                      {PARTICIPANTS.map((name) => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Where are you based right now?</Label>
                  <Input
                    className="rounded-none"
                    placeholder="City, country"
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tell us about your background in 2–3 sentences.</Label>
                  <Textarea
                    className="rounded-none min-h-[120px]"
                    placeholder="Think of it as what you'd say at the start of a smart dinner conversation — not your LinkedIn headline."
                    value={form.background}
                    onChange={(e) => update("background", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h2 className="font-serif text-3xl text-foreground">What's your world right now?</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>What are you currently focused on — professionally or as a project?</Label>
                  <Textarea
                    className="rounded-none min-h-[120px]"
                    placeholder="A job, a startup, a side project, or a serious question you're trying to answer."
                    value={form.current_focus}
                    onChange={(e) => update("current_focus", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>What's the hardest problem you're working on right now?</Label>
                  <Textarea
                    className="rounded-none min-h-[120px]"
                    placeholder="Not necessarily the biggest — the hardest. The one that keeps you thinking."
                    value={form.hardest_problem}
                    onChange={(e) => update("hardest_problem", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <h2 className="font-serif text-3xl text-foreground">How do you actually use AI?</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>How are you using AI in your work or life today?</Label>
                  <Textarea
                    className="rounded-none min-h-[120px]"
                    placeholder="Be specific if you can — what tools, what tasks, what results."
                    value={form.ai_usage}
                    onChange={(e) => update("ai_usage", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>What has AI made genuinely better for you?</Label>
                  <Input
                    className="rounded-none"
                    placeholder="One specific thing, honestly."
                    value={form.ai_better}
                    onChange={(e) => update("ai_better", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>What aspect of AI worries or frustrates you?</Label>
                  <Input
                    className="rounded-none"
                    placeholder="One thing, also honestly. There are no wrong answers."
                    value={form.ai_worry}
                    onChange={(e) => update("ai_worry", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <h2 className="font-serif text-3xl text-foreground">Before we meet.</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Jaifferson is described as 'AI-structured expert conversation.' What's your immediate reaction to that idea?</Label>
                  <Textarea
                    className="rounded-none min-h-[120px]"
                    placeholder="First instinct — skeptical, curious, excited, confused. All valid."
                    value={form.reaction_to_jaifferson}
                    onChange={(e) => update("reaction_to_jaifferson", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>What would make this session genuinely valuable for you?</Label>
                  <Textarea
                    className="rounded-none min-h-[120px]"
                    placeholder="What would you want to leave with?"
                    value={form.session_value}
                    onChange={(e) => update("session_value", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Is there a specific question you'd like to put to the group?</Label>
                  <Textarea
                    className="rounded-none min-h-[100px]"
                    placeholder="Optional — something you're stuck on, or want smart people to push back on."
                    value={form.question_for_group}
                    onChange={(e) => update("question_for_group", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">This field is optional.</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-12">
            {step > 1 ? (
              <Button
                variant="outline"
                className="rounded-none"
                onClick={() => setStep(step - 1)}
              >
                ← Back
              </Button>
            ) : (
              <div />
            )}
            {step < 4 ? (
              <Button
                className="rounded-none"
                disabled={!canAdvance()}
                onClick={() => setStep(step + 1)}
              >
                Next →
              </Button>
            ) : (
              <Button
                className="rounded-none"
                disabled={!canAdvance() || submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Submitting..." : "Submit →"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboard;
