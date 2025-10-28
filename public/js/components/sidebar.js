import { breakLineParenthesis, stringToUrl } from "../utils/stringUtils.js";
import { copySimple, copyMultiple } from "../controller/copy.js";
import { getStatus, setStatus } from "../main.js";
import { focusMarker } from "./mapa/action.js";
import { controllerViewMarker, viewMarkerMultiple } from "./mapa/action.js";

const mapa_sidebar = document.querySelector(".mapa-sidebar");
const mapa_sidebar_close = document.querySelector(".mapa-sidebar-close");
let view = true;

export function getView() {
  return view;
}

if (!mapa_sidebar_close.hasListener) {
  mapa_sidebar_close.addEventListener("click", () => {
    actionSidebar("hide");
    controllerViewMarker();
    view = true;
    setStatus("single");
  });
  mapa_sidebar_close.hasListener = true;
}

export function actionSidebar(option) {
  if (option === "show") {
    mapa_sidebar.style.visibility = "visible";
    mapa_sidebar.classList.add("show");
  } else if (option === "hide") {
    mapa_sidebar.classList.remove("show");
  }
}

export function sidebar_clickMarker({ local, marker }) {
  if (getStatus() === "single") {
    addCodeHTMLSidebarMarker(local, marker);
    if (marker.isPopupOpen()) {
      actionSidebar("show");
    } else {
      actionSidebar("hide");
      controllerViewMarker();
      view = true;
    }
  } else if (getStatus() === "multiple") {
    actionSidebar("show");
    addCodeHTMLSidebarMarkerMultiple(local, marker);
  }
}

export function addCodeHTMLSidebarMarker(local, marker) {
  const content = mapa_sidebar.querySelector(".mapa-sidebar-content");
  content.innerHTML = `
    <div class="conteudo">
      <h1>${breakLineParenthesis(local.nome)}</h1>

      <div class="container-sidebar-svg">
        <div class="sidebar-svg box-sombra" id="svgCopySimple">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
        </div>

        <div class="sidebar-svg box-sombra" id="svgView">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-40H120q-33 0-56.5-23.5T40-120v-120h80v120h120v80Zm480 0v-80h120v-120h80v120q0 33-23.5 56.5T840-40H720ZM480-220q-120 0-217.5-71T120-480q45-118 142.5-189T480-740q120 0 217.5 71T840-480q-45 118-142.5 189T480-220Zm0-80q88 0 161-48t112-132q-39-84-112-132t-161-48q-88 0-161 48T207-480q39 84 112 132t161 48Zm0-40q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41Zm0-80q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420ZM40-720v-120q0-33 23.5-56.5T120-920h120v80H120v120H40Zm800 0v-120H720v-80h120q33 0 56.5 23.5T920-840v120h-80ZM480-480Z"/></svg>
        </div>

        <div class="sidebar-svg box-sombra" id="svgZoomIn">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M120-120v-240h80v104l124-124 56 56-124 124h104v80H120Zm480 0v-80h104L580-324l56-56 124 124v-104h80v240H600ZM324-580 200-704v104h-80v-240h240v80H256l124 124-56 56Zm312 0-56-56 124-124H600v-80h240v240h-80v-104L636-580Z"/></svg>
        </div>
        
        <!-- Pode acicionar mais svg (div>svg) para ter mais botões-->
      </div>
      
      <div class="sidebar-endereco">
        <p><strong>Logradouro:</strong> ${local.end.rua}<p/>
        <p><strong>Número:</strong> ${local.end.num}</p>
        <p><strong>Bairro:</strong> ${local.end.bairro}</p>
        <p><strong>Cidade:</strong> ${local.end.cidade} - ${local.end.sigla}</p>
      </div>
      
      <a href="https://www.google.com/maps/place/${stringToUrl(local.lat + "," + local.lon)}" target="_blank">Latitude: ${local.lat}<br>Longitude: ${local.lon}</a>

      <a href="http://www.google.com.br/search?q=${stringToUrl(
        local.nome +
          ", " +
          local.end.rua +
          ", " +
          local.end.num +
          ", " +
          local.end.bairro +
          ", " +
          local.end.cidade,
      )}" target="_blank">Pesquisar no Google</a>

      <a href="https://www.google.com.br/maps/@${
        local.lat + "," + local.lon
      },3a,75y,0h,90t/data=!3m6!1e1!3m4!1sXYZ12345PanoID!2e0!7i13312!8i6656" target="_blank">O que há aqui?</a>
      
    </div>
  `;
  document
    .querySelector("#svgCopySimple")
    .addEventListener("click", () => copySimple(local));
  document.querySelector("#svgZoomIn").addEventListener("click", () => {
    marker.openPopup();
    focusMarker(null, marker, 19);
  });
  document.querySelector("#svgView").addEventListener("click", () => {
    if (view) {
      controllerViewMarker(marker, "hide");
      //marker.openPopup()
      focusMarker(null, marker);
      view = false;
    } else {
      controllerViewMarker();
      view = true;
    }
  });
  const close = mapa_sidebar.querySelector(".mapa-sidebar-close");
  close.style.display = "block";
  content.style.marginTop = "45px";
}

