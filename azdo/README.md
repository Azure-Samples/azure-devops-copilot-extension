# Azure DevOps Copilot PoC Extension

Welcome to the Azure DevOps Copilot PoC Extension! This guide will help you get started with using and contributing to the extension. *Extensions are add-ons which you can use to customize and extend your experience with Azure DevOps. They're written with standard technologies - HTML, JavaScript, CSS - and developed using your preferred development tools.*

## Pre-read

* [Building an Azure DevOps Extension](https://learn.microsoft.com/en-us/azure/devops/extend/overview?view=azure-devops#build-an-extension).
* [Azure DevOps Extension UI design](https://developer.microsoft.com/en-us/azure-devops/).

## Design

Most of the extensions points loads the javascript code in the browser as an iframe. That is why we could use either vanilla javascript and/or react or any other tool.

Our project was made using [TypeScript](https://www.typescriptlang.org/), React and [Formula Design](https://developer.microsoft.com/en-us/azure-devops/components).

# Azure DevOps API/SDK vs Azure DevOps Extension SDK

In this project **we are using Azure DevOps Extension SDK**, which is different from the Azure DevOps API Client libraries.

There are significant differences between the Azure DevOps [REST API](https://learn.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-7.1)/[SDK](https://learn.microsoft.com/en-us/azure/devops/integrate/concepts/dotnet-client-libraries?view=azure-devops) and the [Azure DevOps Extension SDK](https://github.com/Microsoft/azure-devops-extension-sdk) worth to mention.

Azure DevOps REST API (and it's client libraries) are meant to integrate Azure DevOps with external services/tools, and are commonly used with PAT tokens or other authentication methods, while the Azure DevOps Extension SDK is meant to add features to the Azure DevOps service. Althought theorically we could create a service that updates workitems using the REST API, this is subobtimal, and we want to interact with the workitems directly from the Azure DevOps UI. For example, we could update the workitem title and other fields using the Azure DevOps Extension SDK, but the user will ultimately decide where to save the changes or not, while a REST API call will update the workitem directly.

## Prerequisites:

Before you start using and contributing to the extension, make sure you have the following prerequisites in place:

* An Azure DevOps organization or project with admin permissions.
* Node.js
* Typescript (tsc)
* tfx-cli (`npm i -g tfx-cli`)
* A Azure Marketplace Publisher - [Create a publisher](https://learn.microsoft.com/en-us/azure/devops/extend/publish/overview?toc=%2Fazure%2Fdevops%2Fmarketplace-extensibility%2Ftoc.json&view=azure-devops).
* A Azure Devops PAT token that has access to publish extensions. - [See scope](pat.png)

You can also use a GitHub Codespace, which has already the pre-requisites configured (except for the Azure DevOps organization).

## Setup

1. Create a GitHub Codespace from this repo, or install the pre-requisites from the above section.
2. Navigate to the `azdo` directory.

```
$ cd azdo
```

3. Run npm install to install the required dependencies.

```
$ npm i
```

4. Build the extension, it will generate a .vsix file.

```
$ npm run build:dev
```

> Note: if tfx is not installed, install it with `npm i -g tfx-cli`.

5. Publish the extension, this will update the extension in the marketplace.
You will need to publish with your own publisher/organization and using your own PAT token (with Marketplace manage scope):

```
$ tfx extension publish --manifest-globs azure-devops-extension.json src/Components/**/*.json -t <PAT-TOKEN> --publisher <PUBLISHER> --extension-id <EXT_ID> --share-with <MYORGNAME> 
```

or if you want to publish it with configuration overrides for hot-reload:

```
$ tfx extension publish --manifest-globs azure-devops-extension.json src/Components/**/*.json -t <PAT-TOKEN> --publisher <PUBLISHER> --extension-id <EXT_ID> --share-with <MYORGNAME> --overrides-file config/dev.json
```

You can build and publish your own extension, modify the azure-devops-extension.json manifest with your publisher details, and run:

```
$ npm run build:prod
```

> See [package and publish extensions for more information](https://learn.microsoft.com/en-us/azure/devops/extend/publish/overview?toc=%2Fazure%2Fdevops%2Fmarketplace-extensibility%2Ftoc.json&view=azure-devops).

6. To use hot-reload locally:

```
npm run start:dev
```

Navigate to your Azure DevOps (AZDO) instance where your developer extension has been installed. You should now observe that any changes you make are automatically reflected in AZDO.

Please note that this feature is currently compatible with Edge and Chrome browsers. Although it functions with Firefox, it might trigger an error on https://localhost:3000.

For successful integration with AZDO, it's imperative to employ the secure https protocol instead of http. In order to proceed, you may need to grant your consent.

# References

* [Installing and using the extension](https://github.com/microsoft/azure-devops-copilot/blob/main/docs/README.md).
* [Azure DevOps extensibility points](https://learn.microsoft.com/en-us/azure/devops/extend/reference/targets/overview?toc=%2Fazure%2Fdevops%2Fmarketplace-extensibility%2Ftoc.json&view=azure-devops#hubs-and-hub-groups).
