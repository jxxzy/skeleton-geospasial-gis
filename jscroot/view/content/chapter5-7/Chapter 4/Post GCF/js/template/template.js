export let URLGeoJson = "https://us-central1-vivid-vent-401501.cloudfunctions.net/function-2";
export let urlPostGCF = "https://asia-southeast2-vivid-vent-401501.cloudfunctions.net/test-post";
export let tableTag="tr";
export let tableRowClass="content is-small";
export let tableTemplate=`
<td>#NAME#</td>
<td >#KORDINAT#</td>
<td>#TYPE#</td>
`
export const clickpopup = `
Long : #LONG#<br>
Lat  : #LAT#<br>
X   : #X#<br>
Y   : #Y#<br>
HDMS : #HDMS#<br>
`