# Resource Group
output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "resource_group_location" {
  description = "Location of the resource group"
  value       = azurerm_resource_group.main.location
}

# Container Registry
output "acr_login_server" {
  description = "Login server URL for the container registry"
  value       = azurerm_container_registry.acr.login_server
}

output "acr_admin_username" {
  description = "Admin username for the container registry"
  value       = azurerm_container_registry.acr.admin_username
}

output "acr_admin_password" {
  description = "Admin password for the container registry"
  value       = azurerm_container_registry.acr.admin_password
  sensitive   = true
}

# PostgreSQL
output "postgres_fqdn" {
  description = "Fully qualified domain name of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.db.fqdn
}

output "postgres_connection_string" {
  description = "PostgreSQL connection string"
  value       = "postgresql://${var.postgres_admin_username}:${urlencode(var.postgres_admin_password)}@${azurerm_postgresql_flexible_server.db.fqdn}:5432/${var.postgres_database_name}"
  sensitive   = true
}

# Container Apps
output "backend_url" {
  description = "URL of the backend application"
  value       = "https://${azurerm_container_app.backend.ingress[0].fqdn}"
}

output "frontend_url" {
  description = "URL of the frontend application"
  value       = "https://${azurerm_container_app.frontend.ingress[0].fqdn}"
}

output "backend_fqdn" {
  description = "FQDN of the backend container app"
  value       = azurerm_container_app.backend.ingress[0].fqdn
}

output "frontend_fqdn" {
  description = "FQDN of the frontend container app"
  value       = azurerm_container_app.frontend.ingress[0].fqdn
}

# Log Analytics
output "log_analytics_workspace_id" {
  description = "ID of the Log Analytics Workspace"
  value       = azurerm_log_analytics_workspace.main.id
}

# Container App Environment
output "container_app_environment_id" {
  description = "ID of the Container App Environment"
  value       = azurerm_container_app_environment.main.id
}

# Summary
output "deployment_summary" {
  description = "Deployment summary with all important URLs and information"
  value = {
    frontend_url        = "https://${azurerm_container_app.frontend.ingress[0].fqdn}"
    backend_url         = "https://${azurerm_container_app.backend.ingress[0].fqdn}"
    backend_api_docs    = "https://${azurerm_container_app.backend.ingress[0].fqdn}/docs"
    database_server     = azurerm_postgresql_flexible_server.db.fqdn
    container_registry  = azurerm_container_registry.acr.login_server
    resource_group      = azurerm_resource_group.main.name
  }
}
