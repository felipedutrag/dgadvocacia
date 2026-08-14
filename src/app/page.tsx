"use client";

import { useState } from "react";
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
  // Estado para a Consulta Interativa de Marca (Simulador)
  const [marcaInput, setMarcaInput] = useState("");
  const [classeInput, setClasseInput] = useState("25");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [termoBuscaClasse, setTermoBuscaClasse] = useState("");
  const [descInput, setDescInput] = useState("");
  const [whatsInput, setWhatsInput] = useState("");
  const [loadingConsulta, setLoadingConsulta] = useState(false);
  const [resultadoConsulta, setResultadoConsulta] = useState<any>(null);
  const [erroConsulta, setErroConsulta] = useState<string | null>(null);

  const faqs = [
    {
      question: "Por que devo registrar minha marca no INPI?",
      answer: "O registro no INPI (Instituto Nacional da Propriedade Industrial) garante o direito de uso exclusivo da marca em todo o território nacional. Sem o registro, outra empresa pode registrar o nome primeiro e impedi-lo de utilizá-lo, além de cobrar indenizações."
    },
    {
      question: "Qual o valor e a validade do registro de marca?",
      answer: "Após concedido pelo INPI, o registro da marca tem validade de 10 anos em todo o Brasil, renovável por períodos iguais e sucessivos. Trata-se de um investimento patrimonial direto no ativo intangível da sua empresa."
    },
    {
      question: "O que são as Classes de Nice do INPI?",
      answer: "As Classes de Nice classificam produtos e serviços em 45 categorias internacionais (1 a 34 para produtos e 35 a 45 para serviços). O registro protege a marca nas classes específicas escolhidas para a sua atividade."
    },
    {
      question: "Como funciona a API de consulta de disponibilidade do INPI?",
      answer: "Nossa API realiza varredura exata e por similaridade nos bancos de dados do INPI, identificando processos existentes na mesma classe de Nice e fornecendo uma análise de viabilidade imediata para o registro."
    },
    {
      question: "Quanto tempo demora o processo de concessão de marca no INPI?",
      answer: "O processo médio de registro no INPI leva entre 6 a 12 meses. Nossa equipe jurídica faz o acompanhamento semanal das publicações na Revista da Propriedade Industrial (RPI) para responder eventuais oposições no prazo legal."
    }
  ];

  const handleSimular = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marcaInput.trim()) return;

    setLoadingConsulta(true);
    setErroConsulta(null);
    setResultadoConsulta(null);

    try {
      const res = await fetch("/api/inpi/check-trademark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trademark: marcaInput.trim(),
          classe: classeInput,
          description: descInput.trim() || undefined,
          whatsapp: whatsInput.trim() || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao consultar a disponibilidade da marca.");
      }

      setResultadoConsulta(data);
    } catch (err: any) {
      setErroConsulta(err.message || "Erro de conexão ao consultar a API.");
    } finally {
      setLoadingConsulta(false);
    }
  };

  const classesFiltradas = NICE_CLASSES.filter((item) => {
    const matchCategory = categoriaFiltro === "todas" || item.categories.includes(categoriaFiltro);
    const matchSearch =
      termoBuscaClasse.trim() === "" ||
      item.name.toLowerCase().includes(termoBuscaClasse.toLowerCase()) ||
      item.code.includes(termoBuscaClasse.trim());
    return matchCategory && matchSearch;
  });

  return (
    <>
      <Header />

      <main className="flex-1 bg-[#0B0F19] text-gray-100 font-sans">
        {/* 1. Hero Section - Background: Dark Navy Radial (#121A2E -> #0B0F19) */}
        <section className="relative py-28 sm:py-36 overflow-hidden bg-radial from-[#121A2E] via-[#0B0F19] to-[#0B0F19] border-b border-accent/10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto space-y-8">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Proteção de Propriedade Intelectual & Registro no INPI
              </span>

              <h1 className="text-4xl sm:text-6xl font-serif font-extrabold text-white tracking-tight leading-[1.15]">
                Sua marca é o seu maior ativo. <br />
                <span className="gold-text-gradient">Garanta o registro oficial no INPI.</span>
              </h1>

              <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Proteja o nome e a identidade da sua empresa contra cópias e imitações. Oferecemos assessoria jurídica completa e tecnologia de busca inteligente para consultar a viabilidade da sua marca em segundos.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                <a
                  href="#simulador"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider text-[#0B0F19] gold-gradient hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-accent/10"
                >
                  Consultar Minha Marca Agora
                </a>
                <a
                  href="https://wa.me/5511972667778?text=Ol%C3%A1%2C+gostaria+de+falar+com+um+advogado+sobre+registro+de+marcas+no+INPI."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  Falar com Advogado
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Por Que Registrar? - Background: Darker Tone (#090D16) */}
        <section id="por-que-registrar" className="py-24 bg-[#090D16] border-b border-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Exclusividade & Segurança</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Por que registrar sua marca no INPI?
              </h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Quem não registra não é dono. Descubra a importância de blindar legalmente o nome do seu negócio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card rounded-2xl p-8 hover:border-accent/30 transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Uso Exclusivo em Todo o Brasil</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  O registro concede o direito de exploração comercial exclusiva da sua marca em todo o território nacional, impedindo concorrentes de usarem nomes parecidos.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-8 hover:border-accent/30 transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Ativo Financeiro de Alto Valor</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Uma marca registrada é um bem intangível que pode ser avaliado monetariamente, vendido, licenciado ou até utilizado como garantia em operações comerciais.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-8 hover:border-accent/30 transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Proteção Contra Notificações e Processos</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Evite a perda repentina do nome do seu negócio, custos de alteração de identidade visual e pesadas indenizações por uso indevido de marcas alheias.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Simulador de Marcas (Consumo da API) - Background: Primary Dark (#0B0F19) */}
        <section id="simulador" className="py-24 bg-[#0B0F19] relative border-b border-accent/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                API em Tempo Real
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Consulte a Disponibilidade da sua Marca no INPI
              </h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Insira o nome da sua marca e a classe de atuação para consultar diretamente o banco de dados oficial via nossa API de análise.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Form de Busca */}
              <div className="lg:col-span-5 glass-card p-8 rounded-2xl border border-accent/20 shadow-2xl h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Simulador de Marca
                  </h3>

                  <form onSubmit={handleSimular} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                        Nome da Marca <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: DG Advocacia"
                        value={marcaInput}
                        onChange={(e) => setMarcaInput(e.target.value)}
                        className="w-full bg-[#070A11] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent text-sm"
                      />
                    </div>

                    {/* Filtro de Perfil / Ramo de Atuação (Digital / Geral) */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Filtrar por Perfil / Ramo de Atuação
                      </label>
                      <select
                        value={categoriaFiltro}
                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                        className="w-full bg-[#070A11] border border-gray-700 rounded-xl px-3 py-2 text-accent focus:outline-none focus:border-accent text-xs font-medium"
                      >
                        <option value="todas">🌐 Todas as 45 Classes de Nice</option>
                        <option value="digital">💻 Negócios Digitais & TI (SaaS, Apps, E-commerce, Marketing)</option>
                        <option value="moda">👗 Moda, Vestuário, Joias & Acessórios</option>
                        <option value="alimentacao">🍔 Alimentos, Bebidas & Restaurantes</option>
                        <option value="saude">💄 Saúde, Estética & Cosméticos</option>
                        <option value="educacao">📚 Educação, Cursos, Podcasts & Mídia</option>
                        <option value="servicos">⚖️ Serviços Profissionais, Financeiros & Jurídicos</option>
                        <option value="industria">🏭 Indústria, Materiais & Produtos Diversos</option>
                      </select>
                    </div>

                    {/* Busca Rápida por palavra-chave da classe */}
                    <div>
                      <input
                        type="text"
                        placeholder="🔍 Ou digite o nome/número para buscar na lista..."
                        value={termoBuscaClasse}
                        onChange={(e) => setTermoBuscaClasse(e.target.value)}
                        className="w-full bg-[#070A11] border border-gray-800 rounded-lg px-3 py-1.5 text-gray-300 placeholder-gray-500 text-xs focus:outline-none focus:border-accent"
                      />
                    </div>

                    {/* Dropdown com todas as 45 classes de Nice */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                        Classe de Nice (INPI) — <span className="text-accent">{classesFiltradas.length} encontrada(s)</span>
                      </label>
                      <select
                        value={classeInput}
                        onChange={(e) => setClasseInput(e.target.value)}
                        className="w-full bg-[#070A11] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent text-sm"
                      >
                        {classesFiltradas.length > 0 ? (
                          classesFiltradas.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.name}
                            </option>
                          ))
                        ) : (
                          <option value="25">Nenhuma classe encontrada para a busca</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                        Sua Empresa / Razão Social (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Nome do seu negócio"
                        value={descInput}
                        onChange={(e) => setDescInput(e.target.value)}
                        className="w-full bg-[#070A11] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                        WhatsApp para Relatório Completo (Opcional)
                      </label>
                      <input
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={whatsInput}
                        onChange={(e) => setWhatsInput(e.target.value)}
                        className="w-full bg-[#070A11] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loadingConsulta}
                      className="w-full py-4 rounded-xl font-semibold text-sm uppercase tracking-wider text-[#0B0F19] gold-gradient hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      {loadingConsulta ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-[#0B0F19]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Consultando API do INPI...
                        </>
                      ) : (
                        "Verificar Disponibilidade na API"
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Resultado da Busca */}
              <div className="lg:col-span-7 glass-card p-8 rounded-2xl border border-white/10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
                    <span>Resultado da Análise da API</span>
                    {resultadoConsulta && (
                      <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                        HTTP 200 OK
                      </span>
                    )}
                  </h3>

                  {erroConsulta && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
                      <strong>Erro na Consulta:</strong> {erroConsulta}
                    </div>
                  )}

                  {!resultadoConsulta && !loadingConsulta && !erroConsulta && (
                    <div className="text-center py-16 space-y-4 text-gray-500">
                      <svg className="w-16 h-16 mx-auto opacity-30 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm">Preencha o formulário ao lado para acionar a nossa API e obter o status da marca no INPI.</p>
                    </div>
                  )}

                  {loadingConsulta && (
                    <div className="py-16 text-center space-y-4">
                      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm text-gray-300">Buscando marcas similares e verificando conflitos na Classe {classeInput}...</p>
                    </div>
                  )}

                  {resultadoConsulta && (
                    <div className="space-y-6">
                      <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                        <p className="text-xs text-accent uppercase tracking-wider font-semibold">Marca Analisada</p>
                        <p className="text-lg font-bold text-white">{resultadoConsulta.trademark || marcaInput}</p>
                        <p className="text-xs text-gray-400 mt-1">Classe de Nice: {classeInput} | Total de Processos Encontrados: {resultadoConsulta.processos?.length || 0}</p>
                      </div>

                      {resultadoConsulta.processos && resultadoConsulta.processos.length > 0 ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                            ⚠️ Processos Semelhantes Registrados no INPI:
                          </p>
                          {resultadoConsulta.processos.map((proc: any, i: number) => (
                            <div key={i} className="p-3.5 rounded-lg bg-[#070A11] border border-gray-800 text-xs flex justify-between items-center gap-4">
                              <div>
                                <span className="font-bold text-white block">{proc.marca || proc.numero}</span>
                                <span className="text-gray-400 text-[11px]">Nº: {proc.numero} | {proc.situacao || "Em andamento"}</span>
                              </div>
                              <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono shrink-0">
                                Conflito Potencial
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-start gap-3">
                          <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <div>
                            <strong>Nenhum impedimento direto encontrado!</strong>
                            <p className="text-xs text-emerald-300/80 mt-1">A marca demonstra alta probabilidade de registro na Classe {classeInput}. Fale com nossos advogados para efetuar o depósito oficial.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {resultadoConsulta && (
                  <div className="pt-4 border-t border-gray-800 flex justify-end">
                    <a
                      href={`https://wa.me/5511972667778?text=Ol%C3%A1%2C+consultei+a+marca+${encodeURIComponent(marcaInput)}+na+classe+${classeInput}+e+gostaria+de+iniciar+o+registro.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#0B0F19] gold-gradient"
                    >
                      Iniciar Registro via WhatsApp &rarr;
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Como Funciona o Processo no INPI - Background: Darker Tone (#090D16) */}
        <section className="py-24 bg-[#090D16] border-b border-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Passo a Passo</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Como Funciona o Processo de Registro no INPI
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative glass-card p-8 rounded-2xl border border-accent/10">
                <span className="text-4xl font-serif font-bold text-accent/30 block mb-4">01</span>
                <h3 className="text-lg font-bold text-white mb-2">Busca de Anterioridade</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Varredura minuciosa nos arquivos do INPI para garantir que nenhuma marca similar ou idêntica impeça a sua concessão.
                </p>
              </div>

              <div className="relative glass-card p-8 rounded-2xl border border-accent/10">
                <span className="text-4xl font-serif font-bold text-accent/30 block mb-4">02</span>
                <h3 className="text-lg font-bold text-white mb-2">Depósito Oficial do Pedido</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Protocolo jurídico formal no INPI com o enquadramento perfeito nas Classes de Nice e emissão da Guia de Recolhimento da União (GRU).
                </p>
              </div>

              <div className="relative glass-card p-8 rounded-2xl border border-accent/10">
                <span className="text-4xl font-serif font-bold text-accent/30 block mb-4">03</span>
                <h3 className="text-lg font-bold text-white mb-2">Acompanhamento & Concessão</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Monitoramento semanal na Revista da Propriedade Industrial (RPI), defesa contra oposições e emissão do Certificado de Registro de 10 anos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FAQ Section - Background: Primary Dark (#0B0F19) */}
        <FAQ faqs={faqs} title="Dúvidas Frequentes sobre Registro de Marcas" subtitle="INPI & Propriedade Intelectual" />
      </main>

      <Footer />
    </>
  );
}
