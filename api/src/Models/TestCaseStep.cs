// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

namespace AzDoCopilotSK.Models
{
    public class TestCaseStep
    {
        public int Index { get; set; }

        public string? Action { get; set; }

        public string? ExpectedResult { get; set; }
    }
}