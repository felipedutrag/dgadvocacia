export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#070A11] border-t border-accent/10 py-16 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Brief Description */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-serif font-bold tracking-wider gold-text-gradient">DG</span>
              <span className="text-sm font-sans font-light tracking-[0.2em] text-gray-300 border-l border-accent/20 pl-2">ADVOCACIA</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed max-w-sm">
              Consultoria jurídica especializada em Direito Digital, Governança de IA, LGPD e Auditoria de Propriedade Intelectual para proteger ativos de software e blindar negócios tecnológicos.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Navegação</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="/" className="hover:text-accent transition-colors">
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
                <a href="#faq" className="hover:text-accent transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Contato</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="https://wa.me/5513988658518" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  (13) 98865-8518
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="break-all">contato@dgadvocacia.online</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-accent mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Av. Eng. Luiz Carlos Berrini, 1748, Conj. 1710 - Cidade Monções, São Paulo/SP - CEP 04571-000</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-accent/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-xs">
          <div>
            <p>&copy; {currentYear} DG Advocacia. Todos os direitos reservados.</p>
            <p className="mt-1 text-gray-500">Felipe Dutra Gonçalves &bull; OAB/SP nº 459.254</p>
          </div>
          <div className="flex gap-4">
            <a href="#advogado" className="hover:text-accent transition-colors">Felipe Dutra Gonçalves</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
