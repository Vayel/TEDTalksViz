if __name__ == "__main__":
    import os
    import sys
    import csv
    import json
    from functools import partial
    from collections import defaultdict
    from tools import *

    OUTPUT_PATH = os.path.join(DATA_DIR, extract_fname(__file__) + ".json")
    if os.path.isfile(OUTPUT_PATH):
        print("{0} already exists.".format(OUTPUT_PATH))
        sys.exit(1)

    with open(RAW_FILE) as f:
        reader = csv.reader(f)
        next(reader) # Skip header
        data = {}
        for row in reader:
            for tag in get_tags(row):
                data[tag] = []
        with open(OUTPUT_PATH, "w") as output:
            json.dump(data, output, indent=2)
