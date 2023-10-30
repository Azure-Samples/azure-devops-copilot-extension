# Infrastructure

We provide one-click deployment for the Backend API and OpenAI service to your own Azure subscription.

## Important

> This project is a proof-of-concept sample and no support is provided. There is one **critical missing piece** in the backend, which is the authentication between the Azure DevOps instance and the Backend, which is being tracked in the [issue 35](https://github.com/microsoft/azure-devops-copilot/issues/35), however even when that piece is completed, a fully production service should be designed accordingly to your company compliance.

## Deploy

You can deploy the infrastructure using the [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli). You will need to have the Azure CLI installed and logged in to your Azure subscription.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-devops-copilot-extension%2Fmain%2Finfra%2Fmain.bicep)

Alternatively, the infrastructure can be deployed by manually running the next command:

```sh
az deployment sub create --location eastus --template-file main.bicep
```
