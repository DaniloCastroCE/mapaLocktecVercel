import { removeAccents } from "../utils/stringUtils.js";
import { clickMarker } from "../components/mapa/mapEvents.js"; 
import { viewMarkerMultiple, setEsconderMarkers, focusMarker } from "../components/mapa/action.js";
import {getListCondominios, setListCondominios, actionSidebar, addCodeHTMLSidebarMarkerMultiple} from "../components/sidebar.js"
import {getStatus, setStatus} from "../main.js"

export function handleSearch(manualValue = null,inputType,inputText,markers) {
    const tipo = inputType.value;
    const valor = manualValue || removeAccents(inputText.value);

    if (!valor) return;

    let resultados = [];

    if (tipo === "nome") {
        // Retorna todos os objetos cujo nome inclui o valor pesquisado
        resultados = markers.filter((i) =>
            removeAccents(i.local.nome) === removeAccents(valor),
        );
    } else {
        if (tipo === "rua") {
            resultados = markers.filter((i) =>
                removeAccents(i.local.end?.rua || "").includes(
                    removeAccents(valor),
                ),
            );
        }
        else if (tipo === "num") {
            resultados = markers.filter((i) =>
                removeAccents(i.local.end?.num) === removeAccents(valor),
            );
        }
        else if (tipo === "bairro") {
            resultados = markers.filter((i) =>
                removeAccents(i.local.end?.bairro || "").includes(
                    removeAccents(valor),
                ),
            );
        }
        else if (tipo === "cidade") {
            resultados = markers.filter((i) =>
                removeAccents(i.local.end?.cidade || "").includes(
                    removeAccents(valor),
                ),
            );
        }else {
            resultados = [];
        }
    }

    console.log("Itens filtrados:", resultados);

    if (resultados.length === 0) {
        alert(`Nenhum resultado encontrado na busca de: ${inputText.value.toUpperCase()}`);
        return;
    }

    if(tipo === 'nome') {
        resultados[0].marker.openPopup()
        clickMarker(resultados[0])
        focusMarker(null,resultados[0].marker)
        viewMarkerMultiple(resultados[0].marker,'one')
    }else {
        setListCondominios(resultados)
        setTimeout(() => {
            setStatus('multiple')
            actionSidebar('show')
            addCodeHTMLSidebarMarkerMultiple()
            viewMarkerMultiple(getListCondominios(),'cleanAll_ShowSelection')
        },100)
    }
    inputText.value = ""
    return true
}
