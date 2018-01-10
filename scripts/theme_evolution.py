if __name__ == "__main__":
    import os
    import csv
    import json
    from collections import defaultdict
    from tools import *

    OUTPUT_NAME = "theme_evolution.json"

    with open(RAW_FILE) as f:
        reader = csv.reader(f)
        next(reader) # Skip header
        data = {}
        for row in reader:
            tags = get_tags(row)
