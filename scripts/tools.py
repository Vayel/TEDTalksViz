import os
import json
import csv
import ast
import datetime as dt
import operator

ROOT = os.path.join(os.path.dirname(os.path.realpath(__file__)), "..")
DATA_DIR = os.path.join(ROOT, "data")
RAW_FILE = os.path.join(DATA_DIR, "raw.csv")
FIRST_DATE = "2004-01" # 2004 because before this year, not all semesters contain talks


def read_raw():
    with open(RAW_FILE) as f:
        reader = csv.reader(f)
        next(reader) # Skip header
        for row in reader:
            date = get_date(row)
            if date < FIRST_DATE:
                continue
            yield row

# Getters
def get_date(row):
    timestamp = int(row[4])
    date = dt.datetime.fromtimestamp(timestamp)
    year = str(date.year)
    month = "01" if date.month < 7 else "07"
    return year + "-" + month

def get_tags(row):
    # Cannot parse with json module as data use single quotes
    return ast.literal_eval(row[13])

def get_views(row):
    return int(row[16])

def get_duration(row):
    return int(row[2])

def get_comments(row):
    return int(row[0])

def get_languages(row):
    return int(row[5])


def last_date():
    last = FIRST_DATE
    for row in read_raw():
        last = max(last, get_date(row))
    return last


def add_months(sourcedate, months):
    month = sourcedate.month - 1 + months
    year = sourcedate.year + month // 12
    month = month % 12 + 1
    return dt.date(year, month, 1)


def date_range():
    date = dt.datetime.strptime(FIRST_DATE, "%Y-%m")
    last = last_date()
    while date.strftime("%Y-%m") <= last:
        yield date.strftime("%Y-%m")
        date = add_months(date, 6)


def extract_fname(path):
    return os.path.splitext(os.path.basename(path))[0]


def tags_to_themes(tags):
    with open(os.path.join(DATA_DIR, "tags_to_themes.json")) as f:
        tags_to_themes = json.load(f)
        themes = set()
        for tag in tags:
            themes.update(tags_to_themes[tag])
        try:
            themes.remove("")
        except KeyError:
            pass
        return themes


def list_themes():
    themes = set()
    for row in read_raw():
        for theme in tags_to_themes(get_tags(row)):
            themes.add(theme)
    return themes


def dict_to_list(d, key_label, value_label, sort_index=0, reverse=False):
    sorted_d = sorted(d.items(), key=operator.itemgetter(sort_index), reverse=reverse)
    return [{key_label: k, value_label: v} for k, v in sorted_d]


def write(path, data):
    with open(path, "w") as output:
        json.dump(data, output, indent=2)
