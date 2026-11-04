<template>
  <footer class="pie">
    <div class="linea"></div>
    <p>Desarrollado por <strong>Pablo Simbaña</strong></p>
  </footer>
</template>

<script>
export default {
  name: 'PiePagina'
}
</script>

<style scoped>
.pie {
  padding: 24px 16px 32px;
  text-align: center;
  background: var(--color-granate);
  color: var(--color-crema);
  font-size: 0.9rem;
  letter-spacing: 0.02em;
}

.linea {
  width: 56px;
  height: 2px;
  margin: 0 auto 14px;
  background: var(--color-salvia);
  border-radius: 2px;
}

.pie p {
  margin: 0;
}

.pie strong {
  font-family: var(--fuente-titulo);
  font-size: 1rem;
  color: #fff;
}
</style>
