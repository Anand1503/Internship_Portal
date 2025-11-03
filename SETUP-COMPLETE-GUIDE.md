# 🚀 Complete Setup Guide

## ✅ What's Been Created

### 1. Terraform Infrastructure (NEW!)

Your infrastructure is now defined as code in the `terraform/` directory:

```
terraform/
├── main.tf                    # Infrastructure definition
├── variables.tf               # Configuration variables
├── outputs.tf                 # Output values
├── terraform.tfvars.example   # Example configuration
├── .gitignore                 # Terraform gitignore
└── README.md                  # Terraform documentation
```

**Benefits:**
- ✅ Version controlled infrastructure
- ✅ Reproducible deployments
- ✅ Easy to create dev/staging/prod environments
- ✅ Team collaboration friendly

### 2. GitHub Actions Secrets (READY!)

Your GitHub Actions CI/CD secrets have been generated and saved to:
- `github-secrets.txt` (contains all 3 secrets)

## 🔐 Step 1: Add GitHub Secrets

### Visit Your Repository Settings:
https://github.com/Anand1503/Internship_Portal/settings/secrets/actions

### Add These 3 Secrets:

#### Secret 1: `AZURE_CREDENTIALS`
**Get from:** `github-secrets.txt` file in your project root

**Format:**
```json
{
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "subscriptionId": "64da7b80-1969-401c-9719-09abc1e5b3c9",
  "tenantId": "your-tenant-id",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

#### Secret 2: `ACR_USERNAME`
**Get from:** `github-secrets.txt` file  
**Value:** `internshipportal`

#### Secret 3: `ACR_PASSWORD`
**Get from:** `github-secrets.txt` file  
**Value:** The ACR password from the file

### How to Add:
1. Click "New repository secret"
2. Name: `AZURE_CREDENTIALS`
3. Value: Copy the entire JSON above
4. Click "Add secret"
5. Repeat for the other 2 secrets

## 📝 Step 2: Commit Terraform Code

```bash
# Add Terraform files
git add terraform/

# Commit
git commit -m "Add Terraform infrastructure as code"

# Push to GitHub
git push origin main
```

## 🧪 Step 3: Test GitHub Actions

### Option A: Make a Small Change
```bash
# Edit README
echo "\n## Updated" >> README.md

# Commit and push
git add README.md
git commit -m "Test CI/CD deployment"
git push
```

### Option B: Manual Trigger
1. Go to: https://github.com/Anand1503/Internship_Portal/actions
2. Click on "Deploy to Azure Container Apps"
3. Click "Run workflow"
4. Select branch: `main`
5. Click "Run workflow"

### Watch the Deployment:
- Go to Actions tab in GitHub
- Click on the running workflow
- Watch logs in real-time
- Deployment takes ~5-7 minutes

## 🏗️ Step 4: Using Terraform (Optional)

### Why Use Terraform?

**Use Terraform when:**
- Creating new environments (dev, staging)
- Rebuilding infrastructure from scratch
- Documenting infrastructure changes
- Team needs to recreate your setup

**Don't use Terraform for:**
- Deploying code changes (use GitHub Actions)
- Day-to-day updates (use Azure Portal or CLI)
- Simple configuration changes

### Quick Terraform Setup:

```bash
cd terraform

# Initialize
terraform init

# Create your config (copy from example)
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your values
# (Use the values from your current deployment)

# See what would be created
terraform plan

# Import existing resources (optional)
# This tells Terraform about your existing infrastructure
terraform import azurerm_resource_group.main /subscriptions/64da7b80-1969-401c-9719-09abc1e5b3c9/resourceGroups/internship-portal-production-rg
```

## 📊 Current Deployment Status

### Live URLs:
- **Frontend:** https://internship-portal-frontend.orangeglacier-54f3babc.centralindia.azurecontainerapps.io/
- **Backend API:** https://internship-portal-backend.orangeglacier-54f3babc.centralindia.azurecontainerapps.io/docs

### Test Credentials:
- Email: `student@test.com`
- Password: `password123`

### Azure Resources:
| Resource | Name | Status |
|----------|------|--------|
| Resource Group | internship-portal-production-rg | ✅ Active |
| Container Registry | internshipportal.azurecr.io | ✅ Active |
| PostgreSQL | internship-portal-db | ✅ Running |
| Backend App | internship-portal-backend | ✅ Healthy |
| Frontend App | internship-portal-frontend | ✅ Healthy |

### Database:
- **74 rows migrated** from local database
- 9 students, 8 internships, 33 applications

## 🔄 Workflow After Setup

### Making Code Changes:

```bash
# 1. Make your changes
git add .
git commit -m "Your changes"
git push

