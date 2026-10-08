import logicoreImg from '../assets/images/portfolio_logicore_erp_1790912187135.jpg';
import auraClinicImg from '../assets/images/portfolio_aura_clinic_1790912198150.jpg';
import nexusFintechImg from '../assets/images/portfolio_nexus_fintech_1790912207795.jpg';
import autopartsImg from '../assets/images/portfolio_autoparts_b2b_1790912217993.jpg';
import alzzaImg from '../assets/images/alzza.png';
import soverImg from '../assets/images/sover.png';

export type PortfolioCategory =
  | 'Sistemas de Gestión'
  | 'Agendamiento'
  | 'Landing Pages';

export type LeadStatus = 'NUEVO' | 'EN SEGUIMIENTO' | 'ATENDIDO';

export interface ProjectPreviewStat {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  deployId: string;
  title: string;
  landingTitle: string;
  client: string;
  industry: string;
  shortTag: string;
  category: PortfolioCategory;
  adminCategoryLabel: string;
  liveUrl: string;
  imageUrl: string;
  // Aliases for direct source code / API compatibility
  image?: string;
  link?: string;
  metrics?: string;
  description: string;
  impactLabel: string;
  impactValue: string;
  matrixCode: string;
  matrixBadge: string;
  previewStats: ProjectPreviewStat[];
  published: boolean;
  technologies: string[];
}

export interface Lead {
  id: string;
  status: LeadStatus;
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  service: string;
  serviceCategory: 'Landing Pages' | 'ERP / Stock' | 'Agendamiento' | 'Software a Medida';
  serviceIcon: string;
  message: string;
  dateLabel: string;
  timeLabel: string;
  createdAt: number;
}

export interface AgencySettings {
  whatsappNumber: string;
  contactEmail: string;
  adminPassword: string;
  webhookActive: boolean;
  slaMinutes: number;
  elvioPhotoUrl?: string;
  jorgePhotoUrl?: string;
}

// Static local paths for immutable founder profile images (never modified by AI)
export const FOUNDER_ASSETS = {
  elvio: 'images/elvio.jpeg',
  jorge: 'images/jorge.jpeg',
};

