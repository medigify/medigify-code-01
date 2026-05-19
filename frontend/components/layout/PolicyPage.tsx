type PolicySection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

type PolicyPageProps = {
  title: string;
  intro: string[];
  sections: PolicySection[];
  lastUpdated: string;
};

export default function PolicyPage({
  title,
  intro,
  sections,
  lastUpdated,
}: PolicyPageProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-8">
        {title}
      </h1>
      <div className="prose prose-invert max-w-none space-y-6 text-text-secondary leading-relaxed">
        {intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-heading text-xl font-semibold text-text-primary mt-8 mb-4">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets?.length ? (
              <ul className="list-disc pl-6 space-y-2">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <p className="text-sm mt-8">Last updated: {lastUpdated}</p>
      </div>
    </div>
  );
}
