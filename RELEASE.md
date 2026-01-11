# Release Process

This document describes the automated release process using [Semantic Release](https://semantic-release.gitbook.io/semantic-release/).

## Overview

Releases are **fully automated** based on your commit messages. When code is merged to `main`, Semantic Release:

1. Analyzes all commits since the last release
2. Determines the version bump (MAJOR, MINOR, or PATCH)
3. Generates the CHANGELOG
4. Updates `package.json` version
5. Commits changes with `[skip ci]`
6. Creates a GitHub release with assets

## Release Workflow

```
Developer merges PR to dev
            ↓
Developer creates release PR (release/x.y.z → main)
            ↓
Reviewers review and approve
            ↓
PR merged to main
            ↓
GitHub Actions triggers Release workflow
            ↓
Semantic Release analyzes commits
            ↓
Version calculated automatically
            ↓
CHANGELOG generated
            ↓
GitHub Release created
```

## Commit Message Convention

Semantic Release uses [Conventional Commits](https://www.commitlint.io/) to determine version bumps.

| Commit Type | Version Bump      | Example                          |
| ----------- | ----------------- | -------------------------------- |
| `feat`      | MINOR (x.**1**.0) | `feat: add new puzzle room`      |
| `fix`       | PATCH (x.y.**1**) | `fix: inventory persistence bug` |
| `feat!`     | MAJOR (**2**.0.0) | `feat!: breaking change`         |
| `break!`    | MAJOR             | `break!: save format changed`    |
| `docs`      | -                 | No version change                |
| `style`     | -                 | No version change                |
| `refactor`  | -                 | No version change                |
| `chore`     | -                 | No version change                |

### Examples

```bash
# MINOR release - new feature
git commit -m "feat: add inventory combine system"

# PATCH release - bug fix
git commit -m "fix: resolve canvas resize issue"

# MAJOR release - breaking change
git commit -m "feat!: change save file format"

# With scope
git commit -m "feat(inventory): add item drag and drop"
git commit -m "fix(hubspots): resolve visibility condition"
```

## Release Branches

### Standard Release

For normal releases, merge from `dev` directly to `main`:

1. Ensure all changes are in `dev`
2. Create PR: `dev` → `main`
3. Review and merge
4. Semantic Release creates the release automatically

### Pre-release (Beta)

For beta testing, use release branches:

```bash
git checkout dev
git pull origin dev
git checkout -b release/1.2.0-beta.0

# Make final fixes if needed
git commit -m "fix: beta fix"
git push origin release/1.2.0-beta.0

# Create PR: release/1.2.0-beta.0 → main
```

Beta releases will be tagged as pre-release on GitHub.

## Version Number

Semantic Release follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (0.x.0): New features (backward compatible)
- **PATCH** (0.0.x): Bug fixes (backward compatible)

## What's Included in Release

Semantic Release automatically:

- Updates `package.json` version
- Updates `CHANGELOG.md`
- Creates git tag
- Creates GitHub release
- Commits changes back to repository

## Troubleshooting

### Release Didn't Trigger

Check:

1. Workflow ran successfully in Actions tab
2. Commit messages follow conventional format
3. Changes were merged to `main` (not just pushed)

### Wrong Version Calculated

Check commit messages:

- `feat: xxx` → MINOR bump
- `fix: xxx` → PATCH bump
- No version change for docs, style, chore, refactor

### CHANGELOG Missing Entries

Ensure commits on `main` since last release use proper conventional commit format.

## Manual Version Override

If you need to force a specific version, add a commit with footer:

```bash
git commit -m "chore: release prep" --allow-empty
git commit --amend -m "chore: release prep

BREAKING CHANGE: force major release"
```

## Configuration

See `.releaserc` for Semantic Release configuration.

## GitHub Actions

The release workflow is defined in `.github/workflows/release.yml`:

- Triggers on push to `main`
- Uses `GH_TOKEN` for authentication
- Runs `pnpm exec semantic-release`

### Required Secrets

| Secret     | Description                                  |
| ---------- | -------------------------------------------- |
| `GH_TOKEN` | GitHub PAT with `repo` scope (content write) |

Create via: GitHub → Repository → Settings → Secrets and variables → Actions
