export default function Audience() {
  const audiences = [
    {
      year: '1st & 2nd Year',
      message:
        "Building your foundation? Start with Anatomy, Physiology, and Biochemistry past papers.",
    },
    {
      year: '3rd & 4th Year',
      message:
        "Into clinical subjects? Pathology, Pharmacology, and Forensic Medicine. All covered.",
    },
    {
      year: 'Final Year',
      message: "Revision mode. Timed mocks that feel like the real exam.",
    },
  ];

  return (
    <section className="py-16 md:py-24" aria-labelledby="audience-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="audience-heading"
          className="font-heading text-3xl md:text-4xl font-bold text-center text-text-primary"
        >
          Built For Every Year
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((audience) => (
            <div
              key={audience.year}
              className="bg-bg-surface border border-border rounded-lg overflow-hidden"
            >
              {/* Gradient top border */}
              <div className="h-1 bg-gradient-to-r from-accent to-accent/40" />
              <div className="p-6">
                <h3 className="font-heading text-xl font-semibold text-text-primary">
                  {audience.year}
                </h3>
                <p className="mt-3 text-text-secondary leading-relaxed">
                  {audience.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
