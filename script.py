import requests
import time
import json
import sys, getopt

#username = "Qcharton"
#username = "Roipancakes"
#username = "Kiparte"
#username = "Fonb"


def main(argv):
    outputfile = ''
    username = ''
    try:
        opts, args = getopt.getopt(argv,"hu:o:",["user=", "ofile="])
    except getopt.GetoptError:
      print("Erreur d'arguments. Lancez script.py -h pour plus d'information.")
      sys.exit()
    for opt, arg in opts:
        if opt == '-h':
            print("Bievenue dans l'aide de notre script")
            print("Afin de l'executer, lancer la commande suivante : ")
            print ("    script.py --user <username> --ofile <output-file>")
            print("Cela creera un dataset en json pour le user <username> à l'emplacement <output-file>")
            sys.exit()
        elif opt in ("-o", "--ofile"):
            outputfile = arg
        elif opt in ("-u", "--user"):
            username = arg
    if username == '' or outputfile == '' :
        print("Erreur d'arguments. Lancez script.py -h pour plus d'information.")
        sys.exit()
    else:
        creation_dataset(username, outputfile)


def creation_dataset(username, outputfile):
    page = 1
    URL = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=" + username + "&api_key=9be74406d0a68902ed0d0d6ff90e7e33&format=json&fbclid=IwAR2GgbRVOeuks_Oz2f-Y5MUAAcWJUePIVXmlxQRI9a6EDyVGVPi43ELxVSg&limit=200&page="

    resp = requests.get(URL + str(page))
    if 'recenttracks' not in resp.json():
        print("Erreur de username")
        sys.exit()
    total_pages = int(resp.json()['recenttracks']['@attr']['totalPages'])
    tracks = []

    #On récupère les tracks écoutées par l'utilisateur
    for page in range(total_pages):
        resp = requests.get(URL + str(page+1))
        tracks += resp.json()['recenttracks']['track']

    print("Nous avons récupéré " + str(len(tracks)) + " de vos musiques !")

    #on récupère les albums
    album = {}
    for t in tracks:
        key = t['album']['#text']
        if key in album:
            if t['name'] in  album[key]['tracks']:
                album[key]['tracks'][t['name']]['nb_ecoute'] += 1
            else:
                d = {
                "nb_ecoute" : 1,
                    "duration" : 0 
                }
                album[key]['tracks'][t['name']] = d
                album[key]['nb_ecoute_unique'] += 1
            
            album[key]['nb_ecoute_tot'] += 1
        else:
            album[key] = {
                "mbid":t['album']['mbid'],
                "artiste" : t['artist']['#text'],
                "tracks": {
                    t['name'] : { 
                        "nb_ecoute" : 1,
                        "duration" : 0
                        }    
                },
                "image" : t['image'][3]['#text'],
                "nb_ecoute_tot" : 1,
                "nb_ecoute_unique" : 1,
                #"date" : t['date']['uts'],
                "nb_tracks" : 10
            }

    print("Nous avons récupéré " + str(len(album)) + " de vos albums !")
    print("Traitement en cours...")


    #liste regroupant les albums posant problème, on les supprime à la fin du traitement
    keys_to_delete = []

    #On parcours les albums écoutés pour récupérer les données avec LastFM
    for key in album:
        #Si l'album a un mbid on récupère les données de ses tracks grâce au mbid
        if album[key]['mbid'] != '':
            url_album = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=9be74406d0a68902ed0d0d6ff90e7e33&mbid="+str(album[key]['mbid'])+"&format=json&autocorrect=1"
        #Sinon on récupère les données grâce aux noms d'album et d'artiste
        else:
            artist = album[key]["artiste"]
            url_album = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=9be74406d0a68902ed0d0d6ff90e7e33&artist="+artist+"&album="+key+"&format=json&autocorrect=1"
        resp = requests.get(url_album)
        try:
            temp = resp.json()
        except ValueError:
            keys_to_delete.append(key)
            continue
        
        #Si une requête d'album pose problème en renvoyant "error" (souvent avec le mbid), on retente avec le nom de l'artiste et de l'album
        if next(iter(temp.keys())) == "error":
            artist = album[key]["artiste"]
            url_album = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=9be74406d0a68902ed0d0d6ff90e7e33&artist="+artist+"&album="+key+"&format=json&autocorrect=1"
            resp = requests.get(url_album)
            temp = resp.json()
        #Si l'erreur persiste, on ajoute l'album à la liste des albums à effacer
        if next(iter(temp.keys())) == "error":
            keys_to_delete.append(key)
        else:
            album[key]["nb_tracks"] = len(next(iter(temp.values()))['tracks']['track'])
            
            #Si le nombre de track n'est pas spécifié c'est qu'il s'agit d'un single
            if album[key]["nb_tracks"] == 0:
                album[key]["nb_tracks"] = 1

            duree_album = 0
            duree_ecoute = 0
            #On parcours toutes les tracks t de l'album sur LastFM
            for t in next(iter(temp.values()))['tracks']['track']:
                
                #Si la track n'a pas de durée définie, on lui donne la durée moyenne des tracks en 2019
                if int(t['duration']) != 0 :
                    d_temp = int(t['duration'])
                else:
                    d_temp = 230
                
                #On parcourt les tracks ta écoutés par l'utilisateur
                for ta in album[key]['tracks']:
                    #si la track a été écoutée, on mets à jour la durée de la track et de l'écoute de l'album
                    if t['name'] == ta:
                        duree_ecoute += d_temp * album[key]['tracks'][ta]['nb_ecoute']
                        album[key]['tracks'][ta]['duration'] = d_temp

                duree_album += d_temp
            #print(album[key]["nb_tracks"]," | ",url_album)
            album[key]['album_duration'] = duree_album
            album[key]['ecoute_duration'] = duree_ecoute
            time.sleep(0.1)
            
    #Suppression des albums problématiques
    while keys_to_delete != []:
        del album[keys_to_delete.pop()]


    #ajout des emissions de co2
    for key in album:
        if album[key]['ecoute_duration'] == 0 or album[key]['album_duration'] == 0:
            keys_to_delete.append(key)
        else:
            album[key]['co2_spotify'] = (album[key]['ecoute_duration'] * 0.14) / 60
            album[key]['co2_demat'] = (album[key]['album_duration'] * 0.14) / 60
            album[key]['co2_cd'] = 167
            
    #on supprime tous ceux pour qui on n'a pas d'infos
    while keys_to_delete != []:
        del album[keys_to_delete.pop()]

    #on change le dico en liste
    dictlist = []
    for key, value in album.items():
        temp = [key,value]
        dictlist.append(temp)


    album_json = json.dumps(dictlist)
    f = open(outputfile+".json", "w+")
    f.write(album_json)
    f.close()
    print("Dataset créé !")


if __name__ == "__main__":
   main(sys.argv[1:])