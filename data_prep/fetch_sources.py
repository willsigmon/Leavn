"""
Download public‑domain Bible texts (WEB & KJV) into data_prep/raw/.
"""
import subprocess, pathlib, shutil
DEST = pathlib.Path("data_prep/raw")
if DEST.exists(): shutil.rmtree(DEST)
subprocess.check_call(
    ["git", "clone", "--depth", "1",
     "https://github.com/seven1m/open-bibles.git", str(DEST)]
)
