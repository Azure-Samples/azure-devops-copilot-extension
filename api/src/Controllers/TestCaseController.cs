// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

using AzDoCopilotSK.SK;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Newtonsoft.Json;
using AzDoCopilotSK.Extensions;
using AzDoCopilotSK.Models;

namespace AzDoCopilotSK.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestCaseController : ControllerBase
    {
        private readonly IKernel _kernel;
        private readonly ISkillsFactory _skillsFactory;
        private readonly ILogger<TestCaseController> _logger;

        public TestCaseController(IKernel kernel, 
            ISkillsFactory skillsFactory,
            ILogger<TestCaseController> logger)
        {
            _kernel = kernel;
            _skillsFactory = skillsFactory;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<List<TestCase>>> GetTestCases(TestCasesGetDto testCasesGetDto)
        {
            var testCaseSkill = _skillsFactory.GetTestCaseSkill();

            var context = _kernel.CreateNewContext();

            context.Variables["input"] = testCasesGetDto.AcceptanceCriteria ?? "";

            var result = await testCaseSkill.InvokeAsync(context);
            _logger.LogInformation($"Test case skill result: {result}");
            
            if (!result.Result.IsValidJson())
            {
                _logger.LogWarning("Result from Prompt is not valid JSON.");
                return BadRequest();
            }
                
            var testCases = JsonConvert.DeserializeObject<List<TestCase>>(result.Result);
            foreach (var testCase in testCases!)
            {
                testCase.Id = Guid.NewGuid().ToString();
            }

            return Ok(testCases!);
        }
    }
}

