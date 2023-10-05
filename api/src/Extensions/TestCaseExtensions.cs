using System.Text;
using AzDoCopilotSK.Models;
using Microsoft.VisualStudio.Services.WebApi.Patch;
using Microsoft.VisualStudio.Services.WebApi.Patch.Json;

namespace AzDoCopilotSK.Extensions;

public static class TestCaseExtensions
{
    public static JsonPatchDocument AsJsonUpdateModel(this TestCase testCase, string areaPath)
    {
        var patchDocument = new JsonPatchDocument
        {
            new()
            {
                Operation = Operation.Add,
                Path = "/fields/System.Title",
                Value = testCase.Title
            },
            new()
            {
                Operation = Operation.Add,
                Path = "/fields/System.AreaPath",
                Value = areaPath
            },
            new()
            {
                Operation = Operation.Add,
                Path = "/fields/System.AssignedTo",
                Value = ""
            },

        };

        if (testCase.TestCaseSteps != null && testCase.TestCaseSteps.Count > 0)
        {
            patchDocument.Add(
                new JsonPatchOperation()
                {
                    Operation = Operation.Add,
                    Path = "/fields/Microsoft.VSTS.TCM.Steps",
                    Value = testCase.TestCaseSteps.AsSteps()
                });
        }
        
        return patchDocument;
    }

    public static string AsSteps(this List<TestCaseStep> steps)
    {
        var sb = new StringBuilder();
        sb.Append("<steps id=\"0\">");
        foreach (var step in steps)
        {
            sb.Append($"<step id=\"{step.Index}\" type=\"ValidateStep\">");
            sb.Append($"<parameterizedString isformatted=\"true\">{step.Action}</parameterizedString>");
            sb.Append($"<parameterizedString isformatted=\"true\">{step.ExpectedResult}</parameterizedString>");
            sb.Append("<description/>");
            sb.Append("</step>");
        }
        sb.Append("</steps>");
        return sb.ToString();
    }
}