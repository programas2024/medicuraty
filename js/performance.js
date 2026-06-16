// ===== OPTIMIZACIÓN DE RENDIMIENTO =====

document.addEventListener('DOMContentLoaded', () => {
    // Precarga de imágenes de temas para evitar "parpadeo" blanco
    if (typeof temas !== 'undefined' && Array.isArray(temas)) {
        temas.forEach(tema => {
            if (tema.imagen && tema.imagen.trim() !== '') {
                const img = new Image();
                // Si la imagen falla o no existe, simplemente lo ignoramos sin ensuciar la consola
                img.onerror = () => {}; 
                img.src = `imganes/${tema.imagen}`;
            }
        });
    }

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