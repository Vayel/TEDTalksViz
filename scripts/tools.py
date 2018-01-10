import os
import ast

ROOT = os.path.join(os.path.dirname(os.path.realpath(__file__)), "..")
DATA_DIR = os.path.join(ROOT, "data")
RAW_FILE = os.path.join(DATA_DIR, "raw.csv")

TAGS_COL = 13
FILM_DATE_COL = 4

def get_tags(row):
    # Cannot parse with json module as data use single quotes
    return ast.literal_eval(row[TAGS_COL])


def tags_to_themes(tags):
    # TODO: filter tags to keep general themes
    return ",".join(tags)
