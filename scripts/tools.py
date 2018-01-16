import os
import json
import ast
import datetime as dt
import operator

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

def get_comments(row):
    return int(row[0])


def extract_fname(path):
    return os.path.splitext(os.path.basename(path))[0]


def tags_to_themes(tags):
    with open(os.path.join(DATA_DIR, "tags_to_themes.json")) as f:
        tags_to_themes = json.load(f)
        themes = set()
        for tag in tags:
            themes.update(tags_to_themes[tag])
        return themes


def dict_to_list(d, key_label, value_label, sort_index=0, reverse=False):
    sorted_d = sorted(d.items(), key=operator.itemgetter(sort_index), reverse=reverse)
    return [{key_label: k, value_label: v} for k, v in sorted_d]
