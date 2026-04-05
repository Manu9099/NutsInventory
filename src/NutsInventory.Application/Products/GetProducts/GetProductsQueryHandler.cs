using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Application.Products.Common;

namespace NutsInventory.Application.Products.GetProducts;

public sealed class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, IReadOnlyList<ProductDto>>
{
    private readonly INutsDbContext _db;

    public GetProductsQueryHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Products.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim().ToLower();
            query = query.Where(x =>
                x.Name.ToLower().Contains(search) ||
                x.Sku.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            var category = request.Category.Trim().ToLower();
            query = query.Where(x => x.Category.ToLower() == category);
        }

        if (request.IsActive.HasValue)
        {
            query = query.Where(x => x.IsActive == request.IsActive.Value);
        }

        return await query
            .OrderBy(x => x.Name)
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