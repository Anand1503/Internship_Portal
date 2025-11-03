# General Configuration
variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "internship-portal"
}

variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "centralindia"
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "internship-portal-production-rg"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Environment = "Production"
    Project     = "Internship Portal"
    ManagedBy   = "Terraform"
  }
}

# Container Registry
variable "acr_name" {
  description = "Name of the Azure Container Registry"
  type        = string
  default     = "internshipportal"
}

# PostgreSQL Configuration
variable "postgres_server_name" {
  description = "Name of the PostgreSQL server"
  type        = string
  default     = "internship-portal-db"
}

variable "postgres_admin_username" {
  description = "PostgreSQL administrator username"
  type        = string
  default     = "psqladmin"
}

variable "postgres_admin_password" {
  description = "PostgreSQL administrator password"
  type        = string
  sensitive   = true
}

variable "postgres_database_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "postgres"
}

# Network Configuration
variable "allow_local_ip" {
  description = "Whether to allow local IP access to PostgreSQL"
  type        = bool
  default     = false
}

variable "local_ip_address" {
  description = "Local IP address to allow access to PostgreSQL"
  type        = string
  default     = ""
}

# Container Apps Configuration
variable "container_env_name" {
  description = "Name of the Container App Environment"
  type        = string
  default     = "internship-portal-env"
}

variable "backend_app_name" {
  description = "Name of the backend container app"
  type        = string
  default     = "internship-portal-backend"
}

variable "frontend_app_name" {
  description = "Name of the frontend container app"
  type        = string
  default     = "internship-portal-frontend"
}

# Backend Configuration
variable "backend_secret_key" {
  description = "Secret key for backend JWT authentication"
  type        = string
  sensitive   = true
}

# Scaling Configuration
variable "backend_min_replicas" {
  description = "Minimum number of backend replicas"
  type        = number
  default     = 1
}

variable "backend_max_replicas" {
  description = "Maximum number of backend replicas"
  type        = number
  default     = 3
}

variable "frontend_min_replicas" {
  description = "Minimum number of frontend replicas"
  type        = number
  default     = 1
}

variable "frontend_max_replicas" {
  description = "Maximum number of frontend replicas"
  type        = number
  default     = 3
}
