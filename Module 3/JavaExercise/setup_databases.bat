@echo off
echo Setting up MySQL databases and tables...
echo Please enter your MySQL root password when prompted

mysql -u root -p < "setup_mysql.sql"

echo.
echo If you see any errors above, please make sure:
echo 1. MySQL Server is running
pause
