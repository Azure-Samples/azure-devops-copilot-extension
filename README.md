# Azure DevOps Co-Pilot

Azure DevOps Co-Pilot is a proof-of-concept project born from the Microsoft Hackathon 2023. Its primary mission is to empower Product Owners and other team members to participate in the development lifecycle with an intelligent and highly personalized assistant using Azure OpenAI + Semantic Kernel that harnesses the power of Azure DevOps services. While initially designed as an Azure DevOps extension, the project has the potential to extend its capabilities to other platforms, including GitHub.

We recognize that every team defines and customizes its own processes and tools to suit its unique Software Development Lifecycle. We have made the decision to open-source this extension so that teams can adopt similar practices and tailor them to their specific requirements. This approach empowers teams to extend and customize the extension according to their needs, facilitating a seamless kickstart to their work without imposing rigid guidelines.

We intend to actively maintain this sample, ensuring it remains compatible with the latest versions of Semantic Kernel, Azure DevOps SDKs, and Azure Open AI features. However, please note that we will not be offering any formal support for this project. Contributions are always welcomed.

> Note: This project is a proof-of-concept sample to integrate OpenAI + Semantic Kernel + Azure DevOps, it is not itself a service provided by Microsoft. It contains sample code that can be used as base point for a service in production, however no support is provided.

## Key Features

### 1. Smart Assistance for Product Owners
Azure DevOps Co-Pilot redefines the role of Product Owners by providing them with a smart assistant capable of streamlining various aspects of project management and decision-making within the Azure DevOps ecosystem.

### 2. Versatile API Backend
The project includes a robust API backend that plays a pivotal role in connecting to Azure Open AI's Semantic Kernel. This connection enables advanced natural language processing, enhancing the assistant's ability to understand and interact with users effectively.

### 3. Azure DevOps Extension
The core of the project revolves around its Azure DevOps extension. This extension is designed to be adaptable, allowing users to configure it to connect to their own backend. This flexibility ensures that the solution can be tailored to meet unique requirements.

### 4. Open Source Initiative
Azure DevOps Co-Pilot is an open-source sample that can be adapted by different organizations for their specific needs in security, deployment, management and features. We also invite developers and enthusiasts to explore, learn, contribute, and collaborate. By embracing the principles of open source, we aim to foster a thriving community dedicated to improving and expanding the project's capabilities.

## Enhanced Development Workflow
Azure DevOps Co-Pilot not only offers smart assistance but also actively contributes to the improvement of your development workflow:

### 1. Consistency in User Story Creation
The assistant guides users in creating user stories that adhere to best practices and standard formats. This consistency promotes clarity and effective communication within your team.

### 2. Streamlined Test Case Creation
Co-Pilot simplifies the process of test case creation by offering templates and guidance, ensuring that your testing standards remain high.

### 3. Active Collaboration in Backlog Creation and Refinement
With Co-Pilot, all team members can actively participate in backlog creation and refinement. This inclusive approach ensures that your backlog is comprehensive and well-rounded.

### 4. Reduced Overhead for Product Owners
By automating repetitive tasks like work item management and status tracking, Co-Pilot reduces administrative overhead for Product Owners. This, in turn, enables them to focus on strategic planning and decision-making.

### 5. Risk Management and Idea Generation
The assistant is equipped to identify potential risks and suggest mitigation strategies based on historical data and industry best practices. Additionally, it aids in brainstorming sessions, helping teams generate innovative ideas and solutions to challenges.

## Getting Started

To embark on your journey with Azure DevOps Co-Pilot, refer to the [Getting Started guide](./docs/README.md) in the project's documentation. It offers comprehensive instructions on setting up the backend, configuring the extension, and harnessing the full potential of this intelligent assistant.

## Contributing to Azure DevOps Co-Pilot

Thank you for considering contributing to Azure DevOps Co-Pilot! Your contributions are valuable in making this project even more powerful and user-friendly for Product Owners using Azure DevOps services. To get started, we have three main areas for contribution:

* [Azure DevOps Integration](./azdo/azdo/README.md). **Technologies involved:** Typescript/Javascript, React, HTML/CSS.
* [Backend Api/ Azure OpenAI](./api/README.md). **Technologies involved:** OpenAI/Azure OpenAI, Azure Prompt Flow, Semantic Kernel, C#/netcore.
* [Infra as a Code / DevOps](./infra/README.md). **Technologies involved:** CI/CD, DevOps, GitHub actions, nodejs, Azure AD (Microsoft Entra ID), Bicep/ARM.
* Testing, Validation, and Data-Sets Creation. **Technologies involved:** Azure Prompt Flow, Jupyter notebooks, Semantic Kernel.

### Other notes

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft trademarks or logos is subject to and must follow [Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).

Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
