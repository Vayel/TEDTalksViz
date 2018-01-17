if __name__ == "__main__":
    import os
    import csv
    import json
    from functools import partial
    from collections import defaultdict
    from tools import *

    OUTPUT_PATH = os.path.join(DATA_DIR, extract_fname(__file__) + ".json")

    data = defaultdict(partial(defaultdict, lambda: 0))
    for row in read_raw():
        date = get_date(row)
        for theme in tags_to_themes(get_tags(row)):
            data[date][theme] += 1

    print(data.keys())
    data = dict_to_list(data, "date", "distribution")
    for period in data:
        period["distribution"] = dict_to_list(period["distribution"], "theme", "talks", sort_index=1, reverse=True)
    with open(OUTPUT_PATH, "w") as output:
        json.dump(data, output, indent=2)
