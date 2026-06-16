// ===== OPTIMIZACIÓN DE RENDIMIENTO =====

document.addEventListener('DOMContentLoaded', () => {

    // Manejo global de imágenes rotas (fallback) usando delegación de eventos
    // Esto captura errores incluso en imágenes que se cargan después de abrir un tema
    document.addEventListener('error', function (e) {
        if (e.target.tagName === 'IMG') {
            const img = e.target;
            if (!img.src.includes('imganes/logosmedi.png')) {
                img.src = 'imganes/logosmedi.png';
                img.classList.add('img-error');
            }
        }
    }, true);
});