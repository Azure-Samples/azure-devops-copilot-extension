using Microsoft.SemanticKernel;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using System.Diagnostics.Metrics;
using System.Threading;

namespace Mapache.PromptEvalDotNet
{
    public class CoherenceEvaluator
    {
        private readonly Counter<int> _counter;
        private readonly Histogram<int> _histogram;
        
        private readonly KernelPlugin _prompts;
        private readonly Kernel _kernel;

        public CoherenceEvaluator(KernelPlugin prompts, Kernel kernel, Counter<int> counter, Histogram<int> histogram, string? promptId = null)
        {
            this._counter = counter;
            this._histogram = histogram;

            this._kernel = kernel;
            this._prompts = prompts;
        }

        public async Task<int> GetScore(string question, string answer)
        {
            var eval = _prompts["coherence"];

            var args = new KernelArguments
            {
                { "Question", question },
                { "Answer", answer }
            };

            _counter.Add(1);

            var evalResult = await eval.InvokeAsync(_kernel, args);

            var evalInt = int.Parse(evalResult.ToString());

            _histogram.Record(evalInt);

            return evalInt;
        }
    }
}