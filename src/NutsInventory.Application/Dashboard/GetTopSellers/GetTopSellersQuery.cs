using MediatR;
using NutsInventory.Application.Dashboard.Common;

namespace NutsInventory.Application.Dashboard.GetTopSellers;

public sealed record GetTopSellersQuery(
    int? Month = null,
    int? Year = null,
    int Limit = 5
) : IRequest<IReadOnlyList<TopSellerDto>>;