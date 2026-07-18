// ===== MENÚ DE CATEGORÍAS PARA MÓVIL =====
document.addEventListener('DOMContentLoaded', function() {
    // Si estamos en la galería, no manejamos el menú aquí para evitar conflictos con su lógica propia
    const esPaginaGaleria = window.location.pathname.includes('galeria.html') || window.location.pathname.includes('galeria2.html');
    if (esPaginaGaleria) return;

    const hamburguesaBtn = document.getElementById('categoriasHamburguesa');
    const menuMovil = document.getElementById('menuCategoriasMovil');
    const cerrarBtn = document.getElementById('cerrarCategorias');
    const contenedorBotones = document.getElementById('categoriasMovilBotones');
    
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'categorias-overlay';
    overlay.id = 'overlayMenuMovil';
    document.body.appendChild(overlay);
    
    // Generar botones de categorías para móvil
    function generarBotonesCategorias() {
        const contenedorBotonesActual = document.getElementById('categoriasMovilBotones');
        if (!contenedorBotonesActual) return;

        // En la galería no queremos sobrescribir el menú de secciones (Completa/Destacados/Recientes)
        if (esPaginaGaleria) return;

        const listaCategorias = window.categorias || [];
        // Detectar si estamos en index para decidir el destino de galería
        const esPaginaIndex = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
        const urlDestinoGaleria = esPaginaIndex ? 'galeria2.html' : 'galeria.html';

        let html = '';
        
        // ========== SECCIÓN DE CATEGORÍAS ==========
        html += `
            <div style="margin-bottom: 15px;">
                <p style="font-size: 0.75rem; color: #9b59b6; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 10px; padding-left: 5px;">
                    <i class="fas fa-tags" style="margin-right: 8px;"></i>Categorías
                </p>
            </div>
        `;
        
        listaCategorias.forEach(cat => {
            // Determinar el icono de la categoría
            let icono = cat.icono || 'fa-bookmark';
            let color = cat.color || '#9b59b6';
            
            if (cat.id === 'galeria') {
                html += `
                    <button class="categoria-movil-btn" onclick="window.location.href='${urlDestinoGaleria}'"
                            style="border-left-color: ${color};">
                        <i class="fas ${icono}" style="color: ${color};"></i>
                        <span>${cat.nombre}</span>
                    </button>
                `;
            } else {
                html += `
                    <button class="categoria-movil-btn" onclick="mostrarCategoriaMovil('${cat.id}')"
                            style="border-left-color: ${color};">
                        <i class="fas ${icono}" style="color: ${color};"></i>
                        <span>${cat.nombre}</span>
                    </button>
                `;
            }
        });

        // ========== SECCIÓN DE ACCESOS RÁPIDOS (ESTILO UNIFICADO) ==========
        html += `
            <div style="margin-top: 25px; padding-top: 20px; border-top: 2px solid rgba(155, 89, 182, 0.15);">
                <p style="font-size: 0.75rem; color: #9b59b6; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 12px; padding-left: 5px;">
                    <i class="fas fa-bolt" style="margin-right: 8px;"></i>Accesos rápidos
                </p>
                
                <!-- Botón Misión -->
                <button class="categoria-movil-btn no-cerrar-menu" onclick="window.mostrarMision()" 
                        style="border-left-color: #9b59b6;">
                    <i class="fas fa-bullseye" style="color: #9b59b6;"></i>
                    <span>Misión</span>
                </button>
                
                <!-- Botón Soporte (solo en principal) -->
                ${window.location.pathname.includes('principal.html') ? `
                <button class="categoria-movil-btn no-cerrar-menu" onclick="window.mostrarSoporte()" 
                        style="border-left-color: #9b59b6;">
                    <i class="fas fa-headset" style="color: #9b59b6;"></i>
                    <span>Soporte</span>
                </button>
                ` : ''}
                
                <!-- Botón Gracias -->
                <button class="categoria-movil-btn no-cerrar-menu" onclick="window.mostrarAgradecimientos()" 
                        style="border-left-color: #9b59b6;">
                    <i class="fas fa-heart" style="color: #9b59b6;"></i>
                    <span>Gracias</span>
                </button>
                
                <!-- Botón Opiniones -->
                <button class="categoria-movil-btn no-cerrar-menu" onclick="window.verOpinionesSweetAlert()" 
                        style="border-left-color: #9b59b6;">
                    <i class="fas fa-comment-dots" style="color: #9b59b6;"></i>
                    <span>Opiniones</span>
                </button>
                
                <!-- Botón Aporte -->
                <button class="categoria-movil-btn no-cerrar-menu" onclick="window.abrirAporteMovil()" 
                        style="border-left-color: #9b59b6;">
                    <i class="fas fa-envelope-open-text" style="color: #9b59b6;"></i>
                    <span>Aporte</span>
                </button>
                
                <!-- Botón Quiénes Somos -->
                <button class="categoria-movil-btn no-cerrar-menu" onclick="window.location.href='quienes.html'" 
                        style="border-left-color: #9b59b6;">
                    <i class="fas fa-users" style="color: #9b59b6;"></i>
                    <span>Quiénes Somos</span>
                </button>
                
                <!-- Botón Play (NUEVO) -->
                <button class="categoria-movil-btn no-cerrar-menu" onclick="window.location.href='play.html'" 
                        style="border-left-color: #9b59b6;">
                    <i class="fas fa-play" style="color: #9b59b6;"></i>
                    <span>Play</span>
                </button>
            </div>
        `;

        // ========== CALIFICACIÓN DE LA PÁGINA (ESTILO UNIFICADO) ==========
        html += `
            <div style="margin-top: 25px; padding: 15px 20px; background: linear-gradient(135deg, #f8f2ff 0%, #f0e8ff 100%); border-radius: 30px; border: 2px solid rgba(155, 89, 182, 0.2); text-align: center;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
                    <i class="fas fa-star" style="color: #f1c40f; font-size: 1.2rem;"></i>
                    <span style="color: #6c4b7e; font-weight: 600; font-size: 0.85rem;">Valoración:</span>
                    <span id="valorPromedioGlobalMovil" style="color: #2c1b4e; font-weight: 800; font-size: 1.4rem;">0.0</span>
                    <span style="color: #9b59b6; font-size: 0.75rem;">/ 5.0</span>
                </div>
                <div style="width: 100%; height: 4px; background: rgba(155, 89, 182, 0.1); border-radius: 4px; margin-top: 8px; overflow: hidden;">
                    <div id="barraPromedioMovil" style="width: 0%; height: 100%; background: linear-gradient(90deg, #9b59b6, #f1c40f); border-radius: 4px; transition: width 0.8s ease;"></div>
                </div>
                <p style="font-size: 0.6rem; color: #b0a4e3; margin-top: 6px; letter-spacing: 0.3px;">
                    <i class="fas fa-users" style="margin-right: 4px;"></i> Basado en opiniones de la comunidad
                </p>
            </div>
        `;

        contenedorBotonesActual.innerHTML = html;
        
        // Actualizar la barra de progreso después de renderizar
        setTimeout(() => {
            actualizarBarraPromedio();
        }, 100);
    }
    
    // Función para actualizar la barra de promedio
    function actualizarBarraPromedio() {
        const valorElement = document.getElementById('valorPromedioGlobalMovil');
        const barraElement = document.getElementById('barraPromedioMovil');
        
        if (valorElement && barraElement) {
            const valor = parseFloat(valorElement.textContent) || 0;
            const porcentaje = (valor / 5) * 100;
            barraElement.style.width = Math.min(porcentaje, 100) + '%';
        }
    }
    
    // Función para mostrar categoría en móvil (SOLO PARA NO GALERÍA)
    window.mostrarCategoriaMovil = function(catId) {
        const categoria = categorias.find(c => c.id === catId);
        if (categoria) {
            mostrarTemasCategoriaMobile(categoria);
            cerrarMenu();
        }
    };

    window.abrirAporteMovil = function() {
        const btnBuzon = document.getElementById('btnBuzon');
        if (btnBuzon) {
            btnBuzon.click();
            return;
        }
        if (typeof window.mostrarNovedades === 'function') {
            window.mostrarNovedades(null);
        }
    };
    
    // ========== CONTROL DEL MENÚ MEJORADO ==========
    // Abrir menú
    hamburguesaBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Sincronizar visibilidad de logros (si el wrapper original tiene display flex activo por JS)
        const wrapperOrig = document.getElementById('wrapperLogros');
        const btnLogrosMovil = document.getElementById('btnLogrosMovil');
        if (wrapperOrig && btnLogrosMovil) {
            btnLogrosMovil.style.display = (wrapperOrig.style.display === 'flex') ? 'flex' : 'none';
        }

        menuMovil.classList.add('mostrar');
        overlay.classList.add('mostrar');
        document.body.style.overflow = 'hidden';
    });
    
    // Cerrar menú
    window.cerrarMenu = function() {
        menuMovil.classList.remove('mostrar');
        overlay.classList.remove('mostrar');
        document.body.style.overflow = '';
    }
    
    cerrarBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        cerrarMenu();
    });
    
    overlay.addEventListener('click', function(e) {
        e.stopPropagation();
        cerrarMenu();
    });
    
    // ========== PREVENIR QUE LOS BOTONES CIERREN EL MENÚ ==========
    // Usar delegación de eventos para los botones con clase 'no-cerrar-menu'
    document.addEventListener('click', function(e) {
        const target = e.target.closest('.no-cerrar-menu');
        if (target) {
            e.stopPropagation();
            // El menú NO se cierra
            return false;
        }
    });
    
    // ========== ACTUALIZAR PROMEDIO CUANDO CAMBIE ==========
    // Escuchar cambios en el promedio global
    const observerPromedio = new MutationObserver(function() {
        const valorElement = document.getElementById('valorPromedioGlobalMovil');
        const barraElement = document.getElementById('barraPromedioMovil');
        
        if (valorElement && barraElement) {
            const valor = parseFloat(valorElement.textContent) || 0;
            const porcentaje = (valor / 5) * 100;
            barraElement.style.width = Math.min(porcentaje, 100) + '%';
        }
    });
    
    // Esperar a que el elemento exista y observarlo
    setTimeout(() => {
        const valorElement = document.getElementById('valorPromedioGlobalMovil');
        if (valorElement) {
            observerPromedio.observe(valorElement, { childList: true, characterData: true, subtree: true });
        }
    }, 500);
    
    // Generar botones
    if (window.categorias) {
        generarBotonesCategorias();
        // Forzar actualización del promedio real una vez creado el elemento en el menú
        if (typeof window.actualizarPromedioGlobal === 'function') {
            window.actualizarPromedioGlobal();
        }
    } else {
        // Esperar a que cargue app.js
        setTimeout(() => {
            generarBotonesCategorias();
            if (typeof window.actualizarPromedioGlobal === 'function') {
                window.actualizarPromedioGlobal();
            }
        }, 500);
    }
});