if __name__ == "__main__":
    import os
    import json
    from collections import defaultdict
    from tools import *

    OUTPUT_PATH = os.path.join(DATA_DIR, extract_fname(__file__) + ".json")

    def mean(numbers):
        return int(float(sum(numbers)) / max(len(numbers), 1))

    views = defaultdict(lambda: defaultdict(list))
    comments = defaultdict(lambda: defaultdict(list))
    for row in read_raw():
        date = get_date(row)
        for theme in tags_to_themes(get_tags(row)):
            views[date][theme].append(get_views(row))
            comments[date][theme].append(get_comments(row))

    data = {
        date: [{
            "views": mean(views[date][theme]),
            "comments": mean(comments[date][theme]),
            "theme": theme
            } for theme in views[date]
        ] for date in views
    }
    data = dict_to_list(data, "date", "talks")
    write(OUTPUT_PATH, data)
