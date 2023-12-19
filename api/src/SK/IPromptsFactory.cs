// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

using Microsoft.SemanticKernel;

namespace AzDoCopilotSK.SK
{
    public interface IPromptsFactory
    {
        KernelFunction GetTestCasePrompt();
        KernelFunction GetUserStoryPrompt(string userStoryStyle);
    }
}
