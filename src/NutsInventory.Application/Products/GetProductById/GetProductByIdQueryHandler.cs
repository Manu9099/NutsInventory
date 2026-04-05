using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Application.Products.Common;

namespace NutsInventory.Application.Products.GetProductById;

public sealed class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto?>
{
    private readonly INutsDbContext _db;

    public GetProductByIdQueryHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<ProductDto?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        return await _db.Products
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
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
            .FirstOrDefaultAsync(cancellationToken);
    }
}