import Link from 'next/link';
import { ArrowLeft, Download, Share2, Smartphone } from 'lucide-react';

const INSTALL_STEPS = [
  {
    platform: 'iPhone / iPad',
    icon: Share2,
    steps: [
      'Open Medigify in Safari.',
      'Tap the Share button at the bottom of the screen.',
      'Choose Add to Home Screen, then tap Add.',
    ],
  },
  {
    platform: 'Android',
    icon: Download,
    steps: [
      'Open Medigify in Chrome.',
      'Tap the three-dot menu in the top-right corner.',
      'Choose Add to Home screen or Install app, then confirm.',
    ],
  },
];

export default function PwaGuidePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to homepage
      </Link>

      <div className="mt-6 rounded-3xl border border-border bg-gradient-to-br from-accent/10 via-bg-surface to-bg-primary p-6 md:p-10">
        <div className="max-w-3xl">
          <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/20 flex items-center justify-center mb-5">
            <Smartphone className="w-7 h-7 text-accent" />
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-text-primary">
            Install Medigify on your phone
          </h1>
          <p className="mt-4 text-text-secondary text-base md:text-lg leading-relaxed">
            Medigify works like an app without going through the App Store or Play Store. Once installed, it opens from your home screen and feels faster on repeat visits.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        {INSTALL_STEPS.map((item) => {
          const Icon = item.icon;
          return (
            <section
              key={item.platform}
              className="rounded-2xl border border-border bg-bg-surface p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h2 className="font-heading text-xl font-semibold text-text-primary">
                  {item.platform}
                </h2>
              </div>
              <ol className="space-y-3 text-sm text-text-secondary leading-relaxed">
                {item.steps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bg-primary border border-border text-text-primary font-medium">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
