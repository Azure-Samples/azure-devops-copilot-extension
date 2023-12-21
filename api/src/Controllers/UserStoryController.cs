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

            var userStorySkill = new UserStorySkill(_kernel, _promptsFactory);

            var userStory = await userStorySkill.GetUserStory(
                userStoryCreateDto.UserStoryStyle,
                userStoryCreateDto.UserStoryDescription!,
                userStoryCreateDto.ProjectContext,
                userStoryCreateDto.PersonaName
            );
            
            return Ok(userStory);
        }
    }
}
