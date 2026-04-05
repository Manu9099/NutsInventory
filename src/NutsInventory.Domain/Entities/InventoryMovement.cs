using NutsInventory.Domain.Common;
using NutsInventory.Domain.Enums;

namespace NutsInventory.Domain.Entities;
public class InventoryMovement : AuditableEntity
{
    private InventoryMovement() { }

    public InventoryMovement(
        int productId,
        InventoryMovementType movementType,
        int quantityChange,
        int previousQuantity,
        int newQuantity,
        string? reason)
    {
        ProductId = productId;
        MovementType = movementType;
        QuantityChange = quantityChange;
        PreviousQuantity = previousQuantity;
        NewQuantity = newQuantity;
        Reason = reason;
    }

    public int ProductId { get; private set; }
    public InventoryMovementType MovementType { get; private set; }
    public int QuantityChange { get; private set; }
    public string? Reason { get; private set; }
    public int PreviousQuantity { get; private set; }
    public int NewQuantity { get; private set; }
}