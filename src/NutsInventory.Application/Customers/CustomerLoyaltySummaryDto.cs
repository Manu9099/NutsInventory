namespace NutsInventory.Application.Customers.Common;

public sealed record CustomerLoyaltySummaryDto(
    int CustomerId,
    string FullName,
    string Email,
    int LoyaltyPoints,
    string Tier,
    decimal TotalSpent,
    int TotalPurchases,
    DateTime? LastPurchaseDate
);