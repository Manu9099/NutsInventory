import { useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deactivateProduct,
  getLowStockProducts,
  getProducts,
  reactivateProduct,
  restockProduct,
  updateProduct,
  type CreateProductRequest,
  type Product,
  type UpdateProductRequest,
} from "./api";
import { ProductFormModal } from "./components/product-form-modal";
import { ProductsTable } from "./components/products-table";
import { RestockModal } from "./components/restock-modal";

export function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStock, setLowStock] = useState<Product[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [restockOpen, setRestockOpen] = useState(false);
  const [restockProductTarget, setRestockProductTarget] = useState<Product | null>(null);

  const loadData = async () => {
    try {
      setError("");

      const [productsData, lowStockData] = await Promise.all([
        getProducts(search),
        getLowStockProducts(),
      ]);

      setProducts(productsData);
      setLowStock(lowStockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar productos.");
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
    () => products.filter((p) => p.isActive).length,
    [products]
  );

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleSubmitForm = async (
    payload: CreateProductRequest | UpdateProductRequest
  ) => {
    try {
      setSaving(true);
      setError("");

      if (formMode === "create") {
        await createProduct(payload as CreateProductRequest);
      } else if (selectedProduct) {
        await updateProduct(selectedProduct.id, payload as UpdateProductRequest);
      }

      setFormOpen(false);
      setSelectedProduct(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el producto.");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenRestock = (product: Product) => {
    setRestockProductTarget(product);
    setRestockOpen(true);
  };

  const handleSubmitRestock = async (payload: {
    quantity: number;
    reason?: string | null;
  }) => {
    if (!restockProductTarget) return;

    try {
      setSaving(true);
      setError("");

      await restockProduct(restockProductTarget.id, payload);

      setRestockOpen(false);
      setRestockProductTarget(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo aplicar el restock.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      setSaving(true);
      setError("");

      if (product.isActive) {
        await deactivateProduct(product.id);
      } else {
        await reactivateProduct(product.id);
      }

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo cambiar el estado del producto."
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
              Productos
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Administra catálogo, stock, activación e inventario operativo.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-slate-400 md:w-80"
              placeholder="Buscar por nombre, SKU o categoría"
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
              onClick={handleOpenCreate}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Nuevo producto
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard title="Productos visibles" value={String(products.length)} />
        <KpiCard title="Productos activos" value={String(activeCount)} />
        <KpiCard title="Low stock" value={String(lowStock.length)} danger={lowStock.length > 0} />
      </div>

      <div>
        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-500">
            Cargando productos...
          </div>
        ) : (
          <ProductsTable
            products={products}
            onEdit={handleOpenEdit}
            onRestock={handleOpenRestock}
            onToggleActive={(product) => void handleToggleActive(product)}
          />
        )}
      </div>

      <ProductFormModal
        open={formOpen}
        mode={formMode}
        product={selectedProduct}
        loading={saving}
        onClose={() => {
          if (saving) return;
          setFormOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleSubmitForm}
      />

      <RestockModal
        open={restockOpen}
        product={restockProductTarget}
        loading={saving}
        onClose={() => {
          if (saving) return;
          setRestockOpen(false);
          setRestockProductTarget(null);
        }}
        onSubmit={handleSubmitRestock}
      />
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