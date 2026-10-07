import React, { useState } from 'react';
import {
  Project,
  PortfolioCategory,
  Lead,
  AgencySettings,
} from '../types/systex';
import { SysTexLogo, SysTexMonogram } from './SysTexLogos';

interface LandingPageProps {
  projects: Project[];
  unreadLeadsCount: number;
  settings: AgencySettings;
  onAddLead: (newLead: Omit<Lead, 'id' | 'status' | 'dateLabel' | 'timeLabel' | 'createdAt'>) => void;
  onUpdateSettings?: (settings: AgencySettings) => void;
  onOpenAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  projects,
  unreadLeadsCount,
  settings,
  onAddLead,
  onOpenAdmin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | PortfolioCategory>('Todos');
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);

  // Interactive Solution Calculator State (Opción 2)
  const [calcIndustry, setCalcIndustry] = useState<'comercio' | 'clinica' | 'empresa' | 'profesional'>('comercio');
  const [calcChallenge, setCalcChallenge] = useState<'turnos' | 'stock' | 'web' | 'automatizacion'>('stock');

  // Contact Form State
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formService, setFormService] = useState('Landing Page / Sitio Web de Alta Conversión');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // Only show published projects on the public landing page
  const publishedProjects = projects.filter((p) => p.published);

  const filteredProjects =
    selectedCategory === 'Todos'
      ? publishedProjects
      : publishedProjects.filter((p) => p.category === selectedCategory);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceForQuote = (serviceOption: string) => {
    setFormService(serviceOption);
    scrollToSection('contacto');
  };

  const industries = [
    { id: 'comercio', label: 'Comercio / Tienda', icon: 'storefront' },
    { id: 'clinica', label: 'Salud & Belleza', icon: 'medical_services' },
    { id: 'empresa', label: 'Empresa / B2B', icon: 'domain' },
    { id: 'profesional', label: 'Servicios Prof.', icon: 'badge' },
  ] as const;

  const challenges = [
    {
      id: 'turnos',
      label: 'Coordinar Citas & Turnos',
      sub: 'Atención manual de mensajes y clientes que se olvidan',
      icon: 'calendar_month',
    },
    {
      id: 'stock',
      label: 'Control de Stock e Inventario',
      sub: 'Desorden en mercadería, salidas y planillas dispersas',
      icon: 'inventory_2',
    },
    {
      id: 'web',
      label: 'Página Web para Vender Más',
      sub: 'Presencia digital seria para transmitir confianza y captar clientes',
      icon: 'web',
    },
    {
      id: 'automatizacion',
      label: 'Automatizar Tareas Repetitivas',
      sub: 'Procesos manuales y planillas que quitan horas todos los días',
      icon: 'settings_suggest',
    },
  ] as const;

  const calcSolutions: Record<
    'turnos' | 'stock' | 'web' | 'automatizacion',
    {
      formService: string;
      title: string;
      categoryBadge: string;
      description: string;
      timeSaved: string;
      timeSavedLabel: string;
      impactMetric: string;
      impactMetricLabel: string;
      deliveryTime: string;
      deliveryLabel: string;
    }
  > = {
    turnos: {
      formService: 'Plataforma de Agendamiento & Reservas',
      title: 'Plataforma de Agendamiento con WhatsApp Automático',
      categoryBadge: 'Agendamiento Inteligente',
      description:
        calcIndustry === 'clinica'
          ? 'Tus pacientes o clientes reservan su horario online desde el celular las 24 hs y reciben confirmaciones y recordatorios automáticos por WhatsApp, eliminando las ausencias por olvido.'
          : 'Sistema de reservas online donde tus clientes agendan en segundos. Elimina el ida y vuelta de mensajes manuales con confirmaciones y recordatorios por WhatsApp.',
      timeSaved: '12 a 18 hrs',
      timeSavedLabel: 'Ahorro semanal en atención',
      impactMetric: '0 ausencias',
      impactMetricLabel: 'Por confirmación automática',
      deliveryTime: '7 a 10 días',
      deliveryLabel: 'Puesta en marcha',
    },
    stock: {
      formService: 'Sistema de Gestión & Control de Stock',
      title: 'Sistema de Gestión & Control de Stock (ERP)',
      categoryBadge: 'Control & Operaciones',
      description:
        calcIndustry === 'comercio'
          ? 'Control absoluto de existencias con lector de código de barras, alertas automáticas de stock mínimo y registro de ventas diarias desde cualquier celular o PC.'
          : 'Plataforma centralizada para inventario multi-almacén, trazabilidad de pedidos y reportes ejecutivos en tiempo real para tomar decisiones con datos confiables.',
      timeSaved: '15 a 25 hrs',
      timeSavedLabel: 'Ahorro semanal en tareas de stock',
      impactMetric: '100% control',
      impactMetricLabel: 'En mercadería y ventas diarias',
      deliveryTime: '12 a 18 días',
      deliveryLabel: 'Puesta en marcha',
    },
    web: {
      formService: 'Landing Page / Sitio Web de Alta Conversión',
      title: 'Landing Page / Sitio Web de Alta Conversión',
      categoryBadge: 'Ventas & Imagen Corporativa',
      description:
        'Sitio web premium, ultrarrápido y perfectamente adaptado a celulares, con botones directos a tu WhatsApp para transformar visitantes en clientes calificados.',
      timeSaved: 'Atención 24/7',
      timeSavedLabel: 'Tu negocio visible todo el tiempo',
      impactMetric: '+40% a +60%',
      impactMetricLabel: 'Aumento en consultas directas',
      deliveryTime: '5 a 8 días',
      deliveryLabel: 'Puesta en marcha',
    },
    automatizacion: {
      formService: 'Software & Automatización a Medida',
      title: 'Software & Automatización a Medida',
      categoryBadge: 'Eficiencia Operativa',
      description:
        'Digitalizamos tus procesos específicos: eliminamos planillas manuales de Excel, conectamos tus herramientas y automatizamos tu facturación y flujos de trabajo.',
      timeSaved: '20+ hrs',
      timeSavedLabel: 'Ahorro semanal en trabajo manual',
      impactMetric: '-90% errores',
      impactMetricLabel: 'Reducción de fallas humanas',
      deliveryTime: '10 a 20 días',
      deliveryLabel: 'Puesta en marcha',
    },
  };

  const currentCalc = calcSolutions[calcChallenge];

  const handleApplyCalcSolution = () => {
    setFormService(currentCalc.formService);
    const indObj = industries.find((i) => i.id === calcIndustry);
    const chalObj = challenges.find((c) => c.id === calcChallenge);
    setFormMessage(
      `Hola SysTex, utilicé la calculadora interactiva para mi negocio (${indObj?.label || 'Comercio'}). Mi mayor prioridad es resolver: "${chalObj?.label}". Me interesa la solución "${currentCalc.title}". Quisiera recibir una propuesta y cotización.`
    );
    scrollToSection('contacto');
  };

  const calcWhatsappMessage = encodeURIComponent(
    `Hola SysTex! Hice la prueba en la calculadora de su web para mi negocio (${
      industries.find((i) => i.id === calcIndustry)?.label
    }) y me interesa la solución: "${currentCalc.title}". ¿Podrían asesorarme con un presupuesto?`
  );
  const calcWhatsappUrl = `https://wa.me/${encodeURIComponent(
    settings.whatsappNumber.replace(/[^0-9]/g, '')
  )}?text=${calcWhatsappMessage}`;

  const mapServiceToCategoryAndIcon = (
    serviceLabel: string
  ): {
    category: 'Landing Pages' | 'ERP / Stock' | 'Agendamiento' | 'Software a Medida';
    icon: string;
  } => {
    const lower = serviceLabel.toLowerCase();
    if (lower.includes('stock') || lower.includes('gestión') || lower.includes('erp') || lower.includes('b2b')) {
      return { category: 'ERP / Stock', icon: 'inventory_2' };
    }
    if (lower.includes('agendamiento') || lower.includes('reservas') || lower.includes('turnos')) {
      return { category: 'Agendamiento', icon: 'calendar_month' };
    }
    if (lower.includes('software') || lower.includes('automatización') || lower.includes('medida')) {
      return { category: 'Software a Medida', icon: 'settings_suggest' };
    }
    return { category: 'Landing Pages', icon: 'web' };
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCompany.trim() || !formWhatsapp.trim()) {
      setFormError('Por favor completa Nombre, Empresa y WhatsApp de contacto.');
      return;
    }
    setFormError('');
    const { category, icon } = mapServiceToCategoryAndIcon(formService);

    onAddLead({
      name: formName.trim(),
      company: formCompany.trim(),
      whatsapp: formWhatsapp.trim(),
      email: formEmail.trim() || `contacto@${formCompany.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      service: formService,
      serviceCategory: category,
      serviceIcon: icon,
      message:
        formMessage.trim() ||
        `Solicitud de cotización para ${formService} enviada desde la Landing Page de SysTex.`,
    });

    setFormSubmitted(true);
    setFormName('');
    setFormCompany('');
    setFormWhatsapp('');
    setFormEmail('');
    setFormMessage('');
  };

  const whatsappDirectUrl = `https://api.whatsapp.com/send?phone=${settings.whatsappNumber}&text=${encodeURIComponent(
    'Hola Elvio y Jorge (SysTex), visité su web y me gustaría recibir asesoramiento para un proyecto digital.'
  )}`;

  const servicesList = [
    {
      id: 'srv-web',
      icon: 'code',
      title: 'Desarrollo Web & Landing Pages',
      description:
        'Sitios web de alta conversión diseñados a medida, con UX/UI vanguardista, tiempos de respuesta ultra veloces y SEO técnico de grado enterprise.',
      tags: ['Next.js', 'Tailwind', 'High-Conversion'],
      formOption: 'Landing Page / Sitio Web de Alta Conversión',
    },
    {
      id: 'srv-erp',
      icon: 'database',
      title: 'Sistemas de Gestión & Control de Stock',
      description:
        'Plataformas ERP personalizadas, control exhaustivo de inventario multi-almacén, facturación automatizada y analítica ejecutiva en tiempo real.',
      tags: ['ERP Custom', 'Inventario', 'Facturación'],
      formOption: 'Sistema de Gestión & Control de Stock',
    },
    {
      id: 'srv-booking',
      icon: 'schedule',
      title: 'Plataformas de Agendamiento & Reservas',
      description:
        'Automatización total de citas para clínicas, salones y prestadores de servicios, sincronizada con WhatsApp.',
      tags: ['Smart Booking', 'WhatsApp Bot', 'Agenda 24/7'],
      formOption: 'Plataforma de Agendamiento & Reservas',
    },
    {
      id: 'srv-custom',
      icon: 'hub',
      title: 'Software & Automatización a Medida',
      description:
        'Flujos de trabajo que erradican tareas manuales repetitivas, integrando tus herramientas existentes a través de APIs robustas y seguras.',
      tags: ['Custom APIs', 'Webhooks', 'Automations'],
      formOption: 'Software & Automatización a Medida',
    },
  ];

  return (
    <div className="min-h-screen bg-[#111317] text-[#E1E7ED] flex flex-col pb-20 relative overflow-x-hidden">
      {/* Ambient Top Metallic Glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-[#3A6D8C]/12 blur-[130px] rounded-full z-0" />

      {/* TOP NAVBAR (Exact match to Image 5 + Desktop Navigation) */}
      <header className="sticky top-0 z-40 w-full bg-[#111317]/90 backdrop-blur-xl border-b border-[#22262E]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => scrollToSection('inicio')}
            className="text-left focus:outline-none group"
          >
            <SysTexLogo size="sm" subtitleText="INICIO" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#9BA3AE]">
            <button
              type="button"
              onClick={() => scrollToSection('inicio')}
              className={`hover:text-white transition-colors whitespace-nowrap ${
                activeSection === 'inicio' ? 'text-[#97CDF4]' : ''
              }`}
            >
              Inicio
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('servicios')}
              className={`hover:text-white transition-colors whitespace-nowrap ${
                activeSection === 'servicios' ? 'text-[#97CDF4]' : ''
              }`}
            >
              Servicios
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('portafolio')}
              className={`hover:text-white transition-colors whitespace-nowrap ${
                activeSection === 'portafolio' ? 'text-[#97CDF4]' : ''
              }`}
            >
              Portafolio
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('equipo')}
              className={`hover:text-white transition-colors whitespace-nowrap ${
                activeSection === 'equipo' ? 'text-[#97CDF4]' : ''
              }`}
            >
              Nosotros
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contacto')}
              className={`hover:text-white transition-colors whitespace-nowrap ${
                activeSection === 'contacto' ? 'text-[#97CDF4]' : ''
              }`}
            >
              Contacto
            </button>
          </nav>

          {/* Right Actions: Admin Access + Founder Quick Avatar */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1B1E24] hover:bg-[#252A32] border border-[#2C313A] text-xs font-semibold text-[#D6DEE7] transition-all cursor-pointer"
              title="Acceder al Panel de Administración de SysTex"
            >
              <span className="material-symbols-outlined text-[15px] text-[#73A9CA]">
                shield_person
              </span>
              <span>Admin</span>
              {unreadLeadsCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#3A6D8C] text-white text-[10px] font-mono font-bold shadow-[0_0_8px_rgba(151,205,244,0.6)]">
                  {unreadLeadsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('equipo')}
              className="w-8 h-8 rounded-full bg-[#87BEE4] text-[#0D2538] flex items-center justify-center hover:brightness-110 transition-all cursor-pointer shadow-[0_0_12px_rgba(135,190,228,0.3)]"
              title="Equipo Fundador: Elvio Vazquez & Jorge Nuñez"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="relative z-10 flex-1 w-full max-w-[960px] mx-auto px-4 sm:px-6">
        {/* =========================================================
            1. HERO SECTION (Exact Match to Image 5)
           ========================================================= */}
        <section id="inicio" className="pt-10 pb-16 md:pt-14 md:pb-20 flex flex-col items-center text-center">
          {/* Top Kicker Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181C22] border border-[#272D37] text-[11px] font-label-text font-semibold tracking-wider uppercase text-[#B8C4D0] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#5294BE] shadow-[0_0_8px_#5294BE]" />
            <span>SOLUCIONES DIGITALES B2B DE NUEVA GENERACIÓN</span>
          </div>

          {/* Headline */}
          <h1
            className="font-headline font-bold text-3xl sm:text-4xl md:text-[44px] text-white tracking-tight leading-[1.15] max-w-3xl"
            style={{ textWrap: 'balance' }}
          >
            Transformamos tu Negocio con Soluciones Digitales y{' '}
            <span className="relative inline-block text-[#74B3DC]">
              Sistemas
              <span className="absolute left-0 right-0 -bottom-1 h-[3px] bg-gradient-to-r from-[#4A88B0] via-[#89C4EB] to-transparent rounded-full" />
            </span>{' '}
            a Medida
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base text-[#9AA2AE] max-w-xl leading-relaxed">
            Desarrollo web de alto impacto, landing pages optimizadas y sistemas de gestión
            inteligentes diseñados para acelerar tu crecimiento y rentabilidad.
          </p>

          {/* CTA Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => scrollToSection('portafolio')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2B729F] hover:bg-[#3582B3] text-white font-semibold text-sm transition-all shadow-[0_0_24px_rgba(43,114,159,0.45)] cursor-pointer whitespace-nowrap"
            >
              <span>Explorar Portafolio</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1A1D23] hover:bg-[#232730] border border-[#2C313B] text-[#E1E7ED] font-semibold text-sm transition-all whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px] text-[#74B3DC]">chat</span>
              <span>Contactar por WhatsApp</span>
            </a>
          </div>

          {/* Interactive Solution Calculator (Opción 2) */}
          <div className="mt-10 w-full max-w-[640px] rounded-2xl bg-[#15181E] border border-[#262D38] p-5 sm:p-7 text-left shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
            {/* Header of the Calculator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#222731] gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5294BE] shadow-[0_0_8px_#5294BE]" />
                <span className="font-mono text-xs font-semibold text-[#8EB8D6] uppercase tracking-wider">
                  Calculadora de Solución &amp; Ahorro
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#7C8594]">
                Diagnóstico interactivo para tu negocio
              </span>
            </div>

            {/* Step 1: Select Industry */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-[#D4DEE8] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#243344] text-[#74B3DC] text-[10px] flex items-center justify-center font-bold">1</span>
                <span>¿Cuál es el rubro de tu negocio?</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                {industries.map((ind) => {
                  const isSelected = calcIndustry === ind.id;
                  return (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setCalcIndustry(ind.id)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1E2D3D] border-[#4D8FB8] text-white shadow-[0_0_15px_rgba(77,143,184,0.3)]'
                          : 'bg-[#191D24] border-[#252B35] text-[#9AA2AE] hover:text-white hover:border-[#353D4B]'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-lg ${isSelected ? 'text-[#74B3DC]' : 'text-[#707B8A]'}`}>
                        {ind.icon}
                      </span>
                      <span className="leading-tight">{ind.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Challenge */}
            <div className="mt-5">
              <p className="text-xs font-semibold text-[#D4DEE8] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#243344] text-[#74B3DC] text-[10px] flex items-center justify-center font-bold">2</span>
                <span>¿Cuál es tu mayor desafío hoy?</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {challenges.map((chal) => {
                  const isSelected = calcChallenge === chal.id;
                  return (
                    <button
                      key={chal.id}
                      type="button"
                      onClick={() => setCalcChallenge(chal.id)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1A2837] border-[#4D8FB8] text-white shadow-[0_0_14px_rgba(77,143,184,0.25)]'
                          : 'bg-[#191D24] border-[#252B35] text-[#9AA2AE] hover:text-white hover:border-[#353D4B]'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-lg shrink-0 mt-0.5 ${isSelected ? 'text-[#74B3DC]' : 'text-[#707B8A]'}`}>
                        {chal.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold leading-tight ${isSelected ? 'text-white' : 'text-[#D0D7E0]'}`}>
                          {chal.label}
                        </p>
                        <p className="text-[10px] text-[#7C8594] mt-0.5 leading-snug">
                          {chal.sub}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Result Card */}
            <div className="mt-5 rounded-xl bg-[#111419] border border-[#2A3442] p-4 sm:p-5 relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#1A2B3C] border border-[#2E4A68] text-[10px] font-mono font-semibold uppercase tracking-wider text-[#7CC0EB]">
                  {currentCalc.categoryBadge}
                </span>
                <span className="text-[10px] font-mono text-[#7C8594]">
                  SOLUCIÓN RECOMENDADA
                </span>
              </div>

              <h4 className="font-headline font-bold text-base sm:text-lg text-white leading-snug">
                {currentCalc.title}
              </h4>

              <p className="text-xs sm:text-sm text-[#9AA2AE] mt-1.5 leading-relaxed">
                {currentCalc.description}
              </p>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#1F2530]">
                <div className="bg-[#181D25] rounded-lg p-2.5 border border-[#242C38]">
                  <div className="flex items-center gap-1.5 text-[#74B3DC] text-xs">
                    <span className="material-symbols-outlined text-[15px]">schedule</span>
                    <span className="font-semibold text-white">{currentCalc.timeSaved}</span>
                  </div>
                  <p className="text-[10px] text-[#7C8594] mt-0.5">{currentCalc.timeSavedLabel}</p>
                </div>

                <div className="bg-[#181D25] rounded-lg p-2.5 border border-[#242C38]">
                  <div className="flex items-center gap-1.5 text-[#54B889] text-xs">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    <span className="font-semibold text-white">{currentCalc.impactMetric}</span>
                  </div>
                  <p className="text-[10px] text-[#7C8594] mt-0.5">{currentCalc.impactMetricLabel}</p>
                </div>

                <div className="bg-[#181D25] rounded-lg p-2.5 border border-[#242C38]">
                  <div className="flex items-center gap-1.5 text-[#8EB8D6] text-xs">
                    <span className="material-symbols-outlined text-[15px]">bolt</span>
                    <span className="font-semibold text-white">{currentCalc.deliveryTime}</span>
                  </div>
                  <p className="text-[10px] text-[#7C8594] mt-0.5">{currentCalc.deliveryLabel}</p>
                </div>
              </div>

              {/* Direct CTAs */}
              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleApplyCalcSolution}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#2B729F] hover:bg-[#3582B3] text-white font-semibold text-xs sm:text-sm transition-all shadow-[0_0_18px_rgba(43,114,159,0.35)] cursor-pointer"
                >
                  <span>Cotizar esta Solución</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>

                <a
                  href={calcWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#181D25] hover:bg-[#202732] border border-[#2A3442] text-[#D4DEE8] font-semibold text-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#74B3DC]">chat</span>
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. SECCIÓN DE SERVICIOS (#servicios — NUESTRAS CAPACIDADES)
           ========================================================= */}
        <section id="servicios" className="py-12 border-t border-[#1D2129]">
          <div className="flex flex-col items-center text-center mb-8">
            <span className="px-3 py-1 rounded-md bg-[#181C22] border border-[#262C36] font-label-text text-[10px] font-semibold uppercase tracking-widest text-[#74B3DC]">
              NUESTRAS CAPACIDADES
            </span>
            <h2 className="mt-3 font-headline font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Soluciones de Ingeniería Digital que Escalan Empresas
            </h2>
            <p className="mt-2 text-sm text-[#949CA8] max-w-lg">
              Construimos activos tecnológicos estratégicos pensados para maximizar la eficiencia y
              facturación.
            </p>
          </div>

          {/* Services Stack / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servicesList.map((srv) => (
              <div
                key={srv.id}
                onClick={() => handleSelectServiceForQuote(srv.formOption)}
                className="group rounded-2xl bg-[#171A20] hover:bg-[#1B1F26] border border-[#252A33] hover:border-[#3A6D8C] p-6 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#1E252F] border border-[#2B3746] flex items-center justify-center text-[#74B3DC] mb-4 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">{srv.icon}</span>
                  </div>
                  <h3 className="font-headline font-bold text-lg text-white group-hover:text-[#97CDF4] transition-colors">
                    {srv.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#98A1AE] leading-relaxed">{srv.description}</p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {srv.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-[#1D222A] border border-[#2A303B] font-mono text-[11px] text-[#8AB8D9]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#74B3DC] opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                    Cotizar <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            3. REPOSITORIO / PORTAFOLIO DINÁMICO (#portafolio)
           ========================================================= */}
        <section id="portafolio" className="py-12 border-t border-[#1D2129]">
          <div className="flex flex-col items-center text-center mb-7">
            <span className="px-3 py-1 rounded-md bg-[#181C22] border border-[#262C36] font-label-text text-[10px] font-semibold uppercase tracking-widest text-[#74B3DC]">
              PORTAFOLIO SELECCIONADO
            </span>
            <h2 className="mt-3 font-headline font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Nuestros Trabajos y Casos de Éxito
            </h2>
            <p className="mt-2 text-sm text-[#949CA8] max-w-lg">
              Explora los proyectos web y sistemas que impulsan a nuestros clientes.
            </p>
          </div>

          {/* Category Filter Buttons (Exact Match to Image 5) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
            {(
              [
                { label: `Todos (${publishedProjects.length})`, value: 'Todos' },
                { label: 'Sistemas de Gestión', value: 'Sistemas de Gestión' },
                { label: 'Agendamiento', value: 'Agendamiento' },
                { label: 'Landing Pages', value: 'Landing Pages' },
              ] as const
            ).map((tab) => {
              const isActive = selectedCategory === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setSelectedCategory(tab.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#7CC0EB] text-[#082236] shadow-[0_0_16px_rgba(124,192,235,0.35)]'
                      : 'bg-[#181B21] text-[#9AA2AE] border border-[#262B34] hover:text-white hover:border-[#3A6D8C]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Dynamic Project Cards List */}
          {filteredProjects.length === 0 ? (
            <div className="rounded-2xl bg-[#171A20] border border-[#262B34] p-10 text-center">
              <p className="text-sm text-[#9AA2AE]">
                No hay proyectos publicados en la categoría seleccionada. Puedes activarlos o agregar
                nuevos desde el Panel de Administración.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {filteredProjects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-2xl bg-[#171A20] border border-[#262B35] hover:border-[#3A6D8C] transition-all shadow-lg p-5 sm:p-6"
                >
                  {/* Top Bar with Matrix Code / Live Badge */}
                  <div className="flex items-center justify-between text-[10px] font-mono pb-3.5 mb-3.5 border-b border-[#222730]">
                    <span className="text-[#8E97A5] tracking-wider uppercase">
                      {project.matrixCode || `${project.title.toUpperCase()} // LIVE`}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#1D2733] border border-[#2E4156] text-[#7CC0EB] font-semibold">
                      {project.matrixBadge || 'PRODUCTION'}
                    </span>
                  </div>

                  {/* Card Main Content */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-mono font-semibold uppercase tracking-wider text-[#66A7D2]">
                        {project.industry || project.client}
                      </span>
                      <span className="text-[#9AA2AE] font-medium">
                        {project.shortTag || project.category}
                      </span>
                    </div>

                    <h3 className="font-headline font-bold text-lg sm:text-xl text-white">
                      {project.landingTitle || project.title}
                    </h3>

                    <p className="mt-1.5 text-sm text-[#98A1AE] leading-relaxed">
                      {project.description}
                    </p>

                    {/* Impact / Result Bar */}
                    <div className="mt-4 pt-3.5 border-t border-[#222731] flex items-center justify-between gap-2 text-xs">
                      <span className="text-[#8E97A4]">{project.impactLabel || 'Impacto medido:'}</span>
                      <span className="font-semibold text-[#7CC0EB] text-right">
                        {project.impactValue}
                      </span>
                    </div>

                    {/* Action Button: Ver Caso de Estudio / Ver Proyecto */}
                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedCaseStudy(project)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#1D2129] hover:bg-[#252B36] border border-[#2B313D] text-xs font-semibold text-[#E1E7ED] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Ver Caso de Estudio</span>
                        <span className="material-symbols-outlined text-[15px] text-[#7CC0EB]">
                          open_in_new
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* =========================================================
            4. EQUIPO FUNDADOR (#equipo — Detrás de SysTex)
           ========================================================= */}
        <section id="equipo" className="py-12 border-t border-[#1D2129]">
          <div className="flex flex-col items-center text-center mb-8">
            <span className="px-3 py-1 rounded-md bg-[#181C22] border border-[#262C36] font-label-text text-[10px] font-semibold uppercase tracking-widest text-[#74B3DC]">
              EQUIPO FUNDADOR
            </span>
            <h2 className="mt-3 font-headline font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Detrás de SysTex
            </h2>
            <p className="mt-2 text-sm text-[#949CA8] max-w-md">
              Liderazgo técnico y visión de negocio de alto impacto al servicio de tu empresa.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Founder 1: Elvio Vazquez */}
            <div className="rounded-2xl bg-[#171A20] border border-[#252A34] hover:border-[#3A6D8C]/50 transition-colors p-6 sm:p-7 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src="images/elvio.jpeg"
                alt="Elvio Vázquez"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#3A6D8C] shadow-lg shrink-0 bg-[#1E242E]"
              />
              <div className="flex flex-col text-center sm:text-left">
                <h3 className="font-headline font-bold text-xl sm:text-2xl text-white leading-snug">
                  Elvio Vázquez
                </h3>
                <p className="text-sm font-semibold text-[#74B3DC] mt-0.5">
                  Co-Fundador &amp; Desarrollador de Software
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#8E97A4] mt-1 mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3A6D8C]" />
                  <span>Informática Empresarial &amp; Metodologías Ágiles (Scrum)</span>
                </div>
                <p className="text-xs sm:text-sm text-[#9AA2AE] leading-relaxed">
                  Estudiante de Lic. en Informática Empresarial con orientación al desarrollo web y gestión ágil de proyectos (Scrum). Especializado en analizar procesos comerciales y traducirlos en soluciones digitales eficientes y funcionales.
                </p>
              </div>
            </div>

            {/* Founder 2: Jorge Nuñez */}
            <div className="rounded-2xl bg-[#171A20] border border-[#252A34] hover:border-[#3A6D8C]/50 transition-colors p-6 sm:p-7 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src="images/jorge.jpeg"
                alt="Jorge Núñez"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#3A6D8C] shadow-lg shrink-0 bg-[#1E242E]"
              />
              <div className="flex flex-col text-center sm:text-left">
                <h3 className="font-headline font-bold text-xl sm:text-2xl text-white leading-snug">
                  Jorge Núñez
                </h3>
                <p className="text-sm font-semibold text-[#74B3DC] mt-0.5">
                  Co-Fundador &amp; Desarrollador de Software
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#8E97A4] mt-1 mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3A6D8C]" />
                  <span>Desarrollo Web &amp; Arquitectura de Bases de Datos</span>
                </div>
                <p className="text-xs sm:text-sm text-[#9AA2AE] leading-relaxed">
                  Estudiante de Lic. en Informática Empresarial enfocado en el desarrollo de software y el diseño de bases de datos. Encargado de la arquitectura técnica, y la lógica de los sistemas de gestión.
                </p>
              </div>
            </div>

            {/* Commitment Quote Block (Exact Match to Image 5) */}
            <div className="rounded-2xl bg-[#15181E] border border-[#232832] p-6 sm:p-8 flex flex-col items-center text-center mt-1">
              <SysTexMonogram className="w-10 h-10 mb-2" />
              <span className="material-symbols-outlined text-[#6CA6CE] text-base mb-2">
                verified
              </span>
              <blockquote className="text-xs sm:text-sm italic text-[#C5CDD8] max-w-xl leading-relaxed">
                “Combinamos excelencia en código, diseño estético de primer nivel y un enfoque
                implacable en retorno de inversión para cada cliente.”
              </blockquote>
              <cite className="mt-2.5 not-italic font-mono text-[10px] uppercase tracking-widest text-[#7C8594]">
                — COMPROMISO SYSTEX
              </cite>
            </div>
          </div>
        </section>

        {/* =========================================================
            5. FORMULARIO DE CONTACTO FUNCIONAL (#contacto)
           ========================================================= */}
        <section id="contacto" className="py-12 border-t border-[#1D2129]">
          <div className="flex flex-col items-center text-center mb-8">
            <span className="px-3 py-1 rounded-md bg-[#181C22] border border-[#262C36] font-label-text text-[10px] font-semibold uppercase tracking-widest text-[#74B3DC]">
              COTIZACIÓN INMEDIATA
            </span>
            <h2 className="mt-3 font-headline font-bold text-2xl sm:text-3xl text-white tracking-tight">
              ¿Listo para llevar tu empresa al siguiente nivel digital?
            </h2>
            <p className="mt-2 text-sm text-[#949CA8] max-w-md">
              Diseñamos y programamos la herramienta exacta que tu negocio necesita para automatizar
              procesos y multiplicar ventas.
            </p>
          </div>

          <div className="rounded-2xl bg-[#171A20] border border-[#262B35] p-5 sm:p-7 shadow-xl">
            {formSubmitted ? (
              <div className="py-6 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1E3242] border border-[#3A6D8C] flex items-center justify-center text-[#7CC0EB]">
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                </div>
                <h3 className="font-headline font-bold text-xl text-white">
                  ¡Solicitud Recibida con Éxito!
                </h3>
                <p className="text-sm text-[#9AA2AE] max-w-md">
                  Tu requerimiento ya fue registrado en tiempo real en la bandeja de entrada de{' '}
                  <strong className="text-white">Elvio Vazquez &amp; Jorge Nuñez</strong>.
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="px-4 py-2 rounded-xl bg-[#2B729F] hover:bg-[#3582B3] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">inbox</span>
                    <span>Ver Lead en Panel Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="px-4 py-2 rounded-xl bg-[#1F242D] hover:bg-[#282E3A] text-xs font-semibold text-[#C5CDD8] transition-all cursor-pointer"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-[#3A181B] border border-[#6E2A30] text-xs text-[#FFB4AB]">
                    {formError}
                  </div>
                )}

                {/* Nombre y Apellido */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#B8C2CE]">
                    Nombre y Apellido <span className="text-[#74B3DC]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full rounded-xl bg-[#111317] border border-[#262B35] focus:border-[#4D8FB8] px-3.5 py-2.5 text-sm text-white placeholder:text-[#5E6673] focus:outline-none transition-colors"
                  />
                </div>

                {/* Empresa o Negocio */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#B8C2CE]">
                    Empresa o Negocio <span className="text-[#74B3DC]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="Ej. Distribuidora Sur S.A."
                    className="w-full rounded-xl bg-[#111317] border border-[#262B35] focus:border-[#4D8FB8] px-3.5 py-2.5 text-sm text-white placeholder:text-[#5E6673] focus:outline-none transition-colors"
                  />
                </div>

                {/* WhatsApp + Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#B8C2CE]">
                      WhatsApp de Contacto <span className="text-[#74B3DC]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formWhatsapp}
                      onChange={(e) => setFormWhatsapp(e.target.value)}
                      placeholder="+595 985....."
                      className="w-full rounded-xl bg-[#111317] border border-[#262B35] focus:border-[#4D8FB8] px-3.5 py-2.5 text-sm text-white placeholder:text-[#5E6673] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#B8C2CE]">
                      Email Corporativo
                    </label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="contacto@empresa.com"
                      className="w-full rounded-xl bg-[#111317] border border-[#262B35] focus:border-[#4D8FB8] px-3.5 py-2.5 text-sm text-white placeholder:text-[#5E6673] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Tipo de Solución Requerida */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#B8C2CE]">
                    Tipo de Solución Requerida <span className="text-[#74B3DC]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formService}
                      onChange={(e) => setFormService(e.target.value)}
                      className="w-full appearance-none rounded-xl bg-[#111317] border border-[#262B35] focus:border-[#4D8FB8] px-3.5 py-2.5 pr-9 text-sm text-white focus:outline-none transition-colors"
                    >
                      <option value="Landing Page / Sitio Web de Alta Conversión">
                        Landing Page / Sitio Web de Alta Conversión
                      </option>
                      <option value="Sistema de Gestión & Control de Stock">
                        Sistema de Gestión &amp; Control de Stock
                      </option>
                      <option value="Plataforma de Agendamiento & Reservas">
                        Plataforma de Agendamiento &amp; Reservas
                      </option>
                      <option value="Software & Automatización a Medida">
                        Software &amp; Automatización a Medida
                      </option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-[#7C8594] pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Detalles del Requerimiento */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#B8C2CE]">
                    Detalles del Requerimiento
                  </label>
                  <textarea
                    rows={3}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Cuéntanos brevemente qué procesos buscas automatizar o qué objetivos tiene tu web..."
                    className="w-full rounded-xl bg-[#111317] border border-[#262B35] focus:border-[#4D8FB8] px-3.5 py-2.5 text-sm text-white placeholder:text-[#5E6673] focus:outline-none transition-colors"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="mt-2 w-full py-3 px-5 rounded-xl bg-[#2B729F] hover:bg-[#3484B8] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(43,114,159,0.45)] transition-all cursor-pointer"
                >
                  <span>Solicitar Cotización Inmediata</span>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </form>
            )}
          </div>

          {/* Direct WhatsApp Button Below Form (Exact Match to Image 5) */}
          <div className="mt-4 flex justify-center">
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#161920] hover:bg-[#1E222B] border border-[#252A34] text-xs font-semibold text-[#B8C4D0] transition-all"
            >
              <span className="material-symbols-outlined text-sm text-[#74B3DC]">chat</span>
              <span>Hablar directamente por WhatsApp con los fundadores</span>
            </a>
          </div>
        </section>

        {/* =========================================================
            6. FOOTER CORPORATIVO
           ========================================================= */}
        <footer className="py-10 border-t border-[#1D2129] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7C8594]">
          <div className="flex flex-col items-center sm:items-start gap-1.5">
            <SysTexLogo size="sm" />
            <p className="mt-1 text-[11px] text-[#7C8594]">
              Fundada por <strong className="text-[#C5CDD8]">Elvio Vazquez</strong> &amp;{' '}
              <strong className="text-[#C5CDD8]">Jorge Nuñez</strong>. Todos los derechos
              reservados © {new Date().getFullYear()}.
            </p>
          </div>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => scrollToSection('servicios')}
              className="hover:text-white transition-colors"
            >
              Servicios
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('portafolio')}
              className="hover:text-white transition-colors"
            >
              Portafolio
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contacto')}
              className="hover:text-white transition-colors"
            >
              Contacto
            </button>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-[#74B3DC] hover:underline font-semibold"
            >
              SysTex Admin
            </button>
          </div>
        </footer>
      </main>

      {/* =========================================================
          BOTTOM NAVIGATION BAR (Exact Match to Image 5 Bottom Bar)
         ========================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-14 bg-[#12151B]/95 backdrop-blur-xl border-t border-[#232832] flex items-center justify-around max-w-[960px] mx-auto px-2">
        {[
          { id: 'inicio', label: 'Inicio', icon: 'home' },
          { id: 'servicios', label: 'Servicios', icon: 'auto_awesome_motion' },
          { id: 'portafolio', label: 'Portafolio', icon: 'grid_view' },
          { id: 'equipo', label: 'Equipo', icon: 'groups' },
          { id: 'contacto', label: 'Contacto', icon: 'chat_bubble' },
        ].map((item) => {
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
                active ? 'text-[#7CC0EB]' : 'text-[#7C8594] hover:text-[#C5CDD8]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* =========================================================
          CASE STUDY & LIVE PROJECT MODAL
         ========================================================= */}
      {selectedCaseStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-2xl bg-[#181B22] border border-[#2B313D] overflow-hidden shadow-2xl">
            <div className="relative h-52 bg-[#111317]">
              <img
                src={selectedCaseStudy.imageUrl}
                alt={selectedCaseStudy.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181B22] via-[#181B22]/30 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedCaseStudy(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-[#111317]/80 text-[#C5CDD8] hover:text-white flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
              <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#7CC0EB]">
                    {selectedCaseStudy.industry} · {selectedCaseStudy.deployId}
                  </span>
                  <h3 className="font-headline font-bold text-2xl text-white">
                    {selectedCaseStudy.landingTitle || selectedCaseStudy.title}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex flex-col gap-4">
              <p className="text-sm text-[#B8C2CE] leading-relaxed">
                {selectedCaseStudy.description}
              </p>

              <div className="rounded-xl bg-[#12151B] border border-[#242934] p-3.5 flex items-center justify-between">
                <span className="text-xs text-[#8E97A4]">
                  {selectedCaseStudy.impactLabel || 'Impacto medido:'}
                </span>
                <span className="text-xs font-bold text-[#7CC0EB]">
                  {selectedCaseStudy.impactValue}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const srv = selectedCaseStudy.category;
                    setSelectedCaseStudy(null);
                    handleSelectServiceForQuote(
                      srv === 'Agendamiento'
                        ? 'Plataforma de Agendamiento & Reservas'
                        : srv === 'Landing Pages'
                          ? 'Landing Page / Sitio Web de Alta Conversión'
                          : 'Sistema de Gestión & Control de Stock'
                    );
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#212630] hover:bg-[#2A303C] text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Cotizar Sistema Similar
                </button>

                <a
                  href={selectedCaseStudy.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#2B729F] hover:bg-[#3582B3] text-xs font-semibold text-white inline-flex items-center gap-1.5 shadow-[0_0_20px_rgba(43,114,159,0.4)] transition-all"
                >
                  <span>Abrir Proyecto en Vivo</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
