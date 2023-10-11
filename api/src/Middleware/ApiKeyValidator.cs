// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

namespace AzDoCopilotSK.Middleware
{
    public class ApiKeyValidator
    {
        private readonly RequestDelegate _next;

        public const string ApiKeyHeaderName = "x-api-key";

        public const string ApiKeySettingsName = "API_KEY";

        public ApiKeyValidator(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (!context.Request.Headers.TryGetValue(ApiKeyHeaderName, out var extractedApiKey))
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Api Key was not provided.");
                return;
            }

            var appSettings = context.RequestServices.GetRequiredService<IConfiguration>();
            var apiKey = appSettings.GetValue<string>(ApiKeySettingsName);

            if (!apiKey!.Equals(extractedApiKey))
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Unauthorized client.");
                return;
            }

            await _next(context);
        }
    }
}
