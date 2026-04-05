import { useEffect, useState } from "react";
import type { CreateProductRequest, Product, UpdateProductRequest } from "../api";

type ProductFormValues = {
  name: string;
  sku: string;
  description: string;
  price: string;
  stockQuantity: string;
  reorderLevel: string;
  category: string;
  weight: string;
  imageUrl: string;
};

const emptyForm: ProductFormValues = {
  name: "",
  sku: "",
  description: "",
  price: "",
  stockQuantity: "",
  reorderLevel: "",
  category: "",
  weight: "",
  imageUrl: "",
};

export function ProductFormModal({
  open,
  mode,
  product,
  loading,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  product: Product | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateProductRequest | UpdateProductRequest) => Promise<void>;
}) {
  const [form, setForm] = useState<ProductFormValues>(emptyForm);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && product) {
      setForm({
        name: product.name,
        sku: product.sku,
        description: product.description ?? "",
        price: String(product.price),
        stockQuantity: String(product.stockQuantity),
        reorderLevel: String(product.reorderLevel),
        category: product.category,
        weight: String(product.weight),
        imageUrl: product.imageUrl ?? "",
      });
      return;
    }

    setForm(emptyForm);
  }, [open, mode, product]);

  if (!open) return null;

  const updateField = (field: keyof ProductFormValues, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "create") {
      await onSubmit({
        name: form.name.trim(),
        sku: form.sku.trim(),
        description: form.description.trim() || null,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        reorderLevel: Number(form.reorderLevel),
        category: form.category.trim(),
        weight: Number(form.weight),
        imageUrl: form.imageUrl.trim() || null,
      });
      return;
    }

    await onSubmit({
      name: form.name.trim(),
      sku: form.sku.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      reorderLevel: Number(form.reorderLevel),
      category: form.category.trim(),
      weight: Number(form.weight),
      imageUrl: form.imageUrl.trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {mode === "create" ? "Nuevo producto" : "Editar producto"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Completa la información del catálogo.
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
            <Field label="Nombre">
              <input
                className="h-11 w-full rounded-xl border border-slate-200 px-3"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </Field>

            <Field label="SKU">
              <input
                className="h-11 w-full rounded-xl border border-slate-200 px-3"
                value={form.sku}
                onChange={(e) => updateField("sku", e.target.value)}
                required
              />
            </Field>

            <Field label="Categoría">
              <input
                className="h-11 w-full rounded-xl border border-slate-200 px-3"
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                required
              />
            </Field>

            <Field label="Precio">
              <input
                type="number"
                step="0.01"
                min="0"
                className="h-11 w-full rounded-xl border border-slate-200 px-3"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                required
              />
            </Field>

            {mode === "create" ? (
              <Field label="Stock inicial">
                <input
                  type="number"
                  min="0"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3"
                  value={form.stockQuantity}
                  onChange={(e) => updateField("stockQuantity", e.target.value)}
                  required
                />
              </Field>
            ) : null}

            <Field label="Reorder level">
              <input
                type="number"
                min="0"
                className="h-11 w-full rounded-xl border border-slate-200 px-3"
                value={form.reorderLevel}
                onChange={(e) => updateField("reorderLevel", e.target.value)}
                required
              />
            </Field>

            <Field label="Peso (kg)">
              <input
                type="number"
                step="0.001"
                min="0"
                className="h-11 w-full rounded-xl border border-slate-200 px-3"
                value={form.weight}
                onChange={(e) => updateField("weight", e.target.value)}
                required
              />
            </Field>

            <Field label="Image URL">
              <input
                className="h-11 w-full rounded-xl border border-slate-200 px-3"
                value={form.imageUrl}
                onChange={(e) => updateField("imageUrl", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Descripción">
            <textarea
              className="-min-h-[110px] w-full rounded-2xl border border-slate-200 p-3"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </Field>

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
              {loading
                ? "Guardando..."
                : mode === "create"
                ? "Crear producto"
                : "Guardar cambios"}
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