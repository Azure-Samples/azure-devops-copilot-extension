using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.SkillDefinition;

namespace AzDoCopilotSK.SK
{
    public interface ISkillsFactory
    {
        ISKFunction GetTestCaseSkill();
        ISKFunction GetUserStorySkill(string userStoryStyle);
    }
}
