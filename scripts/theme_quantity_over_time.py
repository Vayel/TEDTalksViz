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

    data_as_list = {k: dict_to_list(v, "date", "talks") for k, v in data.items()}
    with open(OUTPUT_PATH, "w") as output:
        json.dump(data_as_list, output, indent=2)
