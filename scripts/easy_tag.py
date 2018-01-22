
from list_tags import list_tags
import csv
import json
import pickle
from tools import *

data = {}
i = 0
step = 0
for tag in list_tags(RAW_FILE):
	step += 1
	i += 1
	themes = input(str(step) + ' - ' + tag + ": ").split(',')
	data[tag] = themes

	# backup every X steps
	if i == 20:
		print("Backup...")
		i = 0
		with open('output_backup_'+str(step)+'.pkl', 'wb') as f:
			pickle.dump(data, f)
		print("Done")


with open('output.json', 'w') as f:
	json.dump(data, f, indent=4)

