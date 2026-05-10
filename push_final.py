#!/usr/bin/env python3
"""
Final Push Script - Attempts multiple authentication methods
"""

import os
import subprocess
import sys
from pathlib import Path

def run_command(cmd, cwd=None, capture_output=True, shell=True):
    """Run a shell command"""
    try:
        result = subprocess.run(
            cmd,
            shell=shell,
            cwd=cwd,
            capture_output=capture_output,
            text=True,
            timeout=30
        )
        return result.returncode, result.stdout, result.stderr
    except Exception as e:
        return 1, "", str(e)

def main():
    project_dir = Path(__file__).parent
    print("=" * 70)
    print("PUSHING TO GITHUB - FINAL ATTEMPT")
    print("=" * 70)

    # Try multiple push methods
    methods = [
        ("HTTPS (cached credentials)", "git push -u origin main"),
        ("SSH (if keys exist)", "git push -u origin ssh://git@github.com/techcraftlabbkk/tc-collectibles.git"),
    ]

    for method_name, cmd in methods:
        print(f"\n[*] Attempting: {method_name}")
        returncode, stdout, stderr = run_command(cmd, cwd=str(project_dir))

        if returncode == 0:
            print(f"✅ SUCCESS with {method_name}!")
            print(f"\n{stdout}")
            show_success_message()
            return 0
        else:
            if "Permission" in stderr or "403" in stderr:
                print(f"  ✗ Authentication failed")
            elif "Could not read" in stderr or "ssh" in stderr.lower():
                print(f"  ✗ SSH not available or not configured")
            else:
                print(f"  ✗ Failed: {stderr[:100]}")

    # If we get here, all methods failed
    print("\n" + "=" * 70)
    print("⚠️  UNABLE TO AUTHENTICATE AUTOMATICALLY")
    print("=" * 70)
    print("\nThe code is ready to push but needs GitHub authentication.")
    print("\nYour options:")
    print("  1. Provide a GitHub Personal Access Token (recommended)")
    print("  2. Set up SSH keys for GitHub")
    print("  3. Use GitHub Desktop with your account logged in")
    print("\n" + "=" * 70)
    print("WHAT'S BEEN COMPLETED:")
    print("=" * 70)
    print("✅ All 16 app files created locally")
    print("✅ Git repository initialized")
    print("✅ All files staged and committed")
    print("❌ Push to GitHub (pending authentication)")
    print("\n" + "=" * 70)
    print("NEXT STEPS:")
    print("=" * 70)
    print("\n1. Get a GitHub Personal Access Token:")
    print("   - Go to: https://github.com/settings/tokens")
    print("   - Click 'Generate new token' (classic)")
    print("   - Select 'repo' scope")
    print("   - Copy the token")
    print("\n2. Push with token (in Command Prompt):")
    print("   cd \"C:\\Users\\USER\\Desktop\\Claude Project\\TC Collectibles x TechCraft Lab\"")
    print("   git push -u origin main")
    print("   When prompted:")
    print("     Username: (your GitHub username)")
    print("     Password: (paste your token)")
    print("\n3. Or use GitHub Desktop:")
    print("   - Open GitHub Desktop")
    print("   - Log in with your GitHub account")
    print("   - Find TC Collectibles repo")
    print("   - Click 'Publish branch'")
    print("\n" + "=" * 70)
    input("Press Enter to exit...")
    return 1

def show_success_message():
    print("\n" + "=" * 70)
    print("✅ SUCCESS - Changes pushed to GitHub!")
    print("=" * 70)
    print("\n📋 Next Steps:")
    print("  1. Vercel will auto-deploy in 1-2 minutes")
    print("  2. Check deployments:")
    print("     https://vercel.com/techcraftlabbkk-7072s-projects/tc-collectibles/deployments")
    print("  3. Test the app:")
    print("     https://tc-collectibles.vercel.app/en")
    print("\n✨ Deployment fix complete!")
    print("=" * 70)

if __name__ == "__main__":
    sys.exit(main())
