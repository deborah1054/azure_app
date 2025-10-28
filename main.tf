# ----------------------------------------------
# 1. TERRAFORM AND PROVIDER CONFIGURATION
# ----------------------------------------------
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    # Note: The 'random' provider is needed for 'random_string'
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

# Provider configuration (uses ARM_* environment variables for authentication)
provider "azurerm" {
  features {}
}

# ----------------------------------------------
# 2. UTILITY RESOURCE
# ----------------------------------------------
# Utility to create a unique suffix for globally unique resources (ACR, Web App name)
resource "random_string" "suffix" {
  length  = 4
  special = false
  upper   = false
  numeric = true
}

# ----------------------------------------------
# 3. CORE AZURE INFRASTRUCTURE RESOURCES
# ----------------------------------------------

# Resource Group (Container for resources)
resource "azurerm_resource_group" "rg" {
  name     = "rg-nextjs-cicd"
  location = var.location # References a variable in variables.tf
}

# Azure Container Registry (ACR)
resource "azurerm_container_registry" "acr" {
  name                = "nextjsregistry${random_string.suffix.result}" 
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  # Crucial: Enable admin user so the Web App can pull images using these credentials
  admin_enabled       = true 
}

# App Service Plan (The compute infrastructure for the Web App)
resource "azurerm_service_plan" "app_plan" {
  name                = "plan-nextjs-app"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1" # Basic tier
}

# 4. Web App (The container host) - FINAL CORRECT STRUCTURE
resource "azurerm_linux_web_app" "web_app" {
  name                = "app-nextjs-ci-cd-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.app_plan.id

  # site_config contains only general settings for this provider version.
  site_config {
    always_on  = false
    ftps_state = "Disabled"
    
    # *** THIS LINE IS REMOVED: container_registry_server_url ***
    # The URL is handled by the DOCKER_REGISTRY_SERVER_URL App Setting below.
  }

  # app_settings contains all key/value pairs, including ALL Docker settings.
  # This block is correctly placed OUTSIDE of site_config.
  app_settings = { 
    # Set the port the container is listening on (matches Dockerfile: 3000)
    "WEBSITES_PORT"                   = "3000" 
    
    # Required App Setting to define the image to pull
    "DOCKER_CUSTOM_IMAGE_NAME"        = "${azurerm_container_registry.acr.login_server}/nextjs-app:latest"
    
    # Required App Settings for the Web App to pull the image from ACR
    "DOCKER_REGISTRY_SERVER_URL"      = "https://${azurerm_container_registry.acr.login_server}"
    "DOCKER_REGISTRY_SERVER_USERNAME" = azurerm_container_registry.acr.admin_username
    "DOCKER_REGISTRY_SERVER_PASSWORD" = azurerm_container_registry.acr.admin_password
  }
}