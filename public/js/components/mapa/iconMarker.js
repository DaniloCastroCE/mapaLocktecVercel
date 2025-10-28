export function getIconMarker(L,index) {
    const icon = [
      L.icon({
        className: 'icon-marker',
        iconUrl: '../../../img/icon/marker-locktec.png',
        iconSize: [40, 40], // largura, altura do ícone
        iconAnchor: [5, 25], // ponto de ancoragem do ícone
                            // 1º valor: move horizontal → menor = esquerda / maior = direita
                            // 2º valor: move vertical → menor = cima / maior = baixo

        tooltipAnchor: [15, -18], // posição do tooltip em relação ao ícone
                                // 1º valor negativo = esquerda / positivo = direita
                                // 2º valor negativo = cima / positivo = baixo

        popupAnchor: [15, -15], // posição do popup em relação ao ícone
                              // 1º valor negativo = esquerda / positivo = direita
        // 2º valor negativo = cima / positivo = baixo
      }),
    ]

    if(index >= icon.length) {
      index = 0
      console.log('Índice do ícone maior que o número de ícones disponíveis. Índice redefinido para 0.')
    }
    return icon[index]
}