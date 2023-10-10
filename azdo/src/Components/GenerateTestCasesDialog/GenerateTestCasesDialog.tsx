import "./GenerateTestCasesDialog.scss";

import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";

import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { css } from "azure-devops-ui/Util";

import { Toggle } from "azure-devops-ui/Toggle";
import { showRootComponent } from "../../Common";

import "azure-devops-ui/Core/override.css";
import { PanelFooter } from "azure-devops-ui/Components/Panel/PanelFooter";
import {
  IWorkItemFormService,
  WorkItemTrackingServiceIds,
} from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";
import { CopilotService, TestCase } from "../../Services/CopilotService";
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";

import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";

export const TITLE_FIELD: string = "System.Title";
export const AREA_PATH_FIELD: string = "System.AreaPath";
export const WORK_ITEM_TYPE_FIELD: string = "System.WorkItemType";
interface IDialogContentState {
  context?: IActionContext;
  testCases: TestCase[];
  loading?: boolean;
  error?: string;
  copilotReady?: boolean;
}

interface IActionContext {
  tfsContext: TfsContext;
}

interface TfsContext {
  contextData: ContextData;
}

interface ContextData {
  project: ProjectContext;
  collection: CollectionContext;
}

interface ProjectContext {
  id: string;
  name: string;
}

interface CollectionContext {
  id: string;
  name: string;
}

const copilotService = new CopilotService();

