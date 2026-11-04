<template>
    <div class="contenedor-tabla">
        <p v-if="!personaG.length" class="vacio">Aún no has agregado candidatos.</p>

        <table v-else>
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Email</th>
                    <th>País</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(persona, indice) in personaG"
                    :key="indice"
                    :style="{ animationDelay: indice * 60 + 'ms' }"
                >
                    <td>{{ persona.titulo }}</td>
                    <td>{{ persona.nombre }}</td>
                    <td>{{ persona.apellido }}</td>
                    <td>{{ persona.email }}</td>
                    <td>{{ persona.pais }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'AlmacenamientoCandidatos',
    props: {
        personaG: {
            type: Array,
            required: true
        }
    }
}
</script>

<style scoped>
.contenedor-tabla {
    overflow-x: auto;
    border-radius: 12px;
}

.vacio {
    margin: 0;
    padding: 18px 0;
    text-align: center;
    color: var(--texto-suave);
    font-style: italic;
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
}

thead th {
    text-align: left;
    padding: 12px 14px;
    background: var(--color-granate);
    color: var(--color-crema);
    font-weight: 600;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

thead th:first-child {
    border-radius: 10px 0 0 0;
}

thead th:last-child {
    border-radius: 0 10px 0 0;
}

tbody tr {
    animation: aparecer 0.5s ease both;
    transition: background-color 0.2s ease;
}

tbody tr:nth-child(even) {
    background: rgba(165, 167, 155, 0.18);
}

tbody tr:hover {
    background: rgba(165, 167, 155, 0.4);
}

td {
    padding: 12px 14px;
    border-bottom: 1px solid var(--borde);
}
</style>
