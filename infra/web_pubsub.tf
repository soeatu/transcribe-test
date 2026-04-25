# -----------------------------------------------------------------------------
# Azure Web PubSub (Free_F1 — 無料枠)
# -----------------------------------------------------------------------------

resource "azurerm_web_pubsub" "main" {
  name                = "pubsub-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Free_F1" # 無料: 20 同時接続 / 20,000 メッセージ/日
  capacity            = 1

  tags = local.common_tags
}

resource "azurerm_web_pubsub_hub" "transcription" {
  name          = "transcription"
  web_pubsub_id = azurerm_web_pubsub.main.id

  event_handler {
    url_template       = "https://${azurerm_linux_web_app.main.default_hostname}/api/pubsub/eventhandler"
    system_events      = ["connect", "disconnected"]
    user_event_pattern = "*"
  }
}
