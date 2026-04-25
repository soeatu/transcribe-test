# -----------------------------------------------------------------------------
# Cosmos DB (Serverless — 最安構成)
# -----------------------------------------------------------------------------

resource "azurerm_cosmosdb_account" "main" {
  name                = "cosmos-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  offer_type          = "Standard"

  # Serverless (使った分だけ課金)
  capabilities {
    name = "EnableServerless"
  }

  # セッション整合性 (コスト・性能バランス最適)
  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.main.location
    failover_priority = 0
  }

  tags = local.common_tags
}

resource "azurerm_cosmosdb_sql_database" "main" {
  name                = var.cosmos_db_database_name
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
}

resource "azurerm_cosmosdb_sql_container" "sessions" {
  name                = var.cosmos_db_container_name
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.main.name
  partition_key_paths = ["/partitionKey"]

  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/type/?"
    }
    included_path {
      path = "/sessionId/?"
    }
    included_path {
      path = "/status/?"
    }
    included_path {
      path = "/createdAt/?"
    }
    included_path {
      path = "/timestamp/?"
    }

    excluded_path {
      path = "/*"
    }

    composite_index {
      index {
        path  = "/sessionId"
        order = "Ascending"
      }
      index {
        path  = "/timestamp"
        order = "Ascending"
      }
    }
  }
}
