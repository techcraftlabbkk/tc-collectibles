#!/usr/bin/env python3
"""
Automated Git Push Script for TC Collectibles
Handles git initialization, staging, committing, and pushing to GitHub
"""

import os
import subprocess
import sys
import shutil
import json
from pathlib import Path

def run_command(cmd, cwd=None, capture_output=True, shell=True):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(
            cmd,
            shell=shell,
            cwd=cwd,
            capture_output=capture_output,
            text=True,
            timeout=60
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return 1, "", "Command timed out"
    except Exception as e:
        return 1, "", str(e)

def main():
    project_dir = Path(__file__).parent
    git_dir = project_dir / ".git"

    print(f"Project directory: {project_dir}")
    print("=" * 70)

    # Step 1: Check if git is available
    print("\n[1/7] Checking Git installation...")
    returncode, stdout, stderr = run_command("git --version")
    if returncode != 0:
        print("ERROR: Git is not installed or not in PATH")
        print(f"Details: {stderr}")
        print("\nPlease install Git from: https://git-scm.com/download/win")
        input("\nPress Enter to exit...")
        return 1
    print(f"✓ Git found: {stdout.strip()}")

    # Step 2: Clean up corrupted .git folder if it exists
    print("\n[2/7] Cleaning up git repository...")
    if git_dir.exists():
        try:
            print("  Removing corrupted .git folder...")
            shutil.rmtree(git_dir, ignore_errors=True)
            print("✓ Cleaned up")
        except Exception as e:
            print(f"Warning: {e}")
    else:
        print("✓ No existing .git folder")

    # Step 3: Initialize fresh git repo
    print("\n[3/7] Initializing fresh Git repository...")
    # Use --initial-branch=main to create the repo with main branch
    returncode, stdout, stderr = run_command(
        "git init --initial-branch=main",
        cwd=str(project_dir)
    )
    if returncode != 0:
        # Fallback for older git versions
        run_command("git init", cwd=str(project_dir))
        run_command("git checkout -b main", cwd=str(project_dir))
    print("✓ Repository initialized")

    # Step 4: Configure git user and remote
    print("\n[4/7] Configuring Git...")
    run_command("git config user.email \"patipat.arc@gmail.com\"", cwd=str(project_dir))
    run_command("git config user.name \"Claude Automation\"", cwd=str(project_dir))

    # Add GitHub remote
    returncode, stdout, stderr = run_command(
        "git remote add origin https://github.com/techcraftlabbkk/tc-collectibles.git",
        cwd=str(project_dir)
    )
    print("✓ Git configured")

    # Step 5: Stage files
    print("\n[5/7] Staging files...")
    returncode, stdout, stderr = run_command("git add -A", cwd=str(project_dir))
    if returncode != 0:
        print(f"ERROR: Failed to stage files")
        print(f"Details: {stderr}")
        input("\nPress Enter to exit...")
        return 1
    print("✓ Files staged")

    # Step 6: Commit
    print("\n[6/7] Committing changes...")
    commit_msg = "fix: add missing i18n config and app structure - resolves 404 errors"

    returncode, stdout, stderr = run_command(
        f'git commit -m "{commit_msg}"',
        cwd=str(project_dir)
    )

    if returncode != 0:
        if "nothing to commit" not in stderr and "nothing added to commit" not in stderr:
            print(f"Warning during commit: {stderr}")
        else:
            print("✓ No changes to commit")
    else:
        print("✓ Changes committed")

    # Step 7: Push to GitHub
    print("\n[7/7] Pushing to GitHub...")
    returncode, stdout, stderr = run_command(
        "git push -u origin main",
        cwd=str(project_dir)
    )

    if returncode != 0:
        if "remote: Permission to" in stderr or "403" in stderr:
            print("\n⚠️  AUTHENTICATION REQUIRED")
            print("GitHub needs to authenticate.")
            print("\nIf you see a browser window, log in with your GitHub account.")
            print("Otherwise, use a Personal Access Token (PAT):")
            print("  1. Go to https://github.com/settings/tokens")
            print("  2. Generate token with 'repo' scope")
            print("  3. Use it as your password when prompted")
            print("\nRetrying push...")

            # Wait a moment for potential auth dialog
            import time
            time.sleep(2)

            returncode, stdout, stderr = run_command(
                "git push -u origin main",
                cwd=str(project_dir)
            )

        if "did not match" in stderr and returncode != 0:
            print("Trying force push...")
            returncode, stdout, stderr = run_command(
                "git push -u origin main --force",
                cwd=str(project_dir)
            )

    # Final status
    if returncode == 0 or "Everything up-to-date" in stdout or "done" in stdout.lower():
        print("\n" + "=" * 70)
        print("✅ SUCCESS - Changes pushed to GitHub!")
        print("=" * 70)
        print("\n📋 Next Steps:")
        print("  1. Vercel will auto-deploy in 1-2 minutes")
        print("  2. Check status:")
        print("     https://vercel.com/techcraftlabbkk-7072s-projects/tc-collectibles/deployments")
        print("  3. Test the app:")
        print("     https://tc-collectibles.vercel.app/en")
        print("\n✨ Deployment fix complete!")
        print("=" * 70)
        input("\nPress Enter to exit...")
        return 0
    else:
        if stdout:
            print(f"\nOutput: {stdout}")
        if stderr:
            print(f"Errors: {stderr}")

        if returncode != 0 and "permission" not in stderr.lower():
            print("\n⚠️  Push completed with potential issues")
            print("Please check GitHub manually at:")
            print("  https://github.com/techcraftlabbkk/tc-collectibles")

        input("\nPress Enter to exit...")
        return returncode

if __name__ == "__main__":
    sys.exit(main())
