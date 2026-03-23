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
        let html = '';
        categorias.forEach(cat => {
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
        menuMovil.classList.add('mostrar');
        overlay.classList.add('mostrar');
        document.body.style.overflow = 'hidden';
    });
    
    // Cerrar menú
    function cerrarMenu() {
        menuMovil.classList.remove('mostrar');
        overlay.classList.remove('mostrar');
        document.body.style.overflow = '';
    }
    
    cerrarBtn.addEventListener('click', cerrarMenu);
    overlay.addEventListener('click', cerrarMenu);
    
    // Generar botones
    if (typeof categorias !== 'undefined') {
        generarBotonesCategorias();
    } else {
        // Esperar a que cargue app.js
        setTimeout(generarBotonesCategorias, 500);
    }
});