import {getArrayCondominios} from '../js/utils/arrayCondominios.js'
import {initMap, multAddMarkers} from '../js/components/mapa/uiMap.js'
import {addSearchControl, addBoxZoom, addListSidebar} from '../js/components/mapa/layer.js'
import {focusMarkerSearchNome} from '../js/components/mapa/action.js'
import {getLocal} from '../js/service/local.js'
import loading from '../js/utils/loading.js'
loading.addLoading('.loading-section')
let map = initMap('.mapa',-3.74565, -38.51723, 14)
let markers = []
let status = "single"

export function getStatus() {
  return status
}

export function setStatus(newStatus) {
  status = newStatus
}

export function getMarkers() {
  return markers
}

document.querySelector('#ano-atual').innerHTML = new Date().getFullYear()

document.querySelector('.logo-locktec').addEventListener('click', () => focusMarkerSearchNome('locktec'))

getLocal().then(data => {
  if(data.status === 'success') {
    //locais = data.locais
    multAddMarkers(map, markers, data.locais)
    addSearchControl(map, markers)
    addBoxZoom(map)
    addListSidebar(map)
  }else if(data.status === 'error') {
    console.log(data.message)
    if(confirm('Erro ao carregar os condominio atualizados, deseja tentar novamente?')) window.location.reload()
    multAddMarkers(map, markers, getArrayCondominios().array)
    addSearchControl(map, markers)
    addBoxZoom(map)
    addListSidebar(map)
    alert('As informações do mapa podem estar desatualizadas.\nÚltima atualização em: ' + getArrayCondominios().last_update
)
  }
}).catch(err => {
  alert(`Aconteceu um erro, aperte F5 para tentar novamente !\n\nErro: `,err)
})


