using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Application.Inventory.Common;

namespace NutsInventory.Application.Inventory.GetInventoryMovements;

public sealed class GetInventoryMovementsQueryHandler
    : IRequestHandler<GetInventoryMovementsQuery, IReadOnlyList<InventoryMovementDto>>
{
    private readonly INutsDbContext _db;

    public GetInventoryMovementsQueryHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<InventoryMovementDto>> Handle(
        GetInventoryMovementsQuery request,
        CancellationToken cancellationToken)
    {
        var limit = request.Limit <= 0 ? 50 : Math.Min(request.Limit, 200);

        var query =
            from movement in _db.InventoryMovements.AsNoTracking()
            join product in _db.Products.AsNoTracking()
                on movement.ProductId equals product.Id
            select new
            {
                movement.Id,
                movement.ProductId,
                ProductName = product.Name,
                movement.MovementType,
                movement.QuantityChange,
                movement.PreviousQuantity,
                movement.NewQuantity,
                movement.Reason,
                movement.CreatedAt
            };

        if (request.ProductId.HasValue)
        {
            query = query.Where(x => x.ProductId == request.ProductId.Value);
        }

        var data = await query
            .OrderByDescending(x => x.CreatedAt)
            .Take(limit)
            .ToListAsync(cancellationToken);

        return data
            .Select(x => new InventoryMovementDto(
                x.Id,
                x.ProductId,
                x.ProductName,
                x.MovementType.ToString(),
                x.QuantityChange,
                x.PreviousQuantity,
                x.NewQuantity,
                x.Reason,
                x.CreatedAt
            ))
            .ToList();
    }
}