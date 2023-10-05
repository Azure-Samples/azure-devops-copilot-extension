import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";
import { showRootComponent } from "../../Common";
import { ConfigurationContext, CopilotService } from '../../Services/CopilotService';
import { ServerSettings } from './Components/ServerSettings';
import { getClient } from 'azure-devops-extension-api';
import { FeatureManagementRestClient } from 'azure-devops-extension-api/FeatureManagement';

interface IExtensionSettingsHubContent {}

export class ConfigurationSettingsHub extends React.Component<{}, IExtensionSettingsHubContent> {
    static contextType = ConfigurationContext;
    context!: React.ContextType<typeof ConfigurationContext>;

    constructor(props: {}) {
        super(props);

        this.state = {};
    }

    public async componentWillMount() {
        await SDK.init();
    }

    public async componentDidMount() {
        await SDK.ready();

        const extensionId = SDK.getExtensionContext().id;
    }

    public render(): JSX.Element {
        return (
            /*<ZeroData imageAltText={}/>*/
            <Page className="sample-hub flex-grow">

                <Header title="Azure DevOps Copilot" titleSize={TitleSize.Large} />

                <div className="page-content">
                    <h2>Settings</h2>
                    <ServerSettings/>
                </div>
            </Page>
        );
    }
}

showRootComponent(
    <ConfigurationContext.Provider value={new CopilotService()}>
        <ConfigurationSettingsHub />
    </ConfigurationContext.Provider>
);