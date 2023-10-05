param location string = resourceGroup().location

@description('Id of the deployment, defaults to utcNow() in the format yyyyMMddhhmmss')
param deploymentSuffix string = utcNow('yyyyMMddhhmmss')

var resourceSuffix = uniqueString(resourceGroup().id, location)

module openAiServiceDeployment 'br:mcr.microsoft.com/bicep/ai/cognitiveservices:1.0.5' = {
  name: 'openaiservice-${deploymentSuffix}'
  params: {
    kind: 'OpenAI'
    name: 'devops-copilot-openai-${resourceSuffix}'
    skuName: 'S0'
    location: location
    deployments: [
      {
        name: 'model-deployment-${resourceSuffix}'
        sku: {
          name: 'Standard'
          capacity: 1
        }
        properties: {
          model: {
            format: 'OpenAI'
            name: 'gpt-35-turbo'
            version: '0301'
          }
          raiPolicyName: 'Microsoft.Default'
        }
      }
    ]
    restore: true
  }
}

output openAiEndpoint string = openAiServiceDeployment.outputs.endpoint
