<template>
  <div class="app">
    <BarraNavegacion :vista="vista" :opciones="opciones" />

    <main class="contenido">
      <transition name="vista" mode="out-in">
        <component :is="componenteActual" :key="vista" />
      </transition>
    </main>

    <PiePagina />
  </div>
</template>

<script>
import BarraNavegacion from '@/components/BarraNavegacion.vue'
import PiePagina from '@/components/PiePagina.vue'
import PortadaPagina from '@/page/PortadaPagina.vue'
import AprobacionCandidato from '@/page/AprobacionCandidato.vue'
import JuegoPokemon from '@/page/JuegoPokemon.vue'
import ConsumoApi from '@/page/ConsumoApi.vue'

// Cada vista se identifica por su hash en la URL (#inicio, #buscar, ...)
const vistas = {
  inicio: { texto: 'Inicio', componente: PortadaPagina },
  buscar: { texto: 'Buscar personas', componente: AprobacionCandidato },
  pokemon: { texto: 'Juego Pokémon', componente: JuegoPokemon },
  api: { texto: 'Buscar personajes', componente: ConsumoApi }
}

export default {
  name: 'App',
  components: {
    BarraNavegacion,
    PiePagina
  },
  data() {
    return {
      vista: 'inicio',
      opciones: Object.keys(vistas).map(id => ({ id, texto: vistas[id].texto }))
    }
  },
  computed: {
    componenteActual() {
      return vistas[this.vista].componente
    }
  },
  created() {
    this.leerHash()
    window.addEventListener('hashchange', this.leerHash)
  },
  beforeUnmount() {
    window.removeEventListener('hashchange', this.leerHash)
  },
  methods: {
    leerHash() {
      const id = window.location.hash.replace('#', '')
      this.vista = vistas[id] ? id : 'inicio'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.contenido {
  flex: 1;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 16px 56px;
}
</style>
