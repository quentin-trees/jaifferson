import { useLanguage } from "@/i18n/LanguageContext";

const HowItWorks = () => {
  const { t } = useLanguage();

  return (
    <section className="px-6 py-24 max-w-[1100px] mx-auto">
      <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold text-center mb-4">
        {t.how.label}
      </p>
      <h2 className="font-serif text-4xl text-center mb-16">
        {t.how.heading}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Host track */}
        <div>
          <h3 className="text-[13px] font-medium tracking-[0.15em] uppercase text-primary mb-8 border-b border-border pb-3">
            {t.how.host.title}
          </h3>
          <div className="space-y-8">
            {t.how.host.steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <span className="font-serif text-3xl text-foreground/10 leading-none mt-0.5 shrink-0 w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="text-[15px] font-medium mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Participant track */}
        <div>
          <h3 className="text-[13px] font-medium tracking-[0.15em] uppercase text-primary mb-8 border-b border-border pb-3">
            {t.how.participant.title}
          </h3>
          <div className="space-y-8">
            {t.how.participant.steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <span className="font-serif text-3xl text-foreground/10 leading-none mt-0.5 shrink-0 w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="text-[15px] font-medium mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
