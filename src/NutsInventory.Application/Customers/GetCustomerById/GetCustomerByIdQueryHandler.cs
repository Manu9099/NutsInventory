using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Application.Customers.Common;

namespace NutsInventory.Application.Customers.GetCustomerById;

public sealed class GetCustomerByIdQueryHandler : IRequestHandler<GetCustomerByIdQuery, CustomerDto?>
{
    private readonly INutsDbContext _db;

    public GetCustomerByIdQueryHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<CustomerDto?> Handle(GetCustomerByIdQuery request, CancellationToken cancellationToken)
    {
        return await _db.Customers
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .Select(x => new CustomerDto(
                x.Id,
                x.Email,
                x.FirstName,
                x.LastName,
                x.Phone,
                x.City,
                x.Address,
                x.RegisteredAt,
                x.LastPurchaseDate,
                x.TotalSpent,
                x.TotalPurchases,
                x.LoyaltyPoints,
                x.Tier.ToString(),
                x.IsActive
            ))
            .FirstOrDefaultAsync(cancellationToken);
    }
}