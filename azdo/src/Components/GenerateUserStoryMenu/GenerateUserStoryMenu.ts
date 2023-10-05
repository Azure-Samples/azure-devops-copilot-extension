import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostPageLayoutService } from "azure-devops-extension-api";

SDK.register("generate-user-story-menu", () => {
    return {
        execute: async (actionContext: any) => {
            const panelService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
            panelService.openPanel<boolean | undefined>(SDK.getExtensionContext().id + ".generate-user-story-dialog", {
                title: "Generate a user story",
                description: "Generate the user story description and acceptance criteria using OpenAI",
                configuration: {
                    workItemContext: actionContext
                },
                onClose: (result) => {
                    if (result !== undefined) {
                       console.log("closing")
                    }
                }
            });
        }
    }
});

SDK.init();