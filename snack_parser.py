import csv
import requests

preferences = ['sweet','spicy','chewy','crunchy',
               'veg','organic','carb','nut',
               'milk','salty','savory']
snackList = []
snack_preference_description = []

for row in csv.reader(open('snack_data.csv', 'r',errors='ignore')):
    snackList.append(row)

header = snackList[0]+['preferences']
snackList.pop(0)

for i in range(len(snackList)):
    description = snackList[i][2].lower()
    snack_description = []
    for j in range(len(preferences)):
        p = preferences[j]
        if (p in description or p in snackList[i][0].lower()):
            snack_description.append(j)
    if (len(snack_description) == 0):
        snack_description = "null"
    snackList[i].append(snack_description)

for snack in snackList:
    json = '{'
    for i in range(len(header)):
        json = json + '"' + header[i]+ '":'
        if (isinstance(snack[i],str) and snack[i] == "null"):
            json = json + snack[i] + ','
        elif (isinstance(snack[i],str)):
            json = json + '"'+snack[i]+'",'
        else:
            json = json + str(snack[i])+','
    json = json + '"likes":0,"dislikes":0}'
    url = 'http://10.1.176.240:8080/org/sandbox/snacks'
    r = requests.post(url,json)
    print (json)

'''
text_file = open("output.txt","w")
text_file.write(json)
text_file.close()
with open('some.csv','w') as f:
    writer = csv.writer(f, lineterminator='\n')
    writer.writerows(snackList)

f.close()

import csv
import json

csvfile = open('some.csv', 'r')
jsonfile = open('jsonfile.dump', 'w')

fieldnames = header
reader = csv.DictReader( csvfile, fieldnames)
for row in reader:
    print (row)
    json.dump(row, jsonfile)
    jsonfile.write('\n')
jsonfile.close()
    
'''
