using NutsInventory.Domain.Common;
using NutsInventory.Domain.Enums;

namespace NutsInventory.Domain.Entities;

public class LoyaltyTransaction : AuditableEntity
{
    private LoyaltyTransaction() { }

    public LoyaltyTransaction(int customerId, int pointsAdded, LoyaltyReason reason, int? orderId = null)
    {
        CustomerId = customerId;
        PointsAdded = pointsAdded;
        Reason = reason;
        OrderId = orderId;
    }

    public int CustomerId { get; private set; }
    public int PointsAdded { get; private set; }
    public LoyaltyReason Reason { get; private set; }
    public int? OrderId { get; private set; }
}


