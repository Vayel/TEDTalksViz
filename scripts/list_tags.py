if __name__ == "__main__":
    import ast
    import csv
    from tools import *

    with open(RAW_FILE) as f:
        unique_tags = set()
        reader = csv.reader(f)
        next(reader) # Skip header
        for row in reader:
            unique_tags |= set(get_tags(row))
        print("\n".join(unique_tags)) 

