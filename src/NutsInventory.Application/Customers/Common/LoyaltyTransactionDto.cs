namespace NutsInventory.Application.Customers.Common;

public sealed record LoyaltyTransactionDto(
    int Id,
    int CustomerId,
    int PointsAdded,
    string Reason,
    int? OrderId,
    DateTime CreatedAt
);