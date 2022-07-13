// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the second tile layer that will be the background of our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  maxZoom: 18,
  accessToken: API_KEY
});

// Create a layer for our job location data.
let jobLocations = new L.LayerGroup();
let orders = new L.LayerGroup();
let concreteOrders = new L.LayerGroup();

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [40.7, -94.5],
	zoom: 3,
	layers: [dark, jobLocations]
});

// Create a base layer that holds all three maps.
let baseMaps = {
  "Dark": dark,
  "Streets": streets,
  "Satellite": satelliteStreets
};

let overlays = {
  "Job Locations": jobLocations,
  'Recent Orders': orders,
  "Concrete Orders": concreteOrders
};


L.control.layers(baseMaps, overlays).addTo(map);

var sidebar = L.control.sidebar('sidebar').addTo(map)