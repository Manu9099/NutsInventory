using NutsInventory.Domain.Common;
using NutsInventory.Domain.Enums;

namespace NutsInventory.Domain.Entities;

public class Order : AuditableEntity
{
    private readonly List<OrderItem> _items = new();
    private Order() { }

    public Order(int customerId, string? notes = null)
    {
        CustomerId = customerId;
        Notes = notes;
        Status = OrderStatus.Pending;
    }

    public int CustomerId { get; private set; }
    public Customer Customer { get; private set; } = default!;

    public decimal TotalAmount { get; private set; }
    public OrderStatus Status { get; private set; }
    public DateTime OrderDate { get; private set; } = DateTime.UtcNow;
    public DateTime? CompletedDate { get; private set; }
    public decimal DiscountApplied { get; private set; }
    public int LoyaltyPointsEarned { get; private set; }
    public string? Notes { get; private set; }

    public IReadOnlyCollection<OrderItem> Items => _items;

    public void AddItem(int productId, int quantity, decimal unitPrice)
    {
        if (quantity <= 0) throw new ArgumentException("Cantidad inválida.");
        if (unitPrice <= 0) throw new ArgumentException("Precio inválido.");

        _items.Add(new OrderItem(productId, quantity, unitPrice));
    }

    public void FinalizeTotals(decimal discountApplied, int loyaltyPointsEarned)
    {
        DiscountApplied = discountApplied;
        LoyaltyPointsEarned = loyaltyPointsEarned;
        TotalAmount = _items.Sum(x => x.Subtotal) - discountApplied;

        if (TotalAmount <= 0)
            throw new InvalidOperationException("El total final debe ser mayor a 0.");
    }

    public void Confirm()
    {
        Status = OrderStatus.Confirmed;
        Touch();
    }

    public void Complete()
    {
        Status = OrderStatus.Completed;
        CompletedDate = DateTime.UtcNow;
        Touch();
    }
}