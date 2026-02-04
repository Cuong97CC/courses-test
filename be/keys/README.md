# JWT RSA Keys Directory

This directory contains the RSA key pair used for JWT RS256 authentication.

## Key Generation

**For Windows:**

```bash
cd d:\Projects\test\be
scripts\generate-keys.bat
```

**For Linux/Mac:**

```bash
cd /path/to/be
chmod +x scripts/generate-keys.sh
./scripts/generate-keys.sh
```

## Files

- `private.key` - RSA private key (2048-bit) for signing JWTs
- `public.key` - RSA public key for verifying JWTs

## Security Notes

⚠️ **IMPORTANT:**

- **NEVER commit `private.key` to version control**
- Keys are automatically gitignored
- For production: use 4096-bit keys
- Store private key in a secrets manager (AWS Secrets Manager, HashiCorp Vault)
- Rotate keys periodically

## Production Setup

For production environments:

1. Generate stronger keys (4096-bit):
   ```bash
   openssl genrsa -out private.key 4096
   openssl rsa -in private.key -pubout -out public.key
   ```
2. Store private key securely (DO NOT store in filesystem)
3. Use environment variables or secrets manager
4. Implement key rotation strategy
