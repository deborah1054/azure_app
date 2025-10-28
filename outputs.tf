output "acr_login_server" {
  description = "The login server for the Azure Container Registry."
  value       = azurerm_container_registry.acr.login_server
}

output "web_app_name" {
  description = "The name of the Azure Web App for use in Jenkins."
  value       = azurerm_linux_web_app.web_app.name
}

output "resource_group_name" {
  description = "The name of the Azure Resource Group for use in Jenkins."
  value       = azurerm_resource_group.rg.name
}