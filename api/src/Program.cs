using AzDoCopilotSK.Clients;
using AzDoCopilotSK.SK;
using Microsoft.SemanticKernel;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton(opts =>
{
    var builder = new KernelBuilder();

    var configuration = opts.GetRequiredService<IConfiguration>();

    builder.WithAzureChatCompletionService(
         configuration.GetValue("AZURE_OPENAI_MODEL", "gpt-35-turbo")!,
         configuration.GetValue<string>("AZURE_OPENAI_ENDPOINT")!,
         configuration.GetValue<string>("AZURE_OPENAI_KEY")!);

    return builder.Build();
});

builder.Services.AddSingleton<ISkillsFactory>(opts =>
{
    return new SkillsFactory(opts.GetRequiredService<IKernel>());
});

builder.Services.AddSingleton<VisualStudioServicesClient>(opts =>
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

app.UseCors(allowAll);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
