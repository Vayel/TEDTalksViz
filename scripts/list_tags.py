if __name__ == "__main__":
    import ast
    import csv
    from tools import *

    with open(RAW_FILE) as f:
        unique_tags = set()
        reader = csv.reader(f)
        next(reader) # Skip header
        for row in reader:
            # Cannot parse with json module as data use single quotes
            tags = ast.literal_eval(row[TAGS_COL])
            unique_tags |= set(tags)
        print("\n".join(unique_tags)) 

