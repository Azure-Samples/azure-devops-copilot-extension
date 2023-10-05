namespace AzDoCopilotSK.Models
{
    public class UserStoryCreateDto
    {
        public string? ProjectContext { get; set; }

        public string? UserStoryDescription { get; set; }

        public string? PersonaName { get; set; }

        public string UserStoryStyle { get; set; } = UserStoryStyles.Classic;
    }
}