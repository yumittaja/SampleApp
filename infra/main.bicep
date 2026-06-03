@description('The Azure region for all resources.')
param location string = resourceGroup().location

@description('Globally unique name for the Web App. Also used as the default hostname.')
param webAppName string

@description('Name of the App Service plan.')
param appServicePlanName string = '${webAppName}-plan'

@description('The pricing tier for the App Service plan.')
@allowed([
  'F1'
  'B1'
  'B2'
  'P0v3'
  'P1v3'
])
param sku string = 'B1'

@description('The Node.js runtime version for the Linux Web App.')
param linuxFxVersion string = 'NODE|20-lts'

@description('Name of the Log Analytics workspace backing Application Insights.')
param logAnalyticsName string = '${webAppName}-logs'

@description('Name of the Application Insights component.')
param appInsightsName string = '${webAppName}-insights'

resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  sku: {
    name: sku
  }
  properties: {
    // Required for Linux plans
    reserved: true
  }
}

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

resource webApp 'Microsoft.Web/sites@2024-04-01' = {
  name: webAppName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: linuxFxVersion
      alwaysOn: sku != 'F1'
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      appCommandLine: 'node server.js'
      appSettings: [
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'false'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
        {
          name: 'ApplicationInsightsAgent_EXTENSION_VERSION'
          value: '~3'
        }
        {
          name: 'XDT_MicrosoftApplicationInsights_Mode'
          value: 'recommended'
        }
      ]
    }
  }
}

@description('The default hostname of the deployed Web App.')
output webAppHostName string = webApp.properties.defaultHostName

@description('The resource name of the Web App (use for the GitHub Actions AZURE_WEBAPP_NAME).')
output webAppName string = webApp.name

@description('The Application Insights connection string.')
@secure()
output appInsightsConnectionString string = appInsights.properties.ConnectionString
