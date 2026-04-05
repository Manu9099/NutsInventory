import { useEffect, useMemo, useState } from "react";
import {
  createOrder,
  getCustomers,
  getProducts,
  type CreateOrderResponse,
  type Customer,
  type Product,
} from "./api";

type DraftItem = {
  productId: number;
  quantity: number;
};

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

export function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | "">("");
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [draftQuantity, setDraftQuantity] = useState("1");
  const [pointsToRedeem, setPointsToRedeem] = useState("0");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<DraftItem[]>([]);
  const [result, setResult] = useState<CreateOrderResponse | null>(null);

  const loadData = async () => {
    try {
      setError("");
      const [productsData, customersData] = await Promise.all([
        getProducts(),
        getCustomers(customerSearch),
      ]);

      setProducts(productsData.filter((p) => p.isActive));
      setCustomers(customersData.filter((c) => c.isActive));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la data.");
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

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId]
  );

  const availableProducts = useMemo(
    () => products.filter((p) => p.stockQuantity > 0),
    [products]
  );

  const enrichedItems = useMemo(() => {
    return items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;

        return {
          ...item,
          product,
          subtotal: product.price * item.quantity,
        };
      })
      .filter(Boolean) as Array<
      DraftItem & { product: Product; subtotal: number }
    >;
  }, [items, products]);

  const grossAmount = useMemo(
    () => enrichedItems.reduce((acc, item) => acc + item.subtotal, 0),
    [enrichedItems]
  );

  const appliedPoints = useMemo(() => {
    if (!selectedCustomer) return 0;

    const requested = Number(pointsToRedeem || 0);
    const maxFromCustomer = selectedCustomer.loyaltyPoints;
    const maxFromOrder = Math.floor(grossAmount * 100);

    return Math.max(0, Math.min(requested, maxFromCustomer, maxFromOrder));
  }, [selectedCustomer, pointsToRedeem, grossAmount]);

  const discountApplied = appliedPoints / 100;
  const netAmount = Math.max(grossAmount - discountApplied, 0);
  const estimatedPointsEarned = Math.floor(netAmount);

  const handleSearchCustomers = async () => {
    try {
      setError("");
      const data = await getCustomers(customerSearch);
      setCustomers(data.filter((c) => c.isActive));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo buscar clientes."
      );
    }
  };

  const addItem = () => {
    if (!selectedProductId) return;

    const quantity = Number(draftQuantity);
    if (!quantity || quantity <= 0) return;

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    setItems((current) => {
      const existing = current.find((x) => x.productId === selectedProductId);

      if (existing) {
        const nextQuantity = existing.quantity + quantity;
        return current.map((x) =>
          x.productId === selectedProductId
            ? {
                ...x,
                quantity: Math.min(nextQuantity, product.stockQuantity),
              }
            : x
        );
      }

      return [
        ...current,
        {
          productId: selectedProductId,
          quantity: Math.min(quantity, product.stockQuantity),
        },
      ];
    });

    setSelectedProductId("");
    setDraftQuantity("1");
  };

  const changeItemQuantity = (productId: number, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (quantity <= 0) {
      setItems((current) => current.filter((x) => x.productId !== productId));
      return;
    }

    setItems((current) =>
      current.map((x) =>
        x.productId === productId
          ? { ...x, quantity: Math.min(quantity, product.stockQuantity) }
          : x
      )
    );
  };

  const removeItem = (productId: number) => {
    setItems((current) => current.filter((x) => x.productId !== productId));
  };

  const handleSubmitOrder = async () => {
    if (!selectedCustomerId || items.length === 0) return;

    try {
      setSaving(true);
      setError("");
      setResult(null);

      const response = await createOrder({
        customerId: selectedCustomerId,
        items,
        loyaltyPointsToRedeem: appliedPoints,
        notes: notes.trim() || null,
      });

      setResult(response);
      setItems([]);
      setNotes("");
      setPointsToRedeem("0");
      setSelectedProductId("");
      setDraftQuantity("1");

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo registrar la orden."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Órdenes
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Registra pedidos reales con selección de cliente, productos y canje
              de puntos.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard title="Productos disponibles" value={String(availableProducts.length)} />
            <KpiCard title="Clientes activos" value={String(customers.length)} />
            <KpiCard title="Items en borrador" value={String(items.length)} />
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
          <p className="font-semibold">Orden registrada correctamente</p>
          <p className="mt-1">
            Orden #{result.orderId} · Total {currency.format(result.netAmount)} ·
            Puntos ganados {result.loyaltyPointsEarned}
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Selección de cliente
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Busca y selecciona el cliente para el pedido.
            </p>

            <div className="mt-5 flex flex-col gap-3 md:flex-row">
              <input
                className="h-11 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-slate-400"
                placeholder="Buscar por nombre o email"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleSearchCustomers();
                }}
              />
              <button
                onClick={() => void handleSearchCustomers()}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Buscar
              </button>
            </div>

            <div className="mt-4">
              <select
                value={selectedCustomerId}
                onChange={(e) =>
                  setSelectedCustomerId(e.target.value ? Number(e.target.value) : "")
                }
                className="h-11 w-full rounded-2xl border border-slate-200 px-4"
              >
                <option value="">Seleccionar cliente</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName} · {customer.email}
                  </option>
                ))}
              </select>
            </div>

            {selectedCustomer ? (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedCustomer.email}
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <MiniInfo label="Tier" value={selectedCustomer.tier} />
                  <MiniInfo
                    label="Puntos disponibles"
                    value={String(selectedCustomer.loyaltyPoints)}
                  />
                  <MiniInfo
                    label="Total gastado"
                    value={currency.format(selectedCustomer.totalSpent)}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Agregar productos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Arma el pedido antes de enviarlo.
            </p>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_130px_auto]">
              <select
                value={selectedProductId}
                onChange={(e) =>
                  setSelectedProductId(e.target.value ? Number(e.target.value) : "")
                }
                className="h-11 w-full rounded-2xl border border-slate-200 px-4"
              >
                <option value="">Seleccionar producto</option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} · {currency.format(product.price)} · stock{" "}
                    {product.stockQuantity}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                className="h-11 w-full rounded-2xl border border-slate-200 px-4"
                value={draftQuantity}
                onChange={(e) => setDraftQuantity(e.target.value)}
              />

              <button
                onClick={addItem}
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Agregar
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {enrichedItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                  Aún no agregaste productos al pedido.
                </div>
              ) : (
                enrichedItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.product.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {currency.format(item.product.price)} · stock{" "}
                        {item.product.stockQuantity}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        max={item.product.stockQuantity}
                        className="h-10 w-24 rounded-xl border border-slate-200 px-3"
                        value={item.quantity}
                        onChange={(e) =>
                          changeItemQuantity(
                            item.productId,
                            Number(e.target.value || 0)
                          )
                        }
                      />

                      <div className="-min-w-[110px] text-sm font-semibold text-slate-900">
                        {currency.format(item.subtotal)}
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Resumen de orden
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Revisa montos y fidelización antes de confirmar.
            </p>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Canjear puntos
                </span>
                <input
                  type="number"
                  min="0"
                  className="h-11 w-full rounded-2xl border border-slate-200 px-4"
                  value={pointsToRedeem}
                  onChange={(e) => setPointsToRedeem(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Notas
                </span>
                <textarea
                  className="-min-h-[120px] w-full rounded-2xl border border-slate-200 p-4"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observaciones del pedido"
                />
              </label>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <div className="space-y-3 text-sm">
                <Row label="Subtotal" value={currency.format(grossAmount)} />
                <Row
                  label={`Descuento por puntos (${appliedPoints} pts)`}
                  value={`- ${currency.format(discountApplied)}`}
                />
                <Row
                  label="Puntos estimados a ganar"
                  value={`${estimatedPointsEarned} pts`}
                />
              </div>

              <div className="mt-4 border-t border-slate-200 pt-4">
                <Row
                  label="Total final"
                  value={currency.format(netAmount)}
                  strong
                />
              </div>
            </div>

            <button
              onClick={() => void handleSubmitOrder()}
              disabled={!selectedCustomerId || items.length === 0 || saving}
              className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Registrando orden..." : "Registrar orden"}
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Vista rápida
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <KpiCard title="Productos en orden" value={String(items.length)} />
              <KpiCard title="Puntos aplicados" value={String(appliedPoints)} />
              <KpiCard
                title="Monto bruto"
                value={currency.format(grossAmount)}
              />
              <KpiCard title="Monto neto" value={currency.format(netAmount)} />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-500">
          Cargando órdenes...
        </div>
      ) : null}
    </div>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={strong ? "font-semibold text-slate-900" : "text-slate-500"}>
        {label}
      </span>
      <span className={strong ? "font-semibold text-slate-900" : "text-slate-900"}>
        {value}
      </span>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
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
