// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import { TextField, TextFieldWidth } from 'azure-devops-ui/TextField';
import { Button } from 'azure-devops-ui/Button';
import { ConfigurationContext } from '../../../Services/CopilotService';

export interface IServerSettingsState {
    serverUrl?:  string;
    serverUrlInput?: string;
    apiKey?:  string;
    apiKeyInput?: string;
}

export class ServerSettings extends React.Component<{}, IServerSettingsState> {
    static contextType = ConfigurationContext;
    context!: React.ContextType<typeof ConfigurationContext>;

    constructor(props: {}) {
        super(props);
        this.state = {
            serverUrl: undefined,
            apiKey: undefined
        };
    }

    public async componentDidMount() {
        const config = await this.context.getServerUrl();
        this.setState({
            serverUrl: config,
            serverUrlInput: config,
            apiKey: config,
            apiKeyInput: config,
        });
    }

    public render(): JSX.Element {
        return (
            <div>
                <h3>Server URL</h3>
                <div className="flex-row rhythm-horizontal-16">
                    <TextField
                        value={this.state.serverUrlInput}
                        onChange={this.onServerUrlInputChanged}
                        width={TextFieldWidth.auto}
                    />
                    <Button
                        text="Save"
                        primary={true}
                        onClick={this.saveConfig}
                        disabled={this.state.serverUrl === this.state.serverUrlInput}
                    />
                </div>
                <h3>API Key</h3>
                <div className="flex-row rhythm-horizontal-16">
                    <TextField
                        value={this.state.apiKeyInput}
                        onChange={this.onApiKeyInputChanged}
                        width={TextFieldWidth.auto}
                        inputType='password'
                    />
                    <Button
                        text="Save"
                        primary={true}
                        onClick={this.saveConfig}
                        disabled={this.state.apiKey === this.state.apiKeyInput}
                    />
                </div>
            </div>
        );
    }

    private onServerUrlInputChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value: string): void => {
        this.setState({ serverUrlInput: value });
    }

    private onApiKeyInputChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value: string): void => {
        this.setState({ apiKeyInput: value });
    }

    private saveConfig = async (): Promise<void> => {
        const { serverUrlInput, apiKeyInput } = this.state;
        
        if (serverUrlInput === undefined || apiKeyInput === undefined)
            return;

        await this.context.saveConfig(serverUrlInput, apiKeyInput);
        
        this.setState({
            serverUrl: serverUrlInput,
            apiKey: apiKeyInput
        });
    }
}