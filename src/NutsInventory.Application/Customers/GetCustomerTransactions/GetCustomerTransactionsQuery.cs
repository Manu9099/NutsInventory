using MediatR;
using NutsInventory.Application.Customers.Common;

namespace NutsInventory.Application.Customers.GetCustomerTransactions;

public sealed record GetCustomerTransactionsQuery(int CustomerId)
    : IRequest<IReadOnlyList<LoyaltyTransactionDto>>;