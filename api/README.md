# API Backend

This C# dotnet REST-API backend could be used for other services (github, jira, etc.) but has been designed for Azure DevOps. This is the part that connects with Azure OpenAPI.

## Design

To connect the AzDo extension to OpenAPI/Azure OpenAPI there are two options: either calling directly the api from the front-end or having an intermediate back-end layer. Calling directly the api has severe security considerations (for instance the API key is passed over the wire) and for other reasons it is not a pattern used in production-ready environments.

Our initial design looks like this:

![image](https://github.com/microsoft/azure-devops-copilot/assets/952392/9542025d-c1c4-4d27-88d6-9c923f83e7a7)

There are some core design decisions made:

### Framework / Platform

We decided to use [Semantic Kernel](https://github.com/microsoft/semantic-kernel/) because it is gaining traction inside and outside Microsoft, it is robust, allows to our power-users but no-coders PMs to adjust promps which are defined in txt files, and can be extended to test and evaluate the model using Azure Prompt Flow or Jupyther notebooks.

We also decide to use dotnet instead of python, because the amount of samples for AI and LLMs in python is vastly, and we want to help the extense community of dotnet developers to start integration with AI and LLMs in their projects, which sometimes feels a little bit alienated.

### Deployment

We decided to conteinarize the backend api so it can run in kubernetes clusters, local developer environments, GitHub codespaces, or Azure App Containers. Altought it is cloud-agnostic, we decided to have Bicep as first-class IaC platform, so we can leverage on Azure on telemetry, observability, troubleshooting, networking, security and scalling. We use Azure OpenAI, but can also be adapted to use OpenAI or any AI service that [SK supports](https://github.com/microsoft/semantic-kernel).

> To use it with Azure OpenAI, your subscription needs to have OpenAI enabled. You can request access to [in this form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUOFA5Qk1UWDRBMjg0WFhPMkIzTzhKQ1dWNyQlQCN0PWcu).

### TypeScript + Microsoft Prompt Engine

An early protoype can be [found here](/.archive). It is a Typescript proof of concept to generate user story descriptions using Azure OpenAI and Microsoft Prompt Engine. This PoC uses gpt-35 and has a hardcoded tokens limit. The results are very different with other models and will require different prompts.

#### Developing

You can start developing the backend by using GitHub Codespaces.

1. Fork this repository, and open it in a GitHub Codespace, it should have all the pre-requisites installed.
1. Navigate to `api/src`.
1. Copy `appsettings.json` to `appsettings.Development.json` and edit the file with the endpoint and keys of your Azure OpenAI resource.
1. Start the service:

    ```bash
    dotnet run
    ```

1. Open a new bash terminal, and call the service:

    ```bash
    curl -s -X POST -H "Content-Type: application/json" \
      -d '{"input": "Implement CI/CD" , "personaName": "software engineer", "projectContext": "Finantial services software project"}' \
      http://localhost:3000/user-story | jq
    ```

## References

* [Working with LLMS](https://playbook.microsoft.com/code-with-mlops/technology-guidance/generative-ai/working-with-llms/).
