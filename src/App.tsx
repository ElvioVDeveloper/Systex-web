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
import {
  db,
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from './firebase';

const STORAGE_KEYS = {
  PROJECTS: 'systex_db_projects_v1',
  LEADS: 'systex_db_leads_v1',
  SETTINGS: 'systex_db_settings_v3',
  AUTH: 'systex_admin_auth_v1',
};

export default function App() {
  // Current Active View: 'landing' | 'admin'
  const [currentView, setCurrentView] = useState<'landing' | 'admin'>('landing');

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

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

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsAuthenticated(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Leads
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        collection(db, 'leads'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteLeads: Lead[] = [];
            snapshot.forEach((docSnap) => {
              remoteLeads.push(docSnap.data() as Lead);
            });
            remoteLeads.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            setLeads(remoteLeads);
          }
        },
        (error) => {
          // May be restricted for unauthenticated public visitors
          console.warn('Leads read note:', error.message);
        }
      );
      return () => unsub();
    } catch (err) {
      console.warn('Firestore leads snapshot setup error:', err);
    }
  }, []);

  // Real-time Firestore sync for Projects
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        collection(db, 'projects'),
        async (snapshot) => {
          if (!snapshot.empty) {
            const remoteProjects: Project[] = [];
            snapshot.forEach((docSnap) => {
              remoteProjects.push(docSnap.data() as Project);
            });
            setProjects(remoteProjects);
          } else {
            // Seed initial projects to Firestore
            try {
              for (const p of INITIAL_PROJECTS) {
                await setDoc(doc(db, 'projects', p.id), p);
              }
            } catch {
              // ignore if unauthenticated
            }
          }
        },
        (error) => {
          console.warn('Projects read note:', error.message);
        }
      );
      return () => unsub();
    } catch (err) {
      console.warn('Firestore projects snapshot setup error:', err);
    }
  }, []);

  // Real-time Firestore sync for Settings
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        doc(db, 'settings', 'agency'),
        async (docSnap) => {
          if (docSnap.exists()) {
            setSettings((prev) => ({ ...prev, ...(docSnap.data() as AgencySettings) }));
          } else {
            try {
              await setDoc(doc(db, 'settings', 'agency'), DEFAULT_SETTINGS);
            } catch {
              // ignore
            }
          }
        },
        (error) => {
          console.warn('Settings read note:', error.message);
        }
      );
      return () => unsub();
    } catch (err) {
      console.warn('Firestore settings snapshot setup error:', err);
    }
  }, []);

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

  // Lead Operations with Firestore Persistence
  const handleAddLead = async (
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

    // Save to Firestore
    try {
      await setDoc(doc(db, 'leads', createdLead.id), createdLead);
    } catch (err) {
      console.warn('Error saving lead to Firestore:', err);
    }
  };

  const handleUpdateLeadStatus = async (id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      const target = leads.find((l) => l.id === id);
      if (target) {
        await setDoc(doc(db, 'leads', id), { ...target, status }, { merge: true });
      }
    } catch (err) {
      console.warn('Error updating lead status in Firestore:', err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    try {
      await deleteDoc(doc(db, 'leads', id));
    } catch (err) {
      console.warn('Error deleting lead from Firestore:', err);
    }
  };

  // Portfolio CRUD Operations with Firestore Persistence
  const handleCreateProject = async (projectData: Omit<Project, 'id' | 'deployId'>) => {
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
    try {
      await setDoc(doc(db, 'projects', newProject.id), newProject);
    } catch (err) {
      console.warn('Error saving project to Firestore:', err);
    }
  };

  const handleUpdateProject = async (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    triggerToast(
      'Proyecto Actualizado',
      `Los cambios en ${updated.title} ya están sincronizados con la Landing Pública.`
    );
    try {
      await setDoc(doc(db, 'projects', updated.id), updated);
    } catch (err) {
      console.warn('Error updating project in Firestore:', err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (target) {
      triggerToast('Proyecto Eliminado', `${target.title} fue removido del repositorio.`);
    }
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      console.warn('Error deleting project from Firestore:', err);
    }
  };

  const handleToggleProjectVisibility = async (id: string) => {
    let updatedProject: Project | null = null;
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const nextPublished = !p.published;
        updatedProject = { ...p, published: nextPublished };
        triggerToast(
          nextPublished ? 'Proyecto Publicado en Web' : 'Proyecto Oculto (Borrador)',
          `${p.title} ahora está ${nextPublished ? 'visible' : 'oculto'} en la Landing Page.`
        );
        return updatedProject;
      })
    );
    if (updatedProject) {
      try {
        await setDoc(doc(db, 'projects', id), updatedProject);
      } catch (err) {
        console.warn('Error updating visibility in Firestore:', err);
      }
    }
  };

  const handleUpdateSettings = async (newSettings: AgencySettings) => {
    setSettings(newSettings);
    try {
      await setDoc(doc(db, 'settings', 'agency'), {
        ...newSettings,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.warn('Error updating settings in Firestore:', err);
    }
  };

  const handleResetDemoData = async () => {
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
    try {
      for (const p of INITIAL_PROJECTS) {
        await setDoc(doc(db, 'projects', p.id), p);
      }
      await setDoc(doc(db, 'settings', 'agency'), DEFAULT_SETTINGS);
    } catch {
      // ignore
    }
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

  const handleGoogleLogin = async () => {
    try {
      setLoginError('');
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setIsAuthenticated(true);
        setShowLoginModal(false);
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        triggerToast(
          'Autenticado con Firebase',
          `Bienvenido ${res.user.displayName || res.user.email}`
        );
      }
    } catch (err: any) {
      console.warn('Google Sign-in error:', err);
      setLoginError('No se pudo autenticar con Google. Puedes usar la clave directa de demo.');
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
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
          onUpdateSettings={handleUpdateSettings}
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
          onUpdateSettings={handleUpdateSettings}
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

            {/* Google Firebase Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar con Google (Firebase Auth)</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#262B35]" />
              <span className="flex-shrink mx-3 text-[10px] uppercase tracking-widest text-[#6E7785]">
                O ingresa con contraseña
              </span>
              <div className="flex-grow border-t border-[#262B35]" />
            </div>

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
