import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostPageLayoutService, PanelSize } from "azure-devops-extension-api";
import { IWorkItemFormService, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";

SDK.register("generate-test-cases-menu", () => {
    return {
        execute: async (actionContext: any) => {
            const workItemFormService = await SDK.getService<IWorkItemFormService>(
                WorkItemTrackingServiceIds.WorkItemFormService
            );

            const panelService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);

            let acceptanceCriteria = null;
            try {
                acceptanceCriteria = await workItemFormService.getFieldValue(
                    "Microsoft.VSTS.Common.AcceptanceCriteria",
                    { returnOriginalValue: false }
                );
            } catch (error) {
                panelService.openMessageDialog(error, { title: "Error" });
                return;
            }

            if (acceptanceCriteria === null || !acceptanceCriteria) {
                panelService.openMessageDialog("No acceptance criteria found", { title: "Error" });
                return;
            }
            
            panelService.openPanel<boolean | undefined>(SDK.getExtensionContext().id + ".generate-test-cases-dialog", {
                title: "Test Cases Preview",
                size: PanelSize.Large,
                description: "Create a set of test cases within Azure DevOps using OpenAI",
                configuration: {
                    context: actionContext
                },
                onClose: (result) => {
                    if (result !== undefined) {
                        console.log("closing");
                    }
                }
            });
        }
    }
});

SDK.init();