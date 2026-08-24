#!/usr/bin/env bash
set -e

# --------------------------
# Configuration
# --------------------------
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
OUTPUT_NAME="${1:-full-stack-fastapi-template-$TIMESTAMP.zip}"

echo "Project root: $PROJECT_ROOT"
echo "Creating $OUTPUT_NAME..."

cd "$PROJECT_ROOT"

# Remove old zip if it already exists
rm -f "$OUTPUT_NAME"

# Zip everything but virtual envs, node_modules, caches, git, build artifacts, and logs
zip -r "$OUTPUT_NAME" . \
  -x ".venv/*" \
  -x "*/.venv/*" \
  -x "venv/*" \
  -x "*/venv/*" \
  -x "node_modules/*" \
  -x "*/node_modules/*" \
  -x "__pycache__/*" \
  -x "**/__pycache__/*" \
  -x ".pytest_cache/*" \
  -x "**/.pytest_cache/*" \
  -x ".mypy_cache/*" \
  -x "**/.mypy_cache/*" \
  -x ".ruff_cache/*" \
  -x "**/.ruff_cache/*" \
  -x "dist/*" \
  -x "*/dist/*" \
  -x "build/*" \
  -x "*/build/*" \
  -x "coverage/*" \
  -x "*/coverage/*" \
  -x "htmlcov/*" \
  -x "*/htmlcov/*" \
  -x ".coverage" \
  -x "*/.coverage" \
  -x ".git/*" \
  -x "**/.git/*" \
  -x ".tanstack/*" \
  -x "*/.tanstack/*" \
  -x "test-results/*" \
  -x "*/test-results/*" \
  -x "blob-report/*" \
  -x "*/blob-report/*" \
  -x "*.zip" \
  -x "*.log" \
  -x ".DS_Store"

echo "Done! Created $OUTPUT_NAME"
