if __name__ == "__main__":
    import os
    import csv
    from tools import *

    OUTPUT_NAME = "themes_repartition.csv"

    with open(RAW_FILE) as f:
        reader = csv.reader(f)
        next(reader) # Skip header
        with open(os.path.join(DATA_DIR, OUTPUT_NAME), "w", newline="") as output:
            writer = csv.writer(output)
            writer.writerow(["timestamp", "themes"])
            for row in reader:
                writer.writerow([row[FILM_DATE_COL], tags_to_themes(get_tags(row))])
