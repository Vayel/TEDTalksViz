if __name__ == "__main__":
    import os
    import json
    from itertools import chain
    from collections import defaultdict
    from tools import *

    OUTPUT_PATH = os.path.join(DATA_DIR, extract_fname(__file__) + ".json")

    def mean(numbers):
        return int(float(sum(numbers)) / max(len(numbers), 1))

    mean_values = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    for row in read_raw():
        date = get_date(row)
        for theme in tags_to_themes(get_tags(row)):
            mean_values[date][theme]["x"].append(get_views(row))
            mean_values[date][theme]["y"].append(get_comments(row))
            mean_values[date][theme]["radius"].append(get_languages(row))

    # Compute means
    for date in mean_values:
        for theme, point in mean_values[date].items():
            for k, v in point.items():
                point[k] = mean(v)

    UNKNOWN_THEME_RADIUS = -1
    radius = {"min": float("inf"), "max": 0,}
    date_range_ = list(date_range())
    themes = list_themes()
    values = []
    counters = defaultdict(lambda: {"x": 0, "y": 0})
    for date in date_range_:
        row = {
            "date": date,
            "values": [],
        }
        for label in themes:
            if label in mean_values[date]:
                point = mean_values[date][label]
                radius["min"] = min(radius["min"], point["radius"])
                radius["max"] = max(radius["max"], point["radius"])
            else:
                point = {
                    "x": 0,
                    "y": 0,
                    "radius": UNKNOWN_THEME_RADIUS
                }

            point["label"] = label
            for k in ("x", "y"):
                counters[label][k] += point[k]
                point[k] = counters[label][k]

            row["values"].append(point)
        values.append(row)

    write(OUTPUT_PATH, {
        "radius": radius,
        "values": values,
    })
