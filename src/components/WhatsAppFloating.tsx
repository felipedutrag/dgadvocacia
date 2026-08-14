"use client";

import React from "react";

export default function WhatsAppFloating() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-1.5 pointer-events-none">
      <div className="bg-[#0B0F19]/90 border border-[#25D366]/30 text-[#25D366] text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-bounce whitespace-nowrap pointer-events-auto">
        Falar com Advogado
      </div>
      <a
        href="https://wa.me/5511972667778?text=Ol%C3%A1%2C+gostaria+de+falar+com+um+advogado+sobre+direito+imobili%C3%A1rio."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none pointer-events-auto"
        aria-label="Falar no WhatsApp"
      >
        {/* Pulse rings */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping pointer-events-none" />
        
        {/* Icon */}
        <svg className="w-8 h-8 relative z-10 fill-current" viewBox="0 0 448 512">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L32 503l139.7-36.6c32.7 17.7 69 27 106.5 27 123 0 222.6-99.6 222.6-222 0-59.3-23.2-115-65-157.3zM223.9 474c-33.2 0-65.7-8.9-94-25.7l-6.7-4-83.3 21.8 22.2-81.2-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
      </a>
    </div>
  );
}
