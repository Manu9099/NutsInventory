import { LogOut, Menu, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/auth-store";

type TopbarProps = {
  onOpenMobileSidebar: () => void;
};

export function Topbar({ onOpenMobileSidebar }: TopbarProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="inline-flex rounded-2xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Hola{user ? `, ${user.fullName}` : ""}
            </h2>
            <p className="text-sm text-slate-500">
              {user ? user.email : "Sesión activa"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 sm:flex">
              <ShieldCheck className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">
                {user.role}
              </span>
            </div>
          ) : null}

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}