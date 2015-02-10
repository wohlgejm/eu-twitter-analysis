from pymongo import MongoClient
import re
import csv

client = MongoClient('research.jmu.rocks')
client.admin.authenticate('jwohlgemuth', 'Jets0421')
db = client.eu_miner

csvs = ['hypotheses_1_2_3_4_12.csv', 'share.csv', 'tenure.csv', 'right_left.csv', 'internal_cohesion.csv']


def add_data():
    for idx, i in enumerate(csvs):
        with open('/home/jwohlgemuth/eu-twitter-analysis/' + i, 'r') as infile:
            reader = csv.reader(infile, delimiter=',')
            reader.next()
            if idx == 0:
                data = {rows[0]: [rows[1], rows[2], rows[3], rows[4], rows[5]] for rows in reader}
            else:
                data = {rows[0]:rows[1] for rows in reader}

        reduced = db.reduced.find()
        for mep in reduced:
            if idx == 0:
                for k0, v0 in data.iteritems():
                    if k0 == mep['_id']['nationality']:
                        db.reduced.update({'_id.name': mep['_id']['name']}, {'$set': {'WEF_Global_IT_score_2014': float(v0[0])}}, upsert=False)
                        db.reduced.update({'_id.name': mep['_id']['name']}, {'$set': {'GDP_per_capita_PPS_2013': float(v0[1])}}, upsert=False)
                        db.reduced.update({'_id.name': mep['_id']['name']}, {'$set': {'Median_age_2014': float(v0[2])}}, upsert=False)
                        db.reduced.update({'_id.name': mep['_id']['name']}, {'$set': {'Press_freedom_2014': float(v0[3])}}, upsert=False)
                        db.reduced.update({'_id.name': mep['_id']['name']}, {'$set': {'Electoral_system': float(v0[4])}}, upsert=False)
            if idx == 1:
                for k1, v1 in data.iteritems():
                    if k1.decode('utf-8') == mep['_id']['name']:
                        db.reduced.update({'_id.name': mep['_id']['name']}, {'$set': {'share_2009-share_2014': float(v1)}}, upsert=False)
                        break
            if idx == 2:
                for k2, v2 in data.iteritems():
                    if sorted(k2.decode('utf-8').lower()) == sorted(mep['_id']['name'].lower()):
                        db.reduced.update({'_id.name': mep['_id']['name']}, {'$set': {'days_served': float(v2)}}, upsert=False)
                        break
            if idx == 3:
                for k3, v3 in data.iteritems():
                    if k3.decode('utf-8') == mep['_id']['name']:
                        db.reduced.update({'_id.name': mep['_id']['name']}, {'$set': {'right_left': float(v3)}}, upsert=False)
                        break
            if idx == 4:
                for k4, v4 in data.iteritems():
                    if k4.decode('utf-8') == mep['_id']['european_party']:
                        if v4 == "N/A":
                            new_v = None
                        else:
                            new_v = float(v4)
                        db.reduced.update({'_id.name': mep['_id']['name']}, {'$set': {'internal_cohesion_score_2009-2014': new_v}}, upsert=False)
                        break


def output_reduced():
    reduced = db.reduced.find()
    rows = []
    for idx, mep in enumerate(reduced):
        row = {}
        for k, v in mep['_id'].iteritems():
            if k == 'name':
                encoded_name = v.encode('utf-8')
                row.setdefault(k, encoded_name)
            else:
                row.setdefault(k, v)
        for _k, _v in mep.iteritems():
            if _k != '_id':
                row.setdefault(_k, _v)
        if "right_left" not in row.keys():
            row.setdefault("right_left", None)
        rows.append(row)

    with open('/home/jwohlgemuth/eu-twitter-analysis/reduced_output.csv', 'wb') as f:
        w = csv.DictWriter(f, rows[0].keys())
        w.writeheader()
        w.writerows(rows)

if __name__ == '__main__':
    add_data()
    output_reduced()