# Getting Started with Azure DevOps Co-Pilot

## Pre-requisites

Before you can begin using Azure DevOps Co-Pilot, please ensure that you meet the following pre-requisites:

- Membership in the Project Collection Administrators group for administrative access on the Azure DevOps Server where you intend to add this extension.
- A deployed and running [Azure DevOps Co-Pilot backend](/infra).

## Installation

1. Build and deploy the extension following [this documentation](/azdo).
2. Follow the steps outlined in the article [Install extensions](https://learn.microsoft.com/en-us/azure/devops/marketplace/install-extension?view=azure-devops&tabs=browser) for instructions on installing any Azure DevOps extension, including the one you have deployed.

**Note:** If you do not have permission to install extensions, you can request extensions instead. Follow the [Request and approve extensions for Azure DevOps](https://learn.microsoft.com/en-us/azure/devops/marketplace/request-extensions?toc=%2Fazure%2Fdevops%2Fmarketplace-extensibility%2Ftoc.json&view=azure-devops) link for more information.

Once installed, you will see the extension listed in your Organization settings.

## Usage

### End-to-End Flow

To get an overview of the end-to-end flow for generating and creating user stories and test cases in Azure DevOps, watch this recording: 

### Generate an AI-Assisted User Story

Now that the extension is installed in your Azure DevOps environment, you can start using it to generate AI-assisted user stories:

1. Open a user story.
2. Click on the three dots in the upper-right corner and select the 'AI – Generate Description' extension.

3. A panel window will open on the right side of the user story with the heading 'Generate a user story.'

4. In the modal window, fill in the following:
   - 'Persona' of the user for whom the story is being created. In some Agile processes it is also refered as actor (ex. Developer, Finance User, Marketing Executive, etc.).
   - 'Description' that you want to generate for the user story details. This does not need to be extensive, and can also be just keywords.
   - Optionally, you can turn on the toggle for additional features such as 'Generate title,' 'Generate acceptance criteria,' and 'Generate description'.
   
5. You can append, override the existing story details or add details only if they are empty.

6. Click 'OK' to generate the title, description, and acceptance criteria back into the user story work item.

7. Validate the accuracy of the details and adjust the text as needed. If you are satisfied with the content, click 'Save' to create the user story work item in your Azure DevOps project.

### Generate an AI-Assisted Test Case

To generate AI-assisted test cases, make sure you have a user story that has description and acceptance criteria:

1. Open the user story.
2. Click on the three dots in the upper-right corner and select the 'AI – Generate Test Cases' extension.

3. A panel window titled 'Test Cases Preview' will open on the right side of the user story work item.

4. Review the accuracy and relevancy of the test case titles, action steps, and expected results, and adjust the text as needed.

5. By default, the toggle is on for all test cases, indicating that they can be created in bulk as Test Case items in the Azure DevOps project. As needed, switch the toggle to Off.

6. At the end of the panel, you will see the "total number of test cases" generated. Click 'Create.'

7. The screen will display the selected test cases created as test case items in the Azure DevOps Project.

**Note:** Test cases are generated based on the static/predefined prompt, which involves creating positive and negative test case titles and test steps based on the given acceptance criteria in the user story.

## Frequently Asked Questions (FAQ)

Here are some common questions about Azure DevOps Co-Pilot:

- **Authentication and Authorization**: Authentication and Authorization for Co-Pilot happen using Azure Active Directory (AAD).

- **AI Model**: Co-Pilot uses a specific AI model to generate user story and test case details. (Include details about the AI model if relevant.)

- **Data Security**: Your data in the description field is securely handled. (Provide information about data security measures if necessary.)

- **Text Limit**: There may be limits on the text that can be processed in the description field. (Specify any text limits if applicable.)

- **Applicability**: Confirm if this extension is applicable for work items other than user stories and test cases in Azure DevOps. (Explain its applicability if it extends beyond user stories and test cases.)
