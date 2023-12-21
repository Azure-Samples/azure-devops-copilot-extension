using Microsoft.SemanticKernel;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using System.Diagnostics.Metrics;

namespace Mapache.PromptEvalDotNet
{
    public class PromptEvaluatorFactory
    {
        private readonly MeterProvider _meterProvider;

        private readonly Kernel _kernel;

        private readonly KernelPlugin _kernelFunctions;
        
        public Meter Meter { get; }

        public string MeterId { get; }

        public PromptEvaluatorFactory(string meterId, Kernel kernel)
        {
            this.MeterId = meterId;
            this._kernel = kernel;

            this.Meter = new(MeterId ?? "PromptEvalDotNet");

            _meterProvider = Sdk.CreateMeterProviderBuilder()
                .AddMeter(MeterId)
                .Build();

            _kernelFunctions = _kernel.CreatePluginFromPromptDirectory("Prompts");
        }

        public CoherenceEvaluator Coherence(string promptId)
        {
            return GetCoherenceEvaluator(promptId);
        }

        public CoherenceEvaluator GetCoherenceEvaluator(string promptId)
        {
            var counter = Meter.CreateCounter<int>($"coherence.counter.{promptId}");
            var histogram = Meter.CreateHistogram<int>($"coherence.{promptId}");
            
            return new CoherenceEvaluator(_kernelFunctions, _kernel, counter, histogram, promptId);
        }

        public GroundednessEvaluator GetGroundednessEvaluator(string promptId)
        {
            var counter = Meter.CreateCounter<int>($"groundedness.counter.{promptId}");
            var histogram = Meter.CreateHistogram<int>($"groundedness.{promptId}");

            return new GroundednessEvaluator(_kernelFunctions, _kernel, counter, histogram, promptId);
        }

        public RelevanceEvaluator GetRelevanceEvaluator(string promptId)
        {
            var counter = Meter.CreateCounter<int>($"relevance.counter.{promptId}");
            var histogram = Meter.CreateHistogram<int>($"relevance.{promptId}");

            return new RelevanceEvaluator(_kernelFunctions, _kernel, counter, histogram, promptId);
        }
    }
}