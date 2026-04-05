using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Application.Orders.CreateOrder;
using NutsInventory.Application.Products.CreateProduct;
using NutsInventory.Application.Products.GetProductById;
using NutsInventory.Application.Products.GetProducts;
using NutsInventory.Application.Products.RestockProduct;
using NutsInventory.Infrastructure.Persistence;
using NutsInventory.Api.Middleware;
using NutsInventory.Application.Common.Behaviors;
using NutsInventory.Application.Dashboard.GetDashboardSummary;
using NutsInventory.Application.Products.GetLowStockProducts;
using NutsInventory.Application.Products.UpdateProduct;
using NutsInventory.Application.Customers.CreateCustomer;
using NutsInventory.Application.Customers.GetCustomerById;
using NutsInventory.Application.Customers.GetCustomerLoyaltySummary;
using NutsInventory.Application.Customers.GetCustomerTransactions;
using NutsInventory.Application.Customers.GetCustomers;
using NutsInventory.Application.Dashboard.GetMonthlySalesTrend;
using NutsInventory.Application.Dashboard.GetTopSellers;
using NutsInventory.Application.Inventory.GetInventoryMovements;
using NutsInventory.Application.Products.DeactivateProduct;
using NutsInventory.Application.Products.ReactivateProduct;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using NutsInventory.Api.Auth;
using NutsInventory.Domain.Entities;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<NutsDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<INutsDbContext>(sp => sp.GetRequiredService<NutsDbContext>());

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssemblyContaining<CreateOrderCommand>();
    cfg.RegisterServicesFromAssemblyContaining<GetDashboardSummaryQueryHandler>();
});
builder.Logging.AddFilter("LuckyPennySoftware.MediatR.License", LogLevel.None);

builder.Services.AddValidatorsFromAssembly(typeof(CreateOrderCommand).Assembly);
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection(JwtOptions.SectionName));

builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<IPasswordHasher<AdminUser>, PasswordHasher<AdminUser>>();

var FrontendCorsPolicy = "FrontendCorsPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var jwtOptions = builder.Configuration
    .GetSection(JwtOptions.SectionName)
    .Get<JwtOptions>() ?? throw new InvalidOperationException("Jwt config faltante.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtOptions.Issuer,

            ValidateAudience = true,
            ValidAudience = jwtOptions.Audience,

            ValidateLifetime = true,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtOptions.SecretKey)),

            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors(FrontendCorsPolicy);

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseSwagger();
app.UseSwaggerUI();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<NutsDbContext>();
    var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<AdminUser>>();

    await NutsDbContextSeed.SeedAsync(
        db,
        (user, password) => passwordHasher.HashPassword(user, password));
}

app.MapGet("/api/products", async (
    string? search,
    string? category,
    bool? isActive,
    ISender sender) =>
{
    var result = await sender.Send(new GetProductsQuery(search, category, isActive));
    return Results.Ok(result);
});

app.MapGet("/api/products/{id:int}", async (int id, ISender sender) =>
{
    var result = await sender.Send(new GetProductByIdQuery(id));
    return result is null ? Results.NotFound() : Results.Ok(result);
});

app.MapPost("/api/products", async (CreateProductCommand command, ISender sender) =>
{
    var result = await sender.Send(command);
    return Results.Created($"/api/products/{result.Id}", result);
});

app.MapPost("/api/products/{id:int}/restock", async (
    int id,
    RestockRequest request,
    ISender sender) =>
{
    await sender.Send(new RestockProductCommand(id, request.Quantity, request.Reason));
    return Results.NoContent();
});

app.MapPost("/api/orders", async (CreateOrderCommand command, ISender sender) =>
{
    var result = await sender.Send(command);
    return Results.Created($"/api/orders/{result.OrderId}", result);
});
app.MapPut("/api/products/{id:int}", async (
    int id,
    UpdateProductRequest request,
    ISender sender) =>
{
    var result = await sender.Send(new UpdateProductCommand(
        id,
        request.Name,
        request.Sku,
        request.Description,
        request.Price,
        request.ReorderLevel,
        request.Category,
        request.Weight,
        request.ImageUrl
    ));

    return Results.Ok(result);
});

app.MapGet("/api/products/low-stock", async (ISender sender) =>
{
    var result = await sender.Send(new GetLowStockProductsQuery());
    return Results.Ok(result);
});

