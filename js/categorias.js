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
        listaCategorias.forEach(cat => {
            if (cat.id === 'galeria') {
                html += `
                    <button class="categoria-movil-btn" onclick="window.location.href='${urlDestinoGaleria}'"
                            style="border-left-color: ${cat.color};">
                        <i class="fas ${cat.icono}" style="color: ${cat.color};"></i>
                        <span>${cat.nombre}</span>
                    </button>
                `;
            } else {
                // OTRAS CATEGORÍAS: Muestran SweetAlert
                html += `
                    <button class="categoria-movil-btn" onclick="mostrarCategoriaMovil('${cat.id}')"
                            style="border-left-color: ${cat.color};">
                        <i class="fas ${cat.icono}" style="color: ${cat.color};"></i>
                        <span>${cat.nombre}</span>
                    </button>
                `;
            }
        });

        // Agregar botones de utilidad al final del menú móvil
        // Se eliminan Calificarnos, Ver Opiniones y Logros del menú móvil 
        // ya que ahora se accede exclusivamente desde el Perfil.
        html += `
            <div style="margin-top: 20px; padding: 20px; background: #fff9e6; border-radius: 30px; border: 2px solid #f1c40f; text-align: center;">
                <span style="display: block; color: #d4ac0d; font-weight: 700; font-size: 0.8rem; margin-bottom: 5px; text-transform: uppercase;">Puntuación de la página</span>
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <i class="fas fa-star" style="color: #f1c40f; font-size: 1.5rem;"></i>
                    <span id="valorPromedioGlobalMovil" style="color: #2c1b4e; font-weight: 800; font-size: 1.8rem;">0.0</span>
                </div>
            </div>
        `;
        contenedorBotonesActual.innerHTML = html;
    }
    
    // Función para mostrar categoría en móvil (SOLO PARA NO GALERÍA)
    window.mostrarCategoriaMovil = function(catId) {
        const categoria = categorias.find(c => c.id === catId);
        if (categoria) {
            mostrarTemasCategoriaMobile(categoria);
            cerrarMenu();
        }
    };
    
    // Abrir menú
    hamburguesaBtn.addEventListener('click', function() {
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
    
    cerrarBtn.addEventListener('click', cerrarMenu);
    overlay.addEventListener('click', cerrarMenu);
    
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
