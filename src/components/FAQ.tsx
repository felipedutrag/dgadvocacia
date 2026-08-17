"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
  description?: string;
}

export default function FAQ({ 
  faqs, 
  title = "Perguntas Frequentes",
  subtitle = "Esclareça Suas Dúvidas",
  description = "Entenda os principais pontos sobre nossos serviços jurídicos."
}: FAQProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#0B0F19] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent">{subtitle}</span>
          <h2 className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
            {title}
          </h2>
          <p className="mt-2.5 sm:mt-3 text-gray-400 text-xs sm:text-sm md:text-base">
            {description}
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className="glass-card rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 text-left text-white hover:text-accent transition-colors focus:outline-none"
                >
                  <span className="font-semibold text-xs sm:text-sm md:text-base pr-3 sm:pr-4">{faq.question}</span>
                  <span className={`text-accent transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`}>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`transition-all duration-350 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100 border-t border-accent/5" : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <p className="px-4 sm:px-6 py-4 sm:py-5 text-xs sm:text-sm leading-relaxed text-gray-400">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
