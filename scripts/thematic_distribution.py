if __name__ == "__main__":
    import os
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

    data = dict_to_list(data, "date", "values")
    for period in data:
        period["values"] = dict_to_list(period["values"], "x", "y", sort_index=1, reverse=True)

    write(OUTPUT_PATH, data)
