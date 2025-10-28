export function capitalizeFirstLetter(frase) {
  const excecoes = ["de","da","do","das","dos","a","o","e","em","no","na","nos","nas","um","uma","uns","umas"]

  return frase
    .toLowerCase()
    .split(" ")
    .map((palavra, i) => {
      if (i === 0 || !excecoes.includes(palavra)) {
        return palavra.charAt(0).toUpperCase() + palavra.slice(1)
      }
      return palavra
    })
    .join(" ")
}

export function breakLineParenthesis (str,breakLine) {
  if(!breakLine) breakLine = '<br>'
  return str.replace(/\s*\(/g, `${breakLine}(`)
}

export function stringToUrl(str) {
  return encodeURIComponent(str)
}

export function breaklineFromHTML(str) {
  return str.replace('\n', '<br>')
}

export function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}