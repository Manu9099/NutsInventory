using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Domain.Enums;

namespace NutsInventory.Application.Dashboard.GetDashboardSummary;

public sealed class GetDashboardSummaryQueryHandler
    : IRequestHandler<GetDashboardSummaryQuery, DashboardSummaryDto>
{
    private readonly INutsDbContext _db;

    public GetDashboardSummaryQueryHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<DashboardSummaryDto> Handle(
        GetDashboardSummaryQuery request,
        CancellationToken cancellationToken)
    {
        var totalProducts = await _db.Products.CountAsync(cancellationToken);
        var activeProducts = await _db.Products.CountAsync(x => x.IsActive, cancellationToken);
        var lowStockProducts = await _db.Products.CountAsync(
            x => x.IsActive && x.StockQuantity <= x.ReorderLevel,
            cancellationToken);

        var totalCustomers = await _db.Customers.CountAsync(cancellationToken);
        var activeCustomers = await _db.Customers.CountAsync(x => x.IsActive, cancellationToken);

        var totalOrders = await _db.Orders.CountAsync(
            x => x.Status != OrderStatus.Cancelled,
            cancellationToken);

        var totalRevenue = await _db.Orders
            .Where(x => x.Status != OrderStatus.Cancelled)
            .SumAsync(x => (decimal?)x.TotalAmount, cancellationToken) ?? 0m;

        return new DashboardSummaryDto(
            totalProducts,
            activeProducts,
            lowStockProducts,
            totalCustomers,
            activeCustomers,
            totalOrders,
            totalRevenue
        );
    }
}