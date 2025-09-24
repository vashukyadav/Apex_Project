Write-Host "Setting up HRMS Database..." -ForegroundColor Green

# Try common MySQL paths
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe",
    "C:\xampp\mysql\bin\mysql.exe",
    "mysql"
)

$mysqlPath = $null
foreach ($path in $mysqlPaths) {
    if ($path -eq "mysql") {
        try {
            & mysql --version | Out-Null
            $mysqlPath = "mysql"
            break
        } catch { }
    } elseif (Test-Path $path) {
        $mysqlPath = $path
        break
    }
}

if ($mysqlPath) {
    Write-Host "Found MySQL at: $mysqlPath" -ForegroundColor Yellow
    & $mysqlPath -u root -p1829 -e "source backend/utils/seedData.sql"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database setup completed!" -ForegroundColor Green
    } else {
        Write-Host "❌ Database setup failed!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ MySQL not found. Please install MySQL or add it to PATH." -ForegroundColor Red
}

Read-Host "Press Enter to continue"