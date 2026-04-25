# -----------------------------------------------------------------------------
# 共通変数
# -----------------------------------------------------------------------------
variable "subscription_id" {
  description = "Azure サブスクリプション ID"
  type        = string
}

variable "project_name" {
  description = "プロジェクト名（リソース名のプレフィックスに使用）"
  type        = string
  default     = "transcribe"
}

variable "environment" {
  description = "環境名 (dev / stg / prod)"
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Azure リージョン"
  type        = string
  default     = "japaneast"
}

# -----------------------------------------------------------------------------
# App Service
# -----------------------------------------------------------------------------
variable "app_service_sku" {
  description = "App Service プランの SKU"
  type        = string
  default     = "F1"
}

# -----------------------------------------------------------------------------
# Cosmos DB
# -----------------------------------------------------------------------------
variable "cosmos_db_database_name" {
  description = "Cosmos DB のデータベース名"
  type        = string
  default     = "transcribe-app"
}

variable "cosmos_db_container_name" {
  description = "Cosmos DB のコンテナ名"
  type        = string
  default     = "sessions"
}

# -----------------------------------------------------------------------------
# Azure OpenAI
# -----------------------------------------------------------------------------
variable "openai_model_name" {
  description = "デプロイする OpenAI モデル名"
  type        = string
  default     = "gpt-4o"
}

variable "openai_model_version" {
  description = "OpenAI モデルバージョン"
  type        = string
  default     = "2024-11-20"
}
