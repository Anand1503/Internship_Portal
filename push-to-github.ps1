# Script to push updates to GitHub
# This ensures only essential files are committed

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Push to GitHub" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    git remote add origin https://github.com/Anand1503/Internship_Portal.git
}

Write-Host "Checking git status..." -ForegroundColor Yellow
Write-Host ""

# Show what will be committed
git status

Write-Host ""
Write-Host "Files to be committed:" -ForegroundColor Yellow
Write-Host "✓ docker-compose.yml" -ForegroundColor Green
Write-Host "✓ .env.example (if exists)" -ForegroundColor Green
Write-Host "✓ .gitignore" -ForegroundColor Green
Write-Host "✓ README.md" -ForegroundColor Green
Write-Host "✓ backend/ (code and Dockerfile)" -ForegroundColor Green
Write-Host "✓ frontend/ (code and Dockerfile)" -ForegroundColor Green
Write-Host ""
Write-Host "Files excluded (in .gitignore):" -ForegroundColor Yellow
Write-Host "✗ migrate-db.ps1" -ForegroundColor Gray
Write-Host "✗ migrate-now.ps1" -ForegroundColor Gray
Write-Host "✗ test-login.ps1" -ForegroundColor Gray
Write-Host "✗ backup.sql" -ForegroundColor Gray
Write-Host "✗ All .md files except README.md" -ForegroundColor Gray
Write-Host "✗ init-db/" -ForegroundColor Gray
Write-Host "✗ .env (sensitive data)" -ForegroundColor Gray
Write-Host ""

$confirm = Read-Host "Do you want to continue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Adding files to git..." -ForegroundColor Yellow
git add .

Write-Host ""
$commitMessage = Read-Host "Enter commit message"
if ($commitMessage -eq "") {
    $commitMessage = "Update Docker configuration and README"
}

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "$commitMessage"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
$branch = git branch --show-current
if ($branch -eq "") {
    $branch = "main"
    git branch -M main
}

git push -u origin $branch

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Repository: https://github.com/Anand1503/Internship_Portal" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Push failed. Please check your credentials and try again." -ForegroundColor Red
    Write-Host "You may need to authenticate with GitHub." -ForegroundColor Yellow
}
