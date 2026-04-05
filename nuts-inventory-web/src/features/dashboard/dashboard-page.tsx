import { useEffect, useState } from "react";
import {
  Package,
  Users,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import {
  getDashboardSummary,
  getInventoryMovements,
  getLowStockProducts,
  getMonthlySalesTrend,
  getTopSellers,
  type DashboardSummary,
  type InventoryMovement,
  type MonthlyTrend,
  type Product,
  type TopSeller,
} from "./api";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

const dateTime = new Intl.DateTimeFormat("es-PE", {
  dateStyle: "medium",
  timeStyle: "short",
});

function MetricCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">{icon}</div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [topSellers, setTopSellers] = useState<TopSeller[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          summaryData,
          lowStockData,
          topSellersData,
          monthlyTrendData,
          movementData,
        ] = await Promise.all([
          getDashboardSummary(),
          getLowStockProducts(),
          getTopSellers(),
          getMonthlySalesTrend(),
          getInventoryMovements(),
        ]);

        setSummary(summaryData);
        setLowStock(lowStockData);
        setTopSellers(topSellersData);
        setMonthlyTrend(monthlyTrendData);
        setMovements(movementData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudo cargar el dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm text-slate-600">Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Resumen operativo y comercial del sistema.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Productos activos"
          value={`${summary?.activeProducts ?? 0}`}
          hint={`${summary?.totalProducts ?? 0} productos en total`}
          icon={<Package className="h-5 w-5" />}
        />
        <MetricCard
          title="Clientes activos"
          value={`${summary?.activeCustomers ?? 0}`}
          hint={`${summary?.totalCustomers ?? 0} clientes en total`}
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Órdenes"
          value={`${summary?.totalOrders ?? 0}`}
          hint="Pedidos registrados"
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <MetricCard
          title="Facturación"
          value={currency.format(summary?.totalRevenue ?? 0)}
          hint={`${summary?.lowStockProducts ?? 0} productos con stock bajo`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Tendencia de ventas mensual
          </h2>
          <div className="mt-4 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyTrend.map((x) => ({
                  ...x,
                  label: `${x.month.toString().padStart(2, "0")}/${x.year}`,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="totalRevenue" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Top sellers</h2>
          <div className="mt-4 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSellers} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="productName"
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="quantitySold" radius={[10, 10, 10, 10]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-lg font-semibold text-slate-900">
              Productos con stock bajo
            </h2>
          </div>

          <div className="space-y-3">
            {lowStock.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                No hay alertas de stock bajo.
              </div>
            ) : (
              lowStock.slice(0, 6).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-slate-500">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {product.stockQuantity} uds.
                    </p>
                    <p className="text-xs text-slate-500">
                      mínimo: {product.reorderLevel}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Últimos movimientos
          </h2>

          <div className="space-y-3">
            {movements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-start justify-between rounded-2xl border border-slate-200 p-4"
              >
                <div>
                  <p className="font-medium">{movement.productName}</p>
                  <p className="text-sm text-slate-500">
                    {movement.movementType} · {movement.reason || "Sin motivo"}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold">
                    {movement.quantityChange > 0
                      ? `+${movement.quantityChange}`
                      : movement.quantityChange}
                  </p>
                  <p className="text-slate-500">
                    {dateTime.format(new Date(movement.createdAt))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}