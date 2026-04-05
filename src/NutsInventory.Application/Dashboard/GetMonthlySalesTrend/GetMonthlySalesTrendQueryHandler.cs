using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Application.Dashboard.Common;

namespace NutsInventory.Application.Dashboard.GetMonthlySalesTrend;

public sealed class GetMonthlySalesTrendQueryHandler
    : IRequestHandler<GetMonthlySalesTrendQuery, IReadOnlyList<MonthlySalesTrendDto>>
{
    private readonly INutsDbContext _db;

    public GetMonthlySalesTrendQueryHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<MonthlySalesTrendDto>> Handle(
        GetMonthlySalesTrendQuery request,
        CancellationToken cancellationToken)
    {
        var months = request.Months <= 0 ? 12 : Math.Min(request.Months, 24);

        var data = await _db.SalesMetrics
            .AsNoTracking()
            .GroupBy(x => new { x.Year, x.Month })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Month,
                TotalQuantity = g.Sum(x => x.QuantitySold),
                TotalRevenue = g.Sum(x => x.Revenue)
            })
            .OrderByDescending(x => x.Year)
            .ThenByDescending(x => x.Month)
            .Take(months)
            .ToListAsync(cancellationToken);

        return data
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .Select(x => new MonthlySalesTrendDto(
                x.Year,
                x.Month,
                x.TotalQuantity,
                x.TotalRevenue
            ))
            .ToList();
    }
}