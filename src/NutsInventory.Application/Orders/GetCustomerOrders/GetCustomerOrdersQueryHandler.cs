using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Application.Orders.Common;

namespace NutsInventory.Application.Orders.GetCustomerOrders;

public sealed class GetCustomerOrdersQueryHandler
    : IRequestHandler<GetCustomerOrdersQuery, List<CustomerOrderDto>>
{
    private readonly INutsDbContext _db;

    public GetCustomerOrdersQueryHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<List<CustomerOrderDto>> Handle(
        GetCustomerOrdersQuery request,
        CancellationToken cancellationToken)
    {
        var customerExists = await _db.Customers
            .AnyAsync(x => x.Id == request.CustomerId && x.IsActive, cancellationToken);

        if (!customerExists)
            throw new KeyNotFoundException("Cliente no encontrado.");

        return await _db.Orders
            .AsNoTracking()
            .Where(x => x.CustomerId == request.CustomerId)
            .OrderByDescending(x => x.OrderDate)
            .Select(x => new CustomerOrderDto(
                x.Id,
                x.OrderDate,
                x.Status.ToString(),
                x.TotalAmount,
                x.DiscountApplied,
                (int)Math.Round(x.DiscountApplied * 100m, MidpointRounding.AwayFromZero),
                x.LoyaltyPointsEarned,
                x.Notes,
                x.Items
                    .OrderBy(i => i.Id)
                    .Select(i => new CustomerOrderItemDto(
                        i.ProductId,
                        i.Product.Name,
                        i.Product.ImageUrl,
                        i.Quantity,
                        i.UnitPrice,
                        i.Subtotal
                    ))
                    .ToList()
            ))
            .ToListAsync(cancellationToken);
    }
}