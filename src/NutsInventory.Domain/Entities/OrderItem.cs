using NutsInventory.Domain.Common;
using NutsInventory.Domain.Enums;

namespace NutsInventory.Domain.Entities;
public class OrderItem : AuditableEntity
{
    private OrderItem() { }

    public OrderItem(int productId, int quantity, decimal unitPrice)
    {
        ProductId = productId;
        Quantity = quantity;
        UnitPrice = unitPrice;
        Subtotal = quantity * unitPrice;
    }

    public int OrderId { get; private set; }
    public Order Order { get; private set; } = default!;

    public int ProductId { get; private set; }
    public Product Product { get; private set; } = default!;

    public int Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }
    public decimal Subtotal { get; private set; }
}