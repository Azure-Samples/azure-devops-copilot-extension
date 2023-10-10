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
        private readonly IKernel _kernel;
        private readonly ISkillsFactory _skillsFactory;
        private readonly ILogger<UserStoryController> _logger;

        public UserStoryController(IKernel kernel, ISkillsFactory skillsFactory, ILogger<UserStoryController> logger)
        {
            _kernel = kernel;
            _skillsFactory = skillsFactory;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<UserStory?>> Create(UserStoryCreateDto userStoryCreateDto)
        {
            _logger.LogInformation("Creating user story.");
            var createUserStory = _skillsFactory.GetUserStorySkill(userStoryCreateDto.UserStoryStyle);

            var context = _kernel.CreateNewContext();

            context.Variables["ProjectContext"] = userStoryCreateDto.ProjectContext ?? "software development project";
            context.Variables["ContextTopic"] = userStoryCreateDto.UserStoryDescription!;
            context.Variables["Persona"] = userStoryCreateDto.PersonaName ?? "software engineer";

            var result = await createUserStory.InvokeAsync(context);
            _logger.LogInformation($"Result from Prompt: {result}");

            if (!result.Result.IsValidJson())
            {
                _logger.LogWarning("Result from Prompt is not valid JSON.");
                return BadRequest();
            }

            var userStory = JsonSerializer.Deserialize<UserStory>(result.Result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
            
            return Ok(userStory);
        }
    }
}
