#!/bin/bash

# Sync Fork Script
# This script syncs the current local fork with its upstream repository 
# and pushes the changes to your origin repository.

set -e

# Check if gh is installed
if ! command -v gh &> /dev/null
then
    echo "Error: gh (GitHub CLI) could not be found. Please install it first."
    exit 1
fi

# Sync with upstream
echo "Syncing with upstream..."
gh repo sync

# Get the current branch name
CURRENT_BRANCH=$(git branch --show-current)

# Push to origin
echo "Pushing changes to origin ($CURRENT_BRANCH)..."
git push origin "$CURRENT_BRANCH"

echo "Successfully synced and pushed to origin!"
