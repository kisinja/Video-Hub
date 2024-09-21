import sys
import re

# Sample keywords to check for "How-to" videos
how_to_keywords = [
    "how to", "guide", "tutorial", "diy", "step by step",
    "instruction", "lesson", "learn", "teaching"
]

def is_how_to_video(title, description):
    title = title.lower()
    description = description.lower()
    
    for keyword in how_to_keywords:
        if re.search(keyword, title) or re.search(keyword, description):
            return True
    return False

if __name__ == "__main__":
    # Get title and description from command-line arguments
    title = sys.argv[1]
    description = sys.argv[2]
    
    # Check if the video is a "How-to" video
    if is_how_to_video(title, description):
        print("True")
    else:
        print("False")
