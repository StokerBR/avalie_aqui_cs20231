/**
 * Faz slug de uma string
 * @param string text
 * @param boolean noDash
 */
export function slugify(text: string, noDash = false) {
  text = text.toLowerCase();

  const from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;';
  const to = 'aaaaaeeeeeiiiiooooouuuunc------';

  for (let i = 0; i < from.length; i++) {
    text = text.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  text = text
    .trim()
    .replace(/\s+/g, '-') // Trocar espaços por -
    .replace(/&/g, '-e-') // Trocar & por 'e'
    .replace(/[^\w\-]+/g, '') // Remover todos os caracteres não alfanuméricos
    .replace(/\-\-+/g, '-'); // Trocar vários - por um único -

  if (noDash) {
    text = text.replace(/\-+/g, '');
  }

  return text;
}
