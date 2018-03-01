import csv


#THIS IS THE INPUT VARIABLE TO SET THE QR TEXT TO
inputString = ""

iAr = inputString.strip().split(",")
chunks = lambda iAr, n=3: [iAr[i:i+n] for i in range(0, len(iAr), n)]
with open('setupList.csv', 'a+') as csvfile:
    csvWrite = csv.writer(csvfile, dialect='excel', delimiter=',')
    print chunks(iAr)
    print len(iAr)
    csvWrite.writerow(iAr[:8] + iAr[len(iAr)-6:])
with open('eventList.csv', 'a+') as csvfile:
	csvWrite = csv.writer(csvfile, dialect='excel', delimiter=',')
	setupArr = [iAr[2],iAr[1],iAr[5]]
	del iAr[:8]
	del iAr[len(iAr)-6:]
	print iAr
	csvWrite.writerow(setupArr + iAr)