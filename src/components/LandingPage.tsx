import React, { useState } from 'react';
import {
  Project,
  PortfolioCategory,
  Lead,
  AgencySettings,
} from '../types/systex';
import { SysTexLogo, SysTexMonogram } from './SysTexLogos';
import isotipoImg from '../assets/images/isotiposystex.jpg';

interface LandingPageProps {
  projects: Project[];
  settings: AgencySettings;
  onAddLead: (newLead: Omit<Lead, 'id' | 'status' | 'dateLabel' | 'timeLabel' | 'createdAt'>) => void;
  onUpdateSettings?: (settings: AgencySettings) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  projects,
  settings,
  onAddLead,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | PortfolioCategory>('Todos');
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { id: 'empresa', label: 'Empresa', icon: 'domain' },
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
  const calcWhatsappUrl = `https://wa.me/595994865645?text=${calcWhatsappMessage}`;

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

  const whatsappOfficialUrl = 'https://wa.me/595994865645';
  const whatsappDirectUrl = 'https://wa.me/595994865645';

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
    <div className="min-h-screen bg-[#111317] text-[#E1E7ED] flex flex-col relative overflow-x-hidden w-full">
      {/* Ambient Top Metallic Glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[720px] sm:w-[1000px] h-[340px] sm:h-[420px] bg-[#3A6D8C]/15 blur-[140px] rounded-full z-0" />

      {/* TOP NAVBAR (Full Width max-w-7xl + Desktop & Mobile Hamburger Menu) */}
      <header className="sticky top-0 z-50 w-full bg-[#111317]/95 backdrop-blur-xl border-b border-[#22262E]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('inicio');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 sm:gap-3 focus:outline-none group cursor-pointer"
            aria-label="SysTex — Inicio"
          >
            <img
              src={isotipoImg || "/images/isotiposystex.jpg"}
              alt="SysTex Isotipo"
              className="h-8 sm:h-10 w-auto object-contain rounded-full border border-[#00F0FF]/30 shadow-[0_0_12px_rgba(0,240,255,0.25)] shrink-0 group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('/images/isotiposystex.jpg')) {
                  target.src = '/images/isotiposystex.jpg';
                }
              }}
            />
            <div className="flex flex-col justify-center leading-none">
              <div className="font-headline font-bold tracking-tight flex items-baseline text-lg sm:text-xl">
                <span className="bg-gradient-to-b from-[#7EC6EE] via-[#4FACFE] to-[#0093E9] bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  Sys
                </span>
                <span className="bg-gradient-to-b from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8] bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  Tex
                </span>
              </div>
              <span className="font-label text-[#8FA8BE] font-semibold uppercase mt-0.5 sm:mt-1 text-[8px] sm:text-[8.5px] tracking-[0.18em]">
                DIGITAL SYSTEMS
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-sm font-medium text-[#9BA3AE]">
            <button
              type="button"
              onClick={() => scrollToSection('inicio')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                activeSection === 'inicio' ? 'text-[#97CDF4] font-semibold' : ''
              }`}
            >
              Inicio
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('servicios')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                activeSection === 'servicios' ? 'text-[#97CDF4] font-semibold' : ''
              }`}
            >
              Servicios
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('portafolio')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                activeSection === 'portafolio' ? 'text-[#97CDF4] font-semibold' : ''
              }`}
            >
              Portafolio
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('equipo')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                activeSection === 'equipo' ? 'text-[#97CDF4] font-semibold' : ''
              }`}
            >
              Nosotros
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contacto')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                activeSection === 'contacto' ? 'text-[#97CDF4] font-semibold' : ''
              }`}
            >
              Contacto
            </button>
          </nav>

          {/* Desktop Right Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://wa.me/595994865645"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3A6D8C] hover:bg-[#477E9F] text-white text-xs font-semibold transition-all shadow-[0_0_16px_rgba(58,109,140,0.35)] cursor-pointer"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.2 1.16.17 1.6-.1.49-.3 1.47-1.2 1.68-1.71.21-.51.21-.95.15-1.05-.06-.1-.23-.16-.48-.28z"/>
              </svg>
              <span>WhatsApp Directo</span>
            </a>

            <button
              type="button"
              onClick={() => scrollToSection('contacto')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#191D24] hover:bg-[#222732] border border-[#2B313D] text-[#C5CDD8] hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <span>Cotizar Proyecto</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Mobile Right Controls: WhatsApp Quick Icon + Hamburger Button (block md:hidden) */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="https://wa.me/595994865645"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-[#3A6D8C]/25 border border-[#3A6D8C]/50 text-white flex items-center justify-center"
              title="Contactar directamente por whatsapp (+595994865645)"
            >
              <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.2 1.16.17 1.6-.1.49-.3 1.47-1.2 1.68-1.71.21-.51.21-.95.15-1.05-.06-.1-.23-.16-.48-.28z"/>
              </svg>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#171A21] border border-[#252A34] text-white hover:bg-[#1E232C] transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="block md:hidden w-full bg-[#12151B]/98 backdrop-blur-2xl border-b border-[#252A34] px-4 py-5 shadow-2xl transition-all">
            <nav className="flex flex-col gap-1.5">
              {[
                { id: 'inicio', label: 'Inicio', icon: 'home' },
                { id: 'servicios', label: 'Servicios de Ingeniería', icon: 'auto_awesome_motion' },
                { id: 'portafolio', label: 'Portafolio de Proyectos', icon: 'grid_view' },
                { id: 'equipo', label: 'Equipo Fundador (Nosotros)', icon: 'groups' },
                { id: 'contacto', label: 'Contacto & Cotización', icon: 'chat_bubble' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    scrollToSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-sm font-semibold transition-colors cursor-pointer ${
                    activeSection === item.id
                      ? 'bg-[#1C232E] text-[#86C4EE] border border-[#2E3C4E]'
                      : 'text-[#C5CDD8] hover:bg-[#181C23] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl text-[#74B3DC]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}

              <div className="pt-3 mt-2 border-t border-[#222731] flex flex-col gap-2.5">
                <a
                  href="https://wa.me/595994865645"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#3A6D8C] hover:bg-[#477E9F] text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(58,109,140,0.35)]"
                >
                  <svg className="w-5 h-5 fill-currentColor shrink-0" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.2 1.16.17 1.6-.1.49-.3 1.47-1.2 1.68-1.71.21-.51.21-.95.15-1.05-.06-.1-.23-.16-.48-.28z"/>
                  </svg>
                  <span>Contactar directamente por whatsapp</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    scrollToSection('contacto');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#191D24] hover:bg-[#222732] border border-[#2B313D] text-[#C5CDD8] hover:text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Cotizar Proyecto Ahora</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* MAIN CONTENT CONTAINER (Full Width max-w-7xl mx-auto px-4 sm:px-6 lg:px-8) */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================
            1. HERO SECTION (Mobile-first typography text-3xl sm:text-5xl lg:text-6xl)
           ========================================================= */}
        <section id="inicio" className="py-8 sm:py-16 lg:py-24 flex flex-col items-center text-center">
          {/* Top Kicker Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181C22] border border-[#272D37] text-[11px] sm:text-xs font-label-text font-semibold tracking-wide text-[#B8C4D0] mb-6 sm:mb-8">
            <span className="w-2 h-2 rounded-full bg-[#5294BE] shadow-[0_0_8px_#5294BE]" />
            <span>Soluciones Digitales a la Medida de tu Negocio</span>
          </div>

          {/* Headline (Adjusted typography for mobile: text-3xl sm:text-5xl lg:text-6xl) */}
          <h1
            className="font-headline font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12] max-w-5xl"
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
          <p className="mt-5 sm:mt-6 text-sm sm:text-lg text-[#9AA2AE] max-w-2xl sm:max-w-3xl leading-relaxed">
            Desarrollo web de alto impacto, landing pages optimizadas y sistemas de gestión
            inteligentes diseñados para acelerar tu crecimiento y rentabilidad.
          </p>

          {/* CTA Buttons */}
          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            <a
              href="https://wa.me/595994865645"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#3A6D8C] hover:bg-[#477E9F] text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-[0_0_24px_rgba(58,109,140,0.45)] hover:shadow-[0_0_32px_rgba(58,109,140,0.65)] hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap cursor-pointer"
            >
              <svg className="w-5 h-5 fill-currentColor shrink-0" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.2 1.16.17 1.6-.1.49-.3 1.47-1.2 1.68-1.71.21-.51.21-.95.15-1.05-.06-.1-.23-.16-.48-.28z"/>
              </svg>
              <span>Contactar directamente por whatsapp</span>
            </a>

            <button
              type="button"
              onClick={() => scrollToSection('portafolio')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1A1D23] hover:bg-[#232730] border border-[#2C313B] text-[#E1E7ED] font-semibold text-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Explorar Portafolio</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          {/* Interactive Solution Calculator (Opción 2) */}
          <div className="mt-10 sm:mt-14 w-full max-w-4xl rounded-2xl sm:rounded-3xl bg-[#15181E] border border-[#262D38] p-5 sm:p-8 lg:p-10 text-left shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
            {/* Header of the Calculator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#222731] gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5294BE] shadow-[0_0_8px_#5294BE]" />
                <span className="font-mono text-xs font-semibold text-[#8EB8D6] uppercase tracking-wider">
                  Calculadora de Solución &amp; Ahorro
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-[#7C8594]">
                Diagnóstico interactivo para tu negocio
              </span>
            </div>

            {/* Step 1: Select Industry */}
            <div className="mt-5">
              <p className="text-xs sm:text-sm font-semibold text-[#D4DEE8] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#243344] text-[#74B3DC] text-[11px] flex items-center justify-center font-bold">1</span>
                <span>¿Cuál es el rubro de tu negocio?</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2.5">
                {industries.map((ind) => {
                  const isSelected = calcIndustry === ind.id;
                  return (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setCalcIndustry(ind.id)}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 sm:p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#203445] border-[#5294BE] text-white shadow-[0_0_15px_rgba(82,148,190,0.3)]'
                          : 'bg-[#181C23] border-[#252C37] text-[#9AA2AE] hover:text-white hover:border-[#384353]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px] text-[#74B3DC]">{ind.icon}</span>
                      <span className="text-center sm:text-left">{ind.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Challenge */}
            <div className="mt-6">
              <p className="text-xs sm:text-sm font-semibold text-[#D4DEE8] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#243344] text-[#74B3DC] text-[11px] flex items-center justify-center font-bold">2</span>
                <span>¿Qué proceso necesitas solucionar hoy?</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-2.5">
                {challenges.map((chl) => {
                  const isSelected = calcChallenge === chl.id;
                  return (
                    <button
                      key={chl.id}
                      type="button"
                      onClick={() => setCalcChallenge(chl.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#203445] border-[#5294BE] text-white shadow-[0_0_15px_rgba(82,148,190,0.3)]'
                          : 'bg-[#181C23] border-[#252C37] text-[#9AA2AE] hover:text-white hover:border-[#384353]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="material-symbols-outlined text-[18px] text-[#74B3DC]">
                          {chl.icon}
                        </span>
                        <span className="font-semibold text-xs text-white">{chl.label}</span>
                      </div>
                      <p className="text-[11px] text-[#8C96A4] leading-snug">{chl.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Dynamic Result Card */}
            <div className="mt-6 pt-5 border-t border-[#222731]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md bg-[#1B2B38] text-[#74B3DC] font-mono text-[11px] font-semibold tracking-wider uppercase inline-block w-fit">
                  {currentCalc.categoryBadge}
                </span>
                <span className="text-[11px] text-[#7C8594]">Propuesta de Ingeniería SysTex</span>
              </div>

              <h3 className="font-headline font-bold text-base sm:text-xl text-white">
                {currentCalc.title}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-[#A8B2BF] leading-relaxed">
                {currentCalc.description}
              </p>

              {/* Estimated Impact & Metrics (1 col on mobile, 3 cols on sm+) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-5">
                <div className="p-3.5 rounded-xl bg-[#181C23] border border-[#252C37]">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#7C8594] block">
                    Tiempo Ahorrado
                  </span>
                  <p className="text-lg sm:text-xl font-bold font-mono text-[#74B3DC] mt-0.5">
                    {currentCalc.timeSaved}
                  </p>
                  <p className="text-[11px] text-[#8C96A4] mt-0.5">{currentCalc.timeSavedLabel}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#181C23] border border-[#252C37]">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#7C8594] block">
                    Impacto en el Negocio
                  </span>
                  <p className="text-lg sm:text-xl font-bold font-mono text-[#74B3DC] mt-0.5">
                    {currentCalc.impactMetric}
                  </p>
                  <p className="text-[11px] text-[#8C96A4] mt-0.5">{currentCalc.impactMetricLabel}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#181C23] border border-[#252C37]">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#7C8594] block">
                    Tiempo de Entrega
                  </span>
                  <p className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5">
                    {currentCalc.deliveryTime}
                  </p>
                  <p className="text-[11px] text-[#8C96A4] mt-0.5">{currentCalc.deliveryLabel}</p>
                </div>
              </div>

              {/* Direct CTAs */}
              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleApplyCalcSolution}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2B729F] hover:bg-[#3582B3] text-white font-semibold text-xs sm:text-sm transition-all shadow-[0_0_18px_rgba(43,114,159,0.35)] cursor-pointer"
                >
                  <span>Cotizar esta Solución</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>

                <a
                  href={calcWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#181D25] hover:bg-[#202732] border border-[#2A3442] text-[#D4DEE8] hover:text-white font-semibold text-xs sm:text-sm transition-colors"
                >
                  <svg className="w-4 h-4 fill-currentColor text-[#74B3DC]" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.2 1.16.17 1.6-.1.49-.3 1.47-1.2 1.68-1.71.21-.51.21-.95.15-1.05-.06-.1-.23-.16-.48-.28z"/>
                  </svg>
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. SECCIÓN DE SERVICIOS (4 Columnas en Desktop: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6)
           ========================================================= */}
        <section id="servicios" className="py-8 sm:py-16 border-t border-[#1D2129]">
          <div className="flex flex-col items-center text-center mb-10">
            <span className="px-3.5 py-1 rounded-md bg-[#181C22] border border-[#262C36] font-label-text text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-[#74B3DC]">
              NUESTRAS CAPACIDADES
            </span>
            <h2 className="mt-3 font-headline font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Soluciones de Ingeniería Digital que Escalan Empresas
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#949CA8] max-w-2xl">
              Construimos activos tecnológicos estratégicos pensados para maximizar la eficiencia y facturación de tu negocio.
            </p>
          </div>

          {/* Services Grid (4 columnas en Desktop, 2 en Tablet, 1 en Móvil) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesList.map((srv) => (
              <div
                key={srv.id}
                onClick={() => handleSelectServiceForQuote(srv.formOption)}
                className="group rounded-2xl bg-[#171A20] hover:bg-[#1B1F26] border border-[#252A33] hover:border-[#3A6D8C] p-6 sm:p-7 transition-all cursor-pointer flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#1E252F] border border-[#2B3746] flex items-center justify-center text-[#74B3DC] mb-5 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-2xl">{srv.icon}</span>
                  </div>
                  <h3 className="font-headline font-bold text-lg sm:text-xl text-white group-hover:text-[#97CDF4] transition-colors leading-snug">
                    {srv.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-[#98A1AE] leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#222731] flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {srv.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-[#1D222A] border border-[#2A303B] font-mono text-[10px] text-[#8AB8D9]"
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
            3. REPOSITORIO / PORTAFOLIO DINÁMICO (3 a 4 Columnas en Desktop: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6)
           ========================================================= */}
        <section id="portafolio" className="py-8 sm:py-16 border-t border-[#1D2129]">
          <div className="flex flex-col items-center text-center mb-8">
            <span className="px-3.5 py-1 rounded-md bg-[#181C22] border border-[#262C36] font-label-text text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-[#74B3DC]">
              PORTAFOLIO SELECCIONADO
            </span>
            <h2 className="mt-3 font-headline font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Nuestros Trabajos y Casos de Éxito
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#949CA8] max-w-2xl">
              Explora los proyectos web y sistemas que impulsan a nuestros clientes con resultados comprobables.
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 mb-8">
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
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
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

          {/* Dynamic Project Cards Grid (1 col en móvil, 2 en tablet, 3 en lg, 4 en xl) */}
          {filteredProjects.length === 0 ? (
            <div className="rounded-2xl bg-[#171A20] border border-[#262B34] p-10 text-center">
              <p className="text-sm text-[#9AA2AE]">
                Próximamente estaremos publicando nuevos casos de estudio y proyectos en esta categoría.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => {
                const projectImage = project.imageUrl || project.image;
                const projectTitle = project.landingTitle || project.title;
                return (
                  <article
                    key={project.id}
                    className="rounded-2xl bg-[#171A20] border border-[#262B35] hover:border-[#3A6D8C] transition-all shadow-lg overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* Project Preview Image */}
                      {projectImage && (
                        <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-[#111317]">
                          <img
                            src={projectImage}
                            alt={projectTitle}
                            referrerPolicy="no-referrer"
                            className="w-full h-full max-w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#171A20] via-transparent to-transparent opacity-80" />
                        </div>
                      )}

                      {/* Content Body */}
                      <div className="p-5 sm:p-6">
                        {/* Title */}
                        <h3 className="font-headline font-bold text-lg text-white leading-snug">
                          {projectTitle}
                        </h3>

                        {/* Description */}
                        <p className="mt-2 text-xs sm:text-sm text-[#98A1AE] leading-relaxed line-clamp-3">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                      {/* Action Button: Ver Caso de Estudio */}
                      <button
                        type="button"
                        onClick={() => setSelectedCaseStudy(project)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#1D2129] hover:bg-[#252B36] border border-[#2B313D] hover:border-[#3A6D8C] text-xs font-semibold text-[#E1E7ED] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Ver Caso de Estudio</span>
                        <span className="material-symbols-outlined text-[15px] text-[#7CC0EB]">
                          open_in_new
                        </span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================================================
            4. EQUIPO FUNDADOR (#equipo — 2 Columnas en Desktop: grid-cols-1 lg:grid-cols-2 gap-6)
           ========================================================= */}
        <section id="equipo" className="py-8 sm:py-16 border-t border-[#1D2129]">
          <div className="flex flex-col items-center text-center mb-10">
            <span className="px-3.5 py-1 rounded-md bg-[#181C22] border border-[#262C36] font-label-text text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-[#74B3DC]">
              EQUIPO FUNDADOR
            </span>
            <h2 className="mt-3 font-headline font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Detrás de SysTex
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#949CA8] max-w-xl">
              Liderazgo técnico y visión de negocio de alto impacto al servicio de tu empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Founder 1: Elvio Vazquez */}
            <div className="rounded-2xl bg-[#171A20] border border-[#252A34] hover:border-[#3A6D8C]/50 transition-colors p-6 sm:p-7 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 shadow-lg">
              <img
                src="images/elvio.jpeg"
                alt="Elvio Vázquez"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl sm:rounded-full object-cover max-w-full border-4 border-[#3A6D8C] shadow-lg shrink-0 bg-[#1E242E]"
              />
              <div className="flex flex-col text-center sm:text-left flex-1">
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
            <div className="rounded-2xl bg-[#171A20] border border-[#252A34] hover:border-[#3A6D8C]/50 transition-colors p-6 sm:p-7 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 shadow-lg">
              <img
                src="images/jorge.jpeg"
                alt="Jorge Núñez"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl sm:rounded-full object-cover max-w-full border-4 border-[#3A6D8C] shadow-lg shrink-0 bg-[#1E242E]"
              />
              <div className="flex flex-col text-center sm:text-left flex-1">
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
                  Estudiante de Lic. en Informática Empresarial enfocado en el desarrollo de software y el diseño de bases de datos. Encargado de la arquitectura técnica y la lógica de los sistemas de gestión.
                </p>
              </div>
            </div>
          </div>

          {/* Commitment Quote Block */}
          <div className="w-full rounded-2xl bg-[#15181E] border border-[#232832] p-6 sm:p-8 mt-6 flex flex-col items-center text-center">
            <SysTexMonogram className="w-10 h-10 mb-2" />
            <span className="material-symbols-outlined text-[#6CA6CE] text-base mb-2">
              verified
            </span>
            <blockquote className="text-xs sm:text-sm italic text-[#C5CDD8] max-w-2xl leading-relaxed">
              “Combinamos excelencia en código, diseño estético de primer nivel y un enfoque
              implacable en retorno de inversión para cada cliente.”
            </blockquote>
            <cite className="mt-2.5 not-italic font-mono text-[10px] uppercase tracking-widest text-[#7C8594]">
              — COMPROMISO SYSTEX
            </cite>
          </div>
        </section>

        {/* =========================================================
            5. FORMULARIO DE CONTACTO FUNCIONAL (Desktop 12-Column Grid: lg:grid-cols-12 gap-8)
           ========================================================= */}
        <section id="contacto" className="py-8 sm:py-16 border-t border-[#1D2129]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Direct Info & Value Proposition */}
            <div className="lg:col-span-5 flex flex-col gap-6 text-center lg:text-left">
              <div>
                <span className="px-3.5 py-1 rounded-md bg-[#181C22] border border-[#262C36] font-label-text text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-[#74B3DC]">
                  COTIZACIÓN INMEDIATA
                </span>
                <h2 className="mt-3 font-headline font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                  ¿Listo para llevar tu empresa al siguiente nivel digital?
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#949CA8] leading-relaxed">
                  Diseñamos y programamos la herramienta exacta que tu negocio necesita para automatizar procesos y multiplicar ventas.
                </p>
              </div>

              {/* Guarantees List */}
              <div className="flex flex-col gap-3 text-left">
                {[
                  {
                    title: 'Respuesta en menos de 24 horas',
                    desc: 'Evaluamos tu solicitud de inmediato y coordinamos una reunión de diagnóstico.',
                    icon: 'schedule',
                  },
                  {
                    title: 'Asesoría directa con los fundadores',
                    desc: 'Hablas directamente con Elvio y Jorge, sin intermediarios comerciales.',
                    icon: 'engineering',
                  },
                  {
                    title: 'Código propio y escalable',
                    desc: 'Entregamos soluciones tecnológicas 100% de tu propiedad, listas para crecer.',
                    icon: 'verified_user',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#15181E] border border-[#222731]">
                    <div className="w-8 h-8 rounded-lg bg-[#1B2735] text-[#74B3DC] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-white">{item.title}</h4>
                      <p className="text-[11px] sm:text-xs text-[#8E97A4] mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp Direct Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#17232F] to-[#141B24] border border-[#2A3E52] text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7CC0EB] font-semibold">
                    ¿Prefieres chat directo?
                  </span>
                  <p className="font-headline font-bold text-sm text-white mt-0.5">
                    WhatsApp: +595 994 865645
                  </p>
                  <p className="text-[11px] text-[#A4B1C0]">Atención directa para Paraguay y la región</p>
                </div>
                <a
                  href="https://wa.me/595994865645"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#3A6D8C] hover:bg-[#477E9F] text-white font-semibold text-xs sm:text-sm transition-all shadow-[0_0_18px_rgba(58,109,140,0.35)] shrink-0 whitespace-nowrap cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.2 1.16.17 1.6-.1.49-.3 1.47-1.2 1.68-1.71.21-.51.21-.95.15-1.05-.06-.1-.23-.16-.48-.28z"/>
                  </svg>
                  <span>Contactar directamente por whatsapp</span>
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Contact Form */}
            <div className="lg:col-span-7">
              <div className="w-full rounded-2xl sm:rounded-3xl bg-[#171A20] border border-[#262B35] p-6 sm:p-8 shadow-2xl">
                {formSubmitted ? (
                  <div className="py-8 text-center flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#1E3242] border border-[#3A6D8C] flex items-center justify-center text-[#7CC0EB]">
                      <span className="material-symbols-outlined text-3xl">check_circle</span>
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-2xl text-white">
                        ¡Solicitud Recibida con Éxito!
                      </h3>
                      <p className="text-sm text-[#9AA2AE] max-w-md mt-1">
                        Tu requerimiento ya fue registrado en tiempo real en la bandeja de entrada de{' '}
                        <strong className="text-white">Elvio Vazquez &amp; Jorge Nuñez</strong>.
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                      <a
                        href="https://wa.me/595994865645"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3 rounded-xl bg-[#3A6D8C] hover:bg-[#477E9F] text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_18px_rgba(58,109,140,0.35)]"
                      >
                        <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.2 1.16.17 1.6-.1.49-.3 1.47-1.2 1.68-1.71.21-.51.21-.95.15-1.05-.06-.1-.23-.16-.48-.28z"/>
                        </svg>
                        <span>Contactar directamente por whatsapp</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setFormSubmitted(false)}
                        className="px-5 py-3 rounded-xl bg-[#1F242D] hover:bg-[#282E3A] text-xs font-semibold text-[#C5CDD8] transition-all cursor-pointer"
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

                    {/* Nombre y Empresa en 2 columnas en sm+ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          className="w-full appearance-none rounded-xl bg-[#111317] border border-[#262B35] focus:border-[#4D8FB8] px-3.5 py-2.5 pr-9 text-sm text-white focus:outline-none transition-colors cursor-pointer"
                        >
                          <option value="Landing Page / Sitio Web de Alta Conversión">
                            Landing Page / Sitio Web de Alta Conversión
                          </option>
                          <option value="Sistema de Gestión & Control de Stock">
                            Sistema de Gestión &amp; Control de Stock (ERP)
                          </option>
                          <option value="Plataforma de Agendamiento & Reservas">
                            Plataforma de Agendamiento &amp; Reservas con WhatsApp
                          </option>
                          <option value="Software & Automatización a Medida">
                            Software &amp; Automatización de Procesos a Medida
                          </option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-2.5 text-[#7C8594] pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>

                    {/* Mensaje o Descripción */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#B8C2CE]">
                        Detalles o requerimiento inicial (Opcional)
                      </label>
                      <textarea
                        rows={3}
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        placeholder="Cuéntanos brevemente sobre tu negocio y qué te gustaría automatizar o mejorar..."
                        className="w-full rounded-xl bg-[#111317] border border-[#262B35] focus:border-[#4D8FB8] px-3.5 py-2.5 text-sm text-white placeholder:text-[#5E6673] focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    {/* Botón de Envío */}
                    <button
                      type="submit"
                      className="mt-2 w-full py-3.5 px-6 rounded-xl bg-[#2B729F] hover:bg-[#3582B3] text-white font-semibold text-sm transition-all shadow-[0_0_24px_rgba(43,114,159,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Enviar Solicitud de Cotización</span>
                      <span className="material-symbols-outlined text-base">send</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================
          6. FOOTER CORPORATIVO (Full Width max-w-7xl, 100% libre de accesos a Admin)
         ========================================================= */}
      <footer className="w-full border-t border-[#1D2129] py-10 sm:py-14 mt-12 bg-[#0E1014]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#7C8594]">
          <div className="flex flex-col items-center sm:items-start gap-1.5 text-center sm:text-left">
            <SysTexLogo size="sm" />
            <p className="mt-1 text-[11px] text-[#7C8594]">
              Fundada por <strong className="text-[#C5CDD8]">Elvio Vazquez</strong> &amp;{' '}
              <strong className="text-[#C5CDD8]">Jorge Nuñez</strong>. Todos los derechos reservados © {new Date().getFullYear()}.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => scrollToSection('inicio')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Inicio
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('servicios')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Servicios
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('portafolio')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Portafolio
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('equipo')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Nosotros
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contacto')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contacto
            </button>
          </div>
        </div>
      </footer>

      {/* =========================================================
          CASE STUDY & LIVE PROJECT MODAL
         ========================================================= */}
      {selectedCaseStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#181B22] border border-[#2B313D] overflow-hidden shadow-2xl">
            <div className="relative h-56 sm:h-64 bg-[#111317]">
              <img
                src={selectedCaseStudy.imageUrl || selectedCaseStudy.image}
                alt={selectedCaseStudy.title}
                referrerPolicy="no-referrer"
                className="w-full h-full max-w-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181B22] via-[#181B22]/30 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedCaseStudy(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-[#111317]/80 text-[#C5CDD8] hover:text-white flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
              <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#7CC0EB]">
                    {selectedCaseStudy.industry} · {selectedCaseStudy.deployId}
                  </span>
                  <h3 className="font-headline font-bold text-xl sm:text-2xl text-white">
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
                  {selectedCaseStudy.metrics || selectedCaseStudy.impactValue}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 gap-3 flex-wrap sm:flex-nowrap">
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
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#212630] hover:bg-[#2A303C] text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Cotizar Sistema Similar
                </button>

                <a
                  href={selectedCaseStudy.link || selectedCaseStudy.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2B729F] hover:bg-[#3582B3] text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(43,114,159,0.4)] transition-all"
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
