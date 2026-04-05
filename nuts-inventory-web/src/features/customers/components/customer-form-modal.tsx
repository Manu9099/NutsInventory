import { useEffect, useState } from "react";
import type { CreateCustomerRequest } from "../api";

type CustomerFormValues = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  address: string;
};

const emptyForm: CustomerFormValues = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  city: "",
  address: "",
};

export function CustomerFormModal({
  open,
  loading,
  onClose,
  onSubmit,
}: {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCustomerRequest) => Promise<void>;
}) {
  const [form, setForm] = useState<CustomerFormValues>(emptyForm);

  useEffect(() => {
    if (!open) return;
    setForm(emptyForm);
  }, [open]);

  if (!open) return null;

  const updateField = (field: keyof CustomerFormValues, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      email: form.email.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim() || null,
      city: form.city.trim() || null,
      address: form.address.trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Nuevo cliente</h2>
            <p className="mt-1 text-sm text-slate-500">
              Registra un cliente para compras y fidelización.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nombres">
              <input
                className="h-11 w-full rounded-xl border border-slate-200 px-3"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                required
              />
            </Field>

            <Field label="Apellidos">
              <input
                className="h-11 w-full rounded-xl border border-slate-200 px-3"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                required
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                className="h-11 w-full rounded-xl border border-slate-200 px-3"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </Field>

            <Field label="Teléfono">
              <input
                className="h-11 w-full rounded-xl border border-slate-200 px-3"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </Field>

            <Field label="Ciudad">
              <input
                className="h-11 w-full rounded-xl border border-slate-200 px-3"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
            </Field>

            <Field label="Dirección">
              <input
                className="h-11 w-full rounded-xl border border-slate-200 px-3"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              {loading ? "Guardando..." : "Crear cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
