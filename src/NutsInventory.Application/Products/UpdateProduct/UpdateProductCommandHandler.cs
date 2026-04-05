using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Application.Products.Common;

namespace NutsInventory.Application.Products.UpdateProduct;

public sealed class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, ProductDto>
{
    private readonly INutsDbContext _db;

    public UpdateProductCommandHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<ProductDto> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _db.Products
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException("Producto no encontrado.");

        var skuInUse = await _db.Products.AnyAsync(
            x => x.Sku == request.Sku && x.Id != request.Id,
            cancellationToken);

        if (skuInUse)
            throw new InvalidOperationException("Ya existe otro producto con ese SKU.");

        product.UpdateDetails(
            request.Name,
            request.Sku,
            request.Category,
            request.Price,
            request.ReorderLevel,
            request.Weight,
            request.Description,
            request.ImageUrl
        );

        await _db.SaveChangesAsync(cancellationToken);

        return new ProductDto(
            product.Id,
            product.Name,
            product.Sku,
            product.Description,
            product.Price,
            product.StockQuantity,
            product.ReorderLevel,
            product.Category,
            product.Weight,
            product.ImageUrl,
            product.IsActive
        );
    }
}