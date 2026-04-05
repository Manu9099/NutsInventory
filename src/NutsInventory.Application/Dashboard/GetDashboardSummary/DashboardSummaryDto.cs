namespace NutsInventory.Application.Dashboard.GetDashboardSummary;

public sealed record DashboardSummaryDto(
    int TotalProducts,
    int ActiveProducts,
    int LowStockProducts,
    int TotalCustomers,
    int ActiveCustomers,
    int TotalOrders,
    decimal TotalRevenue
);