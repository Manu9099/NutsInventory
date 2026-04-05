import type { Customer } from "../api";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
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

export function CustomersTable({
  customers,
  onViewLoyalty,
}: {
  customers: Customer[];
  onViewLoyalty: (customer: Customer) => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-5 py-4 font-medium">Cliente</th>
              <th className="px-5 py-4 font-medium">Ciudad</th>
              <th className="px-5 py-4 font-medium">Tier</th>
              <th className="px-5 py-4 font-medium">Puntos</th>
              <th className="px-5 py-4 font-medium">Total gastado</th>
              <th className="px-5 py-4 font-medium">Compras</th>
              <th className="px-5 py-4 font-medium">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-t border-slate-200 align-top transition hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <div className="-max-w-[300px]">
                    <p className="font-semibold text-slate-900">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{customer.email}</p>
                    {customer.phone ? (
                      <p className="mt-1 text-xs text-slate-400">{customer.phone}</p>
                    ) : null}
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {customer.city || "Sin ciudad"}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                      tierClasses(customer.tier),
                    ].join(" ")}
                  >
                    {customer.tier}
                  </span>
                </td>

                <td className="px-5 py-4 font-medium text-slate-900">
                  {customer.loyaltyPoints}
                </td>

                <td className="px-5 py-4 font-medium text-slate-900">
                  {currency.format(customer.totalSpent)}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {customer.totalPurchases}
                </td>

                <td className="px-5 py-4">
                  <button
                    onClick={() => onViewLoyalty(customer)}
                    className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
                  >
                    Ver fidelización
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}