namespace NutsInventory.Application.Dashboard.Common;

public sealed record TopSellerDto(
    int ProductId,
    string ProductName,
    string Category,
    int QuantitySold,
    decimal Revenue,
    int Rank
);