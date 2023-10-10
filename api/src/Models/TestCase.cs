// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

namespace AzDoCopilotSK.Models
{
    public class TestCase
    {
        public string? Id { get; set; }
        public string? Title { get; set; }
        public List<TestCaseStep>? TestCaseSteps { get; set; }
    }
}