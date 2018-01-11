if __name__ == "__main__":
    import os
    import csv
    import json
    from functools import partial
    from collections import defaultdict
    from tools import *

    OUTPUT_NAME = "monthly_theme_quantity.json"

    with open(RAW_FILE) as f:
        reader = csv.reader(f)
        next(reader) # Skip header
        data = defaultdict(partial(defaultdict, lambda: 0))
        for row in reader:
            for theme in tags_to_themes(get_tags(row)):
                timestamp = int(row[FILM_DATE_COL])
                data[theme][timestamp_to_date(timestamp)] += 1
        with open(os.path.join(DATA_DIR, OUTPUT_NAME), "w") as output:
            json.dump(data, output, indent=2)
