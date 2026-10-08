/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
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
import { AdminLoginScreen } from './components/AdminLoginScreen';
import { SysTexLogo } from './components/SysTexLogos';
import {
  db,
  auth,
  googleProvider,
  signInWithPopup,
  signInAnonymously,
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
  PROJECTS: 'systex_db_projects_v8', // bumped to v8 for The Classic Barber Shop demo inclusion
  LEADS: 'systex_db_leads_v1',
  SETTINGS: 'systex_db_settings_v3',
  AUTH: 'systex_admin_auth_v1',
};

export default function App() {
  const navigate = useNavigate();

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
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Auto-connect Firebase Auth if admin is locally authenticated
  useEffect(() => {
    if (isAuthenticated && !auth.currentUser) {
      signInAnonymously(auth).catch((err) => {
        console.warn('Anonymous Firebase auth note:', err.message);
      });
    }
  }, [isAuthenticated]);

  // Real-time Toast Notification for Admin
  const [realtimeNotification, setRealtimeNotification] = useState<{
    title: string;
    subtitle: string;
  } | null>(null);

  // Database State: Projects (Directly initialized from static source code INITIAL_PROJECTS)
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      // Clear legacy storage keys
      localStorage.removeItem('systex_db_projects_v1');
      localStorage.removeItem('systex_db_projects_v2');
      localStorage.removeItem('systex_db_projects_v3');
      localStorage.removeItem('systex_db_projects_v4');
      localStorage.removeItem('systex_db_projects_v5');
      localStorage.removeItem('systex_db_projects_v6');
      localStorage.removeItem('systex_db_projects_v7');
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with INITIAL_PROJECTS: default fields come from INITIAL_PROJECTS, but user edits (item) take precedence
          const merged = parsed.map((item: Project) => {
            const initialMatch = INITIAL_PROJECTS.find((p) => p.id === item.id);
            return initialMatch ? { ...initialMatch, ...item } : item;
          });
          for (const initP of INITIAL_PROJECTS) {
            if (!merged.some((m) => m.id === initP.id)) {
              merged.push(initP);
            }
          }
          return merged;
        }
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
              const data = docSnap.data() as Project;
              const initialMatch = INITIAL_PROJECTS.find((p) => p.id === data.id);
              remoteProjects.push(initialMatch ? { ...initialMatch, ...data } : data);
            });
            for (const initP of INITIAL_PROJECTS) {
              if (!remoteProjects.some((rp) => rp.id === initP.id)) {
                remoteProjects.push(initP);
                setDoc(doc(db, 'projects', initP.id), initP).catch(() => {});
              }
            }
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

  const handleGoogleLogin = async () => {
    try {
      setLoginError('');
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setIsAuthenticated(true);
        try {
          localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
        } catch {
          // ignore
        }
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
        if (!auth.currentUser) {
          signInAnonymously(auth).catch((err) => {
            console.warn('Anonymous Firebase auth note:', err.message);
          });
        }
      } catch {
        // ignore
      }
      setLoginError('');
    } else {
      setLoginError('Contraseña incorrecta. Usa "admin" o el acceso rápido de demostración.');
    }
  };

  const handleQuickDemoLogin = () => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      if (!auth.currentUser) {
        signInAnonymously(auth).catch((err) => {
          console.warn('Anonymous Firebase auth note:', err.message);
        });
      }
    } catch {
      // ignore
    }
    setLoginError('');
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
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unreadLeadsCount = leads.filter((l) => l.status === 'NUEVO').length;

  return (
    <div className="relative min-h-screen bg-[#111317] overflow-x-hidden w-full">
      {/* REAL-TIME FLOATING TOAST NOTIFICATION (ONLY FOR AUTHENTICATED ADMIN) */}
      {isAuthenticated && realtimeNotification && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl bg-[#1C2129]/95 backdrop-blur-xl border border-[#3A6D8C] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.65)] hidden md:flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#253545] text-[#97CDF4] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-base">bolt</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-headline font-bold text-xs text-white">
              {realtimeNotification.title}
            </p>
            <p className="text-xs text-[#A3AEBC] mt-0.5">{realtimeNotification.subtitle}</p>
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

      {/* REACT ROUTER: SEPARATION OF PUBLIC LANDING (/) AND PRIVATE ADMIN (/admin) */}
      <Routes>
        {/* RUTA PÚBLICA: LANDING PAGE 100% ENFOCADA AL CLIENTE */}
        <Route
          path="/"
          element={
            <LandingPage
              projects={projects}
              settings={settings}
              onAddLead={handleAddLead}
              onUpdateSettings={handleUpdateSettings}
            />
          }
        />

        {/* RUTA PRIVADA: PANEL DE ADMINISTRACIÓN SYSTEX (/admin) */}
        <Route
          path="/admin"
          element={
            isAuthenticated ? (
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
                  navigate('/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onLogout={handleLogout}
              />
            ) : (
              <AdminLoginScreen
                loginPassword={loginPassword}
                setLoginPassword={setLoginPassword}
                loginError={loginError}
                onLoginSubmit={handleLoginSubmit}
                onGoogleLogin={handleGoogleLogin}
                onQuickDemoLogin={handleQuickDemoLogin}
                onBackToLanding={() => {
                  navigate('/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )
          }
        />

        {/* CATCH-ALL ROUTE: REDIRECCIÓN AUTOMÁTICA A LA LANDING PÚBLICA */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
