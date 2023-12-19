// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

using AzDoCopilotSK.Clients;
using AzDoCopilotSK.Middleware;
using AzDoCopilotSK.SK;
using Microsoft.OpenApi.Models;
using Microsoft.SemanticKernel;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme()
    {
        In = ParameterLocation.Header,
        Name = ApiKeyValidator.ApiKeyHeaderName,
        Type = SecuritySchemeType.ApiKey,
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = ApiKeyValidator.ApiKeyHeaderName }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddSingleton(opts =>
{
    var builder = Kernel.CreateBuilder();

    var configuration = opts.GetRequiredService<IConfiguration>();

    builder.AddAzureOpenAIChatCompletion(
         configuration.GetValue("AZURE_OPENAI_MODEL", "gpt-35-turbo")!,
         configuration.GetValue<string>("AZURE_OPENAI_ENDPOINT")!,
         configuration.GetValue<string>("AZURE_OPENAI_KEY")!);

    return builder.Build();
});

builder.Services.AddSingleton<IPromptsFactory>(opts =>
{
    return new PrompsFactory(opts.GetRequiredService<Kernel>());
});

builder.Services.AddSingleton(opts =>
{
    var configuration = opts.GetRequiredService<IConfiguration>();

    var token = configuration.GetValue("AZURE_DEVOPS_PAT", string.Empty)!;

    var logger = opts.GetRequiredService<ILogger<VisualStudioServicesClient>>();

    return new VisualStudioServicesClient(token, logger);
});

var allowAll = "_allowAll";
builder.Services.AddCors(options =>
    options.AddPolicy(name: allowAll,
                      policy =>
                      {
                          policy.AllowAnyHeader();
                          policy.AllowAnyOrigin();
                          policy.AllowAnyMethod();
                          policy.SetIsOriginAllowed(origin => true);
                      })
);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseMiddleware<ApiKeyValidator>();
}

app.UseCors(allowAll);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
