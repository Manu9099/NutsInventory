namespace NutsInventory.Application.Customers.Common;

public sealed record CustomerDto(
    int Id,
    string Email,
    string FirstName,
    string LastName,
    string? Phone,
    string? City,
    string? Address,
    DateTime RegisteredAt,
    DateTime? LastPurchaseDate,
    decimal TotalSpent,
    int TotalPurchases,
    int LoyaltyPoints,
    string Tier,
    bool IsActive
);