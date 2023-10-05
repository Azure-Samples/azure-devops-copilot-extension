using AzDoCopilotSK.Models;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.SkillDefinition;

namespace AzDoCopilotSK.SK
{
    public class SkillsFactory : ISkillsFactory
    {
        private readonly IKernel kernel;

        private IDictionary<string, ISKFunction>? skills;

        public SkillsFactory(IKernel kernel)
        {
            this.kernel = kernel;
            LoadSkills();
        }

        private void LoadSkills()
        {
            var skillsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "SK");

            this.skills = kernel.ImportSemanticSkillFromDirectory(skillsDirectory, "Skills");
        }

        public ISKFunction GetUserStorySkill(string userStoryStyle)
        {
            switch (userStoryStyle)
            {
                case UserStoryStyles.HypothesisDriven:
                    return skills!["UserStoryDescriptionHypothesis"];
                case UserStoryStyles.Classic:
                default:
                    return skills!["UserStoryDescription"];
            }
            
        }

        public ISKFunction GetTestCaseSkill()
        {
            return skills!["TestCase"];
        }
    }
}