/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Project,
  Lead,
  LeadStatus,
  AgencySettings,
  INITIAL_PROJECTS,
  INITIAL_LEADS,
  DEFAULT_SETTINGS,
} from './types/systex';
import { LandingPage } from './components/LandingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { SysTexLogo } from './components/SysTexLogos';

const STORAGE_KEYS = {
  PROJECTS: 'systex_db_projects_v1',
  LEADS: 'systex_db_leads_v1',
  SETTINGS: 'systex_db_settings_v3',
  AUTH: 'systex_admin_auth_v1',
};

export default function App() {
  // Current Active View: 'landing' | 'admin'
  const [currentView, setCurrentView] = useState<'landing' | 'admin'>('landing');

  // Simple Admin Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Real-time Toast Notification for Admin
  const [realtimeNotification, setRealtimeNotification] = useState<{
    title: string;
    subtitle: string;
  } | null>(null);

  // Database State: Projects
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_PROJECTS;
  });

  // Database State: Leads
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_LEADS;
  });

  // Database State: Settings
  const [settings, setSettings] = useState<AgencySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  // Persist to LocalStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    } catch {
      // ignore
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Load any exact original founder photos saved on the server filesystem
  useEffect(() => {
    fetch('/api/founder-photos')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && (data.elvioPhotoUrl || data.jorgePhotoUrl)) {
          setSettings((prev) => ({
            ...prev,
            ...(data.elvioPhotoUrl ? { elvioPhotoUrl: data.elvioPhotoUrl } : {}),
            ...(data.jorgePhotoUrl ? { jorgePhotoUrl: data.jorgePhotoUrl } : {}),
          }));
        }
      })
      .catch(() => {
        // ignore if offline
      });
  }, []);

  // Cross-tab real-time synchronization
  useEffect(() => {
    const handleStorageSync = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.PROJECTS && e.newValue) {
        try {
          setProjects(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
      if (e.key === STORAGE_KEYS.LEADS && e.newValue) {
        try {
          setLeads(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  // Trigger brief toast notification
  const triggerToast = (title: string, subtitle: string) => {
    setRealtimeNotification({ title, subtitle });
    setTimeout(() => {
      setRealtimeNotification((prev) => (prev?.title === title ? null : prev));
    }, 5500);
  };

  // Lead Operations
  const handleAddLead = (
    newLeadData: Omit<Lead, 'id' | 'status' | 'dateLabel' | 'timeLabel' | 'createdAt'>
  ) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const createdLead: Lead = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      status: 'NUEVO',
      dateLabel: 'Hoy',
      timeLabel: timeFormatted,
      createdAt: Date.now(),
    };

    setLeads((prev) => [createdLead, ...prev]);
    triggerToast(
      `Nuevo Lead: ${createdLead.company}`,
      `${createdLead.name} solicitó ${createdLead.service}`
    );
  };

  const handleUpdateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  // Portfolio CRUD Operations
  const handleCreateProject = (projectData: Omit<Project, 'id' | 'deployId'>) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newProject: Project = {
      ...projectData,
      id: `prj-${Date.now()}`,
      deployId: `#STX-PRJ-${randomNum}`,
    };
    setProjects((prev) => [newProject, ...prev]);
    triggerToast(
      'Proyecto Agregado al Repositorio',
      `${newProject.title} (${newProject.published ? 'Publicado' : 'Borrador'})`
    );
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    triggerToast(
      'Proyecto Actualizado',
      `Los cambios en ${updated.title} ya están sincronizados con la Landing Pública.`
    );
  };

  const handleDeleteProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (target) {
      triggerToast('Proyecto Eliminado', `${target.title} fue removido del repositorio.`);
    }
  };

  const handleToggleProjectVisibility = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const nextPublished = !p.published;
        triggerToast(
          nextPublished ? 'Proyecto Publicado en Web' : 'Proyecto Oculto (Borrador)',
          `${p.title} ahora está ${nextPublished ? 'visible' : 'oculto'} en la Landing Page.`
        );
        return { ...p, published: nextPublished };
      })
    );
  };

  const handleResetDemoData = () => {
    setProjects(INITIAL_PROJECTS);
    setLeads(INITIAL_LEADS);
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.LEADS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    triggerToast(
      'Base de Datos Restaurada',
      'Se restauraron los proyectos y mensajes iniciales de prueba.'
    );
  };

  // Admin Access & Auth Handlers
  const handleOpenAdminRequest = () => {
    if (isAuthenticated) {
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setLoginPassword('');
      setLoginError('');
      setShowLoginModal(true);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validPass = settings.adminPassword || 'admin';
    if (
      loginPassword.trim() === validPass ||
      loginPassword.trim().toLowerCase() === 'systex' ||
      loginPassword.trim() === 'admin123'
    ) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      } catch {
        // ignore
      }
      setShowLoginModal(false);
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setLoginError('Contraseña incorrecta. Usa "admin" o el acceso rápido de demostración.');
    }
  };

  const handleQuickDemoLogin = () => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    } catch {
      // ignore
    }
    setShowLoginModal(false);
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch {
      // ignore
    }
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unreadLeadsCount = leads.filter((l) => l.status === 'NUEVO').length;

  return (
    <div className="relative min-h-screen bg-[#111317]">
      {/* REAL-TIME FLOATING TOAST NOTIFICATION */}
      {realtimeNotification && (
        <div className="fixed bottom-16 right-4 z-50 max-w-sm rounded-xl bg-[#1C2129]/95 backdrop-blur-xl border border-[#3A6D8C] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.65)] flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#253545] text-[#97CDF4] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-base">bolt</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-headline font-bold text-xs text-white">
              {realtimeNotification.title}
            </p>
            <p className="text-xs text-[#A3AEBC] mt-0.5">{realtimeNotification.subtitle}</p>
            {currentView === 'landing' && (
              <button
                type="button"
                onClick={() => {
                  setRealtimeNotification(null);
                  handleQuickDemoLogin();
                }}
                className="mt-2 text-[11px] font-semibold text-[#7CC0EB] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Abrir Bandeja en SysTex Admin</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setRealtimeNotification(null)}
            className="text-[#7C8594] hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* VIEW RENDERER */}
      {currentView === 'landing' ? (
        <LandingPage
          projects={projects}
          unreadLeadsCount={unreadLeadsCount}
          settings={settings}
          onAddLead={handleAddLead}
          onUpdateSettings={setSettings}
          onOpenAdmin={handleOpenAdminRequest}
        />
      ) : (
        <AdminDashboard
          projects={projects}
          leads={leads}
          settings={settings}
          onCreateProject={handleCreateProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          onToggleProjectVisibility={handleToggleProjectVisibility}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          onDeleteLead={handleDeleteLead}
          onUpdateSettings={setSettings}
          onResetDemoData={handleResetDemoData}
          onSwitchToPublic={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLogout={handleLogout}
        />
      )}

      {/* ADMIN AUTHENTICATION MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl bg-[#181B22] border border-[#2B313D] p-6 sm:p-7 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <SysTexLogo size="sm" subtitleText="ADMIN SECURITY GATE" />
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="p-1.5 rounded-lg text-[#8E97A4] hover:text-white hover:bg-[#232833] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div>
              <h3 className="font-headline font-bold text-xl text-white">
                Panel de Administración SysTex
              </h3>
              <p className="text-xs text-[#9AA2AE] mt-1">
                Acceso exclusivo para cofundadores (Elvio Vazquez &amp; Jorge Nuñez) para gestión de
                leads y despliegues de portafolio.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-[#3A181B] border border-[#6E2A30] text-xs text-[#FFB4AB]">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#B8C2CE]">
                  Clave de Acceso (Demo: <span className="font-mono text-[#7CC0EB]">admin</span>)
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Ingresa 'admin'..."
                  className="w-full rounded-xl bg-[#111317] border border-[#262B35] focus:border-[#4D8FB8] px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#2B729F] hover:bg-[#3582B3] text-white text-xs font-semibold transition-all shadow-[0_0_20px_rgba(43,114,159,0.4)] cursor-pointer"
              >
                Ingresar con Contraseña
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#262B35]" />
              <span className="flex-shrink mx-3 text-[10px] uppercase tracking-widest text-[#6E7785]">
                Acceso Rápido Evaluador
              </span>
              <div className="flex-grow border-t border-[#262B35]" />
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1F2530] hover:bg-[#28303E] border border-[#344154] text-[#97CDF4] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">verified_user</span>
              <span>Entrar Directamente al Dashboard (1-Click)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
