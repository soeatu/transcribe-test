# -----------------------------------------------------------------------------
# Azure Key Vault (シークレット管理)
# -----------------------------------------------------------------------------

resource "azurerm_key_vault" "main" {
  name                       = "kv-${var.project_name}-${var.environment}"
  resource_group_name        = azurerm_resource_group.main.name
  location                   = azurerm_resource_group.main.location
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7
  purge_protection_enabled   = false # dev 環境では無効化して削除を容易に

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "Get", "List", "Set", "Delete", "Purge"
    ]
  }

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# シークレット登録
# -----------------------------------------------------------------------------

resource "azurerm_key_vault_secret" "speech_key" {
  name         = "azure-speech-key"
  value        = azurerm_cognitive_account.speech.primary_access_key
  key_vault_id = azurerm_key_vault.main.id
}

resource "azurerm_key_vault_secret" "openai_key" {
  name         = "azure-openai-key"
  value        = azurerm_cognitive_account.openai.primary_access_key
  key_vault_id = azurerm_key_vault.main.id
}

resource "azurerm_key_vault_secret" "cosmos_connection_string" {
  name         = "cosmos-db-connection-string"
  value        = azurerm_cosmosdb_account.main.primary_sql_connection_string
  key_vault_id = azurerm_key_vault.main.id
}

resource "azurerm_key_vault_secret" "pubsub_connection_string" {
  name         = "pubsub-connection-string"
  value        = azurerm_web_pubsub.main.primary_connection_string
  key_vault_id = azurerm_key_vault.main.id
}
