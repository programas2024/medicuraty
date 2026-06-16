// ===== OPTIMIZACIÓN DE RENDIMIENTO =====

document.addEventListener('DOMContentLoaded', () => {

    // Manejo global de imágenes rotas (fallback) usando delegación de eventos
    // Esto captura errores incluso en imágenes que se cargan después de abrir un tema
    document.addEventListener('error', function (e) {
        if (e.target.tagName === 'IMG') {
            const img = e.target;
            
            // Si el logo de respaldo también falla, detenemos para evitar bucle infinito
            if (img.dataset.fallbackAttempted) return;

            if (!img.src.includes('logosmedi.png')) {
                console.warn(`Fallo de carga (Protocol Error/404): ${img.src}`);
                img.dataset.fallbackAttempted = "true";
                img.src = 'imganes/logosmedi.png';
                img.classList.add('img-error');
            }
        }
    }, true);
});