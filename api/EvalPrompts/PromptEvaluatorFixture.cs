using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.Metrics.Testing;
using Microsoft.SemanticKernel;
using OpenTelemetry;
using OpenTelemetry.Metrics;

namespace EvalPrompts
{
    public class PromptEvalDotNetFixture
    {
        public Mapache.PromptEvalDotNet.PromptEvaluatorFactory EvaluatorFactory;

        public Kernel Kernel { get; }

        public PromptEvalDotNetFixture()
        {
            var configurationBuilder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddEnvironmentVariables();

            var config = configurationBuilder.Build();

            var builder = Kernel.CreateBuilder();

            builder.AddAzureOpenAIChatCompletion(
                 config["AZURE_OPENAI_MODEL"]!,
                 config["AZURE_OPENAI_ENDPOINT"]!,
                 config["AZURE_OPENAI_KEY"]!);

            Kernel = builder.Build();

            EvaluatorFactory = new Mapache.PromptEvalDotNet.PromptEvaluatorFactory("AzDoCopilotTests", Kernel);
        }
    }
}