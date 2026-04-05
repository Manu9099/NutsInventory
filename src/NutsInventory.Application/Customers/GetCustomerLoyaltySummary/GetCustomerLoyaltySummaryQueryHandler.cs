using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Application.Customers.Common;

namespace NutsInventory.Application.Customers.GetCustomerLoyaltySummary;

public sealed class GetCustomerLoyaltySummaryQueryHandler
    : IRequestHandler<GetCustomerLoyaltySummaryQuery, CustomerLoyaltySummaryDto>
{
    private readonly INutsDbContext _db;

    public GetCustomerLoyaltySummaryQueryHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<CustomerLoyaltySummaryDto> Handle(
        GetCustomerLoyaltySummaryQuery request,
        CancellationToken cancellationToken)
    {
        var customer = await _db.Customers
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.CustomerId, cancellationToken)
            ?? throw new KeyNotFoundException("Cliente no encontrado.");

        return new CustomerLoyaltySummaryDto(
            customer.Id,
            $"{customer.FirstName} {customer.LastName}",
            customer.Email,
            customer.LoyaltyPoints,
            customer.Tier.ToString(),
            customer.TotalSpent,
            customer.TotalPurchases,
            customer.LastPurchaseDate
        );
    }
}