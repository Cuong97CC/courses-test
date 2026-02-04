# Migrations Directory

This directory contains TypeORM database migrations.

## Creating Migrations

```bash
# Generate migration from entity changes
npm run migration:generate -- migrations/MigrationName

# Create empty migration
npm run migration:create -- migrations/MigrationName
```

## Running Migrations

```bash
# Run all pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

## Migration Naming Convention

Use descriptive names with timestamp prefix (auto-generated):

- `1707123456789-InitialSchema.ts`
- `1707123567890-AddCourseVersion.ts`

## Best Practices

1. **Never modify existing migrations** - create new ones instead
2. **Test migrations** on local database before deploying
3. **Always have a rollback plan** (down method)
4. **Keep migrations small and focused**
5. **Run migrations as part of deployment process**
