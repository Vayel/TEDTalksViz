if __name__ == "__main__":
    import os
    import json
    from itertools import chain
    from collections import defaultdict
    from tools import *

    OUTPUT_PATH = os.path.join(DATA_DIR, extract_fname(__file__) + ".json")

    def mean(numbers):
        return int(float(sum(numbers)) / max(len(numbers), 1))

    values = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    for row in read_raw():
        date = get_date(row)
        for theme in tags_to_themes(get_tags(row)):
            values[date][theme]["x"].append(get_views(row))
            values[date][theme]["y"].append(get_comments(row))
            values[date][theme]["radius"].append(get_languages(row))

    data = {
        "radius": { "min": float("inf"), "max": 0, },
        "x": { "min": float("inf"), "max": 0, },
        "y": { "min": float("inf"), "max": 0, },
        "values": {
            date: [{
                "theme": theme,
                **{k: mean(v) for k, v in features.items()}
                } for theme, features in values[date].items()
            ] for date in values
        }
    }
    for values in data["values"].values():
        for d in values:
            for k, v in d.items():
                if k == "theme":
                    continue
                data[k]["min"] = min(data[k]["min"], v)
                data[k]["max"] = max(data[k]["max"], v)

    data["values"] = dict_to_list(data["values"], "date", "values")
    write(OUTPUT_PATH, data)
