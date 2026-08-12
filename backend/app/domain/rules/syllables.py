import re

def count_vietnamese_syllables(line: str) -> int:
    cleaned = re.sub(r"[^\wÀ-ỹ\s]", " ", line, flags=re.UNICODE)
    return len([w for w in cleaned.strip().split() if w])