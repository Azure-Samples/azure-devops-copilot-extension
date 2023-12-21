using AzDoCopilotSK.Extensions;
using AzDoCopilotSK.Models;
using Microsoft.SemanticKernel;
using System.Text.Json;

namespace AzDoCopilotSK.SK
{
    public class UserStorySkill
    {
        private readonly IPromptsFactory _promptsFactory;

        private readonly Kernel _kernel;

        public UserStorySkill(Kernel kernel, IPromptsFactory promptsFactory)
        {
            _promptsFactory = promptsFactory;
            _kernel = kernel;
        }

        public async Task<UserStory?> GetUserStory(string style, string description, string? projectContext = null, string? personaName = null)
        {
            var createUserStory = _promptsFactory.GetUserStoryPrompt(style);

            var context = new KernelArguments
            {
                { "ProjectContext", projectContext ?? "software development project" },
                { "ContextTopic", description! },
                { "Persona", personaName ?? "software engineer" }
            };

            var result = await createUserStory.InvokeAsync(_kernel, context);

            if (!result.ToString().IsValidJson())
            {
                throw new Exception("Invalid prompt result, not valid json");
            }

            var userStory = JsonSerializer.Deserialize<UserStory>(result.ToString(), new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            return userStory;
        }
    }
}
