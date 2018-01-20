if __name__ == "__main__":
    import os
    import json
    from collections import defaultdict
    from tools import *

    OUTPUT_PATH = os.path.join(DATA_DIR, extract_fname(__file__) + ".json")

    date_range_ = list(date_range())
    data = defaultdict(lambda: {date: 0 for date in date_range_})
    for row in read_raw():
        date = get_date(row)
        for theme in tags_to_themes(get_tags(row)):
            data[theme][date] += 1

    data = {k: dict_to_list(v, "x", "y") for k, v in data.items()}
    for _, values in data.items():
        counter = 0
        for value in values:
            counter += value["y"]
            value["cumulative_y"] = counter
    write(OUTPUT_PATH, data)
