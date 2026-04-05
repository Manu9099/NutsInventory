using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Application.Dashboard.Common;

namespace NutsInventory.Application.Dashboard.GetTopSellers;

public sealed class GetTopSellersQueryHandler
    : IRequestHandler<GetTopSellersQuery, IReadOnlyList<TopSellerDto>>
{
    private readonly INutsDbContext _db;

    public GetTopSellersQueryHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<TopSellerDto>> Handle(
        GetTopSellersQuery request,
        CancellationToken cancellationToken)
    {
        var month = request.Month ?? DateTime.UtcNow.Month;
        var year = request.Year ?? DateTime.UtcNow.Year;
        var limit = request.Limit <= 0 ? 5 : Math.Min(request.Limit, 20);

        var data = await (
            from metric in _db.SalesMetrics.AsNoTracking()
            join product in _db.Products.AsNoTracking()
                on metric.ProductId equals product.Id
            where metric.Month == month && metric.Year == year
            orderby metric.QuantitySold descending, metric.Revenue descending
            select new
            {
                product.Id,
                product.Name,
                product.Category,
                metric.QuantitySold,
                metric.Revenue
            })
            .Take(limit)
            .ToListAsync(cancellationToken);

        return data
            .Select((x, index) => new TopSellerDto(
                x.Id,
                x.Name,
                x.Category,
                x.QuantitySold,
                x.Revenue,
                index + 1
            ))
            .ToList();
    }
}