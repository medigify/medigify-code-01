export default function TrustBar() {
  const metrics = [
    { value: '10,000+', label: 'MCQs' },
    { value: 'Smart', label: 'Flash Cards' },
    { value: 'High Yield', label: 'Notes' },
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
      </div>
    </section>
  );
}
