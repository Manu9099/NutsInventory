import { useEffect, useMemo, useState } from "react";
import {
  createCustomer,
  getCustomerLoyaltySummary,
  getCustomerTransactions,
  getCustomers,
  type CreateCustomerRequest,
  type Customer,
  type CustomerLoyaltySummary,
  type LoyaltyTransaction,
} from "./api";
import { CustomerFormModal } from "./components/customer-form-modal";
import { CustomersTable } from "./components/customers-table";
import { LoyaltyTransactionsModal } from "./components/loyalty-transactions-modal";

export function CustomersPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [formOpen, setFormOpen] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [summary, setSummary] = useState<CustomerLoyaltySummary | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);

  const loadData = async () => {
    try {
      setError("");
      const data = await getCustomers(search);
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar clientes.");
    }
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    };

    void run();
  }, [search]);

  const activeCount = useMemo(
    () => customers.filter((c) => c.isActive).length,
    [customers]
  );

  const vipCount = useMemo(
    () =>
      customers.filter((c) =>
        ["gold", "platinum"].includes(c.tier.toLowerCase())
      ).length,
    [customers]
  );

  const totalPoints = useMemo(
    () => customers.reduce((acc, customer) => acc + customer.loyaltyPoints, 0),
    [customers]
  );

  const handleCreateCustomer = async (payload: CreateCustomerRequest) => {
    try {
      setSaving(true);
      setError("");
      await createCustomer(payload);
      setFormOpen(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el cliente.");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenLoyalty = async (customer: Customer) => {
    try {
      setDetailsLoading(true);
      setError("");
      setSelectedCustomer(customer);
      setDetailsOpen(true);

      const [summaryData, transactionsData] = await Promise.all([
        getCustomerLoyaltySummary(customer.id),
        getCustomerTransactions(customer.id),
      ]);

      setSummary(summaryData);
      setTransactions(transactionsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar la información de fidelización."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Clientes
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Administra la base de clientes y revisa su comportamiento de
              fidelización.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-slate-400 md:w-80"
              placeholder="Buscar por nombre, email o ciudad"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSearch(searchInput);
              }}
            />
            <button
              onClick={() => setSearch(searchInput)}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Buscar
            </button>
            <button
              onClick={() => setFormOpen(true)}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Nuevo cliente
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
        <KpiCard title="Clientes visibles" value={String(customers.length)} />
        <KpiCard title="Activos" value={String(activeCount)} />
        <KpiCard title="Gold + Platinum" value={String(vipCount)} />
        <KpiCard title="Puntos totales" value={String(totalPoints)} />
      </div>

      <div>
        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-500">
            Cargando clientes...
          </div>
        ) : (
          <CustomersTable
            customers={customers}
            onViewLoyalty={(customer) => void handleOpenLoyalty(customer)}
          />
        )}
      </div>

      <CustomerFormModal
        open={formOpen}
        loading={saving}
        onClose={() => {
          if (saving) return;
          setFormOpen(false);
        }}
        onSubmit={handleCreateCustomer}
      />

      <LoyaltyTransactionsModal
        open={detailsOpen}
        customer={selectedCustomer}
        summary={summary}
        transactions={transactions}
        loading={detailsLoading}
        onClose={() => {
          if (detailsLoading) return;
          setDetailsOpen(false);
          setSelectedCustomer(null);
          setSummary(null);
          setTransactions([]);
        }}
      />
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}