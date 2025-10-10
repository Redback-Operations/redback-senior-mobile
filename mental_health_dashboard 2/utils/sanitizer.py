# utils/sanitizer.py
import re

# Words you want visibly censored in the UI (not used for detection logic)
BANNED_WORDS = [
    'kill', 'suicide', 'damn', 'hell',
    'hurt', 'idiot', 'stupid', 'bastard'
]

# Phrases/keywords that should trigger a crisis-safe flow
CRISIS_PATTERNS = [
    r'\bi want to die\b',
    r'\bi want to (?:hurt|harm) myself\b',
    r'\bthinking (?:about|of) suicide\b',
    r'\bsuicid(?:e|al)\b',
    r'\bkill myself\b',
    r'\bself[-\s]?harm\b',
    r'\bno reason to live\b',
    r'\bend it all\b',
    r"\bcan't go on\b",
    r'\bi am in danger\b',
]

def sanitize_input(text: str) -> str:
    """Censor banned words for display (polite UI), not for logic."""
    if not text:
        return ""
    pattern = r'\b(?:' + '|'.join(map(re.escape, BANNED_WORDS)) + r')\b'
    clean_text = re.sub(pattern, '[censored]', text, flags=re.IGNORECASE)
    return clean_text.strip()

def detect_crisis(text: str) -> bool:
    """Return True if the text looks like a crisis / self-harm risk."""
    if not text:
        return False
    t = text.lower()
    return any(re.search(rx, t, flags=re.IGNORECASE) for rx in CRISIS_PATTERNS)
