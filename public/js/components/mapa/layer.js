import * as L from "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js"
import { removeAccents } from "../../utils/stringUtils.js";
import { handleSearch } from "../../controller/handleSearch.js";
import {getStatus, setStatus} from "../../main.js"
import {actionSidebar} from "../sidebar.js"
import {addCodeHTMLSidebarMarkerMultiple} from "../sidebar.js"
import { viewMarkerMultiple } from "./action.js";

export function createLayerBase(L, minZoom, maxZoom) {
    return [
        {
            name: "Padrão",
            layer: L.tileLayer(
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    minZoom: minZoom,
                    maxZoom: maxZoom,
                    attribution:
                        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                },
            ),
        },
        {
            name: "OSM-HOT",
            layer: L.tileLayer(
                "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
                {
                    attribution:
                        "© OpenStreetMap contributors, Tiles style by HOT",
                    minZoom: minZoom,
                    maxZoom: maxZoom,
                },
            ),
        },
        {
            name: "Google Satelite",
            layer: L.tileLayer(
                "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
                {
                    attribution: "Map data © Google",
                    minZoom: minZoom,
                    maxZoom: maxZoom,
                },
            ),
        },
        {
            name: "Simples Claro",
            layer: L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
                {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
                    subdomains: "abcd",
                    minZoom: minZoom,
                    maxZoom: maxZoom,
                },
            ),
        },
        {
            name: "Simples Escuro",
            layer: L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
                {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
                    subdomains: "abcd",
                    minZoom: minZoom,
                    maxZoom: maxZoom,
                },
            ),
        },
        {
            name: "Ciclovias",
            layer: L.tileLayer(
                "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
                {
                    attribution: "© CyclOSM | © OpenStreetMap contributors",
                    minZoom: minZoom,
                    maxZoom: maxZoom,
                },
            ),
        },
        {
            name: "Topográfico",
            layer: L.tileLayer(
                "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
                {
                    minZoom: minZoom,
                    maxZoom: maxZoom,
                    attribution:
                        "Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)",
                },
            ),
        },
    ];
}

export function addLayerControl(layers) {
    const baseLayers = {};
    layers.forEach((layer) => {
        baseLayers[layer.name] = layer.layer;
    });
    return baseLayers;
}

/**
 * Função para adicionar controle de pesquisa ao mapa
 * @param map - instância do Leaflet
 * @param itens - array de objetos a serem pesquisados
 */
