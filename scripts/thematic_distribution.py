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
        data = defaultdict(partial(defaultdict, lambda: 0))
        for row in reader:
            date = timestamp_to_date(int(row[FILM_DATE_COL]))
            for theme in tags_to_themes(get_tags(row)):
                data[date][theme] += 1
        with open(OUTPUT_PATH, "w") as output:
            json.dump(data, output, indent=2)
