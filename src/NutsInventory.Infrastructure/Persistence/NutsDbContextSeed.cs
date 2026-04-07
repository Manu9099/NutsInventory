using Microsoft.EntityFrameworkCore;
using NutsInventory.Domain.Entities;

namespace NutsInventory.Infrastructure.Persistence;

public static class NutsDbContextSeed
{
    public static async Task SeedAsync(
        NutsDbContext db,
        Func<AdminUser, string, string> hashPassword)
    {
        await db.Database.MigrateAsync();

        if (!await db.Products.AnyAsync())
        {
            var products = new List<Product>
            {
                new(
                    "Almendras Premium 500g",
                    "ALM-500",
                    "Almendras",
                    24.90m,
                    40,
                    10,
                    0.500m,
                    "Almendras tostadas premium",
                    "/products/almendras-premium-500g.jpg"
                ),
                new(
                    "Nueces 500g",
                    "NUE-500",
                    "Nueces",
                    29.90m,
                    35,
                    10,
                    0.500m,
                    "Nueces seleccionadas",
                    "/products/nueces-500g.jpg"
                ),
                new(
                    "Pistachos 250g",
                    "PIS-250",
                    "Pistachos",
                    21.50m,
                    30,
                    8,
                    0.250m,
                    "Pistachos salados",
                    "/products/pistachos-250g.jpg"
                ),
                new(
                    "Mix Saludable 500g",
                    "MIX-500",
                    "Mix",
                    27.90m,
                    50,
                    12,
                    0.500m,
                    "Mix de frutos secos y pasas",
                    "/products/mix-saludable-500g.jpg"
                ),
                new(
                    "Pecanas 250g",
                    "PEC-250",
                    "Pecanas",
                    18.90m,
                    25,
                    8,
                    0.250m,
                    "Pecanas naturales",
                    "/products/pecanas-250g.jpg"
                ),
                new(
                    "Castañas 250g",
                    "CAS-250",
                    "Castañas",
                    16.90m,
                    20,
                    8,
                    0.250m,
                    "Castañas tostadas",
                    "/products/castanas-250g.jpg"
                ),
                new(
                    "Maní Salado 500g",
                    "MAN-500",
                    "Maní",
                    12.90m,
                    60,
                    15,
                    0.500m,
                    "Maní crocante salado",
                    "/products/mani-salado-500g.jpg"
                ),
                new(
                    "Mix Keto 300g",
                    "KETO-300",
                    "Mix",
                    23.90m,
                    28,
                    8,
                    0.300m,
                    "Mix bajo en carbohidratos",
                    "/products/mix-keto-300g.jpg"
                ),
                new(
                    "Arándanos Deshidratados 250g",
                    "ARA-250",
                    "Fruta Seca",
                    19.50m,
                    18,
                    6,
                    0.250m,
                    "Arándanos deshidratados",
                    "/products/arandanos-deshidratados-250g.jpg"
                ),
                new(
                    "Pasas Rubias 250g",
                    "PAS-250",
                    "Fruta Seca",
                    11.90m,
                    22,
                    6,
                    0.250m,
                    "Pasas rubias seleccionadas",
                    "/products/pasas-rubias-250g.jpg"
                )
            };

            db.Products.AddRange(products);
        }

        if (!await db.Customers.AnyAsync())
        {
            var customers = new List<Customer>
            {
                new("ana@demo.com", "Ana", "Torres"),
                new("luis@demo.com", "Luis", "Rojas"),
                new("carla@demo.com", "Carla", "Vega")
            };

            db.Customers.AddRange(customers);
        }

        if (!await db.AdminUsers.AnyAsync())
        {
            var admin = new AdminUser(
                "admin@nutsinventory.com",
                "Admin Demo",
                "temp"
            );

            var hash = hashPassword(admin, "Admin123*");
            admin.UpdatePasswordHash(hash);

            db.AdminUsers.Add(admin);
        }

        await db.SaveChangesAsync();
    }
}