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
        private readonly Kernel _kernel;
        private readonly IPromptsFactory _skillsFactory;
        private readonly ILogger<TestCaseController> _logger;

        public TestCaseController(Kernel kernel, 
            IPromptsFactory skillsFactory,
            ILogger<TestCaseController> logger)
        {
            _kernel = kernel;
            _skillsFactory = skillsFactory;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<List<TestCase>>> GetTestCases(TestCasesGetDto testCasesGetDto)
        {
            var testCaseSkill = _skillsFactory.GetTestCasePrompt();

            var context = new KernelArguments
            {
                { "input", testCasesGetDto.AcceptanceCriteria ?? "" }
            };

            var result = await testCaseSkill.InvokeAsync(_kernel, context);
            _logger.LogInformation($"Test case skill result: {result}");
            
            if (!result.ToString().IsValidJson())
            {
                _logger.LogWarning("Result from Prompt is not valid JSON.");
                return BadRequest();
            }
                
            var testCases = JsonConvert.DeserializeObject<List<TestCase>>(result.ToString());
            foreach (var testCase in testCases!)
            {
                testCase.Id = Guid.NewGuid().ToString();
            }

            return Ok(testCases!);
        }
    }
}

