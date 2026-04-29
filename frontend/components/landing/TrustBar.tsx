export default function TrustBar() {
  const metrics = [
    { value: '10,000+', label: 'MCQs' },
    { value: '5+', label: 'Subjects' },
    { value: 'UHS', label: 'Past Papers' },
  ];

  const badges = [
    { name: 'UHS', available: true },
    { name: 'NUMS', available: false },
    { name: 'AKU', available: false },
  ];

  return (
    <section className="py-10 bg-bg-surface border-y border-border" aria-labelledby="trust-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="trust-heading" className="sr-only">Trusted by students</h2>
        {/* Metrics */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <p className="text-2xl md:text-3xl font-heading font-bold text-text-primary">
                {metric.value}
              </p>
              <p className="text-sm text-text-secondary mt-1">{metric.label}</p>
            </div>
          ))}
        </div>
        {/* Examining Body Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          {badges.map((badge) => (
            <span
              key={badge.name}
              className={`px-4 py-2 rounded-md text-sm font-medium border ${
                badge.available
                  ? 'border-accent/30 text-accent bg-accent/5'
                  : 'border-border text-text-secondary'
              }`}
            >
              {badge.name}
              {!badge.available && (
                <span className="text-xs ml-1 opacity-50">Soon</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
