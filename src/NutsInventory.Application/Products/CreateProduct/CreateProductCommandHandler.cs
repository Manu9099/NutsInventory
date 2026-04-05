using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Application.Products.Common;
using NutsInventory.Domain.Entities;

namespace NutsInventory.Application.Products.CreateProduct;

public sealed class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ProductDto>
{
    private readonly INutsDbContext _db;

    public CreateProductCommandHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var skuExists = await _db.Products.AnyAsync(x => x.Sku == request.Sku, cancellationToken);
        if (skuExists)
            throw new InvalidOperationException("Ya existe un producto con ese SKU.");

        var product = new Product(
            request.Name,
            request.Sku,
            request.Category,
            request.Price,
            request.StockQuantity,
            request.ReorderLevel,
            request.Weight,
            request.Description,
            request.ImageUrl
        );

        _db.Products.Add(product);
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