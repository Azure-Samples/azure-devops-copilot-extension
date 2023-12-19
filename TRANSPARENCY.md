# Responsible AI FAQ

## What is Azure DevOps Copilot Extension?

Azure DevOps Copilot Extension is an Azure DevOps Boards Extension sample that integrates Semantic Kernel and OpenAI to assist Product Owners in crafting user stories. At its core, this extension aids software development teams in maintaining consistency in the documentation of user stories. The system takes user input, project context, acceptance criteria, and its outputs include user story descriptions and test cases.

## What can Azure DevOps Copilot Extension Sample do?

Out-of-the-box the Azure DevOps Copilot Extension sample, is not directly usable. Users need to deploy their own backend, based in the sample, and compile and publish the Azure DevOps extension in the marketplace. Azure DevOps Copilot Extension sample, provide sample prompts, a sample backend, and sample integrations within Azure DevOps UI, to accelerate such implementations in our users and customers.

## What is/are Azure DevOps Copilot extension’s intended use(s)?

The intended use(s) of Azure DevOps Copilot Extension are outlined in the Impact Assessment. These uses include streamlining the user story creation process for software development teams, promoting consistency in documentation, and leveraging AI-powered tools for enhanced productivity in Azure DevOps Boards.

## How was [System or Product Name] evaluated? What metrics are used to measure performance?

The evaluation of Azure DevOps Copilot Extension involved assessing its functionality and effectiveness in assisting Product Owners. Metrics such as response time, accuracy in generating user stories, and alignment with acceptance criteria were considered. Results indicated high accuracy and performance, and their generalizability across different software development use cases was validated.

*Note: The specific assessment activities are performed internally, and certain details are not publicly disclosed.*

## What are the limitations of Azure DevOps Copilot Extension? How can users minimize the impact of its limitations when using the system?

As per the Impact Assessment, Azure DevOps Copilot Extension has limitations, including potential variations in response accuracy and adaptability to highly specialized projects. Users can minimize the impact by providing clear and detailed input, validating generated content, and understanding the system's strengths and weaknesses. Users can also (and should) modify the sample prompts to suit their specific needs.

Speaking of technical limitations, the Azure DevOps Copilot extension does not come with a pre-implemented backend authentication. While a basic OAuth authentication implementation is relatively straightforward, we intentionally chose not to include it in the design. This decision was made to allow users the flexibility to evaluate and implement their own authentication methods, encouraging a more customized and secure authentication process as a **conscious step** towards system integration, deployment and security considerations.

## What operational factors and settings allow for effective and responsible use of [System or Product Name]?

Operational factors for effective and responsible use of Azure DevOps Copilot Extension include consistent input quality, alignment with project goals, and periodic validation of generated content. End users can customize prompts and integrate settings based on project requirements, impacting the efficiency and reliability of the extension in real-world scenarios.