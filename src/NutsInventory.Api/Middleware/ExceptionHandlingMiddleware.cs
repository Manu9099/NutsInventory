using System.Net;
using System.Text.Json;
using FluentValidation;

namespace NutsInventory.Api.Middleware;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (BadHttpRequestException ex)
{
    _logger.LogWarning(ex, "Bad request");

    context.Response.StatusCode = StatusCodes.Status400BadRequest;
    context.Response.ContentType = "application/json";

    var response = new
    {
        error = "BadRequest",
        message = "El JSON enviado es inválido o está mal formado."
    };

    await context.Response.WriteAsync(JsonSerializer.Serialize(response));
}
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation error");

            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            context.Response.ContentType = "application/json";

            var response = new
            {
                error = "ValidationError",
                message = "Uno o más datos son inválidos.",
                details = ex.Errors.Select(x => new
                {
                    field = x.PropertyName,
                    error = x.ErrorMessage
                })
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Resource not found");

            context.Response.StatusCode = (int)HttpStatusCode.NotFound;
            context.Response.ContentType = "application/json";

            var response = new
            {
                error = "NotFound",
                message = ex.Message
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Business rule error");

            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            context.Response.ContentType = "application/json";

            var response = new
            {
                error = "BusinessRuleError",
                message = ex.Message
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            var response = new
            {
                error = "ServerError",
                message = "Ocurrió un error interno inesperado."
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}