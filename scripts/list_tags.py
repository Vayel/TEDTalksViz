import csv
import ast
from tools import *

def list_tags(filepath):
    with open(filepath) as f:
        unique_tags = set()
        reader = csv.reader(f)
        next(reader) # Skip header
        for row in reader:
            unique_tags |= set(get_tags(row))
        return unique_tags


if __name__ == "__main__":
    print("\n".join(list_tags(RAW_FILE))) 

