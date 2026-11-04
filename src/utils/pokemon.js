// Funciones puras para el juego de Pokémon (sin llamadas de red, fáciles de probar)

// Pokémon de las generaciones 1 a 9 (ids 1 a 1025) en PokeAPI
export const TOTAL_POKEMON = 1025

// Extrae el id desde una URL de PokeAPI: ".../pokemon/25/" -> 25
export function idDesdeUrl(url) {
  const partes = url.split('/').filter(Boolean)
  return Number(partes[partes.length - 1])
}

// Convierte el nombre técnico en uno legible: "mr-mime" -> "Mr Mime"
export function nombreLegible(slug) {
  return slug
    .split('-')
    .map(parte => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(' ')
}

// Deja solo los Pokémon base (sin formas alternas como "pikachu-gmax")
export function filtrarPokemonBase(resultados) {
  return resultados
    .map(item => ({ id: idDesdeUrl(item.url), slug: item.name }))
    .filter(p => p.id >= 1 && p.id <= TOTAL_POKEMON)
    .map(p => ({ ...p, nombre: nombreLegible(p.slug) }))
}

// Devuelve la lista en orden aleatorio (Fisher-Yates)
export function mezclar(lista, aleatorio = Math.random) {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

// Crea 4 opciones: la correcta y 3 distintas tomadas al azar de la lista
export function generarOpciones(correcto, lista, aleatorio = Math.random) {
  const otros = []
  while (otros.length < 3) {
    const candidato = lista[Math.floor(aleatorio() * lista.length)]
    const repetido = candidato.slug === correcto.slug || otros.some(o => o.slug === candidato.slug)
    if (!repetido) otros.push(candidato)
  }
  return mezclar([correcto, ...otros], aleatorio)
}
