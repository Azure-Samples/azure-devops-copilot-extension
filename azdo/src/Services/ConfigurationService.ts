// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* tslint:disable */
import * as SDK from 'azure-devops-extension-sdk';
import { CommonServiceIds, IExtensionDataService, IProjectPageService } from 'azure-devops-extension-api';
import React from 'react';
import axios,  { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, {
    // https://github.com/softonic/axios-retry/blob/master/es/index.mjs
    retryDelay: (retryCount: number | undefined, error: Error | undefined) => axiosRetry.exponentialDelay(retryCount, error, 1000),
    retryCondition: (error: AxiosError) => {
        const shouldRetry = error.response?.status === 429;
        if (shouldRetry) {
            console.log(error.message, "Retrying");
        }
        return shouldRetry;
    },
} as axiosRetry.IAxiosRetryConfig);

interface IConfiguration {
    serverUrl: string;
}

export interface IRepositoryBadge {
    name: string;
    url: string;
}

export interface IRepository {
    project: string;
    id: string;
    name: string;
    description: string;
    installation: string;
    stars: {
        count: number;
        isStarred: boolean;
    };
    metadata: {
        url: string;
        lastCommitDate: string | null;
    };
    badges: IRepositoryBadge[];
}

export class ConfigurationService {
    private static readonly AuthenticationCookieName = "ado.innersource.authentication";
    private static readonly ConfigurationKey = "configuration";
    private static readonly UserPreferrencePrefix = "userconfiguration";

    private isAuthenticated = false;

    public async ensureAuthenticated(): Promise<void> {
        if (!await this.isReady()) {
            // Application is not properly configured
            return;
        }

        if (this.isAuthenticated) {
            // TODO: Invalidate this after a while
            return;
        }

        if (this.getJwtBearer()) {
            console.log("Authentication session still active.");
            return;
        }

        const accessToken = await SDK.getAccessToken();
        const appToken = await SDK.getAppToken();

        const serverUrl = await this.getServerUrl();
        try {
            const response = await axios.post<{accessToken: string, expiresInSeconds: number}>(`${serverUrl}/token`, {}, {
                headers: {
                    Authorization: 'Bearer ' + appToken,
                    'X-AzureDevOps-AccessToken': accessToken,
                }
            });

            document.cookie = ConfigurationService.AuthenticationCookieName + "=" + response.data.accessToken + "; Max-age=" + response.data.expiresInSeconds + "; SameSite=None; Secure"; // Need to set it with SameSite=none otherwise the cookie is not readable within our iframe
            console.log("Authentication success: ", response.status);
            this.isAuthenticated = true;
        }
        catch (e) {
            let data = {};
            if (axios.isAxiosError(e)) {
                data = (e as AxiosError).toJSON();
            }
            console.log("Authentication failed: ", data);
            this.isAuthenticated = false;
        }
    }

    public async getRepositories(): Promise<IRepository[]> {
        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();
        if (!project) {
            console.error('Could not identify current project')
            return [];
        }

        const serverUrl = await this.getServerUrl();
        try {
            const response = await axios.get<{repositories: IRepository[]}>(`${serverUrl}/${project.id}/repositories`, {
                headers: {
                    Authorization: 'Bearer ' + this.getJwtBearer(),
                }
            });
            return response.data.repositories;
        }
        catch (e) {
            let data = {};
            if (axios.isAxiosError(e)) {
                data = (e as AxiosError).toJSON();
            }
            console.error("Could not get repositories", data);
            return [];
        }
    }

    public async getBadgeJwtToken(repositoryId: string): Promise<{ accessToken: string, expiresInSeconds: number }|undefined> {
        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();
        if (!project) {
            console.error('Could not identify current project')
            return undefined;
        }

        const serverUrl = await this.getServerUrl();
        try {
            const response = await axios.post<{accessToken: string, expiresInSeconds: number}>(`${serverUrl}/${project.name}/repositories/${repositoryId}/badges/token`, {}, {
                headers: {
                    "Accept": "application/json",
                    Authorization: 'Bearer ' + this.getJwtBearer(),
                }
            });

            return {
                accessToken: response.data.accessToken,
                expiresInSeconds: response.data.expiresInSeconds,
            }
        }
        catch (e) {
            let data = {};
            if (axios.isAxiosError(e)) {
                data = (e as AxiosError).toJSON();
            }
            console.log("Could not get badge jwt token", data);
            return undefined;
        }
    }

    public async starRepository(projectName: string, repositoryId: string): Promise<void> {
        const serverUrl = await this.getServerUrl();
        try {
            const response = await axios.post(`${serverUrl}/${projectName}/repositories/${repositoryId}/stars`, {}, {
                headers: {
                    "Accept": "application/json",
                    Authorization: 'Bearer ' + this.getJwtBearer(),
                }
            });
        }
        catch (e) {
            let data = {};
            if (axios.isAxiosError(e)) {
                data = (e as AxiosError).toJSON();
            }
            console.log("Could not star repository", data);
        }
    }

    public async unstarRepository(projectName: string, repositoryId: string): Promise<void> {
        const serverUrl = await this.getServerUrl();
        try {
            const response = await axios.delete(`${serverUrl}/${projectName}/repositories/${repositoryId}/stars`, {
                headers: {
                    "Accept": "application/json",
                    Authorization: 'Bearer ' + this.getJwtBearer(),
                }
            });
        }
        catch (e) {
            let data = {};
            if (axios.isAxiosError(e)) {
                data = (e as AxiosError).toJSON();
            }
            console.log("Could not unstar repository", data);
        }
    }

    public async isReady(): Promise<boolean> {
        return !!await this.getServerUrl();
    }

    public async setServerUrl(serverUrl: string): Promise<void> {
        await SDK.ready();
        const accessToken = await SDK.getAccessToken();
        const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
        const dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);

        await dataManager.setValue<IConfiguration>(ConfigurationService.ConfigurationKey, {
            serverUrl
        },{ scopeType: "Default" });
    }

    public async getServerUrl(): Promise<string|undefined> {
        await SDK.ready();
        const accessToken = await SDK.getAccessToken();
        const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
        const dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);

        let data;
        try {
            data = await dataManager.getValue<IConfiguration|undefined>(ConfigurationService.ConfigurationKey, { scopeType: "Default" });
        }
        catch (e) {
            // Swallow errors
            console.log("Could not find configuration", e);
        }

        return data?.serverUrl;
    }

    public async setUserPreferrence<T>(key: string, value: T): Promise<void> {
        await SDK.ready();
        const accessToken = await SDK.getAccessToken();
        const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
        const dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);

        await dataManager.setValue<T>(ConfigurationService.UserPreferrencePrefix + key, value, { scopeType: "User" });
    }

    public async getUserPreferrence<T>(key: string): Promise<T|undefined> {
        await SDK.ready();
        const accessToken = await SDK.getAccessToken();
        const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
        const dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);

        let data;
        try {
            data = await dataManager.getValue<T|undefined>(ConfigurationService.UserPreferrencePrefix + key, { scopeType: "User" });
        }
        catch (e) {
            // Swallow errors
            console.log("Could not find user preferrence", e);
        }

        return data;
    }

    private getJwtBearer(): string | undefined {
        return this.getCookie(ConfigurationService.AuthenticationCookieName);
    }

    // Source: https://stackoverflow.com/a/15724300/6316091
    private getCookie(name: string): string | undefined {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()
                ?.split(';')
                .shift();
        }
        return undefined;
    }
}

export const ConfigurationContext = React.createContext(new ConfigurationService());