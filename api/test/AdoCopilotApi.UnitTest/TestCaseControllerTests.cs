using AutoFixture.Xunit2;
using AzDoCopilotSK.Controllers;
using AzDoCopilotSK.SK;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Orchestration;
using Microsoft.SemanticKernel.SkillDefinition;
using NSubstitute;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace AdoCopilotApi.UnitTest
{
    public class TestCaseControllerTests
    {
        private readonly IKernel _kernelMock;
        private readonly ISkillsFactory _skillsFactoryMock;
        private readonly IConfiguration _configurationMock;
        private readonly ILogger<TestCaseController> _logger;
        private readonly TestCaseController _controller;

        public TestCaseControllerTests()
        {
            _kernelMock = Substitute.For<IKernel>();
            _skillsFactoryMock = Substitute.For<ISkillsFactory>();
            _configurationMock = Substitute.For<IConfiguration>();
            _logger = new TestLogger<TestCaseController>();
            _controller = new TestCaseController(_kernelMock, _skillsFactoryMock, _configurationMock, _logger);
        }

        [Theory, AutoData]
        public async Task Get_ReturnsTestCases_WhenValidDtoIsProvided(TestCasesGetDto input, List<TestCase?> output)
        {
            // Arrange
            var promptContext = new SKContext();
            promptContext.Variables["input"] = input.AcceptanceCriteria;
            _kernelMock.CreateNewContext().Returns(promptContext);

            var resultContext = new SKContext();
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            var result = JsonSerializer.Serialize(output, options);
            resultContext.Variables.Set("INPUT", result);
            var skillMock = Substitute.For<ISKFunction>();
            skillMock.InvokeAsync(promptContext).Returns(resultContext);
            _skillsFactoryMock.GetTestCaseSkill().Returns(skillMock);

            // Act
            var response = await _controller.GetTestCases(input);

            // Assert
            Assert.NotNull(response.Value);
            Assert.NotEmpty(response.Value);
        }
    }
}