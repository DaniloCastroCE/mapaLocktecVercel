const mes = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro',]
const dia = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

export function getYear () {
  return new Date().getFullYear()
}

export function getMonth (op) {
  if(op === 'number') return (new Date().getMonth() + 1).toString().padStart(2, '0')
  if(op === 'string') return mes[new Date().getMonth()]
}

export function getDay (op) {
  if(op === 'number') return new Date().getDay() + 1
  if(op === 'string') return dia[new Date().getDay()]
}

export function getDate () {
  return new Date().getDate().toString().padStart(2, '0')
}

export function getFullDate (op) {
  if(op === 'string') return `${getDay('string')}, ${getDate()} de ${getMonth('string')} de ${getYear()}`
  if(op === 'number') return `${getDate()} / ${getMonth('number')} / ${getYear()}`
}

export function convertDate (date) {
  return new Date(date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})
}

export default {getYear, getMonth, getDay, getDate, getFullDate, convertDate}