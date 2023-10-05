targetScope = 'subscription'

@description('Location to deploy resources to. Defaults to eastus')
param location string = 'eastus'

@description('Id of the deployment, defaults to utcNow() in the format yyyyMMddhhmmss')
param deploymentSuffix string = utcNow('yyyyMMddhhmmss')

param resourceGroupName string = 'devops-copilot'

var deploymentName = 'devops-copilot'

module resourceGroupDeployment 'modules/carml/resources/resource-group/main.bicep' = {
  scope: subscription()
  name: '${deploymentName}-rg'
  params: {
    name: resourceGroupName
    location: location
  }
}

module logAnalyticsWorkspaceDeployment 'logworkspace.bicep' = {
  scope: resourceGroup(resourceGroupName)
  name: '${deploymentName}-log-analytics-${deploymentSuffix}'
  params: {
    location: location
  }
  dependsOn: [
    resourceGroupDeployment
  ]
}

module apiDeployment 'api.bicep' = {
  scope: resourceGroup(resourceGroupName)
  name: '${deploymentName}-api-${deploymentSuffix}'
  params: {
    location: location
    deploymentSuffix: deploymentSuffix
    logAnalyticsWorkspaceResourceId: logAnalyticsWorkspaceDeployment.outputs.logAnalyticsWorkspaceId
  }
  dependsOn: [
    resourceGroupDeployment
    logAnalyticsWorkspaceDeployment
  ]
}

module openAiServiceDeployment 'openai.bicep' = {
  scope: resourceGroup(resourceGroupName)
  name: '${deploymentName}-openai-${deploymentSuffix}'
  params: {
    location: location
    deploymentSuffix: deploymentSuffix
  }
  dependsOn: [
    resourceGroupDeployment
  ]
}
