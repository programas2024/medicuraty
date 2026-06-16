// ===== LÓGICA PARA COMPARTIR EN WHATSAPP =====
window.compartirWhatsApp = function(temaId) {
    const tema = temas.find(t => t.id === temaId);
    if (!tema) return;

    // Usamos el enlace de la página para que WhatsApp genere la vista previa
    const urlPagina = window.location.href;
    const textoBase = `✨ *${tema.nombre}* ✨\n\n"${tema.desc}"\n\n📍 Léelo aquí: ${urlPagina}\n\n_by Medicurativo_ 🌿`;
    const urlEncoded = encodeURIComponent(textoBase);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${urlEncoded}`;

    window.open(whatsappUrl, '_blank');
};

window.compartirImagenWhatsApp = function(url, titulo) {
    const texto = `📸 *${titulo}*\n\nMira esta reflexión en *Medicurativo*:\n🔗 ${window.location.origin}/${url}\n\n_by Medicurativo_ 🌿`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
};