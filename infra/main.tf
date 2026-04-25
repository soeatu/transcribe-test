terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

# -----------------------------------------------------------------------------
# データソース
# -----------------------------------------------------------------------------
data "azurerm_client_config" "current" {}

# -----------------------------------------------------------------------------
# リソースグループ
# -----------------------------------------------------------------------------
resource "azurerm_resource_group" "main" {
  name     = "rg-${var.project_name}-${var.environment}"
  location = var.location

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# ランダムサフィックス（グローバル一意名に使用）
# -----------------------------------------------------------------------------
resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

# -----------------------------------------------------------------------------
# ローカル変数
# -----------------------------------------------------------------------------
locals {
  suffix = random_string.suffix.result
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
