namespace NutsInventory.Api.Auth;

public sealed record LoginRequest(string Email, string Password);

public sealed record AuthUserResponse(
    int Id,
    string Email,
    string FullName,
    string Role
);

public sealed record LoginResponse(
    string AccessToken,
    DateTime ExpiresAt,
    AuthUserResponse User
);