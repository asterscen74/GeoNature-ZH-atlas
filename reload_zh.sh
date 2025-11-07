#!/bin/bash
MON_URL_GN=https://geonature.nature-haute-savoie.fr/
MON_DOSSIER_ATLASZH=/home/geonature/zh_atlas

wget $MON_URL_GN/api/zones_humides/pbf/complete && mv ./complete $MON_DOSSIER_ATLASZH/public/geonature.pbf
ID_CONTAINER=$(docker container ls --all | grep geonature-zones-humides-atlas | awk '{print $1}')
docker stop $ID_CONTAINER && docker rm -f $ID_CONTAINER
cd $MON_DOSSIER_ATLASZH
docker build -t geonature-zones-humides-atlas .
docker run -d --restart unless-stopped -p 3000:3000 geonature-zones-humides-atlas npm run start_local
