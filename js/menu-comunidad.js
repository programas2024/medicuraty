// ===== MENÚ HAMBURGUESA PARA COMUNIDAD (SOLO 3 BOTONES + RANKING) =====
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que el DOM esté listo
    const hamburguesaBtn = document.getElementById('categoriasHamburguesa');
    const menuMovil = document.getElementById('menuCategoriasMovil');
    const cerrarBtn = document.getElementById('cerrarCategorias');
    const contenedorBotones = document.getElementById('categoriasMovilBotones');
    
    // Si no existen los elementos, salir
    if (!hamburguesaBtn || !menuMovil || !contenedorBotones) {
        console.log('Menú no encontrado en esta página');
        return;
    }
    
    // Crear overlay
    let overlay = document.querySelector('.categorias-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'categorias-overlay';
        document.body.appendChild(overlay);
    }
    
    // ===== GENERAR LOS BOTONES (3 + RANKING) =====
    function generarBotonesMenu() {
        contenedorBotones.innerHTML = `
            <!-- Botón Misión -->
            <button class="categoria-movil-btn no-cerrar-menu" onclick="window.mostrarMision()" style="border-left-color: #9b59b6;">
                <i class="fas fa-bullseye" style="color: #9b59b6; width: 24px; text-align: center;"></i>
                <span>Misión</span>
            </button>
            
            <!-- Botón Soporte -->
            <button class="categoria-movil-btn no-cerrar-menu" onclick="window.mostrarSoporte()" style="border-left-color: #9b59b6;">
                <i class="fas fa-headset" style="color: #9b59b6; width: 24px; text-align: center;"></i>
                <span>Soporte</span>
            </button>
            
            <!-- Botón Gracias -->
            <button class="categoria-movil-btn no-cerrar-menu" onclick="window.mostrarAgradecimientos()" style="border-left-color: #9b59b6;">
                <i class="fas fa-heart" style="color: #9b59b6; width: 24px; text-align: center;"></i>
                <span>Gracias</span>
            </button>
            
            <!-- Botón en el menú hamburguesa -->
<button class="categoria-movil-btn no-cerrar-menu" onclick="window.abrirRanking()" style="border-left-color: #f1c40f;">
    <i class="fas fa-trophy" style="color: #f1c40f;"></i>
    <span>🏆 Ranking</span>
</button>
            
            <!-- Separador decorativo -->
            <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid rgba(155, 89, 182, 0.1);">
                <p style="font-size: 0.7rem; color: #b0a4c4; text-align: center; margin: 0;">
                    <i class="fas fa-heart" style="color: #9b59b6;"></i> 
                    Medicurativo · comunidad
                </p>
            </div>
        `;
    }
    
    // ===== FUNCIONES PARA ABRIR Y CERRAR MENÚ =====
    function abrirMenu() {
        menuMovil.classList.add('mostrar');
        overlay.classList.add('mostrar');
        document.body.style.overflow = 'hidden';
    }
    
    function cerrarMenu() {
        menuMovil.classList.remove('mostrar');
        overlay.classList.remove('mostrar');
        document.body.style.overflow = '';
    }
    
    // ===== EVENTOS =====
    // Abrir menú al hacer clic en hamburguesa
    hamburguesaBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (menuMovil.classList.contains('mostrar')) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    });
    
    // Cerrar con botón X
    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            cerrarMenu();
        });
    }
    
    // Cerrar al hacer clic en el overlay
    overlay.addEventListener('click', function(e) {
        e.stopPropagation();
        cerrarMenu();
    });
    
    // Prevenir que los botones con clase 'no-cerrar-menu' cierren el menú
    document.addEventListener('click', function(e) {
        const target = e.target.closest('.no-cerrar-menu');
        if (target) {
            e.stopPropagation();
            // El menú NO se cierra
            return false;
        }
    });
    
    // Cerrar menú al presionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuMovil.classList.contains('mostrar')) {
            cerrarMenu();
        }
    });
    
    // ===== INICIALIZAR =====
    generarBotonesMenu();
    console.log('✅ Menú de comunidad inicializado (3 botones + Ranking)');
});