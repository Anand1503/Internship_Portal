terraform {
  required_version = ">= 1.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
  
  # Uncomment to use remote state (recommended for team)
  # backend "azurerm" {
  #   resource_group_name  = "terraform-state-rg"
  #   storage_account_name = "tfstate"
  #   container_name       = "tfstate"
  #   key                  = "internship-portal.tfstate"
  # }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
  
  tags = var.tags
}

# Container Registry
resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true
  
  tags = var.tags
}

# PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "db" {
  name                   = var.postgres_server_name
  resource_group_name    = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  version                = "15"
  administrator_login    = var.postgres_admin_username
  administrator_password = var.postgres_admin_password
  storage_mb             = 32768
  sku_name              = "B_Standard_B1ms"
  
  zone                      = "1"
  backup_retention_days     = 7
  geo_redundant_backup_enabled = false
  
  tags = var.tags
}

# PostgreSQL Database
resource "azurerm_postgresql_flexible_server_database" "main" {
  name      = var.postgres_database_name
  server_id = azurerm_postgresql_flexible_server.db.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

# PostgreSQL Firewall Rule - Allow Azure Services
resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure" {
  name             = "AllowAllAzureServicesAndResourcesWithinAzureIps"
  server_id        = azurerm_postgresql_flexible_server.db.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# PostgreSQL Firewall Rule - Allow your IP (optional, for management)
resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_local" {
  count            = var.allow_local_ip ? 1 : 0
  name             = "AllowLocalIP"
  server_id        = azurerm_postgresql_flexible_server.db.id
  start_ip_address = var.local_ip_address
  end_ip_address   = var.local_ip_address
}

# Container App Environment
resource "azurerm_container_app_environment" "main" {
  name                       = var.container_env_name
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
  
  tags = var.tags
}

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "main" {
  name                = "${var.project_name}-logs"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  
  tags = var.tags
}

# Backend Container App
resource "azurerm_container_app" "backend" {
  name                         = var.backend_app_name
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"
  
  registry {
    server               = azurerm_container_registry.acr.login_server
    username             = azurerm_container_registry.acr.admin_username
    password_secret_name = "acr-password"
  }
  
  secret {
    name  = "acr-password"
    value = azurerm_container_registry.acr.admin_password
  }
  
  secret {
    name  = "database-url"
    value = "postgresql://${var.postgres_admin_username}:${urlencode(var.postgres_admin_password)}@${azurerm_postgresql_flexible_server.db.fqdn}:5432/${var.postgres_database_name}"
  }
  
  secret {
    name  = "secret-key"
    value = var.backend_secret_key
  }
  
  template {
    container {
      name   = "backend"
      image  = "${azurerm_container_registry.acr.login_server}/backend:latest"
      cpu    = 0.5
      memory = "1Gi"
      
      env {
        name        = "DATABASE_URL"
        secret_name = "database-url"
      }
      
      env {
        name        = "SECRET_KEY"
        secret_name = "secret-key"
      }
      
      env {
        name  = "ALGORITHM"
        value = "HS256"
      }
      
      env {
        name  = "ACCESS_TOKEN_EXPIRE_MINUTES"
        value = "30"
      }
      
      env {
        name  = "ENVIRONMENT"
        value = "production"
      }
    }
    
    min_replicas = 1
    max_replicas = 3
  }
  
  ingress {
    external_enabled = true
    target_port      = 8000
    
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
  
  tags = var.tags
}

# Frontend Container App
resource "azurerm_container_app" "frontend" {
  name                         = var.frontend_app_name
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"
  
  registry {
    server               = azurerm_container_registry.acr.login_server
    username             = azurerm_container_registry.acr.admin_username
    password_secret_name = "acr-password"
  }
  
  secret {
    name  = "acr-password"
    value = azurerm_container_registry.acr.admin_password
  }
  
  template {
    container {
      name   = "frontend"
      image  = "${azurerm_container_registry.acr.login_server}/frontend:latest"
      cpu    = 0.5
      memory = "1Gi"
    }
    
    min_replicas = 1
    max_replicas = 3
  }
  
  ingress {
    external_enabled = true
    target_port      = 8080
    
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
  
  tags = var.tags
}
