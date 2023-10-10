// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* tslint:disable */
import * as SDK from "azure-devops-extension-sdk";
import {
  CommonServiceIds,
  IExtensionDataService,
  IProjectPageService,
} from "azure-devops-extension-api";
import React from "react";
import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, {
  // https://github.com/softonic/axios-retry/blob/master/es/index.mjs
  retryDelay: (retryCount: number | undefined, error: Error | undefined) =>
    axiosRetry.exponentialDelay(retryCount, error, 1000),
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

export interface IUserStory {
  title: string;
  description: string;
  acceptanceCriteria: string;
}

interface TestCaseStep {
  index: number;
  action: string;
  expectedResult: string;
}

export class TestCase {
  checked: boolean = true;
  title: string;
  testCaseSteps: TestCaseStep[];
}

export class CopilotService {
  private static readonly AuthenticationCookieName =
    "ado.innersource.authentication";
  private static readonly ConfigurationKey = "configuration";
  private static readonly UserPreferrencePrefix = "userconfiguration";

  private isAuthenticated = false;

  public async ensureAuthenticated(): Promise<void> {
    if (!(await this.isReady())) {
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
      const response = await axios.post<{
        accessToken: string;
        expiresInSeconds: number;
      }>(
        `${serverUrl}/token`,
        {},
        {
          headers: {
            Authorization: "Bearer " + appToken,
            "X-AzureDevOps-AccessToken": accessToken,
          },
        }
      );

      document.cookie =
        CopilotService.AuthenticationCookieName +
        "=" +
        response.data.accessToken +
        "; Max-age=" +
        response.data.expiresInSeconds +
        "; SameSite=None; Secure"; // Need to set it with SameSite=none otherwise the cookie is not readable within our iframe
      console.log("Authentication success: ", response.status);
      this.isAuthenticated = true;
    } catch (e) {
      let data = {};
      if (axios.isAxiosError(e)) {
        data = (e as AxiosError).toJSON();
      }
      console.log("Authentication failed: ", data);
      this.isAuthenticated = false;
    }
  }

  public async getBadgeJwtToken(
    repositoryId: string
  ): Promise<{ accessToken: string; expiresInSeconds: number } | undefined> {
    const projectService = await SDK.getService<IProjectPageService>(
      CommonServiceIds.ProjectPageService
    );
    const project = await projectService.getProject();
    if (!project) {
      console.error("Could not identify current project");
      return undefined;
    }

    const serverUrl = await this.getServerUrl();
    try {
      const response = await axios.post<{
        accessToken: string;
        expiresInSeconds: number;
      }>(
        `${serverUrl}/${project.name}/repositories/${repositoryId}/badges/token`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + this.getJwtBearer(),
          },
        }
      );

      return {
        accessToken: response.data.accessToken,
        expiresInSeconds: response.data.expiresInSeconds,
      };
    } catch (e) {
      let data = {};
      if (axios.isAxiosError(e)) {
        data = (e as AxiosError).toJSON();
      }
      console.log("Could not get badge jwt token", data);
      return undefined;
    }
  }

  private async getApiUrl(endpoint: string): Promise<string> {
    const serverUrl = (await this.getServerUrl()).replace(/\/$/, '');
    return `${serverUrl}/api/${endpoint}`;
  }

  public async generateUserStory(
    personaName: string,
    userStoryDescription: string,
    projectContext: string,
    userStoryStyle: string
  ): Promise<IUserStory> {
    
    try {
      const userStoryUrl = await this.getApiUrl("UserStory");
      const response = await axios.post<IUserStory>(
        userStoryUrl,
        {
          projectContext,
          userStoryDescription,
          personaName,
          userStoryStyle
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + this.getJwtBearer(),
          },
        }
      );
      return response.data;
    } catch (e) {
      let data = {};
      if (axios.isAxiosError(e)) {
        data = (e as AxiosError).toJSON();
      }
    }
  }

  public async unstarRepository(
    projectName: string,
    repositoryId: string
  ): Promise<void> {
    const serverUrl = await this.getServerUrl();
    try {
      const response = await axios.delete(
        `${serverUrl}/${projectName}/repositories/${repositoryId}/stars`,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + this.getJwtBearer(),
          },
        }
      );
    } catch (e) {
      let data = {};
      if (axios.isAxiosError(e)) {
        data = (e as AxiosError).toJSON();
      }
      console.log("Could not unstar repository", data);
    }
  }

  public async isReady(): Promise<boolean> {
    return !!(await this.getServerUrl());
  }

  public async setServerUrl(serverUrl: string): Promise<void> {
    await SDK.ready();
    const accessToken = await SDK.getAccessToken();
    const extDataService = await SDK.getService<IExtensionDataService>(
      CommonServiceIds.ExtensionDataService
    );
    const dataManager = await extDataService.getExtensionDataManager(
      SDK.getExtensionContext().id,
      accessToken
    );

    await dataManager.setValue<IConfiguration>(
      CopilotService.ConfigurationKey,
      {
        serverUrl,
      },
      { scopeType: "Default" }
    );
  }

  public async getServerUrl(): Promise<string | undefined> {
    await SDK.ready();
    const accessToken = await SDK.getAccessToken();
    const extDataService = await SDK.getService<IExtensionDataService>(
      CommonServiceIds.ExtensionDataService
    );
    const dataManager = await extDataService.getExtensionDataManager(
      SDK.getExtensionContext().id,
      accessToken
    );

    let data;
    try {
      data = await dataManager.getValue<IConfiguration | undefined>(
        CopilotService.ConfigurationKey,
        { scopeType: "Default" }
      );
    } catch (e) {
      // Swallow errors
      console.log("Could not find configuration", e);
    }

    return data?.serverUrl;
  }

  public async setUserPreferrence<T>(key: string, value: T): Promise<void> {
    await SDK.ready();
    const accessToken = await SDK.getAccessToken();
    const extDataService = await SDK.getService<IExtensionDataService>(
      CommonServiceIds.ExtensionDataService
    );
    const dataManager = await extDataService.getExtensionDataManager(
      SDK.getExtensionContext().id,
      accessToken
    );

    await dataManager.setValue<T>(
      CopilotService.UserPreferrencePrefix + key,
      value,
      { scopeType: "User" }
    );
  }

  public async getUserPreferrence<T>(key: string): Promise<T | undefined> {
    await SDK.ready();
    const accessToken = await SDK.getAccessToken();
    const extDataService = await SDK.getService<IExtensionDataService>(
      CommonServiceIds.ExtensionDataService
    );
    const dataManager = await extDataService.getExtensionDataManager(
      SDK.getExtensionContext().id,
      accessToken
    );

    let data;
    try {
      data = await dataManager.getValue<T | undefined>(
        CopilotService.UserPreferrencePrefix + key,
        { scopeType: "User" }
      );
    } catch (e) {
      // Swallow errors
      console.log("Could not find user preferrence", e);
    }

    return data;
  }

  private getJwtBearer(): string | undefined {
    return this.getCookie(CopilotService.AuthenticationCookieName);
  }

  // Source: https://stackoverflow.com/a/15724300/6316091
  private getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift();
    }
    return undefined;
  }

  public async getTestCasesPreview(acceptanceCriteria): Promise<TestCase[]> {
    // Function to remove HTML tags
    function stripHtmlTags(input: string): string {
      return input.replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/g, "");
    }

    // Remove HTML tags from acceptanceCriteria
    const cleanedAcceptanceCriteria = stripHtmlTags(acceptanceCriteria);
    const endpointUrl = await this.getApiUrl("TestCase");
    return axios
      .post(endpointUrl, {
        acceptanceCriteria: cleanedAcceptanceCriteria,
      })
      .then((response) => {
        console.log("API Response:", response.data);
        return response.data.map((testCase) =>
          Object.assign(new TestCase(), testCase)
        );
      })
      .catch((error) => {
        console.error("Error fetching test cases:", error);
        return [];
      });
  }

  public async createTestCase(
    testCases: TestCase[],
    organization,
    project
  ): Promise<boolean> {
    const apiUrl = await this.getApiUrl("azdo/TestCases");
    const data = {
      organization: organization,
      areaPath: project,
      project: project,
      testCases: testCases,
    };
    return axios
      .post(apiUrl, data)
      .then((response) => {
        console.log("API Response Successful");
        return true;
      })
      .catch((error) => {
        console.error("Error creating test case:", error);
        return false;
      });
  }
}

export const ConfigurationContext = React.createContext(new CopilotService());