import {sidebar_clickMarker} from '../sidebar.js'
import {focusMarker} from './action.js'
import {getMap} from './uiMap.js'
import {getView} from '../sidebar.js'
import {controllerViewMarker} from './action.js'


export function zoomend(map) {
  //console.log(map.getZoom())
}

export function clickMarker({local,marker}) {
  //console.log(local)
  sidebar_clickMarker({local,marker})
  if(marker.isPopupOpen()){
    if(!getView()) controllerViewMarker(marker,'hide')
    //focusMarker(getMap(), marker)
  }
}

export function mouseoverMarker({local,marker}) {
  marker.setZIndexOffset(1000)
  const tip = marker.getTooltip()?.getElement()
  if(tip) {
    tip.style.zIndex = 9999;
    tip.classList.add('tooltip-focused')
  }
}

export function mouseoutMarker({local,marker}) {
  marker.setZIndexOffset(0);
  const tip = marker.getTooltip()?.getElement();
  if (tip) {
    tip.style.zIndex = '';
    tip.classList.remove('tooltip-focused');
  }
}

let last_over;
export function mouseOverWithtOutMarker({local,marker}) {
  const zindexMax = 701;
  if(last_over) {
    last_over.setZIndexOffset(0);
    const tip = last_over.getTooltip()?.getElement();
    if (tip) {
      tip.style.zIndex = '';
      tip.classList.remove('tooltip-focused');
    }
  }
  marker.setZIndexOffset(zindexMax)
  const tip = marker.getTooltip()?.getElement()
  if(tip) {
    tip.style.zIndex = zindexMax;
    tip.classList.add('tooltip-focused')
  }
  last_over = marker;
}
