using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;

namespace NutsInventory.Application.Products.ReactivateProduct;

public sealed class ReactivateProductCommandHandler : IRequestHandler<ReactivateProductCommand, Unit>
{
    private readonly INutsDbContext _db;

    public ReactivateProductCommandHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<Unit> Handle(ReactivateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _db.Products
            .FirstOrDefaultAsync(x => x.Id == request.ProductId, cancellationToken)
            ?? throw new KeyNotFoundException("Producto no encontrado.");

        product.Reactivate();
        await _db.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}