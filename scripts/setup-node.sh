#!/bin/sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
VERSION=v26.13.1
case "$(uname -s)" in Darwin) PLATFORM=darwin ;; Linux) PLATFORM=linux ;; *) echo 'Install an official Node.js LTS runtime for your platform.' >&2; exit 1 ;; esac
case "$(uname -m)" in arm64|aarch64) ARCH=arm64 ;; x86_64) ARCH=x64 ;; *) echo 'Unsupported CPU architecture.' >&2; exit 1 ;; esac
ARCHIVE="node-$VERSION-$PLATFORM-$ARCH.tar.gz"
mkdir -p "$ROOT/.tools/downloads"
cd "$ROOT/.tools/downloads"
curl --fail --location --show-error --silent "https://nodejs.org/dist/$VERSION/$ARCHIVE" --output "$ARCHIVE"
curl --fail --location --show-error --silent "https://nodejs.org/dist/$VERSION/SHASUMS256.txt" --output SHASUMS256.txt
awk -v file="$ARCHIVE" '$2 == file { print }' SHASUMS256.txt > runtime-checksum.txt
test -s runtime-checksum.txt
shasum -a 256 --check runtime-checksum.txt
tar -xzf "$ARCHIVE" -C "$ROOT/.tools"
echo "Project-local Node.js $VERSION is ready. Run: sh scripts/npm install"
