if __name__ == "__main__":
    import os
    import json
    from collections import defaultdict
    import tools

    OUTPUT_PATH = os.path.join(tools.DATA_DIR, tools.extract_fname(__file__) + ".json")

    data = {
        "themes": set(),
        "dates": list(tools.date_range()),
        "duration": { "min": float("inf"), "max": 0, },
        "views": { "min": float("inf"), "max": 0, },
        "comments": { "min": float("inf"), "max": 0, },
        "languages": { "min": float("inf"), "max": 0, },
    }
    for row in tools.read_raw():
        for theme in tools.tags_to_themes(tools.get_tags(row)):
            data["themes"].add(theme)

        for key in ("duration", "views", "comments", "languages"):
            data[key]["min"] = min(data[key]["min"], getattr(tools, "get_" + key)(row))
            data[key]["max"] = max(data[key]["max"], getattr(tools, "get_" + key)(row))

    data["themes"] = list(data["themes"])
    tools.write(OUTPUT_PATH, data)
