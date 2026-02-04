@echo off
REM JWT Key Generation Script for Windows
REM Generates RSA key pair for JWT RS256 authentication

set KEYS_DIR=keys

REM Create keys directory if it doesn't exist
if not exist "%KEYS_DIR%" mkdir "%KEYS_DIR%"

echo 🔑 Generating JWT RSA key pair...

REM Generate private key (2048 bit)
openssl genrsa -out "%KEYS_DIR%\private.key" 2048

REM Generate public key from private key
openssl rsa -in "%KEYS_DIR%\private.key" -pubout -out "%KEYS_DIR%\public.key"

echo ✅ JWT keys generated successfully!
echo 📁 Private key: %KEYS_DIR%\private.key
echo 📁 Public key: %KEYS_DIR%\public.key
echo.
echo ⚠️  WARNING: Keep private.key secure and NEVER commit to version control!
