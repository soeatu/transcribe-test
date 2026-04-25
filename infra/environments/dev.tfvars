# =============================================================================
# 開発環境 (dev) — 最安構成
# =============================================================================

subscription_id = "YOUR_SUBSCRIPTION_ID" # ← Azure サブスクリプション ID を設定

project_name = "transcribe"
environment  = "dev"
location     = "japaneast"

# App Service: F1 (Free)
# ※ WebSocket 非対応。WebSocket が必要な場合は "B1" に変更
app_service_sku = "F1"

# Cosmos DB: Serverless (variables.tf のデフォルト値を使用)
# Speech Service: F0 Free (cognitive_services.tf でハードコード)
# Web PubSub: Free_F1 (web_pubsub.tf でハードコード)
# OpenAI: S0 (Free プランなし、従量課金)

# OpenAI モデル
openai_model_name    = "gpt-4o"
openai_model_version = "2024-11-20"
