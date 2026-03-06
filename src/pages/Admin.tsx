import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface Participant {
  id: string;
  name: string;
  completed: boolean;
}

interface Response {
  location: string;
  background: string;
  current_focus: string;
  hardest_problem: string;
  ai_usage: string;
  ai_better: string;
  ai_worry: string;
  reaction_to_jaifferson: string;
  session_value: string;
  question_for_group: string | null;
  submitted_at: string;
}

const PASSWORD = "jaifferson01";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(
    () => localStorage.getItem("jaifferson_admin") === "true"
  );
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const fetchParticipants = async () => {
    const { data } = await supabase
      .from("participants")
      .select("id, name, completed")
      .order("created_at");
    if (data) setParticipants(data);
  };

  useEffect(() => {
    if (!authenticated) return;
    fetchParticipants();
    const interval = setInterval(fetchParticipants, 60000);
    return () => clearInterval(interval);
  }, [authenticated]);

  const handleLogin = () => {
    if (passwordInput === PASSWORD) {
      localStorage.setItem("jaifferson_admin", "true");
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const openProfile = async (p: Participant) => {
    setSelectedParticipant(p);
    setLoadingProfile(true);
    const { data } = await supabase
      .from("responses")
      .select("*")
      .eq("participant_id", p.id)
      .single();
    setSelectedResponse(data);
    setLoadingProfile(false);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background">
        <header className="px-6 py-8 md:px-16"><Logo /></header>
        <main className="px-6 md:px-16">
          <div className="mx-auto max-w-sm py-24">
            <h2 className="font-serif text-2xl text-foreground mb-6">Host access</h2>
            <div className="space-y-4">
              <Input
                type="password"
                className="rounded-none"
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              {passwordError && (
                <p className="text-sm text-destructive">Incorrect password.</p>
              )}
              <Button className="rounded-none w-full" onClick={handleLogin}>
                Enter →
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const completedCount = participants.filter((p) => p.completed).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-8 md:px-16"><Logo /></header>
      <main className="px-6 md:px-16">
        <div className="mx-auto max-w-3xl py-8 md:py-16">
          <h2 className="font-serif text-3xl text-foreground mb-2">Session #01</h2>
          <p className="text-muted-foreground mb-10">
            {completedCount} of {participants.length} participants completed
          </p>

          <div className="space-y-3">
            {participants.map((p) => (
              <Card key={p.id} className="rounded-none border-border">
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        p.completed ? "bg-green-600" : "bg-muted-foreground/30"
                      }`}
                    />
                    <span className="text-foreground font-medium">{p.name}</span>
                  </div>
                  {p.completed && (
                    <button
                      className="text-sm text-primary hover:underline"
                      onClick={() => openProfile(p)}
                    >
                      View profile →
                    </button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Profile Dialog */}
      <Dialog
        open={!!selectedParticipant}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedParticipant(null);
            setSelectedResponse(null);
          }
        }}
      >
        <DialogContent className="rounded-none max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {selectedParticipant?.name}
            </DialogTitle>
          </DialogHeader>

          {loadingProfile ? (
            <p className="text-muted-foreground py-8 text-center">Loading...</p>
          ) : selectedResponse ? (
            <div className="space-y-8 py-4">
              <Section title="Identity">
                <Field label="Location" value={selectedResponse.location} />
                <Field label="Background" value={selectedResponse.background} />
              </Section>
              <Section title="Current Work">
                <Field label="Current focus" value={selectedResponse.current_focus} />
                <Field label="Hardest problem" value={selectedResponse.hardest_problem} />
              </Section>
              <Section title="AI Relationship">
                <Field label="AI usage" value={selectedResponse.ai_usage} />
                <Field label="What AI improved" value={selectedResponse.ai_better} />
                <Field label="AI concern" value={selectedResponse.ai_worry} />
              </Section>
              <Section title="Session Prep">
                <Field label="Reaction to Jaifferson" value={selectedResponse.reaction_to_jaifferson} />
                <Field label="Desired value" value={selectedResponse.session_value} />
                {selectedResponse.question_for_group && (
                  <Field label="Question for the group" value={selectedResponse.question_for_group} />
                )}
              </Section>
            </div>
          ) : (
            <p className="text-muted-foreground py-8 text-center">No response found.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{title}</h3>
    <div className="space-y-4 border-t border-border pt-4">{children}</div>
  </div>
);

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-muted-foreground mb-1">{label}</p>
    <p className="text-foreground">{value}</p>
  </div>
);

export default Admin;
