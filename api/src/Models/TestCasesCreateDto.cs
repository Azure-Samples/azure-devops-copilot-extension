// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

namespace AzDoCopilotSK.Models
{
    public class TestCasesCreateDto
    {
        public string? Organization { get; set; }
        public string? Project { get; set; }
        public string? AreaPath {get; set; }
        public TestCase[]? TestCases { get; set; }   
    }
}