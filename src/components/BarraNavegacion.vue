<template>
  <header class="barra">
    <a class="marca" href="#inicio">
      Gestión<span class="punto">·</span>Páginas
    </a>

    <nav class="enlaces">
      <a
        v-for="op in opciones"
        :key="op.id"
        :href="'#' + op.id"
        :class="{ activa: op.id === vista }"
      >
        {{ op.texto }}
      </a>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'BarraNavegacion',
  props: {
    vista: { type: String, required: true },
    opciones: { type: Array, required: true }
  }
}
</script>

<style scoped>
.barra {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 24px;
  background: rgba(232, 210, 181, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--borde);
  animation: aparecer 0.6s ease both;
}

.marca {
  font-family: var(--fuente-titulo);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-granate);
  text-decoration: none;
  letter-spacing: 0.01em;
}

.punto {
  color: var(--color-salvia);
  margin: 0 4px;
}

.enlaces {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.enlaces a {
  position: relative;
  padding: 6px 12px;
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.enlaces a:hover {
  background: rgba(165, 167, 155, 0.35);
}

.enlaces a.activa {
  background: var(--color-granate);
  color: var(--color-crema);
}
</style>
