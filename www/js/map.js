/**
 * Created by Boss on 3/13/2015.
 */

var map = new L.Map('map');

var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = 'Map data © OpenStreetMap contributors';
var osm = new L.TileLayer(osmUrl, { attribution: osmAttrib });

map.setView(new L.LatLng(43.069452, -89.411373), 11);
map.addLayer(osm);