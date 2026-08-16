"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="text-3xl font-serif font-bold tracking-wider gold-text-gradient">DG</span>
            <span className="text-sm font-sans font-light tracking-[0.2em] text-gray-400 border-l border-accent/20 pl-2">ADVOCACIA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 ml-auto mr-8">
            <Link href="/" className="text-xs text-gray-300 hover:text-accent transition-colors font-medium">Início</Link>
            <a href="#servicos" className="text-xs text-gray-300 hover:text-accent transition-colors font-medium">Áreas de Atuação</a>
            <a href="#advogado" className="text-xs text-gray-300 hover:text-accent transition-colors font-medium">O Advogado</a>
            <a href="#metodologia" className="text-xs text-gray-300 hover:text-accent transition-colors font-medium">Como Atuamos</a>
            <a href="#faq" className="text-xs text-gray-300 hover:text-accent transition-colors font-medium">FAQ</a>
          </nav>

          {/* Call to Action */}
          <div className="hidden md:flex">
            <a
              href="https://wa.me/5513988658518?text=Ol%C3%A1%2C+gostaria+de+agendar+uma+consulta+estrat%C3%A9gica+sobre+Direito+Digital%2C+IA+e+Propriedade+Intelectual."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-primary gold-gradient hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Agendar Consulta Estratégica
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-accent focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0B0F19]/95 border-b border-accent/10 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-accent hover:bg-gray-800/50"
          >
            Início
          </Link>
          <a
            href="#servicos"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-accent hover:bg-gray-800/50"
          >
            Áreas de Atuação
          </a>
          <a
            href="#advogado"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-accent hover:bg-gray-800/50"
          >
            O Advogado
          </a>
          <a
            href="#metodologia"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-accent hover:bg-gray-800/50"
          >
            Como Atuamos
          </a>
          <a
            href="#faq"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-accent hover:bg-gray-800/50"
          >
            FAQ
          </a>
          <div className="pt-4 px-3">
            <a
              href="https://wa.me/5513988658518?text=Ol%C3%A1%2C+gostaria+de+agendar+uma+consulta+estrat%C3%A9gica+sobre+Direito+Digital%2C+IA+e+Propriedade+Intelectual."
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center w-full py-3 rounded-full text-sm font-semibold uppercase tracking-wider text-primary gold-gradient"
            >
              Agendar Consulta Estratégica
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
