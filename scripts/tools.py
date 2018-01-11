import os
import ast
import datetime as dt

ROOT = os.path.join(os.path.dirname(os.path.realpath(__file__)), "..")
DATA_DIR = os.path.join(ROOT, "data")
RAW_FILE = os.path.join(DATA_DIR, "raw.csv")

# Getters
def get_date(row):
    timestamp = int(row[4])
    date = dt.datetime.fromtimestamp(timestamp)
    return date.strftime("%Y-%m") # Monthly data

def get_tags(row):
    # Cannot parse with json module as data use single quotes
    return ast.literal_eval(row[13])

def get_views(row):
    return int(row[16])

def get_duration(row):
    return int(row[2])


def extract_fname(path):
    return os.path.splitext(os.path.basename(path))[0]


def tags_to_themes(tags):
    # TODO: filter tags to keep general themes
    return tags