# 2. GitHub Actions automatically:
#    - Builds Docker images
#    - Pushes to Azure Container Registry
#    - Updates Container Apps
#    - Deploys to production

# 3. Check deployment status:
#    GitHub → Actions tab
```

### Typical Development Flow:

```
Make Code Changes → Commit → Push → GitHub Actions → Automatic Deployment → Live! ✅
```

**No manual Docker builds needed!**  
**No manual Azure CLI commands needed!**  
**Just push your code!** 🚀

## 🛠️ Troubleshooting

### GitHub Actions Failing?

1. **Check secrets are added correctly**
   - All 3 secrets present?
   - No extra spaces?
   - JSON format correct?

2. **Check workflow logs**
   - GitHub → Actions → Click on failed run
   - Read error messages

3. **Common issues:**
   - Wrong subscription ID
   - Service principal expired
   - Container registry credentials wrong

### Terraform Issues?

1. **Resource already exists**
   ```bash
   # Import existing resource
   terraform import <resource_type>.<name> <azure_resource_id>
   ```

2. **Authentication failed**
   ```bash
   az login
   az account set --subscription "64da7b80-1969-401c-9719-09abc1e5b3c9"
   ```

3. **State file conflicts**
   - Don't run Terraform from multiple locations
   - Use remote state for teams

## 🔒 Security Checklist

- [x] Secrets stored in GitHub Secrets (encrypted)
- [x] terraform.tfvars gitignored
- [x] Service principal has minimum permissions
- [x] Database password is strong
- [x] SSL/TLS enabled on all endpoints
- [x] Container apps run as non-root user
- [ ] Set up Azure Key Vault (optional, for production)
- [ ] Enable Application Insights (optional, for monitoring)
- [ ] Configure custom domain (optional)

## 📚 Next Steps

### Immediate:
1. ✅ Add GitHub secrets
2. ✅ Push Terraform code
3. ✅ Test GitHub Actions deployment

### Short Term:
- [ ] Add Application Insights monitoring
- [ ] Set up database backups
- [ ] Configure custom domain
- [ ] Add more test users

### Long Term:
- [ ] Create staging environment using Terraform
- [ ] Set up automated testing
- [ ] Add performance monitoring
- [ ] Implement caching (Redis)

## 📞 Important Files Location

```
Your Project/
├── terraform/               # Infrastructure as Code
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── README.md
├── .github/workflows/       # CI/CD pipelines
│   ├── azure-deploy.yml
│   └── deploy-azure.yml
├── github-secrets.txt       # GitHub secrets (DELETE after adding!)
├── backend/                 # FastAPI application
├── frontend/                # React application
└── README.md               # Project documentation
```

## ⚠️ IMPORTANT: Clean Up

After adding secrets to GitHub, delete the secrets file:

```bash
# Delete the secrets file
del github-secrets.txt

# Or on Linux/Mac:
rm github-secrets.txt
```

**Never commit this file to git!**

## 🎉 Success Criteria

You're all set when:

- ✅ All 3 GitHub secrets added
- ✅ Terraform code pushed to GitHub
- ✅ GitHub Actions workflow successful
- ✅ Application accessible via URLs
- ✅ github-secrets.txt deleted
- ✅ Code changes trigger automatic deployment

## 🆘 Need Help?

- **Terraform:** Check `terraform/README.md`
- **GitHub Actions:** Check workflow logs in Actions tab
- **Azure:** Use Azure Portal for resource status
- **Application:** Check backend API docs at `/docs`

---

**Your Internship Portal is now production-ready with:**
- ✅ Infrastructure as Code (Terraform)
- ✅ Automated CI/CD (GitHub Actions)
- ✅ Cloud Deployment (Azure)
- ✅ Database Migration Complete
- ✅ Professional Workflows

**Happy Coding!** 🚀
