using Microsoft.AspNetCore.Mvc;
using AzDoCopilotSK.Clients;
using AzDoCopilotSK.Models;

namespace AzDoCopilotSK.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AzDoController : ControllerBase
    {
        private readonly VisualStudioServicesClient _visualStudioServicesClient;
        private readonly ILogger<TestCaseController> _logger;

        public AzDoController(VisualStudioServicesClient visualStudioServicesClient,
            ILogger<TestCaseController> logger)
        {
            _visualStudioServicesClient = visualStudioServicesClient;
            _logger = logger;
        }

        [HttpPost]
        [Route("TestCases")]
        public async Task<ActionResult> CreateTestCases(TestCasesCreateDto testCasesCreateDto)
        {
            await this._visualStudioServicesClient.CreateTestCasesForGivenWorkItem(testCasesCreateDto);
            return Ok();
        }
    }
}

