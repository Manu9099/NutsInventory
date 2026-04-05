using NutsInventory.Domain.Common;
using NutsInventory.Domain.Enums;

namespace NutsInventory.Domain.Entities;

public class SalesMetric : AuditableEntity
{
    private SalesMetric() { }

    public int ProductId { get; private set; }
    public int Month { get; private set; }
    public int Year { get; private set; }
    public int QuantitySold { get; private set; }
    public decimal Revenue { get; private set; }
    public decimal? AveragePrice { get; private set; }
    public int? Rank { get; private set; }

    public static SalesMetric Create(int productId, int month, int year, int quantitySold, decimal revenue)
        => new()
        {
            ProductId = productId,
            Month = month,
            Year = year,
            QuantitySold = quantitySold,
            Revenue = revenue,
            AveragePrice = quantitySold == 0 ? null : revenue / quantitySold
        };

    public void AddSale(int quantity, decimal revenue)
    {
        QuantitySold += quantity;
        Revenue += revenue;
        AveragePrice = QuantitySold == 0 ? null : Revenue / QuantitySold;
        Touch();
    }
}
