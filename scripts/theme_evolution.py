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
        data = defaultdict(list)
        for row in reader:
            for theme in tags_to_themes(get_tags(row)):
                data[theme].append({
                    "timestamp": row[FILM_DATE_COL],
                })
        with open(os.path.join(DATA_DIR, OUTPUT_NAME), "w") as output:
            json.dump(data, output, indent=2)