export const PORTFOLIO_PRESET_IMAGES = [
  { label: 'Barbería & Agendamiento (Sovereign Craft)', url: soverImg },
  { label: 'Gastronomía & Rooftop (Alzza)', url: alzzaImg },
  { label: 'ERP & Control de Stock (LogiCore)', url: logicoreImg },
  { label: 'Clínica & Agendamiento (Aura)', url: auraClinicImg },
  { label: 'FinTech & Landing B2B (Nexus)', url: nexusFintechImg },
  { label: 'Portal Mayorista B2B (AutoParts)', url: autopartsImg },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-1',
    deployId: '#STX-PRJ-8821',
    title: 'LogiCore ERP',
    landingTitle: 'LogiCore ERP',
    client: 'LogiCore S.A.',
    industry: 'LOGÍSTICA & RETAIL',
    shortTag: 'Control Stock',
    category: 'Sistemas de Gestión',
    adminCategoryLabel: 'Sistemas de Gestión & Stock',
    liveUrl: 'https://logicore-portal.systex.cloud',
    link: 'https://logicore-portal.systex.cloud',
    imageUrl: logicoreImg,
    image: 'images/proyecto1.jpeg',
    description:
      'Gestión de inventario masivo con multi-depósito, trazabilidad con lectores de código de barra y despacho optimizado.',
    impactLabel: 'Impacto medido:',
    impactValue: 'Reducción de 45% en pérdidas de stock',
    metrics: 'Reducción de 45% en pérdidas de stock (-45% errores | 52,400+ SKUs)',
    matrixCode: 'LOGICORE // SKU MATRIX',
    matrixBadge: 'LIVE v4.2',
    previewStats: [
      { value: '52,400+', label: 'SKUS' },
      { value: '-45%', label: 'ERRORES' },
      { value: '4 Sedes', label: 'SYNC' },
    ],
    published: true,
    technologies: ['Next.js', 'PostgreSQL', 'Redis', 'Barcode API'],
  },
  {
    id: 'prj-2',
    deployId: '#STX-PRJ-8845',
    title: 'Sovereign Craft - Barbershop',
    landingTitle: 'Sovereign Craft - Studio & Barbershop',
    client: 'Sovereign Craft',
    industry: 'BARBERÍA & CUIDADO PERSONAL',
    shortTag: 'Agendamiento',
    category: 'Agendamiento',
    adminCategoryLabel: 'Plataforma de Agendamiento de Turnos',
    liveUrl: 'https://barberia-sovereign.vercel.app/',
    link: 'https://barberia-sovereign.vercel.app/',
    imageUrl: soverImg,
    image: 'images/sover.png',
    description:
      'Cortes de precisión y afeitado tradicional. Reserva tu turno de 1 hora con confirmación inmediata y recordatorios automáticos.',
    impactLabel: 'Asistencia:',
    impactValue: '0 turnos perdidos por inasistencia',
    metrics: '0 turnos perdidos por inasistencia (Turnos 1h • Confirmación Inmediata)',
    matrixCode: 'SOVEREIGN // BOOKING',
    matrixBadge: 'LIVE BOOKING',
    previewStats: [
      { value: 'Turnos de 1h', label: 'Reserva Previa' },
      { value: 'Confirmación', label: 'Inmediata' },
    ],
    published: true,
    technologies: ['React', 'Node.js', 'Booking Engine', 'WhatsApp API'],
  },
  {
    id: 'prj-3',
    deployId: '#STX-PRJ-8902',
    title: 'Alzza - Gastronomía & Rooftop',
    landingTitle: 'Alzza - Gastronomía & Coctelería de Altura',
    client: 'Alzza Rooftop & Lounge',
    industry: 'GASTRONOMÍA & COCTELERÍA',
    shortTag: 'Landing & Reservas',
    category: 'Landing Pages',
    adminCategoryLabel: 'Landing Page & Experiencia Gastronómica',
    liveUrl: 'https://alzza-py.vercel.app/',
    link: 'https://alzza-py.vercel.app/',
    imageUrl: alzzaImg,
    image: 'images/alzza.png',
    description:
      'Sabores de autor y el mejor after a la altura en la noche encarnacena. Una experiencia sensorial donde la alta cocina se encuentra con la coctelería contemporánea y el horizonte de la ciudad.',
    impactLabel: 'Reservas WhatsApp:',
    impactValue: '+180% en reservas online',
    metrics: '+180% en reservas coordinadas vía WhatsApp (Shopping Encarnación • Planta Alta)',
    matrixCode: 'ALZZA // ROOFTOP & BAR',
    matrixBadge: 'SIGNATURE 2026',
    previewStats: [
      { value: 'Reservas WhatsApp', label: 'Shopping Encarnación' },
      { value: 'Carta Digital', label: 'Coctelería de Autor' },
    ],
    published: true,
    technologies: ['React', 'Tailwind CSS', 'WhatsApp Cloud API', 'Menu Interactivo'],
  },
  {
    id: 'prj-4',
    deployId: '#STX-PRJ-8930',
    title: 'AutoParts Express Portal',
    landingTitle: 'AutoParts Express - Pedidos B2B',
    client: 'AutoParts Repuestos',
    industry: 'AUTOMOTRIZ & MAYORISTAS',
    shortTag: 'Catálogo B2B',
    category: 'Sistemas de Gestión',
    adminCategoryLabel: 'Portal B2B & Cotizador',
    liveUrl: 'https://autoparts-pedidos.systex.cloud',
    link: 'https://autoparts-pedidos.systex.cloud',
    imageUrl: autopartsImg,
    image: 'images/proyecto4.jpeg',
    description:
      'Portal exclusivo para distribuidores mayoristas con listas de precios segmentadas y cotización automática de fletes en tiempo real.',
    impactLabel: 'Ahorro operativo:',
    impactValue: '6 horas/día en atención telefónica',
    metrics: '6 horas/día en atención telefónica (+120 distribuidores activos)',
    matrixCode: 'AUTOPARTS // B2B PORTAL',
    matrixBadge: 'COTIZADOR AUTO',
    previewStats: [
      { value: '+120 Mayoristas', label: 'Activos' },
      { value: '$180k GMV/mes', label: 'Volumen' },
    ],
    published: true,
    technologies: ['TypeScript', 'ERP Sync', 'REST API', 'Cloud SQL'],
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    status: 'NUEVO',
    name: 'Carlos Gómez',
    company: 'Barbería Elite',
    email: 'info@barberiaelite.com',
    whatsapp: '+54 9 11 4455-2211',
    service: 'Plataforma de Agendamiento & Reservas',
    serviceCategory: 'Agendamiento',
    serviceIcon: 'calendar_month',
    message:
      'Hola equipo de SysTex, tenemos 3 sucursales de Barbería Elite con 14 barberos en total. Queremos implementar un sistema de reservas online con recordatorios automáticos por WhatsApp y cobro de seña para eliminar las inasistencias.',
    dateLabel: 'Hoy',
    timeLabel: '10:42 AM',
    createdAt: Date.now() - 4 * 60 * 1000,
  },
  {
    id: 'lead-2',
    status: 'NUEVO',
    name: 'Lucía Benítez',
    company: 'Distribuidora San Martín',
    email: 'gerencia@distrisanmartin.com',
    whatsapp: '+54 9 11 8899-3322',
    service: 'Sistema de Gestión & Control de Stock',
    serviceCategory: 'ERP / Stock',
    serviceIcon: 'inventory_2',
    message:
      'Necesitamos migrar nuestras planillas de Excel a un sistema de stock centralizado que conecte nuestro depósito central con los 2 puntos de venta mayorista, con alertas de stock mínimo y facturación electrónica.',
    dateLabel: 'Hoy',
    timeLabel: '09:15 AM',
    createdAt: Date.now() - 90 * 60 * 1000,
  },
  {
    id: 'lead-3',
    status: 'NUEVO',
    name: 'Dr. Mariano Silva',
    company: 'Nexus Legal Partners',
    email: 'contacto@nexuslegal.ar',
    whatsapp: '+54 9 11 7711-5544',
    service: 'Landing Page Alta Conversión',
    serviceCategory: 'Landing Pages',
    serviceIcon: 'web',
    message:
      'Buscamos renovar por completo la presencia digital de nuestro estudio jurídico corporativo con una Landing Page de alta conversión orientada a empresas B2B y calificación automática de consultas.',
    dateLabel: 'Hoy',
    timeLabel: '08:30 AM',
    createdAt: Date.now() - 135 * 60 * 1000,
  },
  {
    id: 'lead-4',
    status: 'EN SEGUIMIENTO',
    name: 'Dra. Camila Morales',
    company: 'Aura Clinic Estética',
    email: 'administracion@auraclinic.com',
    whatsapp: '+54 9 11 3322-1100',
    service: 'Agendamiento & Bot WhatsApp',
    serviceCategory: 'Agendamiento',
    serviceIcon: 'smart_toy',
    message:
      'Queremos sumar un módulo de confirmación automática con inteligencia conversacional en WhatsApp para nuestras pacientes de tratamientos estéticos y sincronizarlo con las agendas de cada consultorio.',
    dateLabel: 'Ayer',
    timeLabel: '18:20 PM',
    createdAt: Date.now() - 20 * 3600 * 1000,
  },
  {
    id: 'lead-5',
    status: 'ATENDIDO',
    name: 'Ing. Roberto Díaz',
    company: 'LogiCore Soluciones',
    email: 'r.diaz@logicore.io',
    whatsapp: '+54 9 11 2233-4455',
    service: 'ERP & Facturación Multi-Almacén',
    serviceCategory: 'ERP / Stock',
    serviceIcon: 'settings_suggest',
    message:
      'Solicitamos cotización para la fase 2 del sistema ERP: integración con lectores de códigos QR en planta logística y panel de métricas en tiempo real para directorio.',
    dateLabel: 'Hace 3 días',
    timeLabel: '14:10 PM',
    createdAt: Date.now() - 72 * 3600 * 1000,
  },
];

export const DEFAULT_SETTINGS: AgencySettings = {
  whatsappNumber: '595994865645',
  contactEmail: 'contacto@systex.cloud',
  adminPassword: 'admin',
  webhookActive: true,
  slaMinutes: 15,
  elvioPhotoUrl: 'images/elvio.jpeg',
  jorgePhotoUrl: 'images/jorge.jpeg',
};
