using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Application.Customers.Common;

namespace NutsInventory.Application.Customers.GetCustomers;

public sealed class GetCustomersQueryHandler : IRequestHandler<GetCustomersQuery, IReadOnlyList<CustomerDto>>
{
    private readonly INutsDbContext _db;

    public GetCustomersQueryHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<CustomerDto>> Handle(GetCustomersQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Customers.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim().ToLower();
            query = query.Where(x =>
                x.FirstName.ToLower().Contains(search) ||
                x.LastName.ToLower().Contains(search) ||
                x.Email.ToLower().Contains(search));
        }

        if (request.IsActive.HasValue)
        {
            query = query.Where(x => x.IsActive == request.IsActive.Value);
        }

        return await query
            .OrderBy(x => x.FirstName)
            .ThenBy(x => x.LastName)
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
            .ToListAsync(cancellationToken);
    }
}