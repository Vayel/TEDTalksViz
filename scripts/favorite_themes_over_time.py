if __name__ == "__main__":
    import os
    import json
    from itertools import chain
    from collections import defaultdict
    from tools import *

    OUTPUT_PATH = os.path.join(DATA_DIR, extract_fname(__file__) + ".json")

    def mean(numbers):
        return int(float(sum(numbers)) / max(len(numbers), 1))

    data = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    for row in read_raw():
        date = get_date(row)
        for theme in tags_to_themes(get_tags(row)):
            data[date][theme]["views"].append(get_views(row))
            data[date][theme]["comments"].append(get_comments(row))
            data[date][theme]["languages"].append(get_languages(row))

    data = {
        date: [{
            "theme": theme,
            **features
            } for theme, features in data[date].items()
        ] for date in data
    }
    data = dict_to_list(data, "date", "talks")
    write(OUTPUT_PATH, data)
