using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;

namespace NutsInventory.Application.Products.DeactivateProduct;

public sealed class DeactivateProductCommandHandler : IRequestHandler<DeactivateProductCommand, Unit>
{
    private readonly INutsDbContext _db;

    public DeactivateProductCommandHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<Unit> Handle(DeactivateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _db.Products
            .FirstOrDefaultAsync(x => x.Id == request.ProductId, cancellationToken)
            ?? throw new KeyNotFoundException("Producto no encontrado.");

        product.Deactivate();
        await _db.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}