app.MapGet("/api/dashboard/summary", async (ISender sender) =>
{
    var result = await sender.Send(new GetDashboardSummaryQuery());
    return Results.Ok(result);
});
app.MapGet("/api/customers", async (
    string? search,
    bool? isActive,
    ISender sender) =>
{
    var result = await sender.Send(new GetCustomersQuery(search, isActive));
    return Results.Ok(result);
});

app.MapGet("/api/customers/{id:int}", async (int id, ISender sender) =>
{
    var result = await sender.Send(new GetCustomerByIdQuery(id));
    return result is null ? Results.NotFound() : Results.Ok(result);
});

app.MapPost("/api/customers", async (CreateCustomerRequest request, ISender sender) =>
{
    var result = await sender.Send(new CreateCustomerCommand(
        request.Email,
        request.FirstName,
        request.LastName,
        request.Phone,
        request.City,
        request.Address
    ));

    return Results.Created($"/api/customers/{result.Id}", result);
});

app.MapGet("/api/customers/{id:int}/loyalty", async (int id, ISender sender) =>
{
    var result = await sender.Send(new GetCustomerLoyaltySummaryQuery(id));
    return Results.Ok(result);
});

app.MapGet("/api/customers/{id:int}/transactions", async (int id, ISender sender) =>
{
    var result = await sender.Send(new GetCustomerTransactionsQuery(id));
    return Results.Ok(result);
});
app.MapPatch("/api/products/{id:int}/deactivate", async (int id, ISender sender) =>
{
    await sender.Send(new DeactivateProductCommand(id));
    return Results.NoContent();
});

app.MapPatch("/api/products/{id:int}/reactivate", async (int id, ISender sender) =>
{
    await sender.Send(new ReactivateProductCommand(id));
    return Results.NoContent();
});

app.MapGet("/api/inventory/movements", async (
    int? productId,
    int? limit,
    ISender sender) =>
{
    var result = await sender.Send(new GetInventoryMovementsQuery(productId, limit ?? 50));
    return Results.Ok(result);
});

app.MapGet("/api/dashboard/top-sellers", async (
    int? month,
    int? year,
    int? limit,
    ISender sender) =>
{
    var result = await sender.Send(new GetTopSellersQuery(month, year, limit ?? 5));
    return Results.Ok(result);
});

app.MapGet("/api/dashboard/monthly-sales-trend", async (
    int? months,
    ISender sender) =>
{
    var result = await sender.Send(new GetMonthlySalesTrendQuery(months ?? 12));
    return Results.Ok(result);
});
var authGroup = app.MapGroup("/api/auth");

authGroup.MapPost("/login", async (
    LoginRequest request,
    NutsDbContext db,
    IPasswordHasher<AdminUser> hasher,
    JwtTokenService jwtTokenService,
    CancellationToken cancellationToken) =>
{
    var user = await db.AdminUsers
        .FirstOrDefaultAsync(x => x.Email == request.Email && x.IsActive, cancellationToken);

    if (user is null)
        throw new InvalidOperationException("Credenciales inválidas.");

    var verification = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

    if (verification == PasswordVerificationResult.Failed)
        throw new InvalidOperationException("Credenciales inválidas.");

    var (accessToken, expiresAt) = jwtTokenService.CreateToken(user);

    return Results.Ok(new LoginResponse(
        accessToken,
        expiresAt,
        new AuthUserResponse(user.Id, user.Email, user.FullName, user.Role)
    ));
});

authGroup.MapGet("/me", async (
    ClaimsPrincipal principal,
    NutsDbContext db,
    CancellationToken cancellationToken) =>
{
    var userIdValue = principal.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!int.TryParse(userIdValue, out var userId))
        return Results.Unauthorized();

    var user = await db.AdminUsers
        .AsNoTracking()
        .FirstOrDefaultAsync(x => x.Id == userId && x.IsActive, cancellationToken);

    if (user is null)
        return Results.Unauthorized();

    return Results.Ok(new AuthUserResponse(user.Id, user.Email, user.FullName, user.Role));
}).RequireAuthorization();

app.Run();

public sealed record RestockRequest(int Quantity, string? Reason);
  
  public sealed record UpdateProductRequest(
    string Name,
    string Sku,
    string? Description,
    decimal Price,
    int ReorderLevel,
    string Category,
    decimal Weight,
    string? ImageUrl
);
public sealed record CreateCustomerRequest(
    string Email,
    string FirstName,
    string LastName,
    string? Phone,
    string? City,
    string? Address
);