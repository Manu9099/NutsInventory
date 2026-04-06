import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, Truck } from 'lucide-react';
import { useCart } from '../../features/cart/hooks/useCart';
import { useCreateOrder } from '../../features/orders/hooks/useCreateOrder';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { mutateAsync, isPending } = useCreateOrder();

  const [notes, setNotes] = useState('');
  const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState('0');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [address, setAddress] = useState('');
  const [department, setDepartment] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [reference, setReference] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const shipping = items.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const validateForm = () => {
    if (!firstName.trim()) return 'Ingresa los nombres.';
    if (!lastName.trim()) return 'Ingresa los apellidos.';
    if (!email.trim()) return 'Ingresa el correo electrónico.';
    if (!phone.trim()) return 'Ingresa el teléfono.';
    if (!address.trim()) return 'Ingresa la dirección.';
    if (!department.trim()) return 'Ingresa el departamento.';
    if (!province.trim()) return 'Ingresa la provincia.';
    if (!district.trim()) return 'Ingresa el distrito.';
    return '';
  };

  const handlePlaceOrder = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('No hay productos en el carrito.');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      const parsedPoints = Number(loyaltyPointsToRedeem || 0);

      // TODO: reemplazar por customerId resuelto desde la sesión del cliente autenticado
      const resolvedCustomerId = 1;

      const composedNotes = [
        notes.trim(),
        `Cliente: ${firstName} ${lastName}`,
        `Email: ${email}`,
        `Teléfono: ${phone}`,
        `Dirección: ${address}, ${district}, ${province}, ${department}`,
        reference.trim() ? `Referencia: ${reference}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      const response = await mutateAsync({
        customerId: resolvedCustomerId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        loyaltyPointsToRedeem: Number.isNaN(parsedPoints) ? 0 : parsedPoints,
        notes: composedNotes,
      });

      setSuccessMessage(
        `Pedido #${response.orderId} creado correctamente. Total neto: S/ ${Number(
          response.netAmount
        ).toFixed(2)}`
      );

      clearCart();

      setTimeout(() => {
        navigate('/orders');
      }, 1200);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          'No se pudo crear la orden.'
      );
    }
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-12">
        <Link
          to="/cart"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al carrito
        </Link>

        <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
          <h1 className="text-2xl font-bold tracking-tight">No hay productos para pagar</h1>
          <p className="mt-3 text-stone-600">
            Tu carrito está vacío. Agrega productos antes de continuar al checkout.
          </p>

          <Link
            to="/catalog"
            className="mt-6 inline-flex rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Ir al catálogo
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <Link
        to="/cart"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al carrito
      </Link>

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Compra
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="mt-2 text-stone-600">
          Completa tus datos para finalizar la compra.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <div className="mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-stone-700" />
              <h2 className="text-xl font-semibold text-stone-900">
                Información de contacto
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Nombres
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Luciana"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Apellidos
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Pérez"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="999 999 999"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-stone-700" />
              <h2 className="text-xl font-semibold text-stone-900">
                Dirección de envío
              </h2>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Dirección
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Av. Ejemplo 123"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">
                    Departamento
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Lima"
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">
                    Provincia
                  </label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="Lima"
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">
                    Distrito
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Miraflores"
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Referencia
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Frente al parque / edificio azul"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Notas del pedido
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Indicaciones adicionales para la orden"
                  rows={4}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-stone-700" />
              <h2 className="text-xl font-semibold text-stone-900">
                Método de pago
              </h2>
            </div>

            <div className="grid gap-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-stone-200 p-4 transition hover:bg-stone-50">
                <input type="radio" name="paymentMethod" defaultChecked className="mt-1" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">Tarjeta</p>
                  <p className="mt-1 text-sm text-stone-600">
                    Visual por ahora. La orden real ya se crea en backend.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-stone-200 p-4 transition hover:bg-stone-50">
                <input type="radio" name="paymentMethod" className="mt-1" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    Pago contra entrega
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    Útil para la demo mientras luego integras pagos reales.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Puntos a canjear
              </label>
              <input
                type="number"
                min={0}
                value={loyaltyPointsToRedeem}
                onChange={(e) => setLoyaltyPointsToRedeem(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
              />
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-2xl border border-lime-200 bg-lime-50 p-4 text-sm text-lime-700">
              {successMessage}
            </div>
          ) : null}
        </div>

        <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-xl font-semibold text-stone-900">Resumen final</h2>

          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-stone-900">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    {item.quantity} x S/ {item.price.toFixed(2)}
                  </p>
                </div>

                <p className="text-sm font-semibold text-stone-900">
                  S/ {(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 text-sm text-stone-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Envío</span>
              <span>S/ {shipping.toFixed(2)}</span>
            </div>
          </div>

          <div className="my-5 h-px bg-stone-200" />

          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-stone-900">Total visual</span>
            <span className="text-2xl font-bold text-stone-900">
              S/ {total.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isPending}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {isPending ? 'Creando orden...' : 'Confirmar pedido'}
          </button>

          <p className="mt-3 text-xs text-stone-500">
            La orden se crea en backend. El identificador interno del cliente no se expone en la UI.
          </p>
        </aside>
      </div>
    </section>
  );
}