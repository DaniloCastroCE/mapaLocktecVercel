import { toast } from "../utils/toast.js";
import { breaklineFromHTML } from "../utils/stringUtils.js";

export function copySimple(local) {
  const text = `*${local.nome.toUpperCase().trim()}*
Endereço: ${local.end.rua}, ${local.end.num}, ${local.end.bairro} 
`;

  navigator.clipboard.writeText(text).then(() => {
    //console.log(`${text}\n\nTexto copiado com sucesso!`);
    toast(`
        <strong>&#10004; Texto copiado com sucesso &#10004;</strong>
        <p>${breaklineFromHTML(text)}</p>
      `);
  });
}

export function copyMultiple(listCondominios) {
  let text = "";
  let textCondominios = ""
  listCondominios.forEach((obj, index) => {
    text += `*${obj.local.nome.toUpperCase().trim()}*
Endereço: ${obj.local.end.rua}, ${obj.local.end.num}, ${obj.local.end.bairro}

`;
    textCondominios += `<p>${index + 1} - ${obj.local.nome.toUpperCase().trim()}\n</p>`
  });
  navigator.clipboard.writeText(text).then(() => {
    //console.log(`${text}\n\nTexto copiado com sucesso!`);
    toast(`
      <strong>&#10004; Texto copiado com sucesso &#10004;</strong>
      <p style="text-align: center;">${(listCondominios.length).toString().padStart(2, '0')} Condomínios copiados<br><br></p>
      <p>${breaklineFromHTML(textCondominios)}
    `);
  });
}
