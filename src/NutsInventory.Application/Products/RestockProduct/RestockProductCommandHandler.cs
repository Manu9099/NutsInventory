using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Domain.Entities;
using NutsInventory.Domain.Enums;

namespace NutsInventory.Application.Products.RestockProduct;

public sealed class RestockProductCommandHandler : IRequestHandler<RestockProductCommand, Unit>
{
    private readonly INutsDbContext _db;

    public RestockProductCommandHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<Unit> Handle(RestockProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _db.Products.FirstOrDefaultAsync(x => x.Id == request.ProductId, cancellationToken)
            ?? throw new KeyNotFoundException("Producto no encontrado.");

        var previousQty = product.StockQuantity;
        product.IncreaseStock(request.Quantity);

        _db.InventoryMovements.Add(new InventoryMovement(
            product.Id,
            InventoryMovementType.Restock,
            request.Quantity,
            previousQty,
            product.StockQuantity,
            request.Reason ?? "Reposición manual de stock"
        ));

        await _db.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}