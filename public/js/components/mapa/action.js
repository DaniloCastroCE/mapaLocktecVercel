import { getMap } from "./uiMap.js";
import { getStatus, getMarkers } from "../../main.js";
import { removeAccents } from "../../utils/stringUtils.js";
import loading from "../../utils/loading.js";

export function focusMarker(map, marker, zoom) {
  if (!map) map = getMap();

  const latLng = marker.getLatLng();
  const targetZoom = zoom || map.getZoom();
  map.flyTo(latLng, targetZoom, {
    animate: true,
    duration: 0.5, // tempo da animação (em segundos)
  });
}

export function focusMarkerSearchNome(nome) {
  const map = getMap();
  const markers = getMarkers();
  const objSearch = markers.find(
    (obj) => removeAccents(obj.local.nome) === removeAccents(nome),
  );

  if (objSearch) {
    focusMarker(map, objSearch.marker);
    objSearch.marker.openPopup();
  } else {
    console.log("Nome não encontrado");
  }
}

export function controllerViewMarker(marker, option) {
  const status = getStatus();
  if (status === "single") {
    viewMarker(marker, option);
  }
}

export function viewMarker(marker = null, option = "show") {
  const markers = getMarkers(); // Recupera todos os marcadores registrados
  //if (option === "show") loading.action("show");
  markers.forEach((m) => {
    // Garante que o objeto tem um marker válido (evita erros)
    if (!m?.marker) return;

    const isTarget = marker && m.marker === marker;

    if (option === "show") {
      m.marker.setOpacity(1);
      m.marker
        .getTooltip()
        ?.getElement()
        ?.classList.remove("tooltip-display-none");
      const tooltip = m.marker.getTooltip();
      if (tooltip && tooltip._map) tooltip._updatePosition();
    } else if (option === "hide") {
      m.marker.setOpacity(isTarget ? 1 : 0);
      const tooltipEl = m.marker.getTooltip()?.getElement();
      if (tooltipEl) {
        tooltipEl.classList.toggle("tooltip-display-none", !isTarget);
      }
    }
  });
  //if (option === "show") loading.action("hide");
}

let esconderMarkers = false;

export function setEsconderMarkers(esconder) {
  esconderMarkers = esconder;
}

export function viewMarkerMultiple(listMarkers, option = "show") {
  const markers = getMarkers();
  //loading.action('show')

  if (option === "toggle") {
    const markersHide = markers.filter(
      (m) =>
        !listMarkers.some(
          (l) => l?.marker?._leaflet_id === m?.marker?._leaflet_id,
        ),
    );
    markersHide.forEach((m) => {
      const tooltipEl = m.marker.getTooltip()?.getElement();
      if (tooltipEl.classList.contains("tooltip-display-none")) {
        // show
        m.marker.setOpacity(1);
        tooltipEl.classList.remove("tooltip-display-none");
        const tooltip = m.marker.getTooltip();
        if (tooltip && tooltip._map) tooltip._updatePosition();
        esconderMarkers = false;
      } else {
        // hide
        m.marker.setOpacity(0);
        tooltipEl.classList.add("tooltip-display-none");
        const map = getMap();
        map.closePopup();
        esconderMarkers = true;
      }
    });
  } else if (option === "show") {
    markers.forEach((m) => {
      const tooltipEl = m.marker.getTooltip()?.getElement();
      m.marker.setOpacity(1);
      tooltipEl.classList.remove("tooltip-display-none");
      const tooltip = m.marker.getTooltip();
      if (tooltip && tooltip._map) tooltip._updatePosition();
      esconderMarkers = false;
    });
  } else if (option === "check") {
    const markersHide = markers.filter(
      (m) =>
        !listMarkers.some(
          (l) => l?.marker?._leaflet_id === m?.marker?._leaflet_id,
        ),
    );

    if (!esconderMarkers) {
      markersHide.forEach((m) => {
        const tooltipEl = m.marker.getTooltip()?.getElement();
        m.marker.setOpacity(1);
        tooltipEl.classList.remove("tooltip-display-none");
        const tooltip = m.marker.getTooltip();
        if (tooltip && tooltip._map) tooltip._updatePosition();
      });
    } else {
      markersHide.forEach((m) => {
        const tooltipEl = m.marker.getTooltip()?.getElement();
        m.marker.setOpacity(0);
        tooltipEl.classList.add("tooltip-display-none");
      });
    }
  }
  else if(option === 'one'){
    listMarkers.setOpacity(1)
    listMarkers.getTooltip()?.getElement()?.classList.remove("tooltip-display-none");
    const tooltip = listMarkers.getTooltip();
    if (tooltip && tooltip._map) tooltip._updatePosition();
  }
  else if(option === 'cleanAll_ShowSelection') {
    const map = getMap();
    const markerIgual = markers.filter(
        (m) =>
          listMarkers.some(
            (l) => l?.marker?._leaflet_id === m?.marker?._leaflet_id,
          ),
      );
    
    markers.forEach((m) => {
      const tooltipEl = m.marker.getTooltip()?.getElement();
      m.marker.setOpacity(0);
      tooltipEl.classList.add("tooltip-display-none");
      map.closePopup();
    })

    markerIgual.forEach((m) => {
      const tooltipEl = m.marker.getTooltip()?.getElement();
      m.marker.setOpacity(1);
      tooltipEl.classList.remove("tooltip-display-none");
      const tooltip = m.marker.getTooltip();
      if (tooltip && tooltip._map) tooltip._updatePosition();
    })
  }
  //loading.action('hide')
}
