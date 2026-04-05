namespace NutsInventory.Application.Dashboard.Common;

public sealed record MonthlySalesTrendDto(
    int Year,
    int Month,
    int TotalQuantity,
    decimal TotalRevenue
);