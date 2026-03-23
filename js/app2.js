document.addEventListener('DOMContentLoaded', function() {
    
    const btnMision = document.getElementById('btnMision');
    const btnSoporte = document.getElementById('btnSoporte');
    const btnAgradecimientos = document.getElementById('btnAgradecimientos');
    
   
    if (btnMision) btnMision.addEventListener('click', window.mostrarMision);
    if (btnSoporte) btnSoporte.addEventListener('click', window.mostrarSoporte);
    if (btnAgradecimientos) btnAgradecimientos.addEventListener('click', window.mostrarAgradecimientos);
    
    
    
});

// Después de cargar las funciones, agrega:
document.getElementById('btnAyuda').addEventListener('click', function() {
    if (typeof mostrarAyudaGaleria === 'function') {
        mostrarAyudaGaleria();
    }
});