export function addSearchControl(map, markers) {
    const SearchControl = L.Control.extend({
        onAdd: function () {
            // Cria container do controle
            const container = L.DomUtil.create("div", "search-control");

            // HTML do controle: select para tipo, input para pesquisa e botão
            container.innerHTML = `
                <select id="search-type" name="tipo">
                    <option value="nome">Nome</option>
                    <option value="rua">Logradouro</option>
                    <option value="num">Número</option>
                    <option value="bairro">Bairro</option>
                    <option value="cidade">Cidade</option>
                </select>
                <div class="input-wrapper">
                    <input type="text" id="search-input" placeholder="Pesquisar...">
                    <div id="suggestions" class="suggestions"></div>
                </div>
                <button id="search-button">Pesquisar</button>
            `;

            // Referências dos elementos
            const searchType = container.querySelector("#search-type");
            const searchInput = container.querySelector("#search-input");
            const searchButton = container.querySelector("#search-button");
            const suggestionsContainer = container.querySelector("#suggestions");

            let selectedIndex = -1; // índice da seleção via teclado

            /**
             * Atualiza sugestões do autocomplete
             */
            function atualizarSugestoes() {
                const query = removeAccents(searchInput.value); // remove acentos
                suggestionsContainer.innerHTML = "";
                selectedIndex = -1; // reset da seleção

                if ((query || searchType.value === "num") && query.length > 0) {
                    console.log("pesquisando...");
                } else if (!query || query.length < 3) {
                    suggestionsContainer.style.display = "none";
                    return;
                }

                // Filtra itens de acordo com tipo e query
                let resultados = markers.filter((i) => {
                    switch (searchType.value) {
                        case "nome":
                            return removeAccents(i.local.nome).includes(query);
                        case "rua":
                            return removeAccents(i.local.end?.rua || "").includes(query);
                        case "num":
                            return removeAccents(i.local.end?.num || "").includes(query);
                        case "bairro":
                            return removeAccents(i.local.end?.bairro || "").includes(query);
                        case "cidade":
                            return removeAccents(i.local.end?.cidade || "").includes(query);
                        default:
                            return false;
                    }
                });

                // Remove duplicados pelo valor pesquisado
                const seen = new Set();
                resultados = resultados.filter((item) => {
                    let value;
                    switch (searchType.value) {
                        case "nome":
                            value = item.local.nome;
                            break;
                        case "rua":
                            value = item.local.end?.rua || "";
                            break;
                        case "num":
                            value = item.local.end?.num || "";
                            break;
                        case "bairro":
                            value = item.local.end?.bairro || "";
                            break;
                        case "cidade":
                            value = item.local.end?.cidade || "";
                            break;
                    }
                    if (seen.has(value)) return false;
                    seen.add(value);
                    return true;
                });

                if (resultados.length === 0) {
                    suggestionsContainer.style.display = "none";
                    return;
                }

                // 🔹 Ordena resultados em ordem alfabética
                resultados.sort((a, b) => {
                    const getValue = (obj) => {
                        switch (searchType.value) {
                            case "nome": return obj.local.nome || "";
                            case "rua": return obj.local.end?.rua || "";
                            case "num": return obj.local.end?.num || "";
                            case "bairro": return obj.local.end?.bairro || "";
                            case "cidade": return obj.local.end?.cidade || "";
                            default: return "";
                        }
                    };

                    const valA = removeAccents(getValue(a)).toLowerCase();
                    const valB = removeAccents(getValue(b)).toLowerCase();
                    return valA.localeCompare(valB);
                });

                // Cria divs de sugestões com contagem (exceto "nome")
                resultados.forEach((item) => {
                    const div = document.createElement("div");

                    let valorTexto = "";
                    switch (searchType.value) {
                        case "nome":
                            valorTexto = item.local.nome;
                            break;
                        case "rua":
                            valorTexto = item.local.end?.rua || "";
                            break;
                        case "num":
                            valorTexto = item.local.end?.num || "";
                            break;
                        case "bairro":
                            valorTexto = item.local.end?.bairro || "";
                            break;
                        case "cidade":
                            valorTexto = item.local.end?.cidade || "";
                            break;
                    }

                    // Se não for nome, conta quantos markers têm o mesmo valor
                    if (searchType.value !== "nome") {
                        const count = markers.filter((m) => {
                            switch (searchType.value) {
                                case "rua":
                                    return removeAccents(m.local.end?.rua || "") === removeAccents(valorTexto);
                                case "num":
                                    return removeAccents(m.local.end?.num || "") === removeAccents(valorTexto);
                                case "bairro":
                                    return removeAccents(m.local.end?.bairro || "") === removeAccents(valorTexto);
                                case "cidade":
                                    return removeAccents(m.local.end?.cidade || "") === removeAccents(valorTexto);
                                default:
                                    return false;
                            }
                        }).length;

                        div.textContent = `${valorTexto} (${count})`;
                    } else {
                        div.textContent = valorTexto;
                    }

                    div.dataset.tipo = searchType.value;

                    // Clique na sugestão
                    div.addEventListener("click", () => {
                        searchInput.value = valorTexto;
                        suggestionsContainer.style.display = "none";
                        handleSearch(removeAccents(valorTexto), searchType, searchInput, markers);
                    });

                    suggestionsContainer.appendChild(div);
                });

                suggestionsContainer.style.display = "block";
            }

            /**
             * Atualiza destaque da seleção via teclado
             */
            function updateHighlight(items) {
                items.forEach((item, index) => {
                    if (index === selectedIndex) {
                        item.style.backgroundColor = "#e0e0e0";

                        // Garante que item está visível
                        const containerTop = suggestionsContainer.scrollTop;
                        const containerBottom = containerTop + suggestionsContainer.offsetHeight;
                        const itemTop = item.offsetTop;
                        const itemBottom = itemTop + item.offsetHeight;

                        if (itemBottom > containerBottom) {
                            suggestionsContainer.scrollTop = itemBottom - suggestionsContainer.offsetHeight;
                        } else if (itemTop < containerTop) {
                            suggestionsContainer.scrollTop = itemTop;
                        }
                    } else {
                        item.style.backgroundColor = "";
                    }
                });
            }

            // Input → atualiza sugestões
            searchInput.addEventListener("input", atualizarSugestoes);

            // Navegação teclado
            searchInput.addEventListener("keydown", (e) => {
                const items = suggestionsContainer.querySelectorAll("div");
                if (!items.length) return;

                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    selectedIndex = (selectedIndex + 1) % items.length;
                    updateHighlight(items);
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                    updateHighlight(items);
                } else if (e.key === "Enter") {
                    e.preventDefault();

                    if (selectedIndex >= 0 && selectedIndex < items.length) {
                        const item = items[selectedIndex];

                        // Extrai o texto principal (remove o "(n)" do final)
                        let valorSelecionado = item.textContent.replace(/\s\(\d+\)$/, "").trim();

                        // Atualiza o input com o texto selecionado
                        searchInput.value = valorSelecionado;

                        // Executa a busca com o item realmente selecionado
                        if (handleSearch(removeAccents(valorSelecionado), searchType, searchInput, markers)) {
                            suggestionsContainer.style.display = "none";
                        }
                    } else {
                        // Caso o usuário pressione Enter sem selecionar nada (busca manual)
                        const valorDigitado = removeAccents(searchInput.value.trim());
                        if (handleSearch(valorDigitado, searchType, searchInput, markers)) {
                            suggestionsContainer.style.display = "none";
                        }
                    }
                }

            });

            // Botão pesquisar
            searchButton.addEventListener("click", () => {
                if (handleSearch(null, searchType, searchInput, markers)) {
                    suggestionsContainer.style.display = "none";
                }
            });

            // Fecha sugestões ao clicar fora
            document.addEventListener("click", (e) => {
                if (!container.contains(e.target)) {
                    suggestionsContainer.style.display = "none";
                    selectedIndex = -1;
                }
            });

            L.DomEvent.disableClickPropagation(container);
            return container;
        },
    });

    // Adiciona controle no mapa
    const searchControl = new SearchControl({ position: "topleft" });
    map.addControl(searchControl);

    // Reorganiza para ficar acima do zoom
    const container = document.querySelector(".leaflet-top.leaflet-left");
    const searchEl = container.querySelector(".search-control");
    const zoomEl = container.querySelector(".leaflet-control-zoom");

    if (container && searchEl && zoomEl) {
        container.insertBefore(searchEl, zoomEl);
    }
}


