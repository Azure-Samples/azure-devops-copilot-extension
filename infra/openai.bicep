param location string = resourceGroup().location

@description('Id of the deployment, defaults to utcNow() in the format yyyyMMddhhmmss')
param deploymentSuffix string = utcNow('yyyyMMddhhmmss')

var resourceSuffix = uniqueString(resourceGroup().id, location)

param name string = 'devops-copilot-openai-${resourceSuffix}'
param tags object = {}

var deployments array = [
      {
        name: 'model-deployment-${resourceSuffix}'
        model: {
          format: 'OpenAI'
          name: 'gpt-35-turbo'
          version: '0301'
        }
        scaleSettings: {
          scaleType: 'Standard'
        }
        sku: {
          name: 'Standard'
          capacity: 1
        }
      }
    ]
param kind string = 'OpenAI'
param publicNetworkAccess string = 'Enabled'
param sku object = {
  name: 'S0'
}

resource account 'Microsoft.CognitiveServices/accounts@2022-10-01' = {
  name: name
  location: location
  tags: tags
  kind: kind
  properties: {
    publicNetworkAccess: publicNetworkAccess
  }
  sku: sku
}

@batchSize(1)
resource deployment 'Microsoft.CognitiveServices/accounts/deployments@2022-10-01' = [for deployment in deployments: {
  parent: account
  name: deployment.name
  properties: {
    model: deployment.model
    raiPolicyName: contains(deployment, 'raiPolicyName') ? deployment.raiPolicyName : null
    scaleSettings: deployment.scaleSettings
  }
}]

output openAiEndpoint string = account.properties.endpoint
