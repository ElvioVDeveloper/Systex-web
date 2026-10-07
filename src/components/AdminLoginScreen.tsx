import React from 'react';
import { SysTexLogo } from './SysTexLogos';

interface AdminLoginScreenProps {
  loginPassword: string;
  setLoginPassword: (val: string) => void;
  loginError: string;
  onLoginSubmit: (e: React.FormEvent) => void;
  onGoogleLogin: () => void;
  onQuickDemoLogin: () => void;
  onBackToLanding: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({
  loginPassword,
  setLoginPassword,
  loginError,
  onLoginSubmit,
  onGoogleLogin,
  onQuickDemoLogin,
  onBackToLanding,
}) => {
  return (
    <div className="min-h-screen bg-[#0E1116] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2B729F]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-[#161920]/95 border border-[#272D38] p-7 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#222731]">
          <SysTexLogo size="sm" subtitleText="ADMIN SECURITY GATEWAY" />
          <span className="px-2 py-0.5 rounded bg-[#1D2733] border border-[#2E4156] font-mono text-[10px] font-semibold text-[#7CC0EB]">
            RUTA /admin
          </span>
        </div>

        <div>
          <h2 className="font-headline font-bold text-xl sm:text-2xl text-white">
            Panel de Administración SysTex
          </h2>
          <p className="text-xs text-[#9AA2AE] mt-1.5 leading-relaxed">
            Área de gestión privada para cofundadores (Elvio Vazquez &amp; Jorge Nuñez). Control de solicitudes B2B, clientes y despliegues de portafolio.
          </p>
        </div>

        {loginError && (
          <div className="p-3 rounded-xl bg-[#3A181B] border border-[#6E2A30] text-xs text-[#FFB4AB] flex items-center gap-2">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{loginError}</span>
          </div>
        )}

        {/* Google Firebase Login Button */}
        <button
          type="button"
          onClick={onGoogleLogin}
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

        <form onSubmit={onLoginSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#B8C2CE]">
              Clave de Acceso (Demo: <span className="font-mono text-[#7CC0EB]">admin</span>)
            </label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Ingresa 'admin'..."
              className="w-full rounded-xl bg-[#111317] border border-[#262B35] focus:border-[#4D8FB8] px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
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
          onClick={onQuickDemoLogin}
          className="w-full py-2.5 px-4 rounded-xl bg-[#1F2530] hover:bg-[#28303E] border border-[#344154] text-[#97CDF4] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">verified_user</span>
          <span>Entrar Directamente al Dashboard (Modo Demo)</span>
        </button>

        {/* Back to Public Web Link */}
        <div className="pt-2 text-center border-t border-[#222731]">
          <button
            type="button"
            onClick={onBackToLanding}
            className="text-xs text-[#8E97A4] hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Volver a la Página Pública (Landing)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
