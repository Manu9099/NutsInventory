using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Application.Products.Common;

namespace NutsInventory.Application.Products.GetLowStockProducts;

public sealed class GetLowStockProductsQueryHandler
    : IRequestHandler<GetLowStockProductsQuery, IReadOnlyList<ProductDto>>
{
    private readonly INutsDbContext _db;

    public GetLowStockProductsQueryHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<ProductDto>> Handle(
        GetLowStockProductsQuery request,
        CancellationToken cancellationToken)
    {
        return await _db.Products
            .AsNoTracking()
            .Where(x => x.IsActive && x.StockQuantity <= x.ReorderLevel)
            .OrderBy(x => x.StockQuantity)
            .ThenBy(x => x.Name)
            .Select(x => new ProductDto(
                x.Id,
                x.Name,
                x.Sku,
                x.Description,
                x.Price,
                x.StockQuantity,
                x.ReorderLevel,
                x.Category,
                x.Weight,
                x.ImageUrl,
                x.IsActive
            ))
            .ToListAsync(cancellationToken);
    }
}