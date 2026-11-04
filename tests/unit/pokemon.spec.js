import {
  idDesdeUrl,
  nombreLegible,
  filtrarPokemonBase,
  generarOpciones,
  TOTAL_POKEMON
} from '@/utils/pokemon'

describe('utils/pokemon.js', () => {
  it('extrae el id desde la URL de PokeAPI', () => {
    expect(idDesdeUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
  })

  it('convierte el slug en nombre legible', () => {
    expect(nombreLegible('mr-mime')).toBe('Mr Mime')
    expect(nombreLegible('pikachu')).toBe('Pikachu')
  })

  it('descarta formas alternas fuera del rango base', () => {
    const resultados = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'pikachu-gmax', url: 'https://pokeapi.co/api/v2/pokemon/10195/' }
    ]
    const lista = filtrarPokemonBase(resultados)
    expect(lista).toHaveLength(1)
    expect(lista[0].nombre).toBe('Bulbasaur')
    expect(lista[0].id).toBeLessThanOrEqual(TOTAL_POKEMON)
  })

  it('genera 4 opciones únicas que incluyen la respuesta correcta', () => {
    const lista = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      slug: 'poke-' + i,
      nombre: 'Poke ' + i
    }))
    const correcto = lista[5]
    const opciones = generarOpciones(correcto, lista)

    expect(opciones).toHaveLength(4)
    expect(new Set(opciones.map(o => o.slug)).size).toBe(4)
    expect(opciones.map(o => o.slug)).toContain(correcto.slug)
  })

  it('no repite la respuesta correcta entre las distractoras', () => {
    const lista = [
      { id: 1, slug: 'a', nombre: 'A' },
      { id: 2, slug: 'b', nombre: 'B' },
      { id: 3, slug: 'c', nombre: 'C' },
      { id: 4, slug: 'd', nombre: 'D' }
    ]
    // Con un generador fijo, la primera elección sería siempre la misma
    let i = 0
    const valores = [0, 0, 0.3, 0.6, 0.9, 0.1, 0.5, 0.7]
    const aleatorio = () => valores[i++ % valores.length]

    const opciones = generarOpciones(lista[0], lista, aleatorio)
    expect(opciones.filter(o => o.slug === 'a')).toHaveLength(1)
    expect(opciones).toHaveLength(4)
  })
})
