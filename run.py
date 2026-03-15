#!/usr/bin/env python
import os
import sys
import subprocess

# Change to backend directory
os.chdir('backend')

# Run uvicorn from backend directory
port = os.environ.get("PORT", 8000)
subprocess.run([sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", f"--port", str(port)])
