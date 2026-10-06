/* ==========================================================================
   VIDEOSTREAM - SCRIPT DE FUNCIONALIDADES INTERACTIVAS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
       0. FUNCIONES AUXILIARES Y FORMATEADORES
       ====================================================================== */

    /**
     * Formatea números con separadores de miles según la configuración de idioma español.
     * Ejemplo: 1200001 -> "1.200.001"
     */
    function formatearNumero(numero) {
        return numero.toLocaleString('es-ES');
    }

    /**
     * Extrae un valor entero a partir de un texto con caracteres de formato.
     * Ejemplo: "1.200.000" -> 1200000
     */
    function obtenerNumeroEntero(texto) {
        const textoLimpio = texto.replace(/\./g, '').replace(/,/g, '').replace(/[^\d]/g, '');
        return parseInt(textoLimpio, 10) || 0;
    }


    /* ======================================================================
       1. VISTA PREVIA AUTOMÁTICA AL PASAR EL MOUSE (HOVER PREVIEW)
       - "Al pasar el mouse sobre la miniatura se reproduce el video automáticamente
         (sin sonido) y se detiene al salir."
       ====================================================================== */

    /**
     * Añade los eventos 'mouseenter' y 'mouseleave' a una tarjeta dada.
     */
    function activarVistaPreviaHover(tarjeta) {
        const videoElemento = tarjeta.querySelector('video');
        if (!videoElemento) return;

        // Al entrar el cursor: reproduce en silencio
        tarjeta.addEventListener('mouseenter', () => {
            videoElemento.muted = true;
            const promesaReproduccion = videoElemento.play();
            
            if (promesaReproduccion !== undefined) {
                promesaReproduccion.catch(error => {
                    // Evita advertencias si la política de autodetección del navegador detiene la reproducción
                    console.log("Vista previa en espera de interacción:", error);
                });
            }
        });

        // Al salir el cursor: pausa y regresa al inicio (0s)
        tarjeta.addEventListener('mouseleave', () => {
            videoElemento.pause();
            videoElemento.currentTime = 0;
        });
    }

    // Asignar el evento a todas las miniaturas existentes en la página
    const tarjetasIniciales = document.querySelectorAll('.tarjeta-video-horizontal, .tarjeta-video-lateral');
    tarjetasIniciales.forEach(tarjeta => activarVistaPreviaHover(tarjeta));


    /* ======================================================================
       2. INTERACCIÓN CON "ME GUSTA" Y "NO ME GUSTA"
       - "Al hacer click en 'Me gusta' se suma 1 al contador."
       ====================================================================== */

    const botonMegusta = document.getElementById('boton-megusta');
    const contadorMegusta = document.getElementById('contador-megusta');
    const botonNomegusta = document.getElementById('boton-nomegusta');
    const contadorNomegusta = document.getElementById('contador-nomegusta');

    let estaMeGustaActivo = false;
    let totalMeGusta = obtenerNumeroEntero(contadorMegusta ? contadorMegusta.textContent : "4800");

    let estaNoMeGustaActivo = false;
    let totalNoMeGusta = obtenerNumeroEntero(contadorNomegusta ? contadorNomegusta.textContent : "120");

    // Lógica para 'Me gusta'
    if (botonMegusta && contadorMegusta) {
        botonMegusta.addEventListener('click', () => {
            if (!estaMeGustaActivo) {
                totalMeGusta++;
                botonMegusta.classList.add('activo');
                estaMeGustaActivo = true;

                // Si 'No me gusta' estaba previamente activo, se cancela
                if (estaNoMeGustaActivo) {
                    totalNoMeGusta--;
                    botonNomegusta.classList.remove('activo');
                    contadorNomegusta.textContent = formatearNumero(totalNoMeGusta);
                    estaNoMeGustaActivo = false;
                }
            } else {
                // Si vuelve a hacer clic, remueve el me gusta
                totalMeGusta--;
                botonMegusta.classList.remove('activo');
                estaMeGustaActivo = false;
            }
            contadorMegusta.textContent = formatearNumero(totalMeGusta);
        });
    }

    // Lógica para 'No me gusta'
    if (botonNomegusta && contadorNomegusta) {
        botonNomegusta.addEventListener('click', () => {
            if (!estaNoMeGustaActivo) {
                totalNoMeGusta++;
                botonNomegusta.classList.add('activo');
                estaNoMeGustaActivo = true;

                // Si 'Me gusta' estaba previamente activo, se cancela
                if (estaMeGustaActivo) {
                    totalMeGusta--;
                    botonMegusta.classList.remove('activo');
                    contadorMegusta.textContent = formatearNumero(totalMeGusta);
                    estaMeGustaActivo = false;
                }
            } else {
                totalNoMeGusta--;
                botonNomegusta.classList.remove('activo');
                estaNoMeGustaActivo = false;
            }
            contadorNomegusta.textContent = formatearNumero(totalNoMeGusta);
        });
    }


    /* ======================================================================
       3. SUSCRIPCIÓN AL CANAL
       - "Al hacer click en 'Suscribirse' se suma 1 al contador de suscriptores
         y cambia a 'Suscrito'."
       ====================================================================== */

    const botonSuscripcion = document.getElementById('boton-suscripcion');
    const contadorSuscriptores = document.getElementById('contador-suscriptores');

    let estaSuscrito = false;
    let totalSuscriptores = obtenerNumeroEntero(contadorSuscriptores ? contadorSuscriptores.textContent : "1200000");

    if (botonSuscripcion && contadorSuscriptores) {
        botonSuscripcion.addEventListener('click', () => {
            if (!estaSuscrito) {
                totalSuscriptores++;
                botonSuscripcion.textContent = 'Suscrito';
                botonSuscripcion.classList.add('suscrito');
                estaSuscrito = true;
            } else {
                totalSuscriptores--;
                botonSuscripcion.textContent = 'Suscribirse';
                botonSuscripcion.classList.remove('suscrito');
                estaSuscrito = false;
            }
            contadorSuscriptores.textContent = formatearNumero(totalSuscriptores);
        });
    }


    /* ======================================================================
       4. MOSTRAR MÁS / MOSTRAR MENOS DESCRIPCIÓN
       ====================================================================== */

    const botonMostrarMas = document.getElementById('boton-mostrar-mas');
    const textoDescripcion = document.getElementById('texto-descripcion');

    if (botonMostrarMas && textoDescripcion) {
        botonMostrarMas.addEventListener('click', () => {
            const estaContraido = textoDescripcion.classList.contains('descripcion-corta');

            if (estaContraido) {
                textoDescripcion.classList.remove('descripcion-corta');
                textoDescripcion.classList.add('descripcion-expandida');
                botonMostrarMas.textContent = 'Mostrar menos';
            } else {
                textoDescripcion.classList.remove('descripcion-expandida');
                textoDescripcion.classList.add('descripcion-corta');
                botonMostrarMas.textContent = 'Mostrar más';
            }
        });
    }


    /* ======================================================================
       5. GESTIÓN DE LA COLA DE REPRODUCCIÓN (AÑADIR / ELIMINAR / LIMPIAR)
       - "Icono para añadir a la cola de reproducción (+)."
       ====================================================================== */

    const listaCola = document.getElementById('lista-cola');
    const botonLimpiarCola = document.getElementById('boton-limpiar-cola');

    /**
     * Construye un nuevo nodo de video y lo añade a la lista de cola.
     */
    function agregarVideoACola(titulo, canal, vistas, duracion, urlVideo) {
        if (!listaCola) return;

        const nuevaTarjeta = document.createElement('div');
        nuevaTarjeta.className = 'tarjeta-video-lateral';
        nuevaTarjeta.dataset.titulo = titulo;
        nuevaTarjeta.dataset.canal = canal;
        nuevaTarjeta.dataset.vistas = vistas;
        nuevaTarjeta.dataset.duracion = duracion;
        nuevaTarjeta.dataset.video = urlVideo;

        nuevaTarjeta.innerHTML = `
            <div class="contenedor-miniatura-lateral">
                <video class="video-vista-previa" muted loop poster="static/images/cuadrado.png">
                    <source src="${urlVideo}" type="video/mp4">
                </video>
                <span class="duracion-badge">${duracion}</span>
            </div>
            <div class="info-video-lateral">
                <h4>${titulo}</h4>
                <p class="canal">${canal}</p>
                <p class="vistas">${vistas}</p>
            </div>
            <button class="boton-eliminar-cola" title="Eliminar de la cola">✕</button>
        `;

        listaCola.appendChild(nuevaTarjeta);
        activarVistaPreviaHover(nuevaTarjeta);
    }

    // Delegación de eventos para eliminar de la cola (Botón '✕')
    if (listaCola) {
        listaCola.addEventListener('click', (evento) => {
            if (evento.target.classList.contains('boton-eliminar-cola')) {
                const tarjetaAEliminar = evento.target.closest('.tarjeta-video-lateral');
                if (tarjetaAEliminar) {
                    tarjetaAEliminar.remove();
                }
            }
        });
    }

    // Botón "Limpiar cola"
    if (botonLimpiarCola && listaCola) {
        botonLimpiarCola.addEventListener('click', () => {
            listaCola.innerHTML = '';
        });
    }

    // Evento al presionar el botón '+' en la sección de Recomendados
    const listaRecomendados = document.getElementById('lista-recomendados');
    if (listaRecomendados) {
        listaRecomendados.addEventListener('click', (evento) => {
            if (evento.target.classList.contains('boton-agregar-cola')) {
                const tarjeta = evento.target.closest('.tarjeta-video-lateral');
                if (tarjeta) {
                    const titulo = tarjeta.dataset.titulo || tarjeta.querySelector('h4').textContent;
                    const canal = tarjeta.dataset.canal || tarjeta.querySelector('.canal').textContent;
                    const vistas = tarjeta.dataset.vistas || tarjeta.querySelector('.vistas').textContent;
                    const duracion = tarjeta.dataset.duracion || tarjeta.querySelector('.duracion-badge').textContent;
                    const urlVideo = tarjeta.dataset.video || "https://www.w3schools.com/html/mov_bbb.mp4";

                    agregarVideoACola(titulo, canal, vistas, duracion, urlVideo);
                }
            }
        });
    }

    // Botón "Añadir a la cola" ubicado bajo el video principal
    const botonAnadirPrincipal = document.getElementById('boton-anadir-principal');
    if (botonAnadirPrincipal) {
        botonAnadirPrincipal.addEventListener('click', () => {
            const titulo = document.querySelector('.titulo-video')?.textContent || "Video Principal";
            const canal = document.querySelector('.nombre-canal')?.textContent || "VideoStream";
            const vistas = "95 mil visualizaciones";
            const duracion = "4:32";
            const videoElem = document.getElementById('video-principal');
            const urlVideo = videoElem ? (videoElem.currentSrc || videoElem.querySelector('source')?.getAttribute('src')) : "";

            agregarVideoACola(titulo, canal, vistas, duracion, urlVideo);
        });
    }


    /* ======================================================================
       6. CAMBIO DE VIDEO EN EL REPRODUCTOR PRINCIPAL
       - Al hacer clic en una tarjeta de video, carga dicho video arriba.
       ====================================================================== */

    const contenedorPrincipal = document.querySelector('.contenedor-principal');
    if (contenedorPrincipal) {
        contenedorPrincipal.addEventListener('click', (evento) => {
            // Ignorar el clic si se realizó sobre un botón (+ o ✕)
            if (evento.target.tagName === 'BUTTON' || evento.target.closest('button')) return;

            const tarjeta = evento.target.closest('.tarjeta-video-horizontal, .tarjeta-video-lateral');
            if (tarjeta) {
                const titulo = tarjeta.dataset.titulo || tarjeta.querySelector('h4, .titulo-miniatura')?.textContent;
                const urlVideo = tarjeta.dataset.video || tarjeta.querySelector('source')?.getAttribute('src');

                if (urlVideo) {
                    const videoPrincipal = document.getElementById('video-principal');
                    const tituloPrincipal = document.querySelector('.titulo-video');

                    if (videoPrincipal) {
                        videoPrincipal.src = urlVideo;
                        videoPrincipal.play().catch(() => {});
                    }

                    if (tituloPrincipal && titulo) {
                        tituloPrincipal.textContent = titulo;
                    }

                    // Desplazamiento suave al tope para móviles
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    }


    /* ======================================================================
       7. BUSCADOR SIMULADO DE VIDEOS
       ====================================================================== */

    const inputBusqueda = document.getElementById('input-busqueda');
    const botonBuscar = document.querySelector('.boton-buscar');

    function ejecutarBusqueda() {
        if (!inputBusqueda) return;
        const termino = inputBusqueda.value.toLowerCase().trim();

        const tarjetas = document.querySelectorAll('.tarjeta-video-horizontal, .tarjeta-video-lateral');
        tarjetas.forEach(tarjeta => {
            const tituloText = tarjeta.querySelector('h4, .titulo-miniatura')?.textContent.toLowerCase() || '';
            if (tituloText.includes(termino)) {
                tarjeta.style.display = '';
            } else {
                tarjeta.style.display = 'none';
            }
        });
    }

    if (botonBuscar) botonBuscar.addEventListener('click', ejecutarBusqueda);
    if (inputBusqueda) {
        inputBusqueda.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') ejecutarBusqueda();
        });
    }

});