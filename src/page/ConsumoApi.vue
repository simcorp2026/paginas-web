<template>
  <section class="api">
    <header class="encabezado entrada">
      <h2>Buscar personajes</h2>
      <p>Datos en vivo desde la API pública de <strong>Rick and Morty</strong>.</p>
    </header>

    <div class="buscador entrada" style="animation-delay: 0.1s">
      <input
        type="text"
        v-model="busqueda"
        placeholder="Buscar por nombre, por ejemplo: Rick"
        aria-label="Buscar personaje"
      >
      <span v-if="total !== null && !cargando" class="total">{{ total }} resultados</span>
    </div>

    <p v-if="error" class="aviso error entrada">
      {{ error }}
      <button class="secundario" @click="buscar">Reintentar</button>
    </p>

    <p v-else-if="cargando && !personajes.length" class="aviso entrada">Cargando personajes…</p>

    <p v-else-if="!personajes.length" class="aviso entrada">No encontramos personajes con ese nombre.</p>

    <transition-group v-else name="aparece" tag="div" class="rejilla">
      <article
        v-for="personaje in personajes"
        :key="personaje.id"
        class="tarjeta"
      >
        <div class="imagen-contenedor">
          <img :src="personaje.image" :alt="personaje.name" loading="lazy">
        </div>
        <div class="cuerpo">
          <h3>{{ personaje.name }}</h3>
          <p class="estado">
            <span class="punto" :class="claseEstado(personaje.status)"></span>
            {{ textoEstado(personaje.status) }} · {{ personaje.species }}
          </p>
          <p class="detalle">
            <span>Origen</span> {{ personaje.origin.name }}
          </p>
          <p class="detalle">
            <span>Apariciones</span> {{ personaje.episode.length }}
          </p>
        </div>
      </article>
    </transition-group>

    <div v-if="siguienteUrl && !error" class="mas">
      <button class="secundario" :disabled="cargando" @click="cargarMas">
        {{ cargando ? 'Cargando…' : 'Cargar más' }}
      </button>
    </div>
  </section>
</template>

<script>
const URL_PERSONAJES = 'https://rickandmortyapi.com/api/character/'

const ESTADOS = {
  Alive: 'Vivo',
  Dead: 'Muerto',
  unknown: 'Desconocido'
}

export default {
  name: 'ConsumoApi',
  data() {
    return {
      busqueda: '',
      personajes: [],
      siguienteUrl: null,
      total: null,
      cargando: false,
      error: '',
      temporizador: null,
      // Evita que una respuesta lenta sobrescriba una búsqueda más reciente
      solicitud: 0
    }
  },
  watch: {
    busqueda() {
      clearTimeout(this.temporizador)
      this.temporizador = setTimeout(this.buscar, 400)
    }
  },
  mounted() {
    this.buscar()
  },
  beforeUnmount() {
    clearTimeout(this.temporizador)
  },
  methods: {
    async pedir(url) {
      const resp = await fetch(url)
      // La API responde 404 cuando una búsqueda no tiene coincidencias
      if (resp.status === 404) return { info: { count: 0, next: null }, results: [] }
      if (!resp.ok) throw new Error('Respuesta ' + resp.status)
      return resp.json()
    },
    async buscar() {
      const id = ++this.solicitud
      const nombre = this.busqueda.trim()
      const url = nombre
        ? `${URL_PERSONAJES}?name=${encodeURIComponent(nombre)}`
        : URL_PERSONAJES

      this.cargando = true
      this.error = ''
      try {
        const data = await this.pedir(url)
        if (id !== this.solicitud) return
        this.personajes = data.results
        this.siguienteUrl = data.info.next
        this.total = data.info.count
      } catch (e) {
        if (id !== this.solicitud) return
        this.error = 'No se pudo consultar la API. Revisa tu conexión e intenta de nuevo.'
      } finally {
        if (id === this.solicitud) this.cargando = false
      }
    },
    async cargarMas() {
      if (!this.siguienteUrl) return
      const id = this.solicitud
      this.cargando = true
      try {
        const data = await this.pedir(this.siguienteUrl)
        if (id !== this.solicitud) return
        this.personajes = [...this.personajes, ...data.results]
        this.siguienteUrl = data.info.next
      } catch (e) {
        this.error = 'No se pudieron cargar más personajes.'
      } finally {
        this.cargando = false
      }
    },
    textoEstado(estado) {
      return ESTADOS[estado] || 'Desconocido'
    },
    claseEstado(estado) {
      return {
        vivo: estado === 'Alive',
        muerto: estado === 'Dead',
        desconocido: estado !== 'Alive' && estado !== 'Dead'
      }
    }
  }
}
</script>

<style scoped>
.api {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.encabezado h2 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  margin-bottom: 6px;
}

.encabezado p {
  margin: 0;
  color: var(--texto-suave);
}

.buscador {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  background: var(--superficie);
  border: 1px solid var(--borde);
  border-radius: 999px;
  box-shadow: var(--sombra);
}

.buscador input {
  border-bottom: none;
  padding: 6px 4px;
}

.buscador input:focus {
  box-shadow: none;
}

.total {
  white-space: nowrap;
  font-size: 0.85rem;
  color: var(--texto-suave);
}

.aviso {
  margin: 0;
  padding: 20px;
  text-align: center;
  background: var(--superficie);
  border-radius: var(--radio);
  color: var(--texto-suave);
}

.aviso.error {
  color: var(--color-granate);
  font-weight: 600;
}

.aviso.error button {
  margin-left: 12px;
}

.rejilla {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.tarjeta {
  overflow: hidden;
  background: var(--superficie);
  border: 1px solid var(--borde);
  border-radius: var(--radio);
  box-shadow: var(--sombra);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.tarjeta:hover {
  transform: translateY(-6px);
  box-shadow: 0 22px 40px -18px rgba(89, 9, 7, 0.45);
}

.imagen-contenedor {
  aspect-ratio: 1 / 1;
  background: rgba(165, 167, 155, 0.3);
  overflow: hidden;
}

.imagen-contenedor img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.tarjeta:hover .imagen-contenedor img {
  transform: scale(1.08);
}

.cuerpo {
  padding: 16px 18px 18px;
}

.cuerpo h3 {
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.estado {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 10px;
  font-size: 0.9rem;
  color: var(--texto-suave);
}

.punto {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--color-salvia);
}

.punto.vivo {
  background: var(--color-salvia);
  box-shadow: 0 0 0 3px rgba(165, 167, 155, 0.3);
}

.punto.muerto {
  background: var(--color-granate);
}

.punto.desconocido {
  background: transparent;
  border: 1.5px solid var(--color-salvia);
}

.detalle {
  margin: 4px 0 0;
  font-size: 0.88rem;
}

.detalle span {
  display: inline-block;
  min-width: 96px;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--texto-suave);
}

.mas {
  display: flex;
  justify-content: center;
}

/* Animación de entrada/salida de tarjetas */
.aparece-enter-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.aparece-enter-from {
  opacity: 0;
  transform: scale(0.94) translateY(12px);
}

.aparece-leave-active {
  transition: opacity 0.2s ease;
}

.aparece-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .buscador {
    border-radius: var(--radio);
    flex-direction: column;
    align-items: stretch;
  }

  .total {
    text-align: center;
  }
}
</style>
