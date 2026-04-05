import { useEffect, useMemo, useState } from "react";
import { getInventoryMovements, getProducts, type InventoryMovement, type Product } from "./api";

const dateTime = new Intl.DateTimeFormat("es-PE", {
  dateStyle: "medium",
  timeStyle: "short",
});

function movementTypeClasses(type: string) {
  switch (type.toLowerCase()) {
    case "restock":
      return "bg-emerald-100 text-emerald-700";
    case "purchase":
      return "bg-blue-100 text-blue-700";
    case "adjustment":
      return "bg-amber-100 text-amber-700";
    case "damage":
      return "bg-red-100 text-red-700";
    case "return":
      return "bg-violet-100 text-violet-700";
    default:
      return "bg-slate-200 text-slate-700";
  }
}

export function MovementsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);

  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [limit, setLimit] = useState("50");

  const loadData = async (productId?: number) => {
    try {
      setError("");

      const [productsData, movementsData] = await Promise.all([
        getProducts(),
        getInventoryMovements({
          productId,
          limit: Number(limit) || 50,
        }),
      ]);

      setProducts(productsData);
      setMovements(movementsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar los movimientos."
      );
    }
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    };

    void run();
  }, []);

  const restockCount = useMemo(
    () =>
      movements.filter((m) => m.movementType.toLowerCase() === "restock").length,
    [movements]
  );

  const purchaseCount = useMemo(
    () =>
      movements.filter((m) => m.movementType.toLowerCase() === "purchase").length,
    [movements]
  );

  const netChange = useMemo(
    () => movements.reduce((acc, m) => acc + m.quantityChange, 0),
    [movements]
  );

  const selectedProductName = useMemo(() => {
    if (!selectedProductId) return "Todos los productos";
    return products.find((p) => p.id === selectedProductId)?.name ?? "Producto";
  }, [products, selectedProductId]);

  const handleFilter = async () => {
    setLoading(true);
    await loadData(selectedProductId || undefined);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Movimientos
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Auditoría de inventario con historial de compras, restocks, ajustes y
              otros cambios de stock.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <select
              value={selectedProductId}
              onChange={(e) =>
                setSelectedProductId(e.target.value ? Number(e.target.value) : "")
              }
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 md:w-72"
            >
              <option value="">Todos los productos</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>

            <select
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="h-11 rounded-2xl border border-slate-200 px-4"
            >
              <option value="20">20 registros</option>
              <option value="50">50 registros</option>
              <option value="100">100 registros</option>
              <option value="200">200 registros</option>
            </select>

            <button
              onClick={() => void handleFilter()}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard title="Movimientos cargados" value={String(movements.length)} />
        <KpiCard title="Restocks" value={String(restockCount)} />
        <KpiCard title="Purchases" value={String(purchaseCount)} />
        <KpiCard
          title="Cambio neto"
          value={String(netChange)}
          danger={netChange < 0}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Historial de movimientos
            </h2>
            <p className="text-sm text-slate-500">{selectedProductName}</p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-sm text-slate-500">
            Cargando movimientos...
          </div>
        ) : movements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-sm text-slate-500">
            No se encontraron movimientos para este filtro.
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Fecha</th>
                    <th className="px-5 py-4 font-medium">Producto</th>
                    <th className="px-5 py-4 font-medium">Tipo</th>
                    <th className="px-5 py-4 font-medium">Cambio</th>
                    <th className="px-5 py-4 font-medium">Anterior</th>
                    <th className="px-5 py-4 font-medium">Nuevo</th>
                    <th className="px-5 py-4 font-medium">Motivo</th>
                  </tr>
                </thead>

                <tbody>
                  {movements.map((movement) => (
                    <tr
                      key={movement.id}
                      className="border-t border-slate-200 align-top transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4 text-slate-700">
                        {dateTime.format(new Date(movement.createdAt))}
                      </td>

                      <td className="px-5 py-4">
                        <div className="-max-w-[260px]">
                          <p className="font-semibold text-slate-900">
                            {movement.productName}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Producto #{movement.productId}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={[
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                            movementTypeClasses(movement.movementType),
                          ].join(" ")}
                        >
                          {movement.movementType}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={[
                            "font-semibold",
                            movement.quantityChange >= 0
                              ? "text-emerald-700"
                              : "text-red-700",
                          ].join(" ")}
                        >
                          {movement.quantityChange >= 0
                            ? `+${movement.quantityChange}`
                            : movement.quantityChange}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {movement.previousQuantity}
                      </td>

                      <td className="px-5 py-4 text-slate-900 font-medium">
                        {movement.newQuantity}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {movement.reason || "Sin motivo"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  danger = false,
}: {
  title: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p
        className={[
          "mt-2 text-2xl font-semibold",
          danger ? "text-red-600" : "text-slate-900",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}