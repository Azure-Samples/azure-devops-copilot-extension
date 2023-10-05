using AutoFixture.Xunit2;
using AzDoCopilotSK.Controllers;
using AzDoCopilotSK.SK;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Orchestration;
using Microsoft.SemanticKernel.SkillDefinition;
using NSubstitute;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace AdoCopilotApi.UnitTest;

public class UserStoryControllerTests
{
    private readonly IKernel _kernelMock;
    private readonly ISkillsFactory _skillsFactoryMock;
    private readonly UserStoryController _controller;

    public UserStoryControllerTests()
    {
        _kernelMock = Substitute.For<IKernel>();
        _skillsFactoryMock = Substitute.For<ISkillsFactory>();
        _controller = new UserStoryController(_kernelMock, _skillsFactoryMock);
    }

    [Theory, AutoData]
    public async Task Create_ReturnsUserStory_WhenValidDtoIsProvided(UserStoryCreateDto input, UserStory output)
    {
        // Arrange
        var promptContext = new SKContext();
        promptContext.Variables["ProjectContext"] = input.ProjectContext;
        promptContext.Variables["ContextTopic"] = input.UserStoryDescription;
        promptContext.Variables["Persona"] = input.PersonaName;
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
        _skillsFactoryMock.GetUserStorySkill().Returns(skillMock);

        // Act
        var response = await _controller.Create(input);

        // Assert
        Assert.NotNull(response.Value);
        Assert.Equal(output.Title, response.Value.Title);
        Assert.Equal(output.Description, response.Value.Description);
        Assert.Equal(output.AcceptanceCriteria, response.Value.AcceptanceCriteria);
    }
}