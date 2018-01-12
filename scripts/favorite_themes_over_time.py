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
        data = defaultdict(list)
        for row in reader:
            date = get_date(row)
            for theme in tags_to_themes(get_tags(row)):
                data[date].append({
                    "views": get_views(row),
                    "comments": get_comments(row),
                    "duration": get_duration(row),
                    "theme": theme,
                })
        with open(OUTPUT_PATH, "w") as output:
            json.dump(data, output, indent=2)
