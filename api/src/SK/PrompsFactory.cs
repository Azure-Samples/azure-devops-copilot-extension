// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

using AzDoCopilotSK.Models;
using Microsoft.SemanticKernel;

namespace AzDoCopilotSK.SK
{
    public class PrompsFactory : IPromptsFactory
    {
        private readonly Kernel kernel;

        private KernelPlugin? prompts;

        public PrompsFactory(Kernel kernel)
        {
            this.kernel = kernel;
            LoadPrompts();
        }

        private void LoadPrompts()
        {
            this.prompts = kernel.CreatePluginFromPromptDirectory("Prompts");
        }

        public KernelFunction GetUserStoryPrompt(string userStoryStyle)
        {
            string promptKey = $"userstory_description_{userStoryStyle.ToLower()}";
            return prompts![promptKey]!;
        }

        public KernelFunction GetTestCasePrompt()
        {
            return prompts!["testcase"];
        }
    }
}