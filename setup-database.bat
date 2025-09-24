@echo off
echo Setting up HRMS Database...
echo.
echo Make sure MySQL is running and you know the root password.
echo.
set /p password="Enter MySQL root password: "
mysql -u root -p%password% < backend\utils\seedData.sql
if %errorlevel% == 0 (
    echo.
    echo ✅ Database setup completed successfully!
    echo You can now run the backend server.
) else (
    echo.
    echo ❌ Database setup failed. Please check:
    echo 1. MySQL is running
    echo 2. Root password is correct
    echo 3. MySQL is in your PATH
)
pause