document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. INTERACCIÓN 1: SUMAR "ME GUSTA"
       ========================================================================== */
    const botonMegusta = document.getElementById('boton-megusta');
    const contadorMegusta = document.getElementById('contador-megusta');

    if (botonMegusta && contadorMegusta) {
        let meGustaActivo = false;

        botonMegusta.addEventListener('click', () => {
            if (!meGustaActivo) {
                contadorMegusta.textContent = '4,9 K';
                botonMegusta.classList.add('activo');
                meGustaActivo = true;
            } else {
                contadorMegusta.textContent = '4,8 K';
                botonMegusta.classList.remove('activo');
                meGustaActivo = false;
            }
        });
    }

    /* ==========================================================================
       2. INTERACCIÓN 2: SUSCRIBIRSE Y INCREMENTAR SUSCRIPTORES
       ========================================================================== */
    const botonSuscripcion = document.getElementById('boton-suscripcion');
    const contadorSuscriptores = document.getElementById('contador-suscriptores');

    if (botonSuscripcion && contadorSuscriptores) {
        let suscritoActivo = false;

        botonSuscripcion.addEventListener('click', () => {
            if (!suscritoActivo) {
                contadorSuscriptores.textContent = '1,2 M (+1)';
                botonSuscripcion.textContent = 'Suscrito';
                botonSuscripcion.classList.add('suscrito');
                suscritoActivo = true;
            } else {
                contadorSuscriptores.textContent = '1,2 M';
                botonSuscripcion.textContent = 'Suscribirse';
                botonSuscripcion.classList.remove('suscrito');
                suscritoActivo = false;
            }
        });
    }

    /* ==========================================================================
       3. INTERACCIÓN 3: AÑADIR A LA COLA (+) Y MOSTRAR ALERTA TOAST
       ========================================================================== */
    const listaCola = document.getElementById('lista-cola');
    const listaRecomendados = document.getElementById('lista-recomendados');
    const btnAnadirPrincipal = document.getElementById('boton-anadir-principal');
    const alertaToast = document.getElementById('alerta-toast');
    const cerrarAlerta = document.getElementById('cerrar-alerta');
    let temporizadorAlerta = null;

    function mostrarAlerta() {
        if (!alertaToast) return;
        alertaToast.classList.remove('oculto');
        
        clearTimeout(temporizadorAlerta);
        temporizadorAlerta = setTimeout(() => {
            alertaToast.classList.add('oculto');
        }, 3000);
    }

    if (cerrarAlerta) {
        cerrarAlerta.addEventListener('click', () => {
            if (alertaToast) alertaToast.classList.add('oculto');
        });
    }

    if (listaRecomendados && listaCola) {
        listaRecomendados.addEventListener('click', (evento) => {
            if (evento.target.classList.contains('boton-agregar-cola')) {
                const tarjetaOriginal = evento.target.closest('.tarjeta-video-lateral');
                if (!tarjetaOriginal) return;

                const nuevaTarjeta = tarjetaOriginal.cloneNode(true);
                const btnAgregar = nuevaTarjeta.querySelector('.boton-agregar-cola');
                
                if (btnAgregar) {
                    btnAgregar.className = 'boton-eliminar-cola';
                    btnAgregar.textContent = '✕';
                    btnAgregar.title = 'Eliminar de la cola';
                }

                listaCola.appendChild(nuevaTarjeta);
                activarHoverPreview(nuevaTarjeta);
                mostrarAlerta();
            }
        });
    }

    if (btnAnadirPrincipal) {
        btnAnadirPrincipal.addEventListener('click', () => {
            mostrarAlerta();
        });
    }

    if (listaCola) {
        listaCola.addEventListener('click', (evento) => {
            if (evento.target.classList.contains('boton-eliminar-cola')) {
                const tarjeta = evento.target.closest('.tarjeta-video-lateral');
                if (tarjeta) tarjeta.remove();
            }
        });
    }

    const botonLimpiarCola = document.getElementById('boton-limpiar-cola');
    if (botonLimpiarCola && listaCola) {
        botonLimpiarCola.addEventListener('click', () => {
            listaCola.innerHTML = '';
        });
    }

    /* ==========================================================================
       4. INTERACCIÓN 4: REPRODUCIR AL PASAR EL MOUSE (HOVER PREVIEW)
       ========================================================================== */
    function activarHoverPreview(contenedor) {
        const video = contenedor.querySelector('video');
        if (!video) return;

        contenedor.addEventListener('mouseenter', () => {
            video.muted = true;
            video.play().catch(() => {});
        });

        contenedor.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    }

    document.querySelectorAll('.tarjeta-video-horizontal, .tarjeta-video-lateral')
        .forEach(activarHoverPreview);

    /* Alternar Mostrar más / Mostrar menos */
    const botonMostrarMas = document.getElementById('boton-mostrar-mas');
    const textoDescripcion = document.getElementById('texto-descripcion');

    if (botonMostrarMas && textoDescripcion) {
        botonMostrarMas.addEventListener('click', () => {
            const estaCorta = textoDescripcion.classList.toggle('descripcion-corta');
            botonMostrarMas.textContent = estaCorta ? 'Mostrar más ▾' : 'Mostrar menos ▴';
        });
    }

});