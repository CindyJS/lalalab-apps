#!/bin/bash
# script to sync into this repo into users home directory

SCRIPTNAME=$(basename "$0")

# Change to directory where the install script resides
cd "$(dirname "$0")"

echo "Updating the git submodule for applauncher2."
git submodule update --init --recursive

echo "Copying the applauncher2 configurations."
cp showmemusic.config.yml applauncher2/cfg/showmemusic.config.yml
cp beatbox.config.yml applauncher2/cfg/beatbox.config.yml

echo "Done."
