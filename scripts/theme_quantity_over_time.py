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
            data[theme][date] += 1

    data_as_list = {k: dict_to_list(v, "date", "talks") for k, v in data.items()}
    with open(OUTPUT_PATH, "w") as output:
        json.dump(data_as_list, output, indent=2)