let listCondominios = [];

export function getListCondominios() {
  return listCondominios;
}
export function setListCondominios(list) {
  listCondominios = list;
}

function addLocalFromList(listCondominios) {
  const content = mapa_sidebar.querySelector(".mapa-sidebar-content");
  content.querySelector(".box-mutiple").innerHTML = "";
  let count = listCondominios.length;
  listCondominios
    .slice()
    .reverse()
    .forEach((obj) => {
      content.querySelector(".box-mutiple").innerHTML += `
      <div class="sidebar-endereco">
        <span class="order">${count.toString().padStart(2, "0")}</span>
        <span class="deleteElEndCond">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </span>
        <h3>${obj.local.nome}</h3>
        <p>${obj.local.end.rua}, ${obj.local.end.num}<p/>
        <p>${obj.local.end.bairro} (${obj.local.end.cidade})</p>
        <span class="procurarLocal">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
        </span>
      </div>
    `;
      count--;
    });

  const locais = content.querySelectorAll(".sidebar-endereco");
  locais.forEach((elLocal, index) => {
    const realIndex = listCondominios.length - 1 - index;
    if (!elLocal.hasListener) {
      elLocal.addEventListener("click", () => {
        const local = listCondominios[realIndex].local;
        copySimple(local);
      });
    }
    if (!elLocal.querySelector(".deleteElEndCond").hasListener) {
      elLocal
        .querySelector(".deleteElEndCond")
        .addEventListener("click", (event) => {
          event.stopPropagation();
          const nome = listCondominios[realIndex].local.nome;
          if (confirm(`Deseja remover o condomínio ${nome} da lista?`)) {
            listCondominios.splice(realIndex, 1);
            addLocalFromList(listCondominios)
            viewMarkerMultiple(listCondominios, "check");
          }
        });
    }
    if (!elLocal.querySelector(".procurarLocal").hasListener) {
      elLocal
        .querySelector(".procurarLocal")
        .addEventListener("click", (event) => {
          event.stopPropagation();
          const marker = listCondominios[realIndex].marker;
          focusMarker(null, marker);
          marker.openPopup();
        });
    }
  });
}

export function addCodeHTMLSidebarMarkerMultiple(local, marker) {
  const content = mapa_sidebar.querySelector(".mapa-sidebar-content");
  if (local) {
    console.log({ local, marker });
    const exists = listCondominios.some(
      (item) => item.marker._leaflet_id === marker._leaflet_id,
    );
    if (!exists) {
      listCondominios.push({ local, marker });
      addLocalFromList(listCondominios);
    } else {
      alert("Condomínio já adicionado");
    }
  } else {
    content.innerHTML = `
      <div class="conteudo">
        <div class="sidebar-menu-fixo">
          <div class="close-fixo">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
          </div>
          <h1>Lista de Condomínios</h1>
  
          <div class="container-sidebar-svg" >
             <div class="sidebar-svg box-sombra" id="svgCopyMultiple">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M120-220v-80h80v80h-80Zm0-140v-80h80v80h-80Zm0-140v-80h80v80h-80ZM260-80v-80h80v80h-80Zm100-160q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480Zm40 240v-80h80v80h-80Zm-200 0q-33 0-56.5-23.5T120-160h80v80Zm340 0v-80h80q0 33-23.5 56.5T540-80ZM120-640q0-33 23.5-56.5T200-720v80h-80Zm420 80Z"/></svg>
              </div>
      
              <div class="sidebar-svg box-sombra" id="svgViewAll">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-40H120q-33 0-56.5-23.5T40-120v-120h80v120h120v80Zm480 0v-80h120v-120h80v120q0 33-23.5 56.5T840-40H720ZM480-220q-120 0-217.5-71T120-480q45-118 142.5-189T480-740q120 0 217.5 71T840-480q-45 118-142.5 189T480-220Zm0-80q88 0 161-48t112-132q-39-84-112-132t-161-48q-88 0-161 48T207-480q39 84 112 132t161 48Zm0-40q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41Zm0-80q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420ZM40-720v-120q0-33 23.5-56.5T120-920h120v80H120v120H40Zm800 0v-120H720v-80h120q33 0 56.5 23.5T920-840v120h-80ZM480-480Z"/></svg>
              </div>

              <div class="sidebar-svg box-sombra" id="svgClearAll">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-520h80v-280q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800v280ZM200-360h560v-80H200v80Zm-58 240h98v-80q0-17 11.5-28.5T280-240q17 0 28.5 11.5T320-200v80h120v-80q0-17 11.5-28.5T480-240q17 0 28.5 11.5T520-200v80h120v-80q0-17 11.5-28.5T680-240q17 0 28.5 11.5T720-200v80h98l-40-160H182l-40 160Zm676 80H142q-39 0-63-31t-14-69l55-220v-80q0-33 23.5-56.5T200-520h160v-280q0-50 35-85t85-35q50 0 85 35t35 85v280h160q33 0 56.5 23.5T840-440v80l55 220q13 38-11.5 69T818-40Zm-58-400H200h560Zm-240-80h-80 80Z"/></svg>
              </div>
            <!-- Pode acicionar mais svg (div>svg) para ter mais botões-->
          </div>
        </div>

        <div class="box-mutiple"></div>
        
      </div>
    `;
    const close = document.querySelector(".mapa-sidebar-close");
    close.style.display = "none";
    content.style.marginTop = "0";

    const svgCopyMultiple = document.querySelector("#svgCopyMultiple");
    if (!svgCopyMultiple.hasListener) {
      svgCopyMultiple.addEventListener("click", () =>
        copyMultiple(listCondominios),
      );
    }

    const svgViewAll = document.querySelector("#svgViewAll");
    svgViewAll.addEventListener("click", () => {
      viewMarkerMultiple(listCondominios, "toggle");
    });

    const svgClearAll = document.querySelector("#svgClearAll");
    svgClearAll.addEventListener("click", () => {
      if (!confirm("Deseja limpar a lista de condomínios?")) return
      listCondominios = [];
      viewMarkerMultiple(null);
      addLocalFromList(listCondominios);
    });

    const close_fixo = document.querySelector(".close-fixo");
    if (!close_fixo.hasListener) {
      close_fixo.addEventListener("click", () => {
        actionSidebar("hide");
        //viewMarkerMultiple(null)
        view = true;
        setStatus("single");
      });
      close_fixo.hasListener = true;
    }
    addLocalFromList(listCondominios);
  }
}