// Cria e adiciona um controle personalizado que exibe o nível de zoom atual do mapa
export function addBoxZoom(map) {
    // ====== 1. Define o novo controle personalizado ======
    const BoxZoom = L.Control.extend({
        onAdd: function () {
            // Cria o contêiner principal do controle
            const container = L.DomUtil.create("div", "box-zoom");

            // HTML interno: exibe o número do zoom
            container.innerHTML = `
                <div class="zoomNumber">
                    <span id="zoomNumber">14</span>
                </div>
            `;

            // Impede o mapa de reagir a eventos do mouse sobre o controle
            L.DomEvent.disableClickPropagation(container);

            return container;
        },
    });

    // ====== 2. Cria uma instância do controle e adiciona ao mapa ======
    const boxZoom = new BoxZoom({ position: "topleft" });
    map.addControl(boxZoom);

    // ====== 3. Atualiza o número do zoom sempre que o mapa for alterado ======
    map.on("zoomend", () => {
        const zoomNumber = document.querySelector("#zoomNumber");
        if (zoomNumber) zoomNumber.textContent = map.getZoom();
    });

    // ====== 4. Reposiciona o controle (coloca antes do botão de zoom padrão) ======
    const container = document.querySelector(".leaflet-top.leaflet-left");
    const zoomEl = container?.querySelector(".leaflet-control-zoom");
    const boxZoomEl = container?.querySelector(".box-zoom");

    // Insere o número de zoom antes dos botões padrão de zoom (+/-)
    if (container && zoomEl && boxZoomEl) {
        container.insertBefore(boxZoomEl, zoomEl);
    }
}

export function addListSidebar(map) {
    const BoxList = L.Control.extend({
        onAdd: function () {
            // Cria o contêiner principal do controle
            const container = L.DomUtil.create("div", "box-btn-layer-sidebar box_lista");

            // HTML interno: exibe o número do zoom
            container.innerHTML = `
                <div class="div-btn-list-sidebar" id="btn-layer-list">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-280q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 320h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
                </div>
            `;

            // Impede o mapa de reagir a eventos do mouse sobre o controle
            L.DomEvent.disableClickPropagation(container);

            container.querySelector("#btn-layer-list").addEventListener("click", () => {
                if(getStatus() === 'single') {
                    setStatus('multiple')
                    actionSidebar('show')
                    addCodeHTMLSidebarMarkerMultiple()
                }else {
                    viewMarkerMultiple(null)
                    setStatus('single')
                    actionSidebar('hide')
                }                
            })

            return container;
        },
    });

    // ====== 2. Cria uma instância do controle e adiciona ao mapa ======
    const boxList = new BoxList({ position: "topleft" });
    map.addControl(boxList);

    const container = document.querySelector(".leaflet-top.leaflet-left");
    const box_Lista = container.querySelector(".box_lista");
    const box_zoom = container.querySelector(".box-zoom");

    if (container && box_Lista && box_zoom) {
        container.insertBefore(box_Lista, box_zoom);
    }
}
