#!/bin/bash
git pull origin gh-pages
cd ../data
node ../server/fetcher-archiver.js
topojson -o districts_topo.json --id-property 'vcode, vcode' --external-properties=data.csv --properties='district=vdc_name' --properties='dead=dead' --properties='injured=injured' --properties='GovComplete=GovComplete' --properties='GovPartial=GovPartial' --properties='OthComplete=OthComplete' --properties='OthPartial=OthPartial' --properties='population=population' --properties='deadpercent=deadpercent' --properties='injuredpercent=injuredpercent' -- vdcs.geojson;
cd ..
git add -A
git commit -a -m "Updating data"
git push origin gh-pages
