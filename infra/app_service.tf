# -----------------------------------------------------------------------------
# App Service Plan + Web App
# -----------------------------------------------------------------------------

resource "azurerm_service_plan" "main" {
  name                = "plan-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = var.app_service_sku

  tags = local.common_tags
}

resource "azurerm_linux_web_app" "main" {
  name                = "app-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    application_stack {
      node_version = "20-lts"
    }

    # F1 プランでは WebSocket 非対応のため、B1 以上にアップグレード時に有効化
    websockets_enabled = var.app_service_sku != "F1" ? true : false
  }

  app_settings = {
    "NODE_ENV"                          = var.environment == "prod" ? "production" : "development"
    "AZURE_SPEECH_REGION"               = var.location
    "AZURE_OPENAI_ENDPOINT"             = azurerm_cognitive_account.openai.endpoint
    "AZURE_OPENAI_DEPLOYMENT"           = var.openai_model_name
    "AZURE_PUBSUB_HUB_NAME"            = "transcription"
    "COSMOS_DB_ENDPOINT"                = azurerm_cosmosdb_account.main.endpoint
    "COSMOS_DB_DATABASE"                = var.cosmos_db_database_name
    "COSMOS_DB_CONTAINER"               = var.cosmos_db_container_name
    "APPINSIGHTS_INSTRUMENTATIONKEY"    = azurerm_application_insights.main.instrumentation_key
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = azurerm_application_insights.main.connection_string
  }

  tags = local.common_tags
}
