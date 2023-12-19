// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

using AzDoCopilotSK.SK;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using System.Text.Json;
using AzDoCopilotSK.Extensions;
using AzDoCopilotSK.Models;

namespace AzDoCopilotSK.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserStoryController : ControllerBase
    {
        private readonly Kernel _kernel;
        private readonly IPromptsFactory _promptsFactory;
        private readonly ILogger<UserStoryController> _logger;

        public UserStoryController(Kernel kernel, IPromptsFactory skillsFactory, ILogger<UserStoryController> logger)
        {
            _kernel = kernel;
            _promptsFactory = skillsFactory;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<UserStory?>> Create(UserStoryCreateDto userStoryCreateDto)
        {
            _logger.LogInformation("Creating user story.");
            var createUserStory = _promptsFactory.GetUserStoryPrompt(userStoryCreateDto.UserStoryStyle);

            var context = new KernelArguments
            {
                { "ProjectContext", userStoryCreateDto.ProjectContext ?? "software development project" },
                { "ContextTopic", userStoryCreateDto.UserStoryDescription! },
                { "Persona", userStoryCreateDto.PersonaName ?? "software engineer" }
            };

            var result = await createUserStory.InvokeAsync(_kernel, context);
            _logger.LogInformation($"Result from Prompt: {result}");

            if (!result.ToString().IsValidJson())
            {
                _logger.LogWarning("Result from Prompt is not valid JSON.");
                return BadRequest();
            }

            var userStory = JsonSerializer.Deserialize<UserStory>(result.ToString(), new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
            
            return Ok(userStory);
        }
    }
}
