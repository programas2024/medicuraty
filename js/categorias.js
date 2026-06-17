// ===== MENÚ DE CATEGORÍAS PARA MÓVIL =====
document.addEventListener('DOMContentLoaded', function() {
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
        const listaCategorias = window.categorias || [];
        let html = '';
        listaCategorias.forEach(cat => {
            if (cat.id === 'galeria') {
                // ✅ GALERÍA: Redirige a galeria.html
                html += `
                    <button class="categoria-movil-btn" onclick="window.location.href='galeria.html'"
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
        html += `
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #f0e6ff; display: flex; flex-direction: column; gap: 12px;">
                <button class="categoria-movil-btn" onclick="document.getElementById('btnCalificar').click(); cerrarMenu();" style="border-left-color: #f1c40f;">
                    <i class="fas fa-star" style="color: #f1c40f;"></i>
                    <span>Calificarnos</span>
                </button>
                <button class="categoria-movil-btn" onclick="document.getElementById('btnVerOpiniones').click(); cerrarMenu();" style="border-left-color: #9b59b6;">
                    <i class="fas fa-comment-dots" style="color: #9b59b6;"></i>
                    <span>Ver Opiniones</span>
                </button>
                <button id="btnLogrosMovil" class="categoria-movil-btn" onclick="document.getElementById('btnLogros').click(); cerrarMenu();" style="border-left-color: #f1c40f; display: none;">
                    <i class="fas fa-trophy" style="color: #f1c40f;"></i>
                    <span>Mis Logros</span>
                </button>
            </div>
        `;
        contenedorBotones.innerHTML = html;
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
    } else {
        // Esperar a que cargue app.js
        setTimeout(generarBotonesCategorias, 500);
    }
});