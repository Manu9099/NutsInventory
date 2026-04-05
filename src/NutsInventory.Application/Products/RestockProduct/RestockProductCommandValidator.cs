using FluentValidation;

namespace NutsInventory.Application.Products.RestockProduct;

public sealed class RestockProductCommandValidator : AbstractValidator<RestockProductCommand>
{
    public RestockProductCommandValidator()
    {
        RuleFor(x => x.ProductId)
            .GreaterThan(0);

        RuleFor(x => x.Quantity)
            .GreaterThan(0);
    }
}