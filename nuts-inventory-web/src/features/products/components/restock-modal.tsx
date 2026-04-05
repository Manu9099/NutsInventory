import { useEffect, useState } from "react";
import type { Product } from "../api";

export function RestockModal({
  open,
  product,
  loading,
  onClose,
  onSubmit,
}: {
  open: boolean;
  product: Product | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: { quantity: number; reason?: string | null }) => Promise<void>;
}) {
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) return;
    setQuantity("1");
    setReason("");
  }, [open]);

  if (!open || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      quantity: Number(quantity),
      reason: reason.trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Restock</h2>
            <p className="mt-1 text-sm text-slate-500">{product.name}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Cantidad</span>
            <input
              type="number"
              min="1"
              className="h-11 w-full rounded-xl border border-slate-200 px-3"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Motivo</span>
            <textarea
              className="-min-h-[110px] w-full rounded-2xl border border-slate-200 p-3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Compra a proveedor, corrección de stock, etc."
            />
          </label>

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
              {loading ? "Guardando..." : "Aplicar restock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}