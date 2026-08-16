"use client";

import Image from "next/image";
import Header from "@/components/Header";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const NICE_CLASSES = [
  { code: "01", name: "Classe 01 — Produtos Químicos para Indústria, Ciências e Agricultura", categories: ["todas", "industria"] },
  { code: "02", name: "Classe 02 — Tintas, Vernizes, Lacas e Preservativos", categories: ["todas", "industria"] },
  { code: "03", name: "Classe 03 — Cosméticos, Maquiagem, Perfumaria e Produtos de Limpeza", categories: ["todas", "saude", "moda"] },
  { code: "04", name: "Classe 04 — Óleos e Graxas Industriais, Lubrificantes e Velas", categories: ["todas", "industria"] },
  { code: "05", name: "Classe 05 — Produtos Farmacêuticos, Suplementos e Medicinais", categories: ["todas", "saude"] },
  { code: "06", name: "Classe 06 — Metais Comuns, Ligas e Materiais de Construção Metálicos", categories: ["todas", "industria"] },
  { code: "07", name: "Classe 07 — Máquinas, Ferramentas Mecânicas e Motores", categories: ["todas", "industria"] },
  { code: "08", name: "Classe 08 — Ferramentas e Instrumentos Manuais, Cutelaria", categories: ["todas", "industria"] },
  { code: "09", name: "Classe 09 — Software, Apps, Eletrônicos, Celulares e Hardware", categories: ["todas", "digital", "educacao"] },
  { code: "10", name: "Classe 10 — Aparelhos e Instrumentos Médicos e Odontológicos", categories: ["todas", "saude"] },
  { code: "11", name: "Classe 11 — Aparelhos de Iluminação, Refrigeração e Aquecimento", categories: ["todas", "industria"] },
  { code: "12", name: "Classe 12 — Veículos e Aparelhos de Locomoção Terrestre ou Marítima", categories: ["todas", "industria"] },
  { code: "13", name: "Classe 13 — Armas de Fogo, Munições e Fogos de Artifício", categories: ["todas", "industria"] },
  { code: "14", name: "Classe 14 — Joias, Bijuterias, Relógios e Metais Preciosos", categories: ["todas", "moda"] },
  { code: "15", name: "Classe 15 — Instrumentos Musicais", categories: ["todas", "educacao"] },
  { code: "16", name: "Classe 16 — Papelaria, Livros, Embalagens, Impressos e Material Escolar", categories: ["todas", "educacao"] },
  { code: "17", name: "Classe 17 — Borracha, Plásticos Moldados e Isolantes", categories: ["todas", "industria"] },
  { code: "18", name: "Classe 18 — Bolsas, Malas, Couros, Carteiras e Artigos de Viagem", categories: ["todas", "moda"] },
  { code: "19", name: "Classe 19 — Materiais de Construção Não Metálicos", categories: ["todas", "industria"] },
  { code: "20", name: "Classe 20 — Móveis, Espelhos e Artigos de Decoração", categories: ["todas", "industria"] },
  { code: "21", name: "Classe 21 — Utensílios Domésticos, Vidrarias e Porcelanas", categories: ["todas", "alimentacao"] },
  { code: "22", name: "Classe 22 — Cordas, Redes, Tendas, Toldos e Sacos", categories: ["todas", "industria"] },
  { code: "23", name: "Classe 23 — Fios e Linhas para Uso Têxtil", categories: ["todas", "moda"] },
  { code: "24", name: "Classe 24 — Tecidos, Cama, Mesa e Banho", categories: ["todas", "moda"] },
  { code: "25", name: "Classe 25 — Roupas, Calçados, Chapéus e Vestuário/Moda", categories: ["todas", "moda"] },
  { code: "26", name: "Classe 26 — Rendas, Bordados, Fitas, Botões e Armarinho", categories: ["todas", "moda"] },
  { code: "27", name: "Classe 27 — Tapetes, Capachos e Revestimentos de Piso", categories: ["todas", "industria"] },
  { code: "28", name: "Classe 28 — Jogos, Brinquedos, Videogames e Artigos Esportivos", categories: ["todas", "digital", "educacao"] },
  { code: "29", name: "Classe 29 — Carnes, Peixes, Frutas Conservadas, Laticínios e Alimentos", categories: ["todas", "alimentacao"] },
  { code: "30", name: "Classe 30 — Café, Chá, Cacau, Doces, Pães, Farinhas, Molhos e Temperos", categories: ["todas", "alimentacao"] },
  { code: "31", name: "Classe 31 — Produtos Agrícolas, Grãos, Plantas e Alimentos para Animais", categories: ["todas", "alimentacao"] },
  { code: "32", name: "Classe 32 — Cervejas, Águas Minerais, Refrigerantes e Sucos", categories: ["todas", "alimentacao"] },
  { code: "33", name: "Classe 33 — Bebidas Alcoólicas, Vinhos, Destilados e Licores", categories: ["todas", "alimentacao"] },
  { code: "34", name: "Classe 34 — Tabaco, Cigarros e Artigos para Fumantes", categories: ["todas", "industria"] },
  { code: "35", name: "Classe 35 — Comércio (E-commerce, Lojas), Publicidade, Marketing & Gestão", categories: ["todas", "digital", "servicos"] },
  { code: "36", name: "Classe 36 — Serviços Financeiros, Seguros, Bancários e Imobiliários", categories: ["todas", "servicos"] },
  { code: "37", name: "Classe 37 — Construção Civil, Reformas, Instalação e Manutenção", categories: ["todas", "servicos"] },
  { code: "38", name: "Classe 38 — Telecomunicações, Streaming, Provedores e Transmissão de Dados", categories: ["todas", "digital"] },
  { code: "39", name: "Classe 39 — Transporte, Logística, Entregas e Armazenamento", categories: ["todas", "digital", "servicos"] },
  { code: "40", name: "Classe 40 — Gráfica, Tratamento de Materiais e Manipulação Industrial", categories: ["todas", "industria"] },
  { code: "41", name: "Classe 41 — Cursos Online, Educação, Eventos, Podcasting & Conteúdo Digital", categories: ["todas", "digital", "educacao"] },
  { code: "42", name: "Classe 42 — Tecnologia da Informação (TI), SaaS, Apps, Design & Pesquisa", categories: ["todas", "digital", "servicos"] },
  { code: "43", name: "Classe 43 — Restaurantes, Lanchonetes, Cafés, Delivery & Hospedagem", categories: ["todas", "alimentacao"] },
  { code: "44", name: "Classe 44 — Serviços de Saúde, Medicina, Estética, Clínicas & Pet Care", categories: ["todas", "saude"] },
  { code: "45", name: "Classe 45 — Serviços Jurídicos, Advocacia, Propriedade Intelectual & Segurança", categories: ["todas", "servicos"] },
];

export default function Home() {
  const faqs = [
    {
      question: "O que é a Governança e Compliance para Inteligência Artificial?",
      answer: "É a estruturação jurídica que assegura o uso seguro e ético de IA nas empresas. Abrange a conformidade com regulação (Privacy and Ethics by Design), análise de contratos e licenças de modelos de LLMs, proteção de dados em integrações via API e a preservação de segredos de negócio e direitos autorais nos treinos de modelos."
    },
    {
      question: "Como funciona a Auditoria de Propriedade Intelectual (Due Diligence)?",
      answer: "A Due Diligence de PI avalia detalhadamente todo o patrimônio intangível da sua empresa — incluindo softwares, algoritmos, bases de dados, registros no INPI, marcas e patentes. Identificamos gargalos de titularidade, riscos de infração de código/terceiros e oportunidades para blindagem do portfólio."
    },
    {
      question: "Por que minha empresa precisa de conformidade com a LGPD aplicada à tecnologia?",
      answer: "Para empresas de tecnologia e startups, a conformidade vai além de termos de uso genéricos: ela exige Privacy by Design na arquitetura dos sistemas, mapeamento de fluxo de dados em APIs/servidores e termos adequados de transferência internacional ou processamento de dados."
    },
    {
      question: "Como proteger softwares, algoritmos e modelos de IA no Brasil?",
      answer: "A proteção de ativos tecnológicos combina o Registro de Programa de Computador no INPI (para o código-fonte), proteção contratual de segredos de negócio (NDA/Trade Secrets) para algoritmos e arquiteturas, e proteção de marca/patente de invenções implementadas por computador."
    },
    {
      question: "Qual a relevância de contratos específicos de SaaS e Licenciamento de Tecnologia?",
      answer: "Contratos genéricos expõem a empresa a riscos de perda de propriedade intelectual sobre customizações, violação de SLAs, responsabilidade ilimitada por vazamento de dados e disputas sobre o uso de dados de clientes para treinamento de modelos de IA."
    }
  ];

  return (
    <>
      <Header />

      <main className="flex-1 bg-[#0B0F19] text-gray-100 font-sans">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden bg-radial from-[#131C31] via-[#0B0F19] to-[#0B0F19] border-b border-accent/10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Direito Digital, IA &amp; Ativos Tecnológicos
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
              Segurança Jurídica e Estratégia para{" "}
              <span className="gold-text-gradient block mt-2 sm:inline sm:mt-0">
                Inovação, IA e Ativos Tecnológicos
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
              Unimos profundo conhecimento jurídico a uma sólida base técnica em sistemas para blindar seu produto digital, garantir governança em inteligência artificial e proteger seus ativos intangíveis.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="https://wa.me/5513988658518?text=Ol%C3%A1%2C+gostaria+de+agendar+uma+consulta+estrat%C3%A9gica+sobre+Direito+Digital%2C+IA+e+Propriedade+Intelectual."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#0B0F19] gold-gradient hover:opacity-95 active:scale-[0.98] transition-all shadow-xl shadow-accent/10"
              >
                Agendar Consulta Estratégica
              </a>
              <a
                href="#servicos"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                Conhecer Áreas de Atuação
              </a>
            </div>
          </div>
        </section>

        {/* ÁREAS DE ATUAÇÃO */}
        <section id="servicos" className="py-24 bg-[#090D16] border-b border-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Especialidades &amp; Soluções</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Áreas de Atuação Especializada
              </h2>
              <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed">
                Estruturação jurídica e conformidade técnica para negócios de base tecnológica, inteligência artificial e proteção de ativos intangíveis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pillar 1 */}
              <div className="glass-card rounded-2xl p-8 hover:border-accent/30 transition-all flex flex-col justify-between space-y-6">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mb-6">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Auditoria de Propriedade Intelectual (Due Diligence de PI)
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Avaliação minuciosa do portfólio de ativos intangíveis, identificando gargalos, riscos de infração e oportunidades para novos registros de marcas, patentes e programas de computador (software).
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <span className="text-xs text-accent font-medium uppercase tracking-wider">Proteção de Patrimônio &bull; Software &bull; Marcas</span>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="glass-card rounded-2xl p-8 hover:border-accent/30 transition-all flex flex-col justify-between space-y-6">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mb-6">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Governança &amp; Estratégia de PI para IA
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Estruturação jurídica para proteger algoritmos, modelos de IA, bases de dados e códigos-fonte, assegurando conformidade com <em>Privacy and Ethics by Design</em> e segurança em integrações de APIs.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <span className="text-xs text-accent font-medium uppercase tracking-wider">LLMs &bull; Privacy by Design &bull; APIs</span>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="glass-card rounded-2xl p-8 hover:border-accent/30 transition-all flex flex-col justify-between space-y-6">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mb-6">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Gestão e Monitoramento de Portfólio
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Acompanhamento contínuo de registros perante o INPI, defesas contra oposições, cumprimento de exigências e ações preventivas contra infrações de terceiros.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <span className="text-xs text-accent font-medium uppercase tracking-wider">INPI &bull; Vigilância Ativa &bull; Defesas</span>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="glass-card rounded-2xl p-8 hover:border-accent/30 transition-all flex flex-col justify-between space-y-6">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mb-6">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Licenciamento e Contratos de Tecnologia
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Elaboração e negociação de contratos de software (SaaS), cessão de direitos, transferência de tecnologia e parcerias para integração de IA.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <span className="text-xs text-accent font-medium uppercase tracking-wider">Contratos SaaS &bull; Transferência de Tech &bull; NDAs</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO SOBRE O ESCRITÓRIO E INSTITUCIONAL */}
        <section id="sobre" className="py-24 bg-[#0B0F19] relative border-b border-accent/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Diferencial Estratégico</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Engenharia e Direito no Mesmo Diálogo
              </h2>
              <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed">
                Eliminamos a barreira entre o departamento jurídico e a engenharia de software, traduzindo normas regulatórias em proteção técnica efetiva.
              </p>
            </div>

            {/* Container Principal Unificado em Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Imagem do Escritório em Destaque */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-accent/20 shadow-2xl min-h-[380px]">
                <Image
                  src="/office_sign.png"
                  alt="DG Advocacia — Sede do Escritório"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-xs uppercase tracking-widest text-accent font-semibold block mb-1">Estrutura Institucional</span>
                  <p className="text-white text-sm font-serif font-bold">DG Advocacia &bull; São Paulo / SP</p>
                </div>
              </div>

              {/* Card de Conteúdo e Pilares */}
              <div className="lg:col-span-7 flex flex-col justify-between glass-card p-8 sm:p-10 rounded-2xl border border-accent/20 space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Soluções Alinhadas à Sua Inovação
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Seja para auditar o código-fonte de um software proprietário, garantir conformidade com a LGPD em fluxos de IA, ou formalizar contratos de licenciamento SaaS, nossa consultoria atua lado a lado com fundadores, CTOs e líderes de tecnologia.
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">✓</div>
                    <p className="text-sm text-gray-300"><strong className="text-white">Linguagem Nativa de TI:</strong> Compreensão profunda de arquiteturas de software, fluxos de dados, contêineres, LLMs e APIs.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">✓</div>
                    <p className="text-sm text-gray-300"><strong className="text-white">Compliance Ético &amp; Operacional:</strong> Mitigação de riscos regulatórios (LGPD e IA) sem desacelerar seu time de desenvolvimento.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">✓</div>
                    <p className="text-sm text-gray-300"><strong className="text-white">Rigor Ético OAB:</strong> Atuação sóbria, técnica e estritamente informativa para construção de valor patrimonial seguro.</p>
                  </div>
                </div>

                <div>
                  <a
                    href="https://wa.me/5513988658518?text=Ol%C3%A1%2C+gostaria+de+agendar+uma+consulta+estrat%C3%A9gica+sobre+Direito+Digital%2C+IA+e+Propriedade+Intelectual."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#0B0F19] gold-gradient hover:opacity-95 transition-all shadow-lg"
                  >
                    Falar com Advogado Especialista
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO O ADVOGADO */}
        <section id="advogado" className="py-24 bg-[#080C14] relative border-b border-accent/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Liderança &amp; Experiência</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Advocacia Especializada em Tecnologia
              </h2>
              <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed">
                Atuação consultiva e estratégica combinando domínio técnico em sistemas com rigor jurídico e conformidade ética.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Foto do Dr. Felipe Dutra Gonçalves */}
              <div className="lg:col-span-5 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-blue-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500 pointer-events-none" />
                <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden border border-accent/30 shadow-2xl group bg-[#0B0F19]">
                  <Image
                    src="/felipe_dutra.jpg"
                    alt="Dr. Felipe Dutra Gonçalves — Advogado Especialista em Direito Digital e IA"
                    width={600}
                    height={800}
                    priority
                    className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  {/* Máscara de iluminação e degradê suave */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#0B0F19]/80 backdrop-blur-md border border-accent/20 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-accent font-semibold uppercase tracking-wider">Advogado Titular</p>
                      <p className="text-white text-xs font-serif font-bold">OAB/SP 459.254</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Atendimento Ativo" />
                  </div>
                </div>
              </div>

              {/* Bio & Credenciais */}
              <div className="lg:col-span-7 space-y-6">
                <div className="glass-card p-8 sm:p-10 rounded-2xl border border-accent/20 space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-accent font-semibold block mb-1">Fundador &amp; Advogado Titular</span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                      Dr. Felipe Dutra Gonçalves
                    </h3>
                    <p className="text-sm font-mono text-gray-400 mt-1">OAB/SP nº 459.254</p>
                  </div>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Advogado dedicado à vanguarda do Direito Digital, Governança de Inteligência Artificial e Proteção de Ativos Tecnológicos. Sua abordagem inovadora une o entendimento profundo de arquiteturas computacionais, contratos de tecnologia (SaaS/APIs) e privacidade à segurança patrimonial dos clientes.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent flex items-center justify-center text-xs shrink-0 mt-0.5">✓</div>
                      <div>
                        <h4 className="text-white text-sm font-semibold">Auditoria &amp; Due Diligence</h4>
                        <p className="text-xs text-gray-400">Proteção de código-fonte, marcas e patentes no INPI.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent flex items-center justify-center text-xs shrink-0 mt-0.5">✓</div>
                      <div>
                        <h4 className="text-white text-sm font-semibold">IA &amp; Regulação Digital</h4>
                        <p className="text-xs text-gray-400">Privacy by Design, governança de LLMs e contratos de APIs.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                    <a
                      href="https://wa.me/5513988658518?text=Ol%C3%A1+Dr.+Felipe+Dutra%2C+gostaria+de+agendar+uma+consulta+estrat%C3%A9gica."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#0B0F19] gold-gradient hover:opacity-95 transition-all shadow-lg"
                    >
                      Falar Diretamente com Dr. Felipe
                    </a>
                    <span className="text-xs text-gray-400 flex items-center gap-2">
                      <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      (13) 98865-8518
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METODOLOGIA / COMO ATUAMOS */}
        <section id="metodologia" className="py-24 bg-[#090D16] border-b border-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Nossa Abordagem</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Como Atuamos no Seu Negócio
              </h2>
              <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed">
                Um fluxo de consultoria contínuo projetado para acompanhar o ciclo de vida do seu produto digital.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-8 rounded-2xl border border-accent/10 space-y-4 hover:border-accent/30 transition-all">
                <span className="text-4xl font-serif font-bold text-accent block">01</span>
                <h3 className="text-lg font-bold text-white">Diagnóstico &amp; Mapeamento</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Análise profunda da arquitetura de software, bases de dados, contratos vigentes e presença de marca para identificar vulnerabilidades e oportunidades.
                </p>
              </div>

              <div className="glass-card p-8 rounded-2xl border border-accent/10 space-y-4 hover:border-accent/30 transition-all">
                <span className="text-4xl font-serif font-bold text-accent block">02</span>
                <h3 className="text-lg font-bold text-white">Governança &amp; Blindagem</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Implementação de Privacy by Design, elaboração de instrumentos contratuais (SaaS/NDA) e protocolo de proteção para código-fonte e IA.
                </p>
              </div>

              <div className="glass-card p-8 rounded-2xl border border-accent/10 space-y-4 hover:border-accent/30 transition-all">
                <span className="text-4xl font-serif font-bold text-accent block">03</span>
                <h3 className="text-lg font-bold text-white">Monitoramento Contínuo</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Suporte jurídico consultivo permanente para o lançamento de novas features, integrações de modelos de IA e adequação a atualizações regulatórias.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-radial from-[#131C31] to-[#0B0F19] border-b border-accent/10 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Pronto para construir uma base jurídica sólida para sua tecnologia?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Agende uma consulta estratégica com nossa equipe e garanta o alinhamento regulatório e a proteção do seu patrimônio intangível.
            </p>
            <div className="pt-4">
              <a
                href="https://wa.me/5513988658518?text=Ol%C3%A1%2C+gostaria+de+agendar+uma+consulta+estrat%C3%A9gica+sobre+Direito+Digital%2C+IA+e+Propriedade+Intelectual."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#0B0F19] gold-gradient hover:opacity-95 transition-all shadow-xl shadow-accent/10"
              >
                Agendar Consulta Estratégica via WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <FAQ
          faqs={faqs}
          title="Dúvidas Frequentes"
          subtitle="Direito Digital, IA & Propriedade Intelectual"
          description="Esclareça os principais pontos sobre conformidade jurídica, governança de IA e auditoria de intangíveis."
        />
      </main>

      <Footer />
    </>
  );
}
