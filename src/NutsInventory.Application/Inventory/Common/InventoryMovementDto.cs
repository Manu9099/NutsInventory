namespace NutsInventory.Application.Inventory.Common;

public sealed record InventoryMovementDto(
    int Id,
    int ProductId,
    string ProductName,
    string MovementType,
    int QuantityChange,
    int PreviousQuantity,
    int NewQuantity,
    string? Reason,
    DateTime CreatedAt
);