class DialogContent extends React.Component<{}, IDialogContentState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      testCases: [],
      copilotReady: true //we assume the best at the start to avoid conflicting with loading flag
    };
  }

  public componentDidMount() {
    SDK.init();

    SDK.ready().then(async () => {
      const copilotIsReady = await copilotService.isReady();
      if (!copilotIsReady) {
        this.setState({ copilotReady: false });
        console.log(copilotIsReady);
        return;
      }

      const config = SDK.getConfiguration();
      const context = config.context || {};
      const workItemFormService = await SDK.getService<IWorkItemFormService>(
        WorkItemTrackingServiceIds.WorkItemFormService
      );

      let acceptanceCriteria = null;
      try {
        acceptanceCriteria = await workItemFormService.getFieldValue(
          "Microsoft.VSTS.Common.AcceptanceCriteria",
          { returnOriginalValue: false }
        );
      } catch (error) {
        console.error(error);
      }

      this.setState({
        context,
        testCases: [],
        loading: true,
      });

      if (acceptanceCriteria != null || acceptanceCriteria == "") {
        copilotService
          .getTestCasesPreview(acceptanceCriteria)
          .then((testCases) => {
            this.setState({
              testCases: testCases,
              loading: false,
            });

            console.log(testCases);
          })
          .finally(() => {
            if (
              this.state.testCases == null ||
              this.state.testCases.length == 0
            ) {
              this.setState({
                error:
                  "Something went wrong creating test cases, please try again.",
                loading: false,
              });
            }
          });
      } else {
        this.setState({
          error:
            "Acceptance criteria is empty, please update before trying again.",
          loading: false,
        });
      }
    });
  }

   async createTestCases(context: IActionContext) {
    const copilotService = new CopilotService();

    const selectedTestCases = this.state.testCases.filter(
      (testCase) => testCase.checked
    );

    const isCreated = await copilotService.createTestCase(
      selectedTestCases,
      context.tfsContext.contextData.collection.name,
      context.tfsContext.contextData.project.name
    );

    if (isCreated) {
      alert("Test cases created successfully!");
      this.dismiss();
    } else {
      this.setState({
        error: "Something went wrong creating test cases, please try again.",
        loading: false,
      });
    }
  }

  // update toggle

  updateItem(event: any, index1: number | string) {
    const testCasesToUpdate = [...this.state.testCases];

    if (testCasesToUpdate[index1].checked === null) {
      testCasesToUpdate[index1].checked = true;
    } else {
      testCasesToUpdate[index1].checked = !testCasesToUpdate[index1].checked;
    }

    this.setState({ testCases: testCasesToUpdate });
  }

  // update title
  updateTitle(event: any, index1: number | string) {
    const testCasesToUpdate = [...this.state.testCases];

    testCasesToUpdate[index1].title = event.currentTarget.value;

    this.setState({ testCases: testCasesToUpdate });
  }

  // update steps/action
  updateSteps(event: any, index1: number | string, index2: number | string) {
    const testCasesToUpdate = [...this.state.testCases];

    testCasesToUpdate[index1].testCaseSteps[index2].action =
      event.currentTarget.value;

    this.setState({ testCases: testCasesToUpdate });
  }

  // update steps/expected
  updateActions(event: any, index1: number | string, index2: number | string) {
    const testCasesToUpdate = [...this.state.testCases];

    testCasesToUpdate[index1].testCaseSteps[index2].expectedResult =
      event.currentTarget.value;

    this.setState({ testCases: testCasesToUpdate });
  }

  private dismiss() {
    const config = SDK.getConfiguration();
    if (config.dialog) {
      config.dialog.close();
    } else if (config.panel) {
      config.panel.close();
    }
  }

  public render(): JSX.Element {
    const { testCases, context, copilotReady } = this.state;

    return copilotReady ? (
      <div className={css("modal-container")}>
        {this.state.loading ? (
          <div>
            <Spinner size={SpinnerSize.medium} />
            Loading...
          </div>
        ) : (
          <>
            <div className={css("flex-column flex-grow")}>
              {this.state.testCases.length > 0 && (
                <div>
                  {testCases &&
                    testCases?.length > 0 &&
                    testCases.map((testCase: TestCase, index1: any) => {
                      return (
                        <div className={css("test-case-grid-container")}>
                          
                          <div className={css("test-case-grid-item1")}>
                            <Toggle
                              ariaLabel="Create test case toggle"
                              checked={testCase.checked}
                              onChange={(e) => this.updateItem(e, index1)}
                              data-id={`toggle-${index1}`}
                            />
                            &nbsp;&nbsp;</div>
                            
                          <div className={css("test-case-grid-item2")}>
                            <div className={css("flex flex-row")}>
                              <div className={css("test-title-label")}>Title:</div>
                              &nbsp;&nbsp;
                              <TextField
                                ariaLabel="Test case title"
                                value={testCase.title}
                                onChange={(e) => this.updateTitle(e, index1)}
                                className={css("test-title-input very-light-border")}
                                width={TextFieldWidth.auto}
                              />
                            </div>
                          </div>
                          <div className={css("test-case-grid-item3")}>
                            <table>
                            <thead>
                              <tr>
                                <td aria-label="Step column">Step</td>
                                <td aria-label="Action column">Action</td>
                                <td aria-label="Expected column">Expected</td>
                              </tr>
                            </thead>
                            <tbody>
                              {testCase &&
                                testCase.testCaseSteps.length > 0 &&
                                testCase.testCaseSteps.map(
                                  (step, index2: any) => {
                                    return (
                                      <>
                                        <tr>
                                          <td className="vertical-align-center">{step.index}</td>
                                          <td className="test-step-column">
                                            <TextField
                                              ariaLabel="Test case action"
                                              value={step.action}
                                              onChange={(e) => this.updateSteps(e, index1, index2)}
                                              multiline
                                              width={TextFieldWidth.auto}
                                              className={css("very-light-border")}
                                              data-id={`action-${index1}-${index2}`}
                                            />
                                          </td>

                                          <td className="test-step-column">
                                            <TextField
                                              ariaLabel="Expected result"
                                              value={step.expectedResult}
                                              onChange={(e) => this.updateActions(e, index1, index2)}
                                              multiline
                                              width={TextFieldWidth.auto}
                                              className={css("very-light-border")}
                                              data-id={`expected-${index1}-${index2}`}
                                            />
                                          </td>
                                        </tr>
                                      </>
                                    );
                                  }
                                )}
                            </tbody>
                          </table>
                          </div>
                          
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
            <div>
              {testCases.length > 0 && ("Total Test Cases: " + this.state.testCases.filter(tc => tc.checked).length + "/" + testCases.length)}
              <PanelFooter
                className={css("bolt-dialog-resizable-footer footer-buttons")}
                showSeparator={false}
                buttonProps={[
                  {
                    text: "Bulk create",
                    ariaLabel: "Bulk create test cases",
                    onClick: async () => {
                      await this.createTestCases(context);
                    },
                    primary: true,
                  },
                  {
                    ariaLabel: "Cancel creating test cases",
                    text: "Cancel",
                    onClick: () => this.dismiss(),
                  },
                ]}
              />
            </div>
          </>
        )}
      </div>
    ) : (<>
      <div>
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
      </div>
    </>);
  }
}

showRootComponent(<DialogContent />);
