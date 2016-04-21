#!/usr/local/bin/python

''' Copyright ONL SpA 2016  Christian Allende
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Contact: christian.allende.cid@gmail.com
    '''

docstring= """
DESCRIPTION
    Add weights to faq for AIchat chatbot

USAGE:
    python addweights.py <csv-file> lowbound(optional)
    The script will create a Weighted.csv file for your faq
    The script will normalize the weights automatically based on the sentence length, 
    but you can customize the normalization using a value as a base from 0-1
"""

import sys


from sys import argv
import csv
import StringIO
from collections import Counter

length=len(sys.argv)
if length < 2:
    sys.exit('\nAt least one argument required%s' %(docstring))
    
filename= sys.argv[1]
txt = open(filename)
data = txt.read()
input_stream = StringIO.StringIO(data)
output = StringIO.StringIO(data)
reader = csv.reader(input_stream, delimiter=',')
writer = csv.writer(output, delimiter = ',')

reader.next() #skip header
csvrows = [row[0] for row in reader]




counts = Counter()

for sentence in csvrows:
    counts.update(word.strip('.,?\xc2!"\'').lower() for word in sentence.split())


mylist = []
finalweights = []


for sentence in csvrows:
    newrows = list(word.strip('.,?\xc2!"\'').lower() for word in sentence.split())

    myweights = []
    strweigth = ""
    check = 0
    for word in newrows:
        if length < 3:
   		base=1.0/len(newrows)
        else:
   		base=float(sys.argv[2])
        #print word
        myweights.append(base+1.0/counts[word])

    for weight in myweights:
        if check < 1:
   		strweigth+=str(weight/sum(myweights))
        else:
   		strweigth+=" "+str(weight/sum(myweights))
        check += 1
 
    finalweights.append(strweigth)
    mylist.append(newrows)



with open(filename, 'rb') as input, open('Weighted.csv', 'wb') as output:
    reader = csv.reader(input, delimiter = ',')
    writer = csv.writer(output, delimiter = ',')

    all = []
    row = next(reader)
    row.insert(3, 'Weights')
    all.append(row)
    for k, row in enumerate(reader):
        all.append(row + [str(finalweights[k])])

    writer.writerows(all)


