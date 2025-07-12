#!/usr/bin/env bash
# Exit immediately on errors
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Collect static files (if using Django's staticfiles)
python manage.py collectstatic --noinput