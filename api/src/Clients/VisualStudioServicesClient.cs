// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

using AzDoCopilotSK.Extensions;
using AzDoCopilotSK.Models;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.WebApi;

namespace AzDoCopilotSK.Clients;

public class VisualStudioServicesClient
{
    private readonly ILogger<VisualStudioServicesClient> _logger;
    private readonly string _patToken;

    public VisualStudioServicesClient(string patToken, ILogger<VisualStudioServicesClient> logger)
    {
        _patToken = patToken;
        _logger = logger;
    }
    
    public async Task CreateTestCasesForGivenWorkItem(TestCasesCreateDto testCases)
    {
        var connection = this.GetVssClient(testCases.Organization!);
        WorkItemTrackingHttpClient witClient = connection.GetClient<WorkItemTrackingHttpClient>();
        
        foreach (var testCase in testCases.TestCases!)
        {
            var jsonUpdateModel = testCase.AsJsonUpdateModel(testCases.AreaPath!);
            var result = await witClient.CreateWorkItemAsync(jsonUpdateModel, testCases.Project, Constants.TestCaseItemType);
            _logger.LogInformation($"Creating work item with test cases is completed. Work item id: {result.Id}");
        }
    }

    private VssConnection GetVssClient(string organizationName)
    {
        var uri = new Uri($"https://dev.azure.com/{organizationName}");
        var credential =
            new VssBasicCredential(string.Empty, _patToken);

        return new VssConnection(uri, credential);
    }
}