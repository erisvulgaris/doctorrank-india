# Pushing to GitHub

This repo is hosted at: **https://github.com/erisvulgaris/doctorrank-india**

## How to push changes

Since the git remote URL does not store credentials, you need to authenticate when pushing. There are two ways:

### Option 1: Use a Personal Access Token (PAT)

1. Generate a classic PAT at https://github.com/settings/tokens (with `repo` scope)
2. Push using the token inline:
   ```bash
   git push https://<TOKEN>@github.com/erisvulgaris/doctorrank-india.git main
   ```
3. Or temporarily set the remote with the token:
   ```bash
   git remote set-url origin https://<TOKEN>@github.com/erisvulgaris/doctorrank-india.git
   git push
   git remote set-url origin https://github.com/erisvulgaris/doctorrank-india.git  # clean up
   ```

### Option 2: Use GitHub CLI

```bash
gh auth login
git push
```

### Option 3: Use SSH

If you have SSH keys set up with GitHub:
```bash
git remote set-url origin git@github.com:erisvulgaris/doctorrank-india.git
git push
```

## Verify push

```bash
# Check the latest commit on GitHub
curl -s https://api.github.com/repos/erisvulgaris/doctorrank-india/commits | head -5
```

## Security Notes

- **Never commit your `.env` or your GitHub token to the repo**
- The `.env` file contains `DATABASE_URL` and is gitignored
- Tokens should be revoked when no longer needed at https://github.com/settings/tokens
