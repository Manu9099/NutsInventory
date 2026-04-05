import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/products", label: "Productos", icon: Package },
  { to: "/customers", label: "Clientes", icon: Users },
  { to: "/orders", label: "Órdenes", icon: ShoppingCart },
  { to: "/movements", label: "Movimientos", icon: ArrowLeftRight },
];

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
};

export function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapsed,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white shadow-lg transition-all duration-300 lg:static lg:z-auto lg:shadow-none",
          collapsed ? "w-24" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-5">
          <div className={collapsed ? "mx-auto" : ""}>
            <div className="inline-flex items-center rounded-2xl bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
              {collapsed ? "NI" : "Nuts Inventory"}
            </div>

            {!collapsed ? (
              <>
                <h1 className="mt-3 text-lg font-semibold text-slate-900">
                  Panel Admin
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Inventario, fidelización y analytics
                </p>
              </>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleCollapsed}
              className="hidden rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 lg:inline-flex"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={onCloseMobile}
              className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  [
                    "group flex items-center rounded-2xl px-3 py-3 text-sm font-medium transition-all",
                    collapsed ? "justify-center" : "gap-3",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed ? <span>{item.label}</span> : null}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 px-3 py-4">
          <div
            className={[
              "rounded-2xl bg-slate-50 p-3",
              collapsed ? "text-center" : "",
            ].join(" ")}
          >
            {!collapsed ? (
              <>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Estado
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  Demo conectada al backend
                </p>
              </>
            ) : (
              <span className="text-xs font-semibold text-slate-500">API</span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}