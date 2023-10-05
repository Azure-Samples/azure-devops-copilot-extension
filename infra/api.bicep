param location string = resourceGroup().location

@description('Id of the deployment, defaults to utcNow() in the format yyyyMMddhhmmss')
param deploymentSuffix string = utcNow('yyyyMMddhhmmss')

param image string = 'ghcr.io/microsoft/azure-devops-copilot:fix-dockerfile-path'

var resourceSuffix = uniqueString(resourceGroup().id, location)

@description('Id of the existing log analytics workspace')
param logAnalyticsWorkspaceResourceId string 

module apienvironment 'modules/carml/app/managed-environment/main.bicep' = {
  name : 'managed-environment-${deploymentSuffix}'
  params: {
    name: 'api-env-${resourceSuffix}'
    location: location
    enableDefaultTelemetry: false
    logAnalyticsWorkspaceResourceId: logAnalyticsWorkspaceResourceId
  }
}

module apiContainerApp 'modules/carml/app/container-app/main.bicep' = {
  name: 'api-container-app-${deploymentSuffix}'
  params: {
    name: 'api-container-app-${resourceSuffix}'
    location: location
    environmentId: apienvironment.outputs.resourceId
    containers: [
      {
        image: image
        name: 'app-container'
        probes: [] 
        resources: {
          cpu: '0.25'
          memory: '0.5Gi'
        }
      }
    ]
  }
}
