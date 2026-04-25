# =============================================================================
# 開発環境 (dev) — 最安構成
# =============================================================================

subscription_id = "" # ← Azure サブスクリプション ID を設定

project_name = "transcribe"
environment  = "dev"
location     = "japaneast"

# App Service: B1 (Basic)
# ※ F1 (Free) はリージョンによってクォータ制限あり。B1 は最安の有料プラン。
app_service_sku = "B1"

# Cosmos DB: Serverless (variables.tf のデフォルト値を使用)
# Speech Service: F0 Free (cognitive_services.tf でハードコード)
# Web PubSub: Free_F1 (web_pubsub.tf でハードコード)
# OpenAI: S0 (Free プランなし、従量課金)

# OpenAI モデル
openai_model_name    = "gpt-4o"
openai_model_version = "2024-11-20"
