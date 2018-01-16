if __name__ == "__main__":
    import os
    import csv
    import json
    from functools import partial
    from collections import defaultdict
    from tools import *

    OUTPUT_PATH = os.path.join(DATA_DIR, extract_fname(__file__) + ".json")

    with open(RAW_FILE) as f:
        reader = csv.reader(f)
        next(reader) # Skip header
        data = set()
        for row in reader:
            for theme in tags_to_themes(get_tags(row)):
                data.add(theme)
        with open(OUTPUT_PATH, "w") as output:
            json.dump(list(data), output)

