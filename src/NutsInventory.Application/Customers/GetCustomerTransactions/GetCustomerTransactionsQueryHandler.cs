using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Application.Customers.Common;

namespace NutsInventory.Application.Customers.GetCustomerTransactions;

public sealed class GetCustomerTransactionsQueryHandler
    : IRequestHandler<GetCustomerTransactionsQuery, IReadOnlyList<LoyaltyTransactionDto>>
{
    private readonly INutsDbContext _db;

    public GetCustomerTransactionsQueryHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<LoyaltyTransactionDto>> Handle(
        GetCustomerTransactionsQuery request,
        CancellationToken cancellationToken)
    {
        var customerExists = await _db.Customers
            .AnyAsync(x => x.Id == request.CustomerId, cancellationToken);

        if (!customerExists)
            throw new KeyNotFoundException("Cliente no encontrado.");

        return await _db.LoyaltyTransactions
            .AsNoTracking()
            .Where(x => x.CustomerId == request.CustomerId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new LoyaltyTransactionDto(
                x.Id,
                x.CustomerId,
                x.PointsAdded,
                x.Reason.ToString(),
                x.OrderId,
                x.CreatedAt
            ))
            .ToListAsync(cancellationToken);
    }
}