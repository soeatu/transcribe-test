# -----------------------------------------------------------------------------
# 出力値
# -----------------------------------------------------------------------------

output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "app_service_url" {
  value = "https://${azurerm_linux_web_app.main.default_hostname}"
}

output "app_service_name" {
  value = azurerm_linux_web_app.main.name
}

output "cosmos_db_endpoint" {
  value = azurerm_cosmosdb_account.main.endpoint
}

output "speech_service_region" {
  value = azurerm_cognitive_account.speech.location
}

output "openai_endpoint" {
  value = azurerm_cognitive_account.openai.endpoint
}

output "web_pubsub_hostname" {
  value = azurerm_web_pubsub.main.hostname
}

output "key_vault_name" {
  value = azurerm_key_vault.main.name
}

output "application_insights_connection_string" {
  value     = azurerm_application_insights.main.connection_string
  sensitive = true
}
