import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    intent: "",
    topic: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.intent) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("waitlist_signups").insert({
        first_name: formData.firstName,
        email: formData.email,
        intent: formData.intent,
        topic: formData.topic || null,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch {
      alert(t.form.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-border sticky top-0 bg-background z-50">
        <Logo />
        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <a
            href="#waitlist"
            className="bg-primary text-primary-foreground text-[13px] font-medium tracking-widest uppercase px-6 py-2.5 hover:bg-primary/90 transition-colors"
          >
            {t.nav.cta}
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center text-center px-6 pt-24 md:pt-[100px] pb-20 max-w-[780px] mx-auto">
        <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold mb-6">
          {t.hero.label}
        </span>
        <h1 className="font-serif text-[clamp(38px,6vw,64px)] leading-[1.15] text-foreground mb-6">
          {t.hero.title1}
          <br />
          {t.hero.title2} <em className="text-gold italic">{t.hero.titleEmphasis}</em>
        </h1>
        <p className="text-[17px] leading-[1.75] text-muted-foreground max-w-[560px] mb-12">
          {t.hero.desc}
        </p>
      </section>

      {/* WAITLIST FORM */}
      <section id="waitlist" className="px-6 pb-24">
        <div className="bg-card border border-border p-8 md:p-12 max-w-[520px] mx-auto">
          {!submitted ? (
            <>
              <h2 className="font-serif text-[22px] mb-2">{t.form.heading}</h2>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                {t.form.sub}
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium tracking-widest uppercase text-foreground mb-2">
                    {t.form.firstName}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-input bg-background text-foreground text-sm outline-none focus:border-primary transition-colors"
                    placeholder={t.form.firstNamePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium tracking-widest uppercase text-foreground mb-2">
                    {t.form.email}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-input bg-background text-foreground text-sm outline-none focus:border-primary transition-colors"
                    placeholder={t.form.emailPlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium tracking-widest uppercase text-foreground mb-2">
                    {t.form.intentLabel}
                  </label>
                  <div className="flex gap-3">
                    {(["host", "join"] as const).map((option) => (
                      <label
                        key={option}
                        className={`flex-1 flex items-center justify-center px-4 py-3 border cursor-pointer text-[13px] tracking-wide transition-all ${
                          formData.intent === option
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-input bg-background hover:border-muted-foreground"
                        }`}
                      >
                        <input
                          type="radio"
                          name="intent"
                          value={option}
                          checked={formData.intent === option}
                          onChange={(e) => setFormData({ ...formData, intent: e.target.value })}
                          className="sr-only"
                        />
                        {option === "host" ? t.form.host : t.form.join}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium tracking-widest uppercase text-foreground mb-2">
                    {t.form.topicLabel}
                  </label>
                  <textarea
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-3 border border-input bg-background text-foreground text-sm outline-none focus:border-primary transition-colors resize-none h-[90px]"
                    placeholder={t.form.topicPlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-4 text-[13px] font-medium tracking-[0.12em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? t.form.submitting : t.form.submit}
                </button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  {t.form.note}
                </p>
              </form>
            </>
          ) : (
            <div className="text-center py-10">
              <h3 className="font-serif text-2xl mb-3">{t.form.successTitle}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed whitespace-pre-line">
                {t.form.successDesc}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-24 max-w-[900px] mx-auto">
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold text-center mb-4">
          {t.how.label}
        </p>
        <h2 className="font-serif text-4xl text-center mb-16">
          {t.how.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {t.how.steps.map((step, i) => (
            <div key={i}>
              <p className="font-serif text-5xl text-foreground/10 leading-none mb-4">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-base font-medium mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <section className="bg-primary text-primary-foreground py-20 px-6 text-center">
        <blockquote className="font-serif italic text-[clamp(20px,3vw,28px)] leading-relaxed max-w-[700px] mx-auto mb-6 opacity-95">
          {t.quote.text}
        </blockquote>
        <p className="text-[13px] tracking-[0.1em] uppercase opacity-50">
          {t.quote.source}
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-2 text-[13px] text-muted-foreground">
        <span>Jaifferson</span>
        <span>{t.footer.right}</span>
      </footer>
    </div>
  );
};

export default Index;
