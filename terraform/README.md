# Terraform Infrastructure as Code

This directory contains Terraform configuration to deploy the Internship Portal infrastructure to Azure.

## 📋 Prerequisites

1. **Terraform installed** (v1.0 or higher)
   ```bash
   # Install Terraform
   # Windows (using chocolatey):
   choco install terraform
   
   # Or download from: https://www.terraform.io/downloads
   ```

2. **Azure CLI installed and authenticated**
   ```bash
   az login
   az account set --subscription "64da7b80-1969-401c-9719-09abc1e5b3c9"
   ```

3. **Docker images built and pushed to ACR**
   - Backend and frontend images should exist in the container registry
   - Or they will be deployed with placeholder images initially

## 🚀 Quick Start

### 1. Initialize Terraform

```bash
cd terraform
terraform init
```

### 2. Create Configuration File

```bash
# Copy the example file
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your values
# IMPORTANT: Change passwords and secret keys!
```

### 3. Review the Plan

```bash
terraform plan
```

This shows what Terraform will create/change.

### 4. Deploy Infrastructure

```bash
terraform apply
```

Type `yes` when prompted to confirm.

### 5. View Outputs

```bash
terraform output
```

This shows your application URLs and other important information.

## 📁 File Structure

```
terraform/
├── main.tf                    # Main infrastructure definition
├── variables.tf               # Variable declarations
├── outputs.tf                 # Output values
├── terraform.tfvars.example   # Example configuration
├── terraform.tfvars           # Your configuration (gitignored)
└── README.md                  # This file
```

## 🏗️ What Gets Created

This Terraform configuration creates:

1. **Resource Group** - Container for all resources
2. **Container Registry** - Stores Docker images
3. **PostgreSQL Flexible Server** - Database server
4. **PostgreSQL Database** - Application database
5. **Firewall Rules** - Database access control
6. **Log Analytics Workspace** - Logging and monitoring
7. **Container App Environment** - Shared environment for apps
8. **Backend Container App** - FastAPI backend
9. **Frontend Container App** - React frontend

## 🔧 Configuration

### Required Variables

Edit `terraform.tfvars`:

```hcl
subscription_id = "your-subscription-id"
postgres_admin_password = "strong-password-here"
backend_secret_key = "your-secret-key-here"
```

### Generate Secret Key

```bash
# Generate a strong secret key
openssl rand -hex 32
```

### Optional Variables

```hcl
# Allow your IP to access database
allow_local_ip = true
local_ip_address = "your.ip.address.here"

# Adjust scaling
backend_min_replicas = 1
backend_max_replicas = 5
```

## 📊 Useful Commands

### Check Current State

```bash
terraform show
```

### List Resources

```bash
terraform state list
```

### Get Specific Output

```bash
terraform output frontend_url
terraform output backend_url
```

### Format Configuration

```bash
terraform fmt
```

### Validate Configuration

```bash
terraform validate
```

## 🔄 Updating Infrastructure

### Modify Configuration

1. Edit `terraform.tfvars` or `.tf` files
2. Run `terraform plan` to preview changes
3. Run `terraform apply` to apply changes

### Update Container Images

Terraform doesn't automatically update container images. Use GitHub Actions or:

```bash
# Update backend
az containerapp update \
  --name internship-portal-backend \
  --resource-group internship-portal-production-rg \
  --image internshipportal.azurecr.io/backend:latest

# Update frontend
az containerapp update \
  --name internship-portal-frontend \
  --resource-group internship-portal-production-rg \
  --image internshipportal.azurecr.io/frontend:latest
```

## 🗑️ Destroying Infrastructure

**WARNING:** This will delete ALL resources!

```bash
terraform destroy
```

Type `yes` to confirm.

## 🔒 Security Notes

### Secrets Management

1. **Never commit `terraform.tfvars`** - It contains secrets!
2. **Use Azure Key Vault** for production secrets (advanced)
3. **Rotate passwords regularly**
4. **Use strong passwords** (20+ characters)

### Current Setup

- `terraform.tfvars` is gitignored ✅
- Passwords are marked as sensitive ✅
- Secrets stored in Azure securely ✅

## 🌍 Remote State (Optional)

For team collaboration, use remote state:

1. Create storage account:
```bash
az storage account create \
  --name tfstate$RANDOM \
  --resource-group terraform-state-rg \
  --location centralindia \
  --sku Standard_LRS
```

2. Uncomment backend configuration in `main.tf`

3. Initialize:
```bash
terraform init -migrate-state
```

## 🐛 Troubleshooting

### Error: Resource Already Exists

If resources already exist (from manual deployment):

**Option 1: Import existing resources**
```bash
terraform import azurerm_resource_group.main /subscriptions/.../resourceGroups/internship-portal-production-rg
```

**Option 2: Destroy and recreate**
```bash
# Delete existing resources in Azure Portal first
terraform apply
```

### Error: Authentication Failed

```bash
# Re-authenticate
az login
az account set --subscription "64da7b80-1969-401c-9719-09abc1e5b3c9"
```

### Error: Provider Version

```bash
# Upgrade providers
terraform init -upgrade
```

## 📚 Learn More

- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)

## ✅ Next Steps After Deployment

1. **Run database migrations**
   ```bash
   # Connect to backend container and run
   alembic upgrade head
   ```

2. **Seed initial data**
   ```bash
   python seed_data.py
   ```

3. **Test your application**
   - Visit frontend URL
   - Test login functionality
   - Verify backend API docs

4. **Set up monitoring**
   - Enable Application Insights
   - Configure alerts

5. **Set up CI/CD**
   - Configure GitHub Actions
   - Add deployment secrets

---

**Need help?** Check the main project README or create an issue on GitHub.
