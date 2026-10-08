import React, { useState, useRef } from 'react';
import {
  Project,
  PortfolioCategory,
  Lead,
  LeadStatus,
  AgencySettings,
  FOUNDER_ASSETS,
  PORTFOLIO_PRESET_IMAGES,
} from '../types/systex';
import { SysTexMonogram, SysTexIsotipo } from './SysTexLogos';

interface AdminDashboardProps {
  projects: Project[];
  leads: Lead[];
  settings: AgencySettings;
  onCreateProject: (project: Omit<Project, 'id' | 'deployId'>) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onToggleProjectVisibility: (id: string) => void;
  onUpdateLeadStatus: (id: string, status: LeadStatus) => void;
  onDeleteLead: (id: string) => void;
  onUpdateSettings: (settings: AgencySettings) => void;
  onResetDemoData: () => void;
  onSwitchToPublic: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects,
  leads,
  settings,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onToggleProjectVisibility,
  onUpdateLeadStatus,
  onDeleteLead,
  onUpdateSettings,
  onResetDemoData,
  onSwitchToPublic,
  onLogout,
}) => {
  // Navigation & Search State
  const [activeNav, setActiveNav] = useState<
    'dashboard' | 'inbox-leads' | 'portfolio-management' | 'settings'
  >('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [showTopAlert, setShowTopAlert] = useState(true);

  // Leads Filter & Detail Modal State
  const [leadFilter, setLeadFilter] = useState<
    'Todos' | 'No leídos' | 'Landing Pages' | 'ERP / Stock' | 'Agendamiento'
  >('Todos');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // Portfolio Filter & CRUD Modal State
  const [portfolioSearch, setPortfolioSearch] = useState('');
  const [portfolioCategoryFilter, setPortfolioCategoryFilter] = useState<
    'Todos' | PortfolioCategory
  >('Todos');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [showPresetSelector, setShowPresetSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Project Modal Form Fields (matching Image 9)
  const [titleAndClientInput, setTitleAndClientInput] = useState('');
  const [systemCategorySelect, setSystemCategorySelect] = useState(
    'Sistemas de Gestión & Control de Stock'
  );
  const [liveUrlInput, setLiveUrlInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [impactValueInput, setImpactValueInput] = useState('');
  const [publishedInput, setPublishedInput] = useState(true);

  // Settings Modal / View State
  const [whatsappInput, setWhatsappInput] = useState(settings.whatsappNumber);
  const [emailInput, setEmailInput] = useState(settings.contactEmail);
  const [passwordInput, setPasswordInput] = useState(settings.adminPassword);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Computed KPI Metrics
  const unreadLeads = leads.filter((l) => l.status === 'NUEVO');
  const inProgressLeads = leads.filter((l) => l.status === 'EN SEGUIMIENTO');
  const latestUrgentLead = unreadLeads[0] || leads[0];

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesGlobal =
      !globalSearch.trim() ||
      lead.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      lead.company.toLowerCase().includes(globalSearch.toLowerCase()) ||
      lead.service.toLowerCase().includes(globalSearch.toLowerCase()) ||
      lead.email.toLowerCase().includes(globalSearch.toLowerCase());

    if (!matchesGlobal) return false;

    if (leadFilter === 'No leídos') return lead.status === 'NUEVO';
    if (leadFilter === 'Landing Pages') return lead.serviceCategory === 'Landing Pages';
    if (leadFilter === 'ERP / Stock') return lead.serviceCategory === 'ERP / Stock';
    if (leadFilter === 'Agendamiento') return lead.serviceCategory === 'Agendamiento';
    return true;
  });

  // Filtered Portfolio Projects
  const filteredProjects = projects.filter((proj) => {
    const query = (portfolioSearch || globalSearch).trim().toLowerCase();
    const matchesSearch =
      !query ||
      proj.title.toLowerCase().includes(query) ||
      proj.client.toLowerCase().includes(query) ||
      proj.description.toLowerCase().includes(query) ||
      proj.adminCategoryLabel.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (portfolioCategoryFilter === 'Todos') return true;
    return proj.category === portfolioCategoryFilter;
  });

  // Open Modal for Creating a New Project
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setTitleAndClientInput('');
    setSystemCategorySelect('Sistemas de Gestión & Control de Stock');
    setLiveUrlInput('https://');
    setImageUrlInput(PORTFOLIO_PRESET_IMAGES[0].url);
    setDescriptionInput('');
    setImpactValueInput('Optimización operativa del 40%');
    setPublishedInput(true);
    setShowPresetSelector(false);
    setIsProjectModalOpen(true);
  };

  // Open Modal for Editing an Existing Project (Pre-filled like Image 9)
  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setTitleAndClientInput(`${project.title} // ${project.client}`);
    if (project.category === 'Landing Pages') {
      setSystemCategorySelect('Landing Page Institucional');
    } else if (project.category === 'Agendamiento') {
      setSystemCategorySelect('Plataforma de Agendamiento');
    } else if (project.adminCategoryLabel.includes('Portal')) {
      setSystemCategorySelect('Portal B2B & Automatizaciones');
    } else {
      setSystemCategorySelect('Sistemas de Gestión & Control de Stock');
    }
    setLiveUrlInput(project.liveUrl);
    setImageUrlInput(project.imageUrl);
    setDescriptionInput(project.description);
    setImpactValueInput(project.impactValue);
    setPublishedInput(project.published);
    setShowPresetSelector(false);
    setIsProjectModalOpen(true);
  };

  // Map Modal Select value to internal PortfolioCategory & Labels
  const mapSystemSelectToCategory = (
    selectVal: string
  ): {
    category: PortfolioCategory;
    adminCategoryLabel: string;
    shortTag: string;
    industry: string;
  } => {
    if (selectVal.includes('Landing')) {
      return {
        category: 'Landing Pages',
        adminCategoryLabel: 'Landing Page B2B',
        shortTag: 'Landing Page',
        industry: 'CORPORATIVO & B2B',
      };
    }
    if (selectVal.includes('Agendamiento')) {
      return {
        category: 'Agendamiento',
        adminCategoryLabel: 'Plataforma de Agendamiento',
        shortTag: 'Reservas',
        industry: 'SALUD & SERVICIOS',
      };
    }
    if (selectVal.includes('Portal')) {
      return {
        category: 'Sistemas de Gestión',
        adminCategoryLabel: 'Portal B2B & Cotizador',
        shortTag: 'Catálogo B2B',
        industry: 'MAYORISTAS & DISTRIBUCIÓN',
      };
    }
    return {
      category: 'Sistemas de Gestión',
      adminCategoryLabel: 'Sistemas de Gestión & Stock',
      shortTag: 'Control Stock',
      industry: 'LOGÍSTICA & RETAIL',
    };
  };

  // Save Project (Create or Update)
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const rawParts = titleAndClientInput.split('//').map((s) => s.trim());
    const parsedTitle = rawParts[0] || 'Nuevo Sistema SysTex';
    const parsedClient = rawParts[1] || 'Cliente Corporativo';

    const mapped = mapSystemSelectToCategory(systemCategorySelect);
    const cleanUrl =
      liveUrlInput.trim() && liveUrlInput.trim() !== 'https://'
        ? liveUrlInput.trim()
        : `https://${parsedTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.systex.cloud`;

    if (editingProject) {
      onUpdateProject({
        ...editingProject,
        title: parsedTitle,
        landingTitle: parsedTitle,
        client: parsedClient,
        category: mapped.category,
        adminCategoryLabel: mapped.adminCategoryLabel,
        shortTag: editingProject.shortTag || mapped.shortTag,
        liveUrl: cleanUrl,
        imageUrl: imageUrlInput.trim() || editingProject.imageUrl,
        description:
          descriptionInput.trim() ||
          'Plataforma digital desarrollada a medida por SysTex Engineering.',
        impactValue: impactValueInput.trim() || editingProject.impactValue,
        published: publishedInput,
      });
    } else {
      onCreateProject({
        title: parsedTitle,
        landingTitle: parsedTitle,
        client: parsedClient,
        industry: mapped.industry,
        shortTag: mapped.shortTag,
        category: mapped.category,
        adminCategoryLabel: mapped.adminCategoryLabel,
        liveUrl: cleanUrl,
        imageUrl: imageUrlInput.trim() || PORTFOLIO_PRESET_IMAGES[0].url,
        description:
          descriptionInput.trim() ||
          'Plataforma digital desarrollada a medida por SysTex Engineering.',
        impactLabel: 'Impacto medido:',
        impactValue: impactValueInput.trim() || 'Optimización operativa del 40%',
        matrixCode: `${parsedTitle.slice(0, 12).toUpperCase()} // CLOUD`,
        matrixBadge: 'LIVE v1.0',
        previewStats: [
          { value: '99.9% Uptime', label: 'Cloud SLA' },
          { value: '+40% Eficiencia', label: 'Impacto Real' },
        ],
        published: publishedInput,
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Cloud SQL'],
      });
    }

    setIsProjectModalOpen(false);
  };

  // Handle File Upload for Thumbnail Image
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrlInput(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Build WhatsApp Response Link for a Specific Lead
  const getLeadWhatsAppUrl = (lead: Lead) => {
    const cleanPhone = lead.whatsapp.replace(/[^0-9]/g, '') || settings.whatsappNumber;
    const text = `Hola ${lead.name} (${lead.company}), te escribimos de SysTex (Elvio Vazquez y Jorge Nuñez) respecto a tu consulta sobre "${lead.service}". ¿Tienes unos minutos para conversar sobre tu requerimiento?`;
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
  };

  // Navigate Sidebar Sections
  const handleSidebarNav = (
    section: 'dashboard' | 'inbox-leads' | 'portfolio-management' | 'settings'
  ) => {
    setActiveNav(section);
    if (section === 'inbox-leads') {
      document.getElementById('admin-leads-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'portfolio-management') {
      document.getElementById('admin-portfolio-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      whatsappNumber: whatsappInput.replace(/[^0-9]/g, '') || '5491144552211',
      contactEmail: emailInput.trim() || 'contacto@systex.cloud',
      adminPassword: passwordInput.trim() || 'admin',
    });
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  return (
    <div className="bg-background font-body text-on-surface antialiased min-h-screen">
      {/* =========================================================
          FIXED LEFT SIDEBAR (Exact Match to Attached HTML)
         ========================================================= */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-low/95 backdrop-blur-xl z-40 hidden lg:flex flex-col justify-between py-space-lg px-space-md shadow-[0_12px_32px_-4px_rgba(0,0,0,0.5)] border-r border-white/5">
        <div className="flex flex-col gap-space-lg">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-space-sm">
            <div className="flex items-center gap-space-sm">
              <SysTexIsotipo size="sm" className="w-8 h-8" />
              <div className="flex flex-col">
                <span className="font-headline text-[22px] font-bold tracking-tight text-on-surface leading-none">
                  SysTex
                </span>
                <span className="font-label-text text-[11px] text-outline tracking-wider uppercase mt-1">
                  Engineering
                </span>
              </div>
            </div>
            <span className="font-label-text text-[11px] uppercase px-1.5 py-0.5 rounded-lg bg-surface-container-highest text-primary font-semibold tracking-wider">
              ADMIN PANEL
            </span>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-space-xs px-space-xs">
            <button
              type="button"
              onClick={() => handleSidebarNav('dashboard')}
              className={`flex items-center justify-between px-space-md py-space-sm transition-all rounded-xl cursor-pointer ${
                activeNav === 'dashboard'
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[22px]">dashboard</span>
                <span className="font-label-text text-sm">Dashboard</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSidebarNav('inbox-leads')}
              className={`flex items-center justify-between px-space-md py-space-sm transition-all rounded-xl cursor-pointer ${
                activeNav === 'inbox-leads'
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[22px]">inbox</span>
                <span className="font-label-text text-sm">Inbox / Leads</span>
              </div>
              {unreadLeads.length > 0 && (
                <span className="font-label-text text-[11px] font-semibold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container shadow-[0_0_8px_rgba(100,181,246,0.3)] tabular-nums">
                  {unreadLeads.length} New
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSidebarNav('portfolio-management')}
              className={`flex items-center justify-between px-space-md py-space-sm transition-all rounded-xl cursor-pointer ${
                activeNav === 'portfolio-management'
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[22px]">layers</span>
                <span className="font-label-text text-sm">Portfolio Management</span>
              </div>
              <span className="font-mono text-[11px] text-outline tabular-nums">
                {projects.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSidebarNav('settings')}
              className={`flex items-center justify-between px-space-md py-space-sm transition-all rounded-xl cursor-pointer ${
                activeNav === 'settings'
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[22px]">settings</span>
                <span className="font-label-text text-sm">Settings</span>
              </div>
            </button>

            <div className="my-2 border-t border-white/5" />

            {/* Switch back to Public Landing Page */}
            <button
              type="button"
              onClick={onSwitchToPublic}
              className="flex items-center justify-between px-space-md py-space-sm rounded-xl bg-surface-container/80 text-primary hover:bg-surface-container-high transition-all cursor-pointer border border-primary/20"
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[20px]">public</span>
                <span className="font-label-text text-sm font-semibold">Ver Web Pública</span>
              </div>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </button>
          </nav>
        </div>

        {/* Bottom Co-Founders Badge & Logout */}
        <div className="flex flex-col gap-space-sm px-space-xs">
          <div className="p-space-sm rounded-xl bg-surface-container/70 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-full bg-surface-variant flex items-center justify-center font-label-text text-xs text-primary font-bold">
                EV
              </div>
              <div className="flex flex-col">
                <span className="font-label-text text-xs text-on-surface font-semibold truncate max-w-[125px]">
                  Elvio Vazquez
                </span>
                <span className="font-label-text text-[11px] text-outline truncate max-w-[125px]">
                  &amp; Jorge Nuñez
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-surface-container-high transition-colors cursor-pointer"
              title="Cerrar Sesión"
            >
              <span className="material-symbols-outlined text-base">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================
          MAIN CONTENT WRAPPER (pl-72 on Desktop)
         ========================================================= */}
      <div className="lg:pl-72">
        {/* FIXED TOP HEADER */}
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface-container-lowest/85 backdrop-blur-xl z-30 px-4 lg:px-space-lg flex items-center justify-between border-b border-white/5">
          {/* Left: Mobile Brand + Search Input */}
          <div className="flex items-center gap-3 w-full max-w-md">
            <button
              type="button"
              onClick={onSwitchToPublic}
              className="lg:hidden px-2.5 py-1.5 rounded-lg bg-surface-container text-primary text-xs font-semibold flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Web</span>
            </button>

            <div className="relative w-full flex items-center">
              <span className="material-symbols-outlined absolute left-2.5 text-outline text-base pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Buscar leads, proyectos, contratos..."
                className="w-full bg-surface-container-low/90 text-on-surface placeholder:text-outline text-sm pl-9 pr-4 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary border border-white/5"
              />
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Firebase Cloud Sync Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#182330] border border-[#2B4055] text-[11px] text-[#86C4EE] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] shadow-[0_0_6px_#52B788]" />
              <span>Firebase Sync</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowTopAlert(true);
                handleSidebarNav('inbox-leads');
              }}
              className="relative p-1.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all flex items-center justify-center cursor-pointer"
              title={`${unreadLeads.length} Leads Nuevos sin leer`}
            >
              <span
                className={`material-symbols-outlined text-[22px] text-primary ${
                  unreadLeads.length > 0 ? 'animate-pulse' : ''
                }`}
              >
                notifications
              </span>
              {unreadLeads.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#97cdf4]" />
              )}
            </button>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-primary text-on-primary font-label-text text-xs font-semibold rounded-xl shadow-[0_0_20px_rgba(100,181,246,0.35)] hover:bg-primary-fixed-dim transition-all cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>+ Nuevo Proyecto</span>
            </button>

            <img
              alt="Elvio Vázquez"
              src="images/elvio.jpeg"
              className="w-8 h-8 rounded-full object-cover border border-primary/40 hidden sm:block bg-surface-container"
            />
          </div>
        </header>

        {/* =========================================================
            MAIN VIEWPORT
           ========================================================= */}
        <main className="w-full pt-16 bg-background min-h-screen">
          <div className="w-full max-w-[1320px] mx-auto px-4 lg:px-margin py-space-lg flex flex-col gap-space-xl">
            {/* SETTINGS VIEW (When Settings is active in Sidebar) */}
            {activeNav === 'settings' && (
              <section className="rounded-xl bg-surface-container-low/90 border border-white/5 p-space-lg shadow-xl flex flex-col gap-space-md">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <span className="font-label-text text-[11px] text-primary uppercase tracking-widest font-semibold">
                      SysTex Core // Configuración
                    </span>
                    <h2 className="font-headline text-2xl font-bold text-on-surface mt-0.5">
                      Parámetros de Agencia &amp; Base de Datos
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveNav('dashboard')}
                    className="px-3 py-1.5 rounded-lg bg-surface-container text-xs text-on-surface hover:bg-surface-container-high cursor-pointer"
                  >
                    Volver al Dashboard
                  </button>
                </div>

                {settingsSavedToast && (
                  <div className="p-3 rounded-xl bg-primary/15 border border-primary/40 text-xs text-primary font-semibold">
                    ✓ Configuración actualizada correctamente en tiempo real.
                  </div>
                )}

                <form
                  onSubmit={handleSaveSettings}
                  className="grid grid-cols-1 md:grid-cols-3 gap-space-md"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-text text-[11px] uppercase text-outline font-semibold">
                      WhatsApp Oficial (con código de país)
                    </label>
                    <input
                      type="text"
                      value={whatsappInput}
                      onChange={(e) => setWhatsappInput(e.target.value)}
                      className="bg-surface-container text-on-surface font-mono text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-text text-[11px] uppercase text-outline font-semibold">
                      Email Corporativo Receptor
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="bg-surface-container text-on-surface font-mono text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-text text-[11px] uppercase text-outline font-semibold">
                      Contraseña del Panel Admin
                    </label>
                    <input
                      type="text"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="bg-surface-container text-on-surface font-mono text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="md:col-span-3 flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onResetDemoData}
                      className="px-4 py-2 rounded-xl bg-surface-container text-outline hover:text-error text-xs font-label-text font-semibold transition-colors cursor-pointer"
                    >
                      Restaurar Datos de Prueba Iniciales
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-label-text font-semibold hover:bg-primary-fixed-dim transition-all cursor-pointer"
                    >
                      Guardar Configuración
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* TOP LIVE NOTIFICATION BANNER (Exact Match to Attached HTML) */}
            {showTopAlert && latestUrgentLead && (
              <div
                className="relative overflow-hidden rounded-xl bg-surface-container/90 backdrop-blur-xl p-space-md shadow-xl transition-all duration-300 border border-white/5"
                id="topAlertBanner"
              >
                <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container-high shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping absolute" />
                      <span className="w-2 h-2 rounded-full bg-primary relative" />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                      <span className="font-label-text text-xs font-semibold text-primary uppercase tracking-wider bg-surface-container-highest px-2 py-0.5 rounded-lg">
                        Lead Urgente
                      </span>
                      <p className="text-sm sm:text-base text-on-surface truncate">
                        ¡Nuevo formulario recibido de{' '}
                        <strong className="text-on-surface font-semibold">
                          {latestUrgentLead.company}
                        </strong>{' '}
                        - {latestUrgentLead.service}!
                      </p>
                      <span className="font-label-text text-[11px] text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>{' '}
                        {latestUrgentLead.dateLabel} ({latestUrgentLead.timeLabel})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-sm shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => setSelectedLead(latestUrgentLead)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-label-text text-xs font-semibold hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
                    >
                      <span>Ver Mensaje</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTopAlert(false)}
                      className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                      title="Descartar"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================
                SECTION 1: INCOMING FORM SUBMISSIONS (LEADS INBOX)
               ========================================================= */}
            <section id="admin-leads-section" className="flex flex-col gap-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center gap-2">
                    <SysTexMonogram className="w-6 h-6" />
                    <span className="font-label-text text-[11px] text-primary uppercase tracking-widest font-semibold">
                      SysTex Stream Engine // Inbox
                    </span>
                  </div>
                  <h2 className="font-headline text-[28px] font-bold text-on-surface tracking-tight">
                    Formularios de Contacto &amp; Solicitudes
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-outline font-label-text text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-secondary-container" />
                  <span>Sincronización webhook en tiempo real activa</span>
                </div>
              </div>

              {/* KPI Overview Bar (3 Cards matching Attached HTML) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {/* KPI 1 */}
                <div className="relative overflow-hidden rounded-xl bg-surface-container-low/90 backdrop-blur-xl p-space-lg shadow-md flex flex-col justify-between group hover:bg-surface-container transition-all border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="font-label-text text-xs text-outline uppercase tracking-wider">
                      Total Mensajes (Mes)
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-base">stacked_inbox</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-space-sm mt-space-md">
                    <span className="font-headline text-4xl lg:text-5xl font-bold text-on-surface leading-none tabular-nums">
                      {23 + leads.length}
                    </span>
                    <span className="inline-flex items-center gap-0.5 font-label-text text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-xs">trending_up</span> +12%
                    </span>
                  </div>
                  <div className="mt-space-md flex items-center justify-between font-label-text text-[11px] text-outline">
                    <span>Vs. período anterior (25)</span>
                    <svg className="w-20 h-5 text-primary opacity-80" fill="none" viewBox="0 0 100 24">
                      <path
                        d="M0 20 L20 18 L40 14 L60 16 L80 8 L100 4"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                {/* KPI 2 */}
                <div className="relative overflow-hidden rounded-xl bg-surface-container-low/90 backdrop-blur-xl p-space-lg shadow-md flex flex-col justify-between group hover:bg-surface-container transition-all border border-white/5">
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/15 blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between relative">
                    <span className="font-label-text text-xs text-primary font-semibold uppercase tracking-wider">
                      Nuevos Hoy
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shadow-[0_0_12px_rgba(100,181,246,0.3)]">
                      <span className="material-symbols-outlined text-base">mark_email_unread</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-space-sm mt-space-md relative">
                    <span className="font-headline text-4xl lg:text-5xl font-bold text-primary leading-none tabular-nums">
                      {unreadLeads.length}
                    </span>
                    <span className="inline-flex items-center gap-1 font-label-text text-[11px] font-semibold text-primary bg-surface-container-highest px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" /> Acción
                      requerida
                    </span>
                  </div>
                  <div className="mt-space-md flex items-center justify-between font-label-text text-[11px] text-on-surface-variant relative">
                    <span>Alerta activa de respuesta inmediata</span>
                    <span className="font-mono text-outline">&lt;15m SLA</span>
                  </div>
                </div>

                {/* KPI 3 */}
                <div className="relative overflow-hidden rounded-xl bg-surface-container-low/90 backdrop-blur-xl p-space-lg shadow-md flex flex-col justify-between group hover:bg-surface-container transition-all border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="font-label-text text-xs text-outline uppercase tracking-wider">
                      En Seguimiento
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary">
                      <span className="material-symbols-outlined text-base">conversion_path</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-space-sm mt-space-md">
                    <span className="font-headline text-4xl lg:text-5xl font-bold text-on-surface leading-none tabular-nums">
                      {7 + inProgressLeads.length}
                    </span>
                    <span className="inline-flex items-center gap-1 font-label-text text-[11px] font-semibold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-xs">forum</span> 2 agendados
                    </span>
                  </div>
                  <div className="mt-space-md flex items-center justify-between font-label-text text-[11px] text-outline">
                    <span>2 citas agendadas por WhatsApp</span>
                    <span className="text-tertiary font-semibold">28.5% Conv.</span>
                  </div>
                </div>
              </div>

              {/* Leads Management Table Card */}
              <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-xl overflow-hidden shadow-xl flex flex-col border border-white/5">
                {/* Table Filters Header */}
                <div className="p-space-md lg:p-space-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container/40">
                  <div className="flex items-center gap-2 flex-wrap">
                    {(
                      [
                        { label: `Todos (${leads.length})`, value: 'Todos' },
                        { label: `No leídos (${unreadLeads.length})`, value: 'No leídos' },
                        { label: 'Landing Pages', value: 'Landing Pages' },
                        { label: 'ERP / Stock', value: 'ERP / Stock' },
                        { label: 'Agendamiento', value: 'Agendamiento' },
                      ] as const
                    ).map((tab) => {
                      const active = leadFilter === tab.value;
                      return (
                        <button
                          key={tab.value}
                          type="button"
                          onClick={() => setLeadFilter(tab.value)}
                          className={`px-3 py-1.5 rounded-lg font-label-text text-xs transition-all cursor-pointer ${
                            active
                              ? 'bg-primary-container text-on-primary-container font-semibold'
                              : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-space-sm text-outline font-label-text text-[11px]">
                    <span className="material-symbols-outlined text-base">tune</span>
                    <span>Mostrando últimos envíos priorizados</span>
                  </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-container-high/60 font-label-text text-[11px] uppercase tracking-wider text-outline">
                      <tr>
                        <th className="py-3 px-space-md">Estado</th>
                        <th className="py-3 px-space-md">Cliente &amp; Empresa</th>
                        <th className="py-3 px-space-md">Contacto</th>
                        <th className="py-3 px-space-md">Servicio Requerido</th>
                        <th className="py-3 px-space-md">Fecha &amp; Hora</th>
                        <th className="py-3 px-space-md text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-on-surface">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-outline text-sm">
                            No se encontraron solicitudes para el filtro seleccionado.
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => (
                          <tr
                            key={lead.id}
                            className="hover:bg-surface-container/60 transition-colors"
                          >
                            {/* Estado */}
                            <td className="py-4 px-space-md whitespace-nowrap">
                              {lead.status === 'NUEVO' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-text text-[11px] font-semibold bg-primary/10 text-primary">
                                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />{' '}
                                  NUEVO
                                </span>
                              )}
                              {lead.status === 'EN SEGUIMIENTO' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-text text-[11px] font-semibold bg-tertiary-container/30 text-tertiary">
                                  <span className="w-2 h-2 rounded-full bg-tertiary" /> EN
                                  SEGUIMIENTO
                                </span>
                              )}
                              {lead.status === 'ATENDIDO' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-text text-[11px] font-semibold bg-surface-container-highest text-outline">
                                  <span className="w-2 h-2 rounded-full bg-outline" /> ATENDIDO
                                </span>
                              )}
                            </td>

                            {/* Cliente & Empresa */}
                            <td className="py-4 px-space-md">
                              <div className="flex flex-col">
                                <span className="font-label-text text-sm font-semibold text-on-surface">
                                  {lead.company}
                                </span>
                                <span className="text-xs text-outline">{lead.name}</span>
                              </div>
                            </td>

                            {/* Contacto */}
                            <td className="py-4 px-space-md whitespace-nowrap">
                              <div className="flex flex-col gap-1">
                                <span className="text-on-surface-variant font-mono text-xs">
                                  {lead.email}
                                </span>
                                <a
                                  href={getLeadWhatsAppUrl(lead)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-mono"
                                >
                                  <span className="material-symbols-outlined text-sm text-primary">
                                    chat
                                  </span>{' '}
                                  {lead.whatsapp}
                                </a>
                              </div>
                            </td>

                            {/* Servicio Requerido */}
                            <td className="py-4 px-space-md whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-highest font-label-text text-[11px] ${
                                  lead.status === 'ATENDIDO' ? 'text-outline' : 'text-primary'
                                }`}
                              >
                                <span className="material-symbols-outlined text-sm">
                                  {lead.serviceIcon || 'layers'}
                                </span>
                                <span>{lead.service}</span>
                              </span>
                            </td>

                            {/* Fecha & Hora */}
                            <td className="py-4 px-space-md whitespace-nowrap font-mono text-xs text-outline">
                              {lead.dateLabel === 'Hoy' ? (
                                <>
                                  <span className="text-on-surface font-semibold">Hoy</span>,{' '}
                                  {lead.timeLabel}
                                </>
                              ) : (
                                <>
                                  {lead.dateLabel}
                                  {lead.timeLabel ? `, ${lead.timeLabel}` : ''}
                                </>
                              )}
                            </td>

                            {/* Acciones */}
                            <td className="py-4 px-space-md whitespace-nowrap text-right">
                              <div className="inline-flex items-center gap-1.5">
                                {/* Ver Detalle / Mensaje */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedLead(lead)}
                                  className="p-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-xs cursor-pointer"
                                  title="Ver Mensaje Completo"
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    visibility
                                  </span>
                                </button>

                                {/* Responder por WhatsApp */}
                                <a
                                  href={getLeadWhatsAppUrl(lead)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high transition-colors text-xs"
                                  title="Responder por WhatsApp"
                                >
                                  <span className="material-symbols-outlined text-sm">chat</span>
                                </a>

                                {/* Marcar como Atendido / Cambiar Estado */}
                                {lead.status !== 'ATENDIDO' ? (
                                  <button
                                    type="button"
                                    onClick={() => onUpdateLeadStatus(lead.id, 'ATENDIDO')}
                                    className="px-2.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-fixed-dim transition-colors text-xs font-label-text font-semibold cursor-pointer"
                                    title="Marcar como Atendido"
                                  >
                                    Atendido
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => onUpdateLeadStatus(lead.id, 'NUEVO')}
                                    className="px-2.5 py-1.5 rounded-lg bg-surface-container-high text-outline hover:text-on-surface text-xs font-label-text transition-colors cursor-pointer"
                                    title="Reabrir como Nuevo"
                                  >
                                    Completado
                                  </button>
                                )}

                                {/* Eliminar Lead */}
                                <button
                                  type="button"
                                  onClick={() => setLeadToDelete(lead)}
                                  className="p-1.5 rounded-lg bg-surface-container text-outline hover:text-error hover:bg-surface-container-high transition-colors cursor-pointer"
                                  title="Eliminar Consulta"
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* =========================================================
                SECTION 2: PORTFOLIO REPOSITORY MANAGEMENT (CRUD COMPLETO)
               ========================================================= */}
            <section id="admin-portfolio-section" className="flex flex-col gap-space-lg">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">layers</span>
                    <span className="font-label-text text-[11px] text-primary uppercase tracking-widest font-semibold">
                      Repositorio Cloud // Casos de Éxito
                    </span>
                  </div>
                  <h2 className="font-headline text-[28px] font-bold text-on-surface tracking-tight">
                    Gestión de Portafolio &amp; Despliegues
                  </h2>
                </div>

                <div className="flex items-center gap-space-sm flex-wrap">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-base">
                      search
                    </span>
                    <input
                      type="text"
                      value={portfolioSearch}
                      onChange={(e) => setPortfolioSearch(e.target.value)}
                      placeholder="Buscar proyecto..."
                      className="bg-surface-container text-on-surface placeholder:text-outline text-sm pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-52 border border-white/5"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center gap-1.5 px-space-md py-2 bg-primary text-on-primary font-label-text text-xs font-semibold rounded-xl hover:bg-primary-fixed-dim transition-all shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">add_box</span>
                    <span>+ Agregar Trabajo</span>
                  </button>
                </div>
              </div>

              {/* Categories Navigation (Exact Match to Image 9) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(
                  [
                    { label: `Todos (${projects.length})`, value: 'Todos' },
                    { label: 'Landing Pages', value: 'Landing Pages' },
                    { label: 'Sistemas de Gestión', value: 'Sistemas de Gestión' },
                    { label: 'Agendamiento', value: 'Agendamiento' },
                  ] as const
                ).map((cat) => {
                  const active = portfolioCategoryFilter === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setPortfolioCategoryFilter(cat.value)}
                      className={`px-4 py-2 rounded-xl font-label-text text-xs whitespace-nowrap transition-colors cursor-pointer ${
                        active
                          ? 'bg-primary-container text-on-primary-container font-semibold'
                          : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Project Cards Grid (Exact Match to Image 9) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`rounded-xl bg-surface-container-low/90 backdrop-blur-xl overflow-hidden shadow-lg flex flex-col group hover:bg-surface-container transition-all border border-white/5 ${
                      !project.published ? 'opacity-85' : ''
                    }`}
                  >
                    {/* Top Preview Area */}
                    <div className="relative h-48 bg-surface-container-high overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent z-10" />
                      {project.imageUrl || project.image ? (
                        <img
                          src={project.imageUrl || project.image}
                          alt={project.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-65"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-container flex items-center justify-center opacity-40">
                          <span className="material-symbols-outlined text-6xl text-outline">
                            build_circle
                          </span>
                        </div>
                      )}

                      {/* Top-Left Category Badge */}
                      <div className="absolute top-3 left-3 z-20">
                        <span
                          className={`font-label-text text-[11px] px-2.5 py-1 rounded-lg bg-surface-container-highest/90 font-semibold backdrop-blur-md ${
                            project.published ? 'text-primary' : 'text-outline'
                          }`}
                        >
                          {project.adminCategoryLabel || project.category}
                        </span>
                      </div>

                      {/* Top-Right Interactive Visibility Switch Badge */}
                      <button
                        type="button"
                        onClick={() => onToggleProjectVisibility(project.id)}
                        className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-surface-container-lowest/85 hover:bg-surface-container-lowest backdrop-blur-md px-2.5 py-1 rounded-full cursor-pointer border border-white/10 transition-all"
                        title="Haz clic para cambiar entre Publicado y Oculto/Borrador en la Landing Page"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            project.published ? 'bg-primary' : 'bg-outline'
                          }`}
                        />
                        <span
                          className={`font-label-text text-[11px] font-semibold ${
                            project.published ? 'text-on-surface' : 'text-outline'
                          }`}
                        >
                          {project.published ? 'Publicado' : 'Oculto / Borrador'}
                        </span>
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="p-space-lg flex flex-col gap-space-md flex-1 justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-headline text-[22px] font-bold text-on-surface">
                            {project.title}
                          </h3>
                          <span className="font-label-text text-[11px] text-outline shrink-0">
                            {project.client}
                          </span>
                        </div>
                        <p className="text-sm text-on-surface-variant line-clamp-2">
                          {project.description}
                        </p>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 font-mono text-xs hover:underline mt-1 truncate ${
                            project.published ? 'text-primary' : 'text-outline'
                          }`}
                        >
                          <span className="material-symbols-outlined text-xs">link</span>{' '}
                          {project.liveUrl}
                        </a>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between pt-space-sm border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(project)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-label-text font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                              project.published
                                ? 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary'
                                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm">edit</span> Editar
                          </button>

                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-label-text transition-colors flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">open_in_new</span>{' '}
                            {project.published ? 'En Vivo' : 'Preview'}
                          </a>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onToggleProjectVisibility(project.id)}
                            className="p-2 rounded-lg text-outline hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                            title={
                              project.published
                                ? 'Ocultar de la Landing Pública'
                                : 'Publicar en la Landing Pública'
                            }
                          >
                            <span className="material-symbols-outlined text-base">
                              {project.published ? 'visibility' : 'visibility_off'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setProjectToDelete(project)}
                            className="p-2 rounded-lg text-outline hover:text-error hover:bg-surface-container-high transition-colors cursor-pointer"
                            title="Eliminar del Portafolio"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* =========================================================
          MODAL 1: CREATE / EDIT PROJECT (Exact Match to Image 9)
         ========================================================= */}
      {isProjectModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          id="editProjectModal"
        >
          <form
            onSubmit={handleSaveProject}
            className="relative w-full max-w-2xl rounded-xl bg-surface-container-low/95 backdrop-blur-2xl p-6 lg:p-8 shadow-2xl border border-white/10 flex flex-col gap-6 max-h-[92vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-3">
                <SysTexMonogram className="w-8 h-8" />
                <div className="flex flex-col">
                  <h3 className="font-headline text-xl font-bold text-on-surface">
                    {editingProject
                      ? 'Editar Proyecto // Repositorio SysTex'
                      : 'Nuevo Proyecto // Repositorio SysTex'}
                  </h3>
                  <span className="font-mono text-[11px] text-primary uppercase tracking-wider">
                    Deploy ID: {editingProject ? editingProject.deployId : '#STX-PRJ-NEW'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Modal Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field: Nombre del Proyecto & Cliente */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-label-text text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">
                  Nombre del Proyecto &amp; Cliente
                </label>
                <input
                  type="text"
                  required
                  value={titleAndClientInput}
                  onChange={(e) => setTitleAndClientInput(e.target.value)}
                  placeholder="Ej: BarberFlow // BarberFlow Studio"
                  className="bg-surface-container text-on-surface text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-full border border-white/5"
                />
              </div>

              {/* Field: Categoría del Sistema */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-text text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">
                  Categoría del Sistema
                </label>
                <div className="relative">
                  <select
                    value={systemCategorySelect}
                    onChange={(e) => setSystemCategorySelect(e.target.value)}
                    className="bg-surface-container text-on-surface text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-full appearance-none pr-8 border border-white/5"
                  >
                    <option value="Sistemas de Gestión & Control de Stock">
                      Sistemas de Gestión &amp; Control de Stock
                    </option>
                    <option value="Landing Page Institucional">Landing Page Institucional</option>
                    <option value="Plataforma de Agendamiento">Plataforma de Agendamiento</option>
                    <option value="Portal B2B & Automatizaciones">
                      Portal B2B &amp; Automatizaciones
                    </option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-outline pointer-events-none text-base">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Field: URL Sitio Web / Enlace en Vivo */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-text text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">
                  URL Sitio Web / Enlace en Vivo
                </label>
                <input
                  type="url"
                  required
                  value={liveUrlInput}
                  onChange={(e) => setLiveUrlInput(e.target.value)}
                  placeholder="https://proyecto.systex.cloud"
                  className="bg-surface-container text-on-surface font-mono text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-full border border-white/5"
                />
              </div>

              {/* Field: URL de Miniatura / Imagen Preview */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-label-text text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">
                  URL de Miniatura / Imagen Preview
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="systex-assets/portfolio/preview.png o URL..."
                    className="bg-surface-container text-on-surface font-mono text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-full border border-white/5"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors shrink-0 flex items-center gap-1.5 font-label-text text-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">cloud_upload</span> Cargar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPresetSelector((prev) => !prev)}
                    className="px-3 py-2.5 rounded-xl bg-surface-container text-primary hover:bg-surface-container-high transition-colors shrink-0 text-xs font-label-text cursor-pointer"
                    title="Elegir de la galería de capturas SysTex"
                  >
                    Galería
                  </button>
                </div>

                {showPresetSelector && (
                  <div className="mt-1.5 grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 rounded-xl bg-surface-container">
                    {PORTFOLIO_PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setImageUrlInput(preset.url);
                          setShowPresetSelector(false);
                        }}
                        className="group relative rounded-lg overflow-hidden border border-white/10 hover:border-primary text-left cursor-pointer"
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-14 object-cover"
                        />
                        <span className="block text-[10px] p-1 truncate bg-surface-container-lowest text-on-surface">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Field: Resultado / Impacto Medido */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-label-text text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">
                  Resultado / Métrica de Impacto (Landing Page)
                </label>
                <input
                  type="text"
                  value={impactValueInput}
                  onChange={(e) => setImpactValueInput(e.target.value)}
                  placeholder="Ej: Reducción de 45% en pérdidas de stock"
                  className="bg-surface-container text-on-surface text-sm px-3.5 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-full border border-white/5"
                />
              </div>

              {/* Field: Descripción Corta */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-label-text text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">
                  Descripción Corta para Landing
                </label>
                <textarea
                  rows={3}
                  required
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  placeholder="Describe las funcionalidades clave e impacto del sistema..."
                  className="bg-surface-container text-on-surface text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-full border border-white/5"
                />
              </div>

              {/* Switch: Habilitar Visibilidad Pública (Exact Match to Image 9) */}
              <div className="flex items-center justify-between md:col-span-2 p-3.5 rounded-xl bg-surface-container/60 border border-white/5">
                <div className="flex flex-col">
                  <span className="font-label-text text-xs text-on-surface font-semibold">
                    Habilitar visibilidad pública
                  </span>
                  <span className="text-xs text-outline">
                    Mostrar activamente en el catálogo de la Landing Page principal
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={publishedInput}
                    onChange={(e) => setPublishedInput(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-primary after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface font-label-text text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-text text-xs font-semibold hover:bg-primary-fixed-dim transition-all shadow-md cursor-pointer"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================
          MODAL 2: LEAD MESSAGE DETAIL & WHATSAPP RESPONSE
         ========================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-xl bg-surface-container-low/95 p-6 shadow-2xl border border-white/10 flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                  Consulta de Cliente // {selectedLead.dateLabel} ({selectedLead.timeLabel})
                </span>
                <h3 className="font-headline text-xl font-bold text-on-surface mt-0.5">
                  {selectedLead.company} — {selectedLead.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-1 rounded-lg text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-container">
                <span className="text-outline block mb-0.5">WhatsApp</span>
                <span className="font-mono text-primary font-semibold">
                  {selectedLead.whatsapp}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container">
                <span className="text-outline block mb-0.5">Email Corporativo</span>
                <span className="font-mono text-on-surface">{selectedLead.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container sm:col-span-2">
                <span className="text-outline block mb-0.5">Servicio de Interés</span>
                <span className="font-semibold text-primary">{selectedLead.service}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container/70 border border-white/5">
              <span className="font-label-text text-[11px] uppercase tracking-wider text-outline block mb-1.5">
                Mensaje del Cliente:
              </span>
              <p className="text-sm text-on-surface leading-relaxed">{selectedLead.message}</p>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
              <div className="flex items-center gap-1.5">
                {(['NUEVO', 'EN SEGUIMIENTO', 'ATENDIDO'] as LeadStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      onUpdateLeadStatus(selectedLead.id, st);
                      setSelectedLead({ ...selectedLead, status: st });
                    }}
                    className={`px-2.5 py-1 rounded-lg font-label-text text-[11px] font-semibold transition-colors cursor-pointer ${
                      selectedLead.status === st
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-outline hover:text-on-surface'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <a
                href={getLeadWhatsAppUrl(selectedLead)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onUpdateLeadStatus(selectedLead.id, 'EN SEGUIMIENTO')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-label-text text-xs font-semibold hover:bg-primary-fixed-dim transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>Responder por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: SECURITY CONFIRMATION FOR PROJECT DELETION
         ========================================================= */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-xl bg-surface-container-low p-6 shadow-2xl border border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-error-container/40 text-error flex items-center justify-center">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <div>
                <h3 className="font-headline text-lg font-bold text-on-surface">
                  Confirmar Eliminación
                </h3>
                <p className="text-xs text-outline">Deploy ID: {projectToDelete.deployId}</p>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant">
              ¿Estás seguro de que deseas eliminar permanentemente el proyecto{' '}
              <strong className="text-on-surface">{projectToDelete.title}</strong> ({projectToDelete.client}) de la base de datos de SysTex?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface text-xs font-label-text cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteProject(projectToDelete.id);
                  setProjectToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-error text-on-error font-label-text text-xs font-semibold hover:brightness-110 transition-all cursor-pointer"
              >
                Sí, Eliminar Proyecto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 4: SECURITY CONFIRMATION FOR LEAD DELETION
         ========================================================= */}
      {leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-xl bg-surface-container-low p-6 shadow-2xl border border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-error-container/40 text-error flex items-center justify-center">
                <span className="material-symbols-outlined">delete_forever</span>
              </div>
              <div>
                <h3 className="font-headline text-lg font-bold text-on-surface">
                  Eliminar Consulta de Cliente
                </h3>
                <p className="text-xs text-outline">{leadToDelete.company}</p>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant">
              ¿Confirmas eliminar la solicitud de{' '}
              <strong className="text-on-surface">{leadToDelete.name}</strong> de la bandeja de
              entrada?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setLeadToDelete(null)}
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface text-xs font-label-text cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteLead(leadToDelete.id);
                  setLeadToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-error text-on-error font-label-text text-xs font-semibold hover:brightness-110 transition-all cursor-pointer"
              >
                Eliminar Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
