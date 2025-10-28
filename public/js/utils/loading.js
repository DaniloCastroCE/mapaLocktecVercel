export function addLoading(box) {
  const code = /*html*/ `
    <div class="loading">
      <div class="loading-content">
        <img src="./img/loading.gif" alt="loading">
        <p id="texto-loading">Carregando . . .</p>
      </div>
    </div>  
  `
  document.querySelector(box).innerHTML = code
}

export function action(action,text) {
  const loading = document.querySelector('.loading')  
  if(action === 'show') {
    const texto_loading = document.querySelector('#texto-loading')
    texto_loading.innerHTML = !text ? 'Carregando . . .' : text
    loading.style.opacity = '1';
    loading.style.display = 'flex'
    loading.style.animation = 'fadeInLoading 1s forwards'
  }else if(action === 'hide'){
      loading.style.animation = 'fadeOutLoading 1s forwards'
    setTimeout(() => {
      loading.style.opacity = '0';
      loading.style.display = 'none'
    },500)
  }else {
    console.log('Ação inválida')
  }
}

export default {addLoading, action}