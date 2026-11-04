<template>
  <section class="juego">
    <header class="encabezado entrada">
      <h2>¿Quién es ese Pokémon?</h2>
      <p v-if="!fin">Ronda {{ numeroRonda }} de {{ TOTAL_RONDAS }}</p>
    </header>

    <div class="marcador entrada" style="animation-delay: 0.1s">
      <div>
        <span>Puntaje</span>
        <strong :key="puntaje" class="valor">{{ puntaje }}</strong>
      </div>
      <div>
        <span>Aciertos</span>
        <strong class="valor">{{ aciertos }}</strong>
      </div>
      <div>
        <span>Mejor</span>
        <strong class="valor">{{ mejor }}</strong>
      </div>
    </div>

    <!-- Error al cargar la lista o un Pokémon -->
    <div v-if="error" class="tarjeta entrada centrado">
      <p>{{ error }}</p>
      <button @click="iniciar">Reintentar</button>
    </div>

    <!-- Resultado final -->
    <div v-else-if="fin" class="tarjeta entrada centrado">
      <h3>¡Partida terminada!</h3>
      <p>
        Puntaje final <strong>{{ puntaje }}</strong>
        · {{ aciertos }} de {{ TOTAL_RONDAS }} aciertos
      </p>
      <button @click="reiniciar">Jugar de nuevo</button>
    </div>

    <!-- Tablero de juego -->
    <div v-else class="tarjeta entrada">
      <div class="escenario">
        <div v-if="cargando" class="cargando">Cargando Pokémon…</div>
        <img
          v-else-if="imagen"
          :src="imagen"
          :alt="respondido ? correcto.nombre : 'Pokémon misterioso'"
          class="imagen"
          :class="{ revelado: respondido }"
        >
        <span
          v-if="respondido"
          :key="numeroRonda"
          class="pop"
          :class="respondido.slug === correcto.slug ? 'pop-ok' : 'pop-error'"
        >
          {{ respondido.slug === correcto.slug ? '+' + PUNTOS_ACIERTO : '+0' }}
        </span>
      </div>

      <div class="opciones">
        <button
          v-for="op in opciones"
          :key="op.slug"
          class="opcion"
          :class="claseOpcion(op)"
          :disabled="!!respondido || cargando"
          @click="responder(op)"
        >
          {{ op.nombre }}
        </button>
      </div>

      <p v-if="respondido" class="resultado">
        {{ respondido.slug === correcto.slug ? '¡Correcto!' : 'Era ' + correcto.nombre }}
      </p>

      <button v-if="respondido" class="secundario" @click="siguiente">
        {{ numeroRonda === TOTAL_RONDAS ? 'Ver resultado' : 'Siguiente' }}
      </button>
    </div>
  </section>
</template>

<script>
import {
  TOTAL_POKEMON,
  filtrarPokemonBase,
  generarOpciones
} from '@/utils/pokemon'

const URL_LISTA = `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}`
const URL_DETALLE = 'https://pokeapi.co/api/v2/pokemon/'
const CLAVE_MEJOR = 'mejorPuntajePokemon'

// Lee el mejor puntaje guardado; si el navegador bloquea localStorage, devuelve 0
function leerMejor() {
  try {
    return Number(localStorage.getItem(CLAVE_MEJOR)) || 0
  } catch (e) {
    return 0
  }
}

function guardarMejor(valor) {
  try {
    localStorage.setItem(CLAVE_MEJOR, String(valor))
  } catch (e) {
    // Sin persistencia: el juego sigue funcionando
  }
}

export default {
  name: 'JuegoPokemon',
  data() {
    return {
      TOTAL_RONDAS: 10,
      PUNTOS_ACIERTO: 10,
      lista: [],
      correcto: null,
      imagen: '',
      opciones: [],
      respondido: null,
      numeroRonda: 1,
      puntaje: 0,
      aciertos: 0,
      mejor: leerMejor(),
      fin: false,
      cargando: false,
      error: ''
    }
  },
  created() {
    this.iniciar()
  },
  methods: {
    async iniciar() {
      this.error = ''
      this.puntaje = 0
      this.aciertos = 0
      this.numeroRonda = 1
      this.fin = false

      if (this.lista.length) {
        return this.nuevaRonda()
      }

      this.cargando = true
      try {
        const resp = await fetch(URL_LISTA)
        if (!resp.ok) throw new Error('Respuesta ' + resp.status)
        const data = await resp.json()
        // Object.freeze evita que Vue vuelva reactiva una lista grande que no cambia
        this.lista = Object.freeze(filtrarPokemonBase(data.results))
        await this.nuevaRonda()
      } catch (e) {
        this.cargando = false
        this.error = 'No se pudo cargar la lista de Pokémon desde PokeAPI.'
      }
    },
    async nuevaRonda() {
      this.respondido = null
      this.cargando = true
      this.correcto = this.lista[Math.floor(Math.random() * this.lista.length)]
      this.opciones = generarOpciones(this.correcto, this.lista)

      try {
        const resp = await fetch(URL_DETALLE + this.correcto.id)
        if (!resp.ok) throw new Error('Respuesta ' + resp.status)
        const data = await resp.json()
        // Imagen oficial en alta calidad; si no existe, el sprite pequeño
        this.imagen = data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default
      } catch (e) {
        this.error = 'No se pudo cargar la imagen del Pokémon.'
      } finally {
        this.cargando = false
      }
    },
    responder(opcion) {
      if (this.respondido) return
      this.respondido = opcion
      if (opcion.slug === this.correcto.slug) {
        this.puntaje += this.PUNTOS_ACIERTO
        this.aciertos++
      }
    },
    siguiente() {
      if (this.numeroRonda >= this.TOTAL_RONDAS) {
        this.finalizar()
        return
      }
      this.numeroRonda++
      this.nuevaRonda()
    },
    finalizar() {
      this.fin = true
      if (this.puntaje > this.mejor) {
        this.mejor = this.puntaje
        guardarMejor(this.mejor)
      }
    },
    reiniciar() {
      this.iniciar()
    },
    claseOpcion(op) {
      if (!this.respondido) return ''
      if (op.slug === this.correcto.slug) return 'correcta'
      if (op.slug === this.respondido.slug) return 'incorrecta'
      return 'apagada'
    }
  }
}
</script>

<style scoped>
.juego {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.encabezado h2 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  margin-bottom: 4px;
}

.encabezado p {
  margin: 0;
  color: var(--texto-suave);
}

.marcador {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.marcador > div {
  padding: 14px;
  text-align: center;
  background: var(--superficie);
  border: 1px solid var(--borde);
  border-radius: var(--radio);
}

.marcador span {
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--texto-suave);
}

.valor {
  display: inline-block;
  font-family: var(--fuente-titulo);
  font-size: 1.8rem;
  animation: aparecer 0.4s ease both;
}

.tarjeta {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 28px;
  background: var(--superficie);
  border: 1px solid var(--borde);
  border-radius: var(--radio);
  box-shadow: var(--sombra);
}

.centrado {
  align-items: center;
  text-align: center;
}

.escenario {
  position: relative;
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.6), rgba(165, 167, 155, 0.25) 70%);
  overflow: hidden;
}

.cargando {
  color: var(--texto-suave);
  animation: pulso 1.2s ease-in-out infinite;
}

@keyframes pulso {
  50% {
    opacity: 0.4;
  }
}

/* Silueta: el Pokémon se muestra negro hasta responder */
.imagen {
  width: min(240px, 70%);
  height: auto;
  filter: brightness(0);
  transform: scale(0.96);
  transition: filter 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: aparecer 0.5s ease both;
}

.imagen.revelado {
  filter: brightness(1) drop-shadow(0 12px 14px rgba(89, 9, 7, 0.25));
  transform: scale(1.05);
}

.pop {
  position: absolute;
  top: 16px;
  right: 18px;
  font-family: var(--fuente-titulo);
  font-size: 1.6rem;
  font-weight: 700;
  animation: subir 1s ease forwards;
  pointer-events: none;
}

.pop-ok {
  color: var(--color-granate);
}

.pop-error {
  color: var(--texto-suave);
}

@keyframes subir {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.8);
  }
  30% {
    opacity: 1;
    transform: translateY(0) scale(1.1);
  }
  100% {
    opacity: 0;
    transform: translateY(-28px) scale(1);
  }
}

.opciones {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.opcion {
  padding: 14px 16px;
  background: var(--superficie-solida);
  color: var(--texto);
  border: 1px solid var(--color-salvia);
  border-radius: 12px;
  box-shadow: none;
  font-weight: 500;
}

.opcion:hover:not(:disabled) {
  background: rgba(165, 167, 155, 0.35);
  box-shadow: none;
}

.opcion.correcta {
  background: var(--color-granate);
  color: var(--color-crema);
  border-color: var(--color-granate);
  animation: latido 0.6s ease;
}

.opcion.incorrecta {
  background: rgba(89, 9, 7, 0.12);
  border-color: var(--color-granate);
  text-decoration: line-through;
}

.opcion.apagada {
  opacity: 0.5;
}

.opcion:disabled {
  opacity: 1;
}

.opcion.apagada:disabled {
  opacity: 0.5;
}

@keyframes latido {
  50% {
    transform: scale(1.04);
  }
}

.resultado {
  margin: 0;
  text-align: center;
  font-weight: 600;
  animation: aparecer 0.4s ease both;
}

.tarjeta > button {
  align-self: center;
}

@media (max-width: 600px) {
  .marcador {
    gap: 8px;
  }

  .valor {
    font-size: 1.4rem;
  }
}
</style>
