export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#070A11] border-t border-accent/10 pt-12 sm:pt-16 pb-10 sm:pb-12 text-gray-400 text-xs sm:text-sm relative overflow-hidden">
      {/* Glow sutil no topo do footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-12">
          {/* Logo & Institucional */}
          <div className="md:col-span-5 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-serif font-bold tracking-wider gold-text-gradient">DG</span>
              <span className="text-xs sm:text-sm font-sans font-light tracking-[0.2em] text-gray-300 border-l border-accent/20 pl-2">ADVOCACIA</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              Consultoria jurídica especializada em Direito Digital, Governança de IA, LGPD e Auditoria de Propriedade Intelectual para proteger ativos de software e blindar negócios tecnológicos.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-accent/10 text-accent border border-accent/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                São Paulo &bull; Atendimento Global
              </span>
            </div>
          </div>

          {/* Navegação Rápida */}
          <div className="md:col-span-3">
            <h4 className="text-white font-semibold text-[11px] sm:text-xs uppercase tracking-[0.2em] mb-3 sm:mb-4 text-accent/90">
              Navegação
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-accent transition-colors">
                  Áreas de Atuação
                </a>
              </li>
              <li>
                <a href="#advogado" className="hover:text-accent transition-colors">
                  Sobre o Escritório
                </a>
              </li>
              <li>
                <a href="#metodologia" className="hover:text-accent transition-colors">
                  Como Atuamos
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-accent transition-colors">
                  Dúvidas Frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* Atendimento & Contato */}
          <div className="md:col-span-4 space-y-3 sm:space-y-4">
            <h4 className="text-white font-semibold text-[11px] sm:text-xs uppercase tracking-[0.2em] mb-3 sm:mb-4 text-accent/90">
              Atendimento &amp; Sede
            </h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <a
                  href="https://wa.me/5513988658518?text=Ol%C3%A1%2C+gostaria+de+agendar+uma+consulta+estrat%C3%A9gica+sobre+Direito+Digital%2C+IA+e+Propriedade+Intelectual."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-300 hover:text-accent transition-colors group"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 group-hover:border-accent/40 transition-colors">
                    <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span>(13) 98865-8518</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@dgadvocacia.online"
                  className="inline-flex items-center gap-2 text-gray-300 hover:text-accent transition-colors group"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 group-hover:border-accent/40 transition-colors">
                    <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="break-all">contato@dgadvocacia.online</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="leading-relaxed text-[11px] sm:text-xs">
                  Av. Eng. Luiz Carlos Berrini, 1748, Conj. 1710 &bull; Cidade Monções, São Paulo/SP &bull; CEP 04571-000
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Bottom Bar */}
        <div className="border-t border-accent/10 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-center sm:text-left text-[11px] sm:text-xs text-gray-500">
          <div>
            <p className="text-gray-400">&copy; {currentYear} DG Advocacia. Todos os direitos reservados.</p>
            <p className="mt-0.5 sm:mt-1 text-gray-500">Felipe Dutra Gonçalves &bull; OAB/SP nº 459.254</p>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="text-[10px] sm:text-[11px] text-gray-500">Direito Digital &bull; IA &bull; Propriedade Intelectual</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
