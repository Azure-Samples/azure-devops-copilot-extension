// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

using Microsoft.AspNetCore.Diagnostics;

namespace AzDoCopilotSK.Filters;

public class GlobalExceptionFilter : IStartupFilter
{
    private readonly ILogger<GlobalExceptionFilter> _logger;

    public GlobalExceptionFilter(ILogger<GlobalExceptionFilter> logger)
    {
        _logger = logger;
    }
    public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
    {
        return app =>
        {
            app.UseExceptionHandler(builder =>
            {
                builder.Run(async context =>
                {
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    context.Response.ContentType = "application/json";
                    _logger.LogError($"Exception occured in {context.Request.Path}: {context.Features.Get<IExceptionHandlerFeature>()?.Error}");
                    await context.Response.WriteAsync("An unexpected error occurred.");
                });
            });

            next(app);
        };
    }
}