<template>
    <div class="pagina">
        <header class="encabezado entrada">
            <h2>Buscar personas</h2>
            <p>Consulta un perfil aleatorio y, si te convence, agrégalo a la lista de candidatos.</p>
        </header>

        <div class="tarjeta entrada" style="animation-delay: 0.12s">
            <div class="fotografia" :class="{ vacia: !imagen, cargando: cargando }">
                <img v-if="imagen" :src="imagen" alt="Fotografía del candidato">
                <span v-else>{{ cargando ? 'Buscando…' : 'Sin fotografía' }}</span>
            </div>

            <div class="campos">
                <label>
                    Título
                    <input type="text" v-model="titulo">
                </label>
                <label>
                    Nombre
                    <input type="text" v-model="nombre">
                </label>
                <label>
                    Apellido
                    <input type="text" v-model="apellido">
                </label>
                <label>
                    Email
                    <input type="text" v-model="email">
                </label>
                <label>
                    País
                    <input type="text" v-model="pais">
                </label>
            </div>

            <p v-if="mensaje" class="mensaje" :class="tipoMensaje">{{ mensaje }}</p>

            <div class="botones">
                <button class="secundario" :disabled="cargando" @click="consultarAPI()">
                    {{ cargando ? 'Buscando…' : 'Buscar' }}
                </button>
                <button :disabled="!Persona" @click="guardarPersona()">Agregar</button>
            </div>
        </div>

        <div class="tabla-contenedor entrada" style="animation-delay: 0.24s">
            <h3>Candidatos guardados</h3>
            <AlmacenamientoCandidatos :personaG="Personas" />
        </div>
    </div>
</template>

<script>
import AlmacenamientoCandidatos from '@/components/AlmacenamientoCandidatos.vue'

const URL_PERSONA_ALEATORIA = 'https://randomuser.me/api/'

export default {
    components:{
        AlmacenamientoCandidatos
    },
    data() {
        return {
            imagen: '',
            titulo: '',
            nombre: '',
            apellido: '',
            email: '',
            pais: '',
            Persona: null,
            Personas: [],
            cargando: false,
            mensaje: '',
            tipoMensaje: ''
        }
    },
    methods: {
        async consultarAPI() {
            this.cargando = true
            this.mensaje = ''
            try {
                const resp = await fetch(URL_PERSONA_ALEATORIA)
                if (!resp.ok) throw new Error('Respuesta ' + resp.status)
                const data = await resp.json()
                const persona = data.results[0]

                this.titulo = persona.name.title
                this.nombre = persona.name.first
                this.apellido = persona.name.last
                this.imagen = persona.picture.large
                this.email = persona.email
                this.pais = persona.location.country

                this.Persona = {
                    titulo: this.titulo,
                    nombre: this.nombre,
                    apellido: this.apellido,
                    email: this.email,
                    pais: this.pais
                }
            } catch (error) {
                this.mostrarMensaje('No se pudo consultar la API. Intenta de nuevo.', 'error')
            } finally {
                this.cargando = false
            }
        },
        guardarPersona() {
            if (!this.Persona) return
            // Copia para que editar los campos después no altere lo ya guardado
            this.Personas.push({ ...this.Persona })
            this.mostrarMensaje('Candidato agregado a la lista.', 'ok')
        },
        mostrarMensaje(texto, tipo) {
            this.mensaje = texto
            this.tipoMensaje = tipo
        }
    }
}
</script>

<style scoped>
.pagina {
    display: flex;
    flex-direction: column;
    gap: 28px;
}

.encabezado h2 {
    font-size: clamp(2rem, 4vw, 2.8rem);
    margin-bottom: 6px;
}

.encabezado p {
    margin: 0;
    color: var(--texto-suave);
}

.tarjeta,
.tabla-contenedor {
    background: var(--superficie);
    border: 1px solid var(--borde);
    border-radius: var(--radio);
    box-shadow: var(--sombra);
    padding: 28px;
}

.tarjeta {
    display: grid;
    grid-template-columns: minmax(180px, 240px) 1fr;
    gap: 28px;
    align-items: start;
}

.fotografia {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    border: 2px solid var(--color-salvia);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(165, 167, 155, 0.25);
    transition: transform 0.4s ease;
}

.fotografia img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: aparecer 0.6s ease both;
}

.fotografia:hover {
    transform: scale(1.03);
}

.fotografia.vacia span {
    font-size: 0.9rem;
    color: var(--texto-suave);
}

.fotografia.cargando {
    animation: pulso 1.2s ease-in-out infinite;
}

@keyframes pulso {
    50% {
        opacity: 0.5;
    }
}

.campos {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 18px 24px;
}

label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--texto-suave);
}

label input {
    font-size: 1rem;
    letter-spacing: normal;
    text-transform: none;
    color: var(--texto);
    font-weight: 400;
}

.mensaje {
    grid-column: 1 / -1;
    margin: 0;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 0.92rem;
    animation: aparecer 0.4s ease both;
}

.mensaje.ok {
    background: rgba(165, 167, 155, 0.35);
}

.mensaje.error {
    background: rgba(89, 9, 7, 0.12);
    color: var(--color-granate);
    font-weight: 600;
}

.botones {
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.tabla-contenedor h3 {
    font-size: 1.4rem;
}

@media (max-width: 720px) {
    .tarjeta {
        grid-template-columns: 1fr;
        justify-items: center;
    }

    .fotografia {
        width: 180px;
    }

    .campos {
        width: 100%;
    }
}
</style>
