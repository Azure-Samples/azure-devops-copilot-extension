// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import { TextField } from 'azure-devops-ui/TextField';
import { Button } from 'azure-devops-ui/Button';
import { ConfigurationContext } from '../../../Services/CopilotService';

export interface IServerSettingsState {
    serverUrl?:  string;
    serverUrlInput?: string;
}

export class ServerSettings extends React.Component<{}, IServerSettingsState> {
    static contextType = ConfigurationContext;
    context!: React.ContextType<typeof ConfigurationContext>;

    constructor(props: {}) {
        super(props);
        this.state = {
            serverUrl: undefined,
        };
    }

    public async componentDidMount() {
        const config = await this.context.getServerUrl();
        this.setState({
            serverUrl: config,
            serverUrlInput: config,
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
                    />
                    <Button
                        text="Save"
                        primary={true}
                        onClick={this.setServerUrl}
                        disabled={this.state.serverUrl === this.state.serverUrlInput}
                    />
                </div>
            </div>
        );
    }

    private onServerUrlInputChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value: string): void => {
        this.setState({ serverUrlInput: value });
    }

    private setServerUrl = async (): Promise<void> => {
        const { serverUrlInput } = this.state;
        if (serverUrlInput === undefined)
            return;
        await this.context.setServerUrl(serverUrlInput);
        this.setState({
            serverUrl: serverUrlInput
        });
    }
}