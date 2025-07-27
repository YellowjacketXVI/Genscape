# pnpm Setup Guide

This project is now configured to use pnpm as the package manager instead of npm.

## Prerequisites

Make sure you have pnpm installed globally:
```bash
npm install -g pnpm
```

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start the development server:**
   ```bash
   pnpm dev
   ```

3. **Build for web:**
   ```bash
   pnpm run build:web
   ```

4. **Run linting:**
   ```bash
   pnpm lint
   ```

## pnpm-specific Commands

- **Clean install:** `pnpm run clean` - Removes node_modules and reinstalls
- **Add a dependency:** `pnpm add <package-name>`
- **Add a dev dependency:** `pnpm add -D <package-name>`
- **Remove a dependency:** `pnpm remove <package-name>`
- **Update dependencies:** `pnpm update`

## Configuration

The project includes:
- `.npmrc` with pnpm-optimized settings
- `pnpm-lock.yaml` for dependency locking
- Updated package.json scripts

## Benefits of pnpm

- **Faster installs:** Uses hard links and symlinks to save disk space
- **Strict dependency resolution:** Prevents phantom dependencies
- **Better monorepo support:** Built-in workspace support
- **Disk space efficient:** Shared dependency storage

## Troubleshooting

If you encounter issues:
1. Clear pnpm cache: `pnpm store prune`
2. Delete node_modules and reinstall: `pnpm run clean`
3. Check pnpm version: `pnpm --version`
