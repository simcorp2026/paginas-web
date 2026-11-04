<template>
  <section class="portada">
    <div class="hero">
      <p class="etiqueta">Panel de proyectos</p>
      <h1 class="titulo">Gestión Páginas</h1>
      <p class="subtitulo">
        Para
        <span class="escritura">{{ textoEscrito }}</span><span class="cursor">|</span>
      </p>
    </div>

    <div class="tarjetas">
      <a
        v-for="(tarjeta, i) in tarjetas"
        :key="tarjeta.id"
        :href="'#' + tarjeta.id"
        class="tarjeta revelar"
        :style="{ transitionDelay: i * 120 + 'ms' }"
      >
        <span class="numero">0{{ i + 1 }}</span>
        <h3>{{ tarjeta.titulo }}</h3>
        <p>{{ tarjeta.descripcion }}</p>
        <span class="flecha">Ir →</span>
      </a>
    </div>
  </section>
</template>

<script>
const frases = [
  'buscar personas',
  'poner a prueba tu memoria Pokémon',
  'buscar personajes'
]

export default {
  name: 'PortadaPagina',
  data() {
    return {
      tarjetas: [
        { id: 'buscar', titulo: 'Buscar personas', descripcion: 'Genera perfiles de ejemplo y guárdalos en una tabla de candidatos.' },
        { id: 'pokemon', titulo: 'Juego Pokémon', descripcion: 'Adivina quién es ese Pokémon entre cuatro opciones y acumula puntaje.' },
        { id: 'api', titulo: 'Buscar personajes', descripcion: 'Busca personajes de Rick and Morty consumiendo una API pública.' }
      ],
      textoEscrito: '',
      indiceFrase: 0,
      escribiendo: true,
      temporizador: null,
      observador: null
    }
  },
  mounted() {
    this.escribir()
    this.observarTarjetas()
  },
  beforeUnmount() {
    clearTimeout(this.temporizador)
    if (this.observador) this.observador.disconnect()
  },
  methods: {
    // Efecto de máquina de escribir: escribe, pausa, borra y pasa a la siguiente frase
    escribir() {
      const frase = frases[this.indiceFrase]
      let retraso = 90

      if (this.escribiendo) {
        this.textoEscrito = frase.slice(0, this.textoEscrito.length + 1)
        if (this.textoEscrito === frase) {
          this.escribiendo = false
          retraso = 1800
        }
      } else {
        this.textoEscrito = frase.slice(0, this.textoEscrito.length - 1)
        retraso = 45
        if (this.textoEscrito === '') {
          this.escribiendo = true
          this.indiceFrase = (this.indiceFrase + 1) % frases.length
          retraso = 350
        }
      }

      this.temporizador = setTimeout(this.escribir, retraso)
    },
    // Revela cada tarjeta cuando entra en pantalla
    observarTarjetas() {
      if (!('IntersectionObserver' in window)) {
        this.$el.querySelectorAll('.revelar').forEach(el => el.classList.add('visible'))
        return
      }
      this.observador = new IntersectionObserver(entradas => {
        entradas.forEach(entrada => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visible')
            this.observador.unobserve(entrada.target)
          }
        })
      }, { threshold: 0.2 })

      this.$el.querySelectorAll('.revelar').forEach(el => this.observador.observe(el))
    }
  }
}
</script>

<style scoped>
.portada {
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.hero {
  text-align: center;
  padding: 40px 8px 0;
  animation: aparecer 0.9s ease both;
}

.etiqueta {
  display: inline-block;
  margin: 0 0 14px;
  padding: 4px 14px;
  border: 1px solid var(--color-salvia);
  border-radius: 999px;
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--texto-suave);
}

.titulo {
  font-size: clamp(2.4rem, 6vw, 4.2rem);
  margin-bottom: 18px;
}

.subtitulo {
  font-size: clamp(1.05rem, 2.4vw, 1.3rem);
  color: var(--texto-suave);
  min-height: 2em;
}

.escritura {
  color: var(--color-granate);
  font-weight: 600;
}

.cursor {
  display: inline-block;
  margin-left: 2px;
  color: var(--color-granate);
  animation: parpadeo 1s steps(1) infinite;
}

@keyframes parpadeo {
  50% {
    opacity: 0;
  }
}

.tarjetas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.tarjeta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 28px 24px;
  background: var(--superficie);
  border: 1px solid var(--borde);
  border-radius: var(--radio);
  box-shadow: var(--sombra);
  text-decoration: none;
  color: inherit;
  transition: opacity 0.7s ease, transform 0.35s ease, box-shadow 0.35s ease;
}

.tarjeta.visible:hover {
  transform: translateY(-6px);
  box-shadow: 0 22px 40px -18px rgba(89, 9, 7, 0.45);
}

.numero {
  font-family: var(--fuente-titulo);
  font-size: 1.6rem;
  color: var(--color-salvia);
}

.tarjeta h3 {
  font-size: 1.35rem;
  margin: 0;
}

.tarjeta p {
  margin: 0;
  color: var(--texto-suave);
  font-size: 0.95rem;
}

.flecha {
  margin-top: auto;
  padding-top: 12px;
  font-weight: 600;
  color: var(--color-granate);
}
</style>
