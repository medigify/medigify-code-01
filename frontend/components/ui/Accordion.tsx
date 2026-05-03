'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { ReactNode } from 'react';

interface AccordionItem {
  question: string;
  answer: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-border rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggle(index)}
            className="w-full flex items-center justify-between p-4 md:p-5 text-left min-h-[48px] hover:bg-bg-surface-hover transition-colors duration-150"
            aria-expanded={openIndex === index}
          >
            <span className="font-body font-medium text-text-primary pr-4">
              {item.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-text-secondary shrink-0 transition-transform duration-150 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-150 ${
              openIndex === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="px-4 pb-4 md:px-5 md:pb-5 text-text-secondary leading-relaxed">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
