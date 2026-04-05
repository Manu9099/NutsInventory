import type {
  Customer,
  CustomerLoyaltySummary,
  LoyaltyTransaction,
} from "../api";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

const dateTime = new Intl.DateTimeFormat("es-PE", {
  dateStyle: "medium",
  timeStyle: "short",
});

function tierClasses(tier: string) {
  switch (tier.toLowerCase()) {
    case "platinum":
      return "bg-violet-100 text-violet-700";
    case "gold":
      return "bg-amber-100 text-amber-700";
    case "silver":
      return "bg-slate-200 text-slate-700";
    default:
      return "bg-orange-100 text-orange-700";
  }
}

export function LoyaltyTransactionsModal({
  open,
  customer,
  summary,
  transactions,
  loading,
  onClose,
}: {
  open: boolean;
  customer: Customer | null;
  summary: CustomerLoyaltySummary | null;
  transactions: LoyaltyTransaction[];
  loading: boolean;
  onClose: () => void;
}) {
  if (!open || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Fidelización de cliente
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {customer.firstName} {customer.lastName} · {customer.email}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Cerrar
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
            Cargando fidelización...
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <KpiCard title="Puntos" value={String(summary?.loyaltyPoints ?? 0)} />
              <KpiCard title="Compras" value={String(summary?.totalPurchases ?? 0)} />
              <KpiCard
                title="Total gastado"
                value={currency.format(summary?.totalSpent ?? 0)}
              />
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Tier</p>
                <div className="mt-2">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                      tierClasses(summary?.tier ?? "Bronze"),
                    ].join(" ")}
                  >
                    {summary?.tier ?? "Bronze"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-5 py-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Transacciones de puntos
                </h3>
              </div>

              <div className="-max-h-[360px] overflow-auto">
                {transactions.length === 0 ? (
                  <div className="p-5 text-sm text-slate-500">
                    Este cliente aún no tiene movimientos de fidelización.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-start justify-between gap-4 px-5 py-4"
                      >
                        <div>
                          <p className="font-medium text-slate-900">{tx.reason}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {tx.orderId ? `Orden #${tx.orderId}` : "Sin orden asociada"}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {dateTime.format(new Date(tx.createdAt))}
                          </p>
                        </div>

                        <div
                          className={[
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            tx.pointsAdded >= 0
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700",
                          ].join(" ")}
                        >
                          {tx.pointsAdded >= 0 ? `+${tx.pointsAdded}` : tx.pointsAdded} pts
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
