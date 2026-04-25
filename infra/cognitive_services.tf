# -----------------------------------------------------------------------------
# Azure AI Speech Service (F0 Free)
# -----------------------------------------------------------------------------

resource "azurerm_cognitive_account" "speech" {
  name                = "speech-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  kind                = "SpeechServices"
  sku_name            = "F0" # Free: 5時間/月の音声認識

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# Azure OpenAI Service (S0 — Free プランなし)
# -----------------------------------------------------------------------------

resource "azurerm_cognitive_account" "openai" {
  name                = "openai-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  kind                = "OpenAI"
  sku_name            = "S0"

  tags = local.common_tags
}

resource "azurerm_cognitive_deployment" "gpt4o" {
  name                 = var.openai_model_name
  cognitive_account_id = azurerm_cognitive_account.openai.id

  model {
    format  = "OpenAI"
    name    = var.openai_model_name
    version = var.openai_model_version
  }

  sku {
    name     = "Standard"
    capacity = 1 # 最小 TPM (1K tokens/min)
  }
}
