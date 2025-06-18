CREATE USER 'appuser'@'%' IDENTIFIED BY 'app_password';
GRANT ALL PRIVILEGES ON signalement_db.* TO 'appuser'@'%';
FLUSH PRIVILEGES;
