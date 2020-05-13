curl -L "https://opendata.paris.fr/explore/dataset/coronavirus-commercants-parisiens-livraison-a-domicile/download/?format=json&timezone=Europe/Berlin&lang=fr" > coronavirus-commercants-parisiens-livraison-a-domicile.json
node in.js > out.geojson
curl -v -F "geojson=@out.geojson" https://od2osm.cleverapps.io/api/quests -H "Content-Type: multipart/form-data"