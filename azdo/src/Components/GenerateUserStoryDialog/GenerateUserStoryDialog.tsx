import "./GenerateUserStoryDialog.scss";

import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { css } from "azure-devops-ui/Util";

import { Toggle } from "azure-devops-ui/Toggle";
import { showRootComponent } from "../../Common";
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";
import { ObservableValue } from "azure-devops-ui/Core/Observable";

import { Dropdown } from "azure-devops-ui/Dropdown";
import { DropdownSelection } from "azure-devops-ui/Utilities/DropdownSelection";

import "azure-devops-ui/Core/override.css";
import { PanelFooter } from "azure-devops-ui/Components/Panel/PanelFooter";
import { CopilotService } from "../../Services/CopilotService";
import { IWorkItemFormService, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";

interface IDialogContentState {
  workItemContext?: any;
  generateTitle?: boolean;
  generateAC?: boolean;
  generateDescription?: boolean;
  ready?: boolean;
  userStoryDescription?: string;
  personaName?: string;
  updateMethod?: string;
  userStoryStyle?: string;
  copilotReady?: boolean;
}

const multilineObservable = new ObservableValue<string>("");
const updateTypeItem = new DropdownSelection();
const userStoryStyleItem = new DropdownSelection();

const copilotService = new CopilotService();

class DialogContent extends React.Component<{}, IDialogContentState> {


  constructor(props: {}) {
    super(props);
    this.state = { copilotReady: true };
  }

  public componentDidMount() {
    SDK.init();

    SDK.ready().then(async () => {
      const copilotIsReady = await copilotService.isReady();
      if (!copilotIsReady) {
        this.setState({ copilotReady: false });
        return;
      }

      const config = SDK.getConfiguration();
      const workItemContext = config.workItemContext || {};
      this.setState({
        workItemContext,
        generateTitle: true,
        generateAC: true,
        generateDescription: true,
        ready: true,
        userStoryDescription: multilineObservable.value
      });

      updateTypeItem.select(0);
      userStoryStyleItem.select(0);
    });
  }

  public onUserStoryChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => {
    if (value !== undefined) {
      this.setState({ userStoryDescription: value });
    }
  };

  public onPersonaChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => {
    if (value !== undefined) {
      this.setState({ personaName: value });
    }
  };

  async generateUserStory() {
    try {
      const userStory = await copilotService.generateUserStory(this.state.personaName, this.state.userStoryDescription, "software development system", this.state.userStoryStyle);

      const workItemFormService = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);

      const currentTitle = await workItemFormService.getFieldValue("title", { returnOriginalValue: false });
      const currentDescription = await workItemFormService.getFieldValue("description", { returnOriginalValue: false });
      const currentAcceptanceCriteria = await workItemFormService.getFieldValue("Microsoft.VSTS.Common.AcceptanceCriteria", { returnOriginalValue: false });

      const isNullOrEmpty = (str: string | null | undefined | object) => !str ? true : str.toString().trim() === '';

      let updateTitle = this.state.generateTitle;
      let updateDescription = this.state.generateDescription;
      let updateAcceptanceCriteria = this.state.generateAC;

      let title = userStory.title;
      let description = userStory.description;
      let acceptanceCriteria = userStory.acceptanceCriteria

      switch (this.state.updateMethod) {
        case "override":
          break;
        case "append":
          title = currentTitle + " - " + userStory.title;
          description = currentDescription + "\n" + userStory.description;
          acceptanceCriteria = currentAcceptanceCriteria + "\n" + userStory.acceptanceCriteria;
          break;
        case "update":
        default:
          updateTitle = updateTitle && isNullOrEmpty(currentTitle);
          updateDescription = updateDescription && isNullOrEmpty(currentDescription);
          updateAcceptanceCriteria = updateAcceptanceCriteria && isNullOrEmpty(currentAcceptanceCriteria);
          break;
      }

      if (updateTitle) { workItemFormService.setFieldValue("System.Title", title); }
      if (updateDescription) { workItemFormService.setFieldValue("System.Description", description); }
      if (updateAcceptanceCriteria) { workItemFormService.setFieldValue("Microsoft.VSTS.Common.AcceptanceCriteria", acceptanceCriteria); }

    } catch (e) {
      console.log("ERROR", e);
    }
    this.dismiss(true)
  }
  

  public render(): JSX.Element {
    const { copilotReady, ready, generateTitle, userStoryDescription, personaName, generateAC, generateDescription, updateMethod, userStoryStyle } = this.state;

    return copilotReady ? (
      <div className={css("modal-container")}>
        <div className={css("flex-column flex-grow")}>
          <TextField
            ariaLabel="Persona name"
            value={personaName}
            onChange={this.onPersonaChange}
            label="Persona name"
            rows={1}
            width={TextFieldWidth.auto}
            className="input-modal"
          />

          <TextField
            ariaLabel="Describe your user story"
            value={userStoryDescription}
            onChange={this.onUserStoryChange}
            multiline
            label="Describe your user story now"
            rows={4}
            width={TextFieldWidth.auto}
            className="input-modal"
          />

          <Toggle
            className={css("give-me-space")}
            checked={generateTitle}
            text="Generate title"
            disabled={!ready}
            onChange={(e, val) => this.setState({ generateTitle: val })}
          />

          <Toggle
            className={css("give-me-space")}
            checked={generateAC}
            text="Generate acceptance criteria"
            disabled={!ready}
            onChange={(e, val) => this.setState({ generateAC: val })}
          />

          <Toggle
            className={css("give-me-space")}
            checked={generateDescription}
            text="Generate description"
            disabled={!ready}
            onChange={(e, val) => this.setState({ generateDescription: val })}
          />

          <Dropdown
            className={css("give-me-space")}
            ariaLabel="Descrption style"
            placeholder="Descrption style"
            selection={userStoryStyleItem}
            onSelect={(e, val) => this.setState({ userStoryStyle: val.id })}
            items={[
              { id: "classic", text: "Classic" },
              { id: "hypothesis", text: "Hypothesis-Driven Development" }
            ]}
          />

          <Dropdown
            className={css("give-me-space")}
            ariaLabel="Update method"
            placeholder="Update method"
            selection={updateTypeItem}
            onSelect={(e, val) => this.setState({ updateMethod: val.id })}
            items={[
              { id: "update", text: "Update only if empty" },
              { id: "append", text: "Append" },
              { id: "override", text: "Override" }
            ]}
          />

          <PanelFooter
            className={css("bolt-dialog-resizable-footer footer-buttons")}
            showSeparator={false}
            buttonProps={[
              {
                text: "OK",
                onClick: async () => await this.generateUserStory(),
                primary: true,
              },
              {
                text: "Cancel",
                onClick: () => this.dismiss(false),
              },
            ]}
          />
        </div>
      </div>
    ) : (<>
      <MessageCard
          buttonProps={[{
            text: "Open docs",
            href: "https://github.com/microsoft/azure-devops-copilot/blob/main/docs/README.md",
            target: "_blank"
          },
          {
            text: "Submit an issue",
            href: "https://github.com/microsoft/azure-devops-copilot/issues/new",
            target: "_blank"
          }]}
          className="flex-self-stretch"
          severity={MessageCardSeverity.Error}
        >
          Uh-oh! It looks like you have not configured the backend URL,
          please follow the documentation
          to deploy a backend and configure your extension.
          If you believe this is an error, please submit a new issue.
        </MessageCard>
    </>);
  }

  private dismiss(useValue: boolean) {
    const result = useValue ? this.state.generateTitle : undefined;
    const config = SDK.getConfiguration();
    if (config.dialog) {
      config.dialog.close(result);
    } else if (config.panel) {
      config.panel.close(result);
    }
  }
}

showRootComponent(<DialogContent />);