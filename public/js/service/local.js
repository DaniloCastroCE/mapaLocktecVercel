import loading from '../utils/loading.js'

export async function  getLocal() {
  const numTentativas = 5
  for(let i=1; i <= numTentativas; i++){
    try {
      loading.action('show')
      const response = await fetch('https://3n44fs-3000.csb.app/getCondominios')
      if(!response.ok) throw new Error('Erro ao buscar locais')
      const data = await response.json()
      loading.action('hide')
      return {
        status: "success",
        locais: data.condominios
      }  
        
    }catch(err) {
      console.warn(`Tentativa ${i} falhou`)

      if(i === numTentativas) {
        loading.action('hide')
        return {
          status: "error",
          message: 'Todas as tentativas falharão',
          error: err.message
        }
      }
    await new Promise(resolve => setTimeout(resolve, 3000))
    }    
  }
}