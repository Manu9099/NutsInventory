import type { Product } from "../api";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

export function ProductsTable({
  products,
  onEdit,
  onRestock,
  onToggleActive,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
  onRestock: (product: Product) => void;
  onToggleActive: (product: Product) => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-5 py-4 font-medium">Producto</th>
              <th className="px-5 py-4 font-medium">SKU</th>
              <th className="px-5 py-4 font-medium">Precio</th>
              <th className="px-5 py-4 font-medium">Stock</th>
              <th className="px-5 py-4 font-medium">Estado</th>
              <th className="px-5 py-4 font-medium">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const isLowStock = product.stockQuantity <= product.reorderLevel;

              return (
                <tr
                  key={product.id}
                  className="border-t border-slate-200 align-top transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <div className="-max-w-[280px]">
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {product.category}
                      </p>
                      {product.description ? (
                        <p className="mt-2 line-clamp-1 text-xs text-slate-400">
                          {product.description}
                        </p>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-700">{product.sku}</td>

                  <td className="px-5 py-4 font-medium text-slate-900">
                    {currency.format(product.price)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900">
                        {product.stockQuantity} unidades
                      </p>
                      <p className="text-xs text-slate-500">
                        mínimo {product.reorderLevel}
                      </p>
                      {isLowStock ? (
                        <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                          Low stock
                        </span>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                        product.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-700",
                      ].join(" ")}
                    >
                      {product.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => onRestock(product)}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        Restock
                      </button>

                      <button
                        onClick={() => onToggleActive(product)}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        {product.isActive ? "Desactivar" : "Reactivar"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}