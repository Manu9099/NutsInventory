namespace NutsInventory.Application.Orders.Common;

public sealed record CustomerOrderItemDto(
    int ProductId,
    string ProductName,
    string? ImageUrl,
    int Quantity,
    decimal UnitPrice,
    decimal Subtotal
);

public sealed record CustomerOrderDto(
    int Id,
    DateTime OrderDate,
    string Status,
    decimal TotalAmount,
    decimal DiscountApplied,
    int LoyaltyPointsEarned,
    string? Notes,
    IReadOnlyList<CustomerOrderItemDto> Items
);