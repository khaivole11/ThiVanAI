import json
from pathlib import Path
from typing import Dict, Any, Optional

class ManifestManager:
    def __init__(self, manifest_path: str):
        self.manifest_path = Path(manifest_path)

    def load_manifest(self) -> Optional[Dict[str, Any]]:
        if not self.manifest_path.exists():
            return None
        with open(self.manifest_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def save_manifest(self, data: Dict[str, Any]):
        self.manifest_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.manifest_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)