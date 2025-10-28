import * as L from "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js";
import {capitalizeFirstLetter} from "../../utils/stringUtils.js";
import { createLayerBase, addLayerControl, addSearchControl } from "./layer.js";
import { getIconMarker } from "./iconMarker.js";
import { 
  zoomend, 
  clickMarker, 
  mouseoverMarker, 
  mouseoutMarker, 
  mouseOverWithtOutMarker 
} from "./mapEvents.js"

let mapa;

export function initMap(box, lat, lng, zoom) {
  
  const mapOld = document.querySelector("#map");
  if (mapOld) mapOld.remove();
  document.querySelector(box).innerHTML = `<div id="map"></div>`;

  let map = L.map("map").setView([lat, lng], zoom);
  const layers = createLayerBase(L,1,19);
  layers[0].layer.addTo(map);
  addLayerControl(layers);
  L.control
    .layers(addLayerControl(layers), {}, { position: "topleft" })
    .addTo(map);

  map.on('zoomend', () => zoomend(map))
  mapa = map;
  return map;
}

export function addMarker(map, lat, lng, local) {

  const marker = L.marker([lat, lng], {icon: getIconMarker(L,0)})
    .bindPopup(`
      <h3>${local.nome}</h3>
      <p>
        ${local.end.rua}, ${local.end.num}<br>
        ${local.end.bairro}<br>
        ${local.end.cidade} / ${local.end.sigla}
      </p>
    `, {className: 'popup-marker'})
    .bindTooltip(`
      <h3>${capitalizeFirstLetter(local.nome)}</h3>
    `, {
        permanent: true,
        direction: 'top',
        className: 'tooltip-marker'
    }).addTo(map);
  
  const objMarker = {marker: marker, local: local};
  marker.on('click', () => {clickMarker(objMarker)})
  //marker.on('mouseover', () => {mouseoverMarker(objMarker)}) // mouseover com função de over
  //marker.on('mouseout', () => {mouseoutMarker(objMarker)}) // mouseoout com função de out
  marker.on('mouseover', () => {mouseOverWithtOutMarker(objMarker)}) // mouseover com função over e out
  
  return objMarker;
}

export function multAddMarkers(map, markers, locais) {
  locais.forEach(local => {
    markers.push(addMarker(map, local.lat, local.lon, local))
  })
}

export function getMap() {
  return mapa;
}