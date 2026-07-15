// 1. Cargar y aplicar preferencia de tema INMEDIATAMENTE para evitar parpadeo blanco
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// Inicializar Supabase
const supabaseUrl = 'https://eryakdyoscrctqunqkvt.supabase.co';
const supabaseKey = 'sb_publishable_ekj-F2tgLWWOGHuFCSyx-g_8_moXDKa';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Hacer supabaseClient global para que otros scripts lo usen
window.supabaseClient = supabaseClient;

// ===== FUNCIÓN PARA DETECTAR DESTINO DEL BOTÓN INICIO =====
// ===== FUNCIÓN PARA DETECTAR DESTINO DEL BOTÓN INICIO =====
// ===== FUNCIÓN PARA DETECTAR DESTINO DEL BOTÓN INICIO =====
// ===== FUNCIÓN PARA DETECTAR DESTINO DEL BOTÓN INICIO =====
async function getDestinoInicio() {
    const path = window.location.pathname;
    
    const esIndex = path.includes('index.html') || path.endsWith('/') || path === '';
    const esPrincipal = path.includes('principal.html');
    const esComunidad = path.includes('comunidad.html');
    const esDiario = path.includes('diario.html');
    const esGaleria = path.includes('galeria.html') || path.includes('galeria2.html');
    const esLogin = path.includes('login.html');
    const esRestablecer = path.includes('restablecer.html');
    
    // Si estamos en index, login o restablecer, ir a index
    if (esIndex || esLogin || esRestablecer) return 'index.html';
    
    // 🔥 FORZAR RECARGA DE SESIÓN (más confiable)
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    const tieneSesion = session !== null;
    
    // 🔥 TAMBIÉN VERIFICAR CON getSession() otra vez por si acaso
    if (!tieneSesion) {
        // Intentar refrescar la sesión
        const { data: { session: refreshedSession } } = await supabaseClient.auth.getSession();
        if (refreshedSession) {
            return 'principal.html';
        }
        return 'index.html';
    }
    
    // Si estamos en una página protegida y hay sesión -> ir a principal
    if ((esPrincipal || esComunidad || esDiario || esGaleria) && tieneSesion) {
        return 'principal.html';
    }
    
    return 'index.html';
}

// ============================================================
// FUNCIÓN PARA OCULTAR EL SALUDO
// ============================================================
function ocultarSaludo() {
    const contenedorSaludo = document.getElementById('contenedorSaludo');
    if (contenedorSaludo) {
        contenedorSaludo.style.display = 'none';
    }
    
    // También ocultar cualquier elemento relacionado con el usuario
    const spanNombre = document.getElementById('usuarioNombreLogueado');
    if (spanNombre) {
        spanNombre.textContent = '';
    }
    
    console.log('👋 Saludo ocultado (sesión cerrada)');
}
// ===== ACTUALIZAR BOTÓN INICIO =====
// ===== FUNCIÓN PARA ACTUALIZAR BOTÓN INICIO =====
async function actualizarBotonInicio() {
    const linkInicio = document.getElementById('btnInicioLink');
    if (!linkInicio) return;
    
    try {
        if (typeof window.supabaseClient === 'undefined' || !window.supabaseClient) {
            setTimeout(actualizarBotonInicio, 500);
            return;
        }
        
        // ✅ USAR await (es asíncrono)
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        const tieneSesion = session !== null;
        
        if (tieneSesion) {
            linkInicio.href = 'principal.html';
            console.log('🔗 Botón inicio → principal.html (logueado)');
        } else {
            linkInicio.href = 'index.html';
            console.log('🔗 Botón inicio → index.html (no logueado)');
        }
    } catch (error) {
        console.warn('Error al actualizar botón inicio:', error);
        linkInicio.href = 'index.html';
    }
}
// ===== BASE DE DATOS =====

// Sonido de interfaz (Click suave)
const clickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
clickSound.volume = 0.2;
window.clickSound = clickSound;

const successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');
successSound.volume = 0.3;
window.successSound = successSound;

const achievementSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
achievementSound.volume = 0.4;
window.achievementSound = achievementSound;

const temas = [
    // Valores (11 temas)
    { id: 1, nombre: "Apreciate", cat: "valores", icono: "fa-star", desc: "El primer paso para sanar es valorarte a ti mismo.", imagen: "apreciate.png" },
    { id: 2, nombre: "Persona individual", cat: "valores", icono: "fa-user", desc: "Cada persona es única y merece respeto.", imagen: "indivudual.png" },
    { id: 3, nombre: "El respeto", cat: "valores", icono: "fa-handshake", desc: "Base de toda relación saludable.", imagen: "respeto.png" },
    { id: 4, nombre: "La honestidad", cat: "valores", icono: "fa-gem", desc: "Ser auténtico contigo y con los demás.", imagen: "honestidad.png" },
    { id: 5, nombre: "La confianza", cat: "valores", icono: "fa-lock", desc: "Se construye con pequeños actos diarios.", imagen: "confianza.png" },
    { id: 6, nombre: "Un amigo de verdad te entiende sin hablar", cat: "valores", icono: "fa-user-group", desc: "La conexión verdadera va más allá de las palabras.", imagen: "amigo_verdad.jpeg" },
    { id: 7, nombre: "El compartir", cat: "valores", icono: "fa-hands", desc: "Lo que compartes se multiplica.", imagen: "compartir.png" },
    { id: 8, nombre: "Los detalles", cat: "valores", icono: "fa-gift", desc: "Pequeñas acciones, grandes significados.", imagen: "detalles.png" },
    { id: 9, nombre: "La discreción", cat: "valores", icono: "fa-eye-slash", desc: "Saber guardar silencio también es sabiduría.", imagen: "discrecion.png" },
    { id: 10, nombre: "Una persona leal", cat: "valores", icono: "fa-shield-heart", desc: "La lealtad no se exige, se demuestra.", imagen: "gatoperro.jpeg" },
    { id: 11, nombre: "Aprecia lo que tienes", cat: "valores", icono: "fa-heart", desc: "La gratitud transforma tu mirada.", imagen: "aprecia.png" },
    
    // Crecimiento (9 temas)
    { id: 12, nombre: "Es tu momento", cat: "crecimiento", icono: "fa-clock", desc: "El momento de actuar es ahora.", imagen: "tu_momento.png" },
    { id: 13, nombre: "La persistencia", cat: "crecimiento", icono: "fa-arrow-trend-up", desc: "Caer está permitido, levantarse es obligatorio.", imagen: "koala.jpeg" },
    { id: 14, nombre: "La comunicación asertiva", cat: "crecimiento", icono: "fa-comments", desc: "Decir lo que sientes sin herir.", imagen: "comunicacion_asertiva.png" },
    { id: 15, nombre: "Las críticas", cat: "crecimiento", icono: "fa-message", desc: "Aprende de ellas, no te paralices.", imagen: "criticas.png" },
    { id: 16, nombre: "Las oportunidades", cat: "crecimiento", icono: "fa-door-open", desc: "Llegan cuando menos lo esperas.", imagen: "oportunidades.png" },
    { id: 17, nombre: "Progratinar", cat: "crecimiento", icono: "fa-calendar-xmark", desc: "Hoy es el mejor día para empezar.", imagen: "progratinar.png" },
    { id: 18, nombre: "El trabajo", cat: "crecimiento", icono: "fa-briefcase", desc: "Más que obligación, es propósito.", imagen: "trabajo.png" },
    { id: 19, nombre: "La dedicación", cat: "crecimiento", icono: "fa-clock", desc: "El esfuerzo constante da frutos.", imagen: "dedicacion.png" },
    { id: 20, nombre: "El camino hacia el éxito", cat: "crecimiento", icono: "fa-road", desc: "Disfruta cada paso, no solo la meta.", imagen: "camino_exito.png" },
    
    // Emociones (4 temas)
    { id: 21, nombre: "Autocontrol", cat: "emociones", icono: "fa-scale-balanced", desc: "Gestionar tus emociones es poder.", imagen: "autocontrol.png" },
    { id: 22, nombre: "La emoción más poderosa", cat: "emociones", icono: "fa-fire", desc: "El amor lo transforma todo.", imagen: "emocion_poderosa.png" },
    { id: 23, nombre: "Las emociones", cat: "emociones", icono: "fa-face-smile", desc: "Todas son válidas, todas importan.", imagen: "emociones.png" },
    { id: 24, nombre: "El bullying", cat: "emociones", icono: "fa-hand-fist", desc: "Hablemos para sanar.", imagen: "bullying.png" },
    
    // Liderazgo (4 temas)
    { id: 25, nombre: "Lo que debe tener un líder", cat: "liderazgo", icono: "fa-medal", desc: "Humildad, visión y empatía.", imagen: "lider.png" },
    { id: 26, nombre: "Moral y ética", cat: "liderazgo", icono: "fa-scale-balanced", desc: "El carácter define al líder.", imagen: "moral_etica.png" },
    { id: 27, nombre: "El liderazgo", cat: "liderazgo", icono: "fa-people-arrows", desc: "Influyes siempre, aunque no lo sepas.", imagen: "liderazgo.png" }, 
    { id: 28, nombre: "Los profesionales", cat: "liderazgo", icono: "fa-briefcase", desc: "La excelencia es un hábito.", imagen: "profesionales.png" },
    
    // Especial (3 temas)
    { id: 29, nombre: "Una frase del día", cat: "especial", icono: "fa-quote-left", desc: "Pequeñas dosis de inspiración.", imagen: "frase_dia.png" },
    { id: 30, nombre: "Feliz día de la mujer", cat: "especial", icono: "fa-venus", desc: "Celebremos cada día.", imagen: "dia_mujer.png" },
    { id: 31, nombre: "El aprecio a la mujer", cat: "especial", icono: "fa-star", desc: "Reconocimiento y gratitud.", imagen: "aprecio_mujer.png" }
];

// Categorías con colores (INCLUYENDO GALERÍA Y COMUNIDAD)
const categorias = [
    { id: 'valores', nombre: 'Valores', icono: 'fa-hand-sparkles', color: '#1e6f9c', colorFondo: '#0a3b55' },
    { id: 'crecimiento', nombre: 'Crecimiento', icono: 'fa-seedling', color: '#8e44ad', colorFondo: '#4a2360' },
    { id: 'emociones', nombre: 'Emociones', icono: 'fa-heart', color: '#c44569', colorFondo: '#822b4a' },
    { id: 'liderazgo', nombre: 'Liderazgo', icono: 'fa-crown', color: '#0e7c5c', colorFondo: '#064e39' },
    { id: 'especial', nombre: 'Especiales', icono: 'fa-gem', color: '#e67e22', colorFondo: '#a55c17' },
    { id: 'galeria', nombre: 'Galería', icono: 'fa-images', color: '#9b59b6', colorFondo: '#4a2360' },
    { id: 'comunidad', nombre: 'Comunidad', icono: 'fa-users', color: '#27ae60', colorFondo: '#1a6a3e' }
];

// Elementos DOM
const menuHorizontal = document.getElementById('menuHorizontal');
const temaPrincipal = document.getElementById('temaPrincipal');
const esPaginaGaleria = window.location.pathname.includes('galeria.html') || window.location.pathname.includes('galeria2.html');
const esPaginaComunidad = window.location.pathname.includes('comunidad.html');

// Hacer temaPrincipal global para otros scripts
window.temaPrincipal = temaPrincipal;
window.categorias = categorias;
window.temas = temas;

// ===== FUNCIÓN DE ZOOM PARA IMÁGENES =====
window.abrirImagenZoom = function(url, titulo) {
    Swal.fire({
        imageUrl: url,
        imageAlt: titulo,
        title: titulo,
        showCloseButton: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-popup-redondo'
        }
    });
};

// ===== DETECTAR SI ES MÓVIL =====
function isMobile() {
    return window.innerWidth <= 768;
}

// ===== FUNCIÓN PARA MOSTRAR TEMAS DE UNA CATEGORÍA EN SWEETALERT (MÓVIL) =====
window.mostrarTemasCategoriaMobile = function(categoria) {
    // Si es la categoría "comunidad" o "galeria", redirigir directamente
    if (categoria.id === 'comunidad') {
        const esPaginaIndex = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
        const urlDestino = esPaginaIndex ? 'comunidad.html' : 'comunidad.html';
        window.location.href = urlDestino;
        return;
    }
    
    if (categoria.id === 'galeria') {
        const esPaginaIndex = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
        const urlDestino = esPaginaIndex ? 'galeria2.html' : 'galeria.html';
        window.location.href = urlDestino;
        return;
    }
    
    const temasCat = temas.filter(t => t.cat === categoria.id);
    
    let temasHTML = '<div style="max-height: 400px; overflow-y: auto; padding: 5px; scrollbar-width: none;">';
    
    temasCat.forEach(tema => {
        temasHTML += `
            <div onclick="seleccionarTemaDesdeAlert(${tema.id})" 
                 style="display: flex; align-items: center; gap: 15px; padding: 15px; margin: 8px 0; 
                        background: #f8f2ff; border-radius: 40px; cursor: pointer; 
                        border-left: 6px solid ${categoria.color}; transition: 0.2s;">
                <i class="fas ${tema.icono}" style="font-size: 24px; color: ${categoria.color}; width: 30px;"></i>
                <span style="font-size: 16px; font-weight: 500; color: #1d1a2f;">${tema.nombre}</span>
            </div>
        `;
    });
    
    temasHTML += '</div>';
    
    Swal.fire({
        title: `<span style="font-size: 24px; font-weight: 600; color: ${categoria.color};">${categoria.nombre}</span>`,
        html: temasHTML,
        showCloseButton: true,
        showConfirmButton: false,
        background: '#fff9ff',
        customClass: {
            popup: 'swal-popup-categoria'
        },
        width: '90%'
    });
};

// ===== SELECCIONAR TEMA DESDE EL ALERT =====
window.seleccionarTemaDesdeAlert = function(id) {
    Swal.close();
    const tema = temas.find(t => t.id === id);
    if (tema) mostrarTema(tema);
};

// ===== FUNCIÓN PARA MOSTRAR TEMA CON IMAGEN PERSONALIZADA =====
function mostrarTema(tema) {
    if (tema.cat === 'galeria') {
        if (typeof window.mostrarGaleria === 'function') {
            window.mostrarGaleria();
        } else {
            temaPrincipal.innerHTML = '<div class="placeholder-text"><i class="fas fa-exclamation-triangle"></i><p>Error al cargar la galería</p></div>';
        }
        return;
    }
    
    const categoria = categorias.find(c => c.id === tema.cat);
    const colorBorde = categoria ? categoria.color : '#8e44ad';

    const tieneImagen = tema.imagen && tema.imagen.trim() !== '';
    const imagenHTML = tieneImagen ? `
        <div class="tema-personalizado-imagen">
            <img src="imganes/${tema.imagen}" alt="${tema.nombre}" loading="lazy" onerror="this.src='imganes/logosmedi.png'">
        </div>` : '';

    temaPrincipal.innerHTML = `
        <div class="tema-personalizado animacion-entrada ${!tieneImagen ? 'sin-imagen' : ''}">
            <div class="tema-personalizado-texto">
                <div class="icono-gigante"><i class="fas ${tema.icono}" style="color: ${colorBorde}"></i></div>
                <h2>${tema.nombre}</h2>
                <div class="descripcion-personalizada">${tema.desc}</div>
                <button class="btn-compartir" onclick="compartirWhatsApp(${tema.id})">
                    <i class="fab fa-whatsapp"></i> Compartir reflexión
                </button>
            </div>
            ${imagenHTML}
        </div>
    `;
    
    temaPrincipal.style.borderLeftColor = colorBorde;
}

// ===== FUNCIÓN PARA CERRAR SUBMENÚS =====
function cerrarTodosSubmenus() {
    document.querySelectorAll('.submenu').forEach(sub => {
        sub.classList.remove('mostrar');
    });
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('activo');
    });
}

// ===== FUNCIÓN PARA CONSTRUIR MENÚ ADAPTABLE (CON COMUNIDAD COMO ENLACE DIRECTO) =====
function construirMenuAdaptable(filtro = '') {
    if (!menuHorizontal) return;
    let html = '';
    const mobile = isMobile();
    const esPaginaIndex = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
    const urlDestinoGaleria = esPaginaIndex ? 'galeria2.html' : 'galeria.html';
    const urlDestinoComunidad = esPaginaIndex ? 'comunidad.html' : 'comunidad.html';
    
    categorias.forEach(cat => {
        // ===== CATEGORÍA GALERÍA (ENLACE DIRECTO) =====
        if (cat.id === 'galeria') {
            html += `
                <button class="menu-btn-categoria" onclick="window.location.href='${urlDestinoGaleria}'"
                        style="border-left: 5px solid ${cat.color};">
                    <i class="fas ${cat.icono}" style="color: ${cat.color};"></i>
                    <span>${cat.nombre}</span>
                </button>
            `;
        } 
        // ===== CATEGORÍA COMUNIDAD (ENLACE DIRECTO - TANTO PC COMO MÓVIL) =====
        else if (cat.id === 'comunidad') {
            html += `
                <button class="menu-btn-categoria" onclick="window.location.href='${urlDestinoComunidad}'"
                        style="border-left: 5px solid ${cat.color};">
                    <i class="fas ${cat.icono}" style="color: ${cat.color};"></i>
                    <span>${cat.nombre}</span>
                </button>
            `;
        }
        // ===== OTRAS CATEGORÍAS (valores, crecimiento, etc.) =====
        else {
            if (mobile) {
                html += `
                    <button class="menu-btn-categoria" onclick="window.mostrarTemasCategoriaMobile(${JSON.stringify(cat).replace(/"/g, '&quot;')})"
                            style="border-left: 5px solid ${cat.color};">
                        <i class="fas ${cat.icono}" style="color: ${cat.color};"></i>
                        <span>${cat.nombre}</span>
                    </button>
                `;
            } else {
                const temasCat = temas.filter(t => 
                    t.cat === cat.id && 
                    t.nombre.toLowerCase().includes(filtro.toLowerCase())
                );

                if (temasCat.length === 0 && filtro !== '') return;

                html += `
                    <div class="menu-item" data-cat="${cat.id}">
                        <div class="btn-con-tooltip">
                            <button class="menu-btn" onclick="toggleSubmenu(event, '${cat.id}')">
                                <i class="fas ${cat.icono}"></i>
                                <span>${cat.nombre}</span>
                            </button>
                            <span class="tooltip">Ver ${cat.nombre}</span>
                        </div>
                        <div class="submenu ${cat.id}" id="submenu-${cat.id}" style="border-color: ${cat.color}">
                            ${temasCat.map(t => `
                                <div class="tema-link" onclick="seleccionarTema(${t.id})">
                                    <i class="fas ${t.icono}" style="color: ${cat.color}"></i>
                                    <span>${t.nombre}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        }
    });
    
    menuHorizontal.innerHTML = html;
}

// ===== FUNCIÓN PARA ACTUALIZAR MENÚ MÓVIL (HAMBURGUESA) =====
function actualizarMenuMovil() {
    const menuMovilBotones = document.getElementById('categoriasMovilBotones');
    if (!menuMovilBotones) return;
    
    const esPaginaIndex = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
    const urlDestinoGaleria = esPaginaIndex ? 'galeria2.html' : 'galeria.html';
    const urlDestinoComunidad = esPaginaIndex ? 'comunidad.html' : 'comunidad.html';
    
    let html = '';
    
    categorias.forEach(cat => {
        if (cat.id === 'galeria') {
            html += `
                <button class="categoria-movil-btn" onclick="window.location.href='${urlDestinoGaleria}'" style="border-left-color: ${cat.color};">
                    <i class="fas ${cat.icono}" style="color: ${cat.color};"></i>
                    <span>${cat.nombre}</span>
                </button>
            `;
        } else if (cat.id === 'comunidad') {
            html += `
                <button class="categoria-movil-btn" onclick="window.location.href='${urlDestinoComunidad}'" style="border-left-color: ${cat.color};">
                    <i class="fas ${cat.icono}" style="color: ${cat.color};"></i>
                    <span>${cat.nombre}</span>
                </button>
            `;
        } else {
            // Otras categorías (valores, crecimiento, etc.)
            html += `
                <button class="categoria-movil-btn" onclick="window.mostrarTemasCategoriaMobile(${JSON.stringify(cat).replace(/"/g, '&quot;')})" style="border-left-color: ${cat.color};">
                    <i class="fas ${cat.icono}" style="color: ${cat.color};"></i>
                    <span>${cat.nombre}</span>
                </button>
            `;
        }
    });
    
    menuMovilBotones.innerHTML = html;
}

// ===== FUNCIONES PARA PC =====
window.toggleSubmenu = function(e, catId) {
    const event = (e && e.stopPropagation) ? e : null;
    const id = event ? catId : e;

    if (event) event.stopPropagation();
    
    const submenu = document.getElementById(`submenu-${id}`);
    const btn = event ? event.currentTarget : null;
    
    if (submenu && submenu.classList.contains('mostrar')) {
        submenu.classList.remove('mostrar');
        if (btn) btn.classList.remove('activo');
    } else {
        cerrarTodosSubmenus();
        if (submenu) submenu.classList.add('mostrar');
        if (btn) btn.classList.add('activo');
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log("Audio requiere interacción previa"));
    }
};

window.seleccionarTema = function(id) {
    if (id === 999) {
        if (typeof window.mostrarGaleria === 'function') {
            window.mostrarGaleria();
        } else {
            temaPrincipal.innerHTML = '<div class="placeholder-text"><i class="fas fa-exclamation-triangle"></i><p>Error: Galería no disponible</p></div>';
        }
    } else if (id === 998) {
        temaPrincipal.innerHTML = `
            <div class="galeria-container">
                <h2 class="galeria-titulo"><i class="fas fa-star"></i> Destacados</h2>
                <div class="galeria-grid">
                    <div class="galeria-item" onclick="window.abrirImagenZoom('imganes/camalio.png', 'Cambia por tu bienestar')">
                        <img src="imganes/camalio.png" alt="Cambia por tu bienestar" loading="lazy">
                        <div class="galeria-caption">
                            <span>Cambia por tu bienestar</span>
                            <button class="btn-share-mini" onclick="event.stopPropagation(); compartirImagenWhatsApp('imganes/camalio.png', 'Cambia por tu bienestar')">
                                <i class="fab fa-whatsapp"></i>
                            </button>
                        </div>
                    </div>
                    <div class="galeria-item" onclick="window.abrirImagenZoom('imganes/gatoperro.jpeg', 'La lealtad')">
                        <img src="imganes/gatoperro.jpeg" alt="la lealtad" loading="lazy">
                        <div class="galeria-caption">
                            <span>La lealtad</span>
                            <button class="btn-share-mini" onclick="event.stopPropagation(); compartirImagenWhatsApp('imganes/gatoperro.jpeg', 'La lealtad')">
                                <i class="fab fa-whatsapp"></i>
                            </button>
                        </div>
                    </div>
                    <div class="galeria-item" onclick="window.abrirImagenZoom('imganes/koala.jpeg', 'Constancia')">
                        <img src="imganes/koala.jpeg" alt="constancia" loading="lazy">
                        <div class="galeria-caption">
                            <span>Constancia</span>
                            <button class="btn-share-mini" onclick="event.stopPropagation(); compartirImagenWhatsApp('imganes/koala.jpeg', 'Constancia')">
                                <i class="fab fa-whatsapp"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (id === 997) {
        temaPrincipal.innerHTML = `
            <div class="galeria-container">
                <h2 class="galeria-titulo"><i class="fas fa-clock"></i> Recientes</h2>
                <div class="galeria-grid">
                    <div class="galeria-item" onclick="window.abrirImagenZoom('imganes/cerdo.png', 'Valorate')">
                        <img src="imganes/cerdo.png" alt="valorate" loading="lazy">
                        <div class="galeria-caption">
                            <span>Valorate</span>
                            <button class="btn-share-mini" onclick="event.stopPropagation(); compartirImagenWhatsApp('imganes/cerdo.png', 'Valorate')">
                                <i class="fab fa-whatsapp"></i>
                            </button>
                        </div>
                    </div>
                    <div class="galeria-item" onclick="window.abrirImagenZoom('imganes/gatoperro.jpeg', 'La lealtad')">
                        <img src="imganes/gatoperro.jpeg" alt="La lealtad" loading="lazy">
                        <div class="galeria-caption">
                            <span>La lealtad</span>
                            <button class="btn-share-mini" onclick="event.stopPropagation(); compartirImagenWhatsApp('imganes/gatoperro.jpeg', 'La lealtad')">
                                <i class="fab fa-whatsapp"></i>
                            </button>
                        </div>
                    </div>
                    <div class="galeria-item" onclick="window.abrirImagenZoom('imganes/koala.jpeg', 'Constancia')">
                        <img src="imganes/koala.jpeg" alt="Constancia" loading="lazy">
                        <div class="galeria-caption">
                            <span>Constancia</span>
                            <button class="btn-share-mini" onclick="event.stopPropagation(); compartirImagenWhatsApp('imganes/koala.jpeg', 'Constancia')">
                                <i class="fab fa-whatsapp"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        const tema = temas.find(t => t.id === id);
        if (tema) mostrarTema(tema);
    }
    cerrarTodosSubmenus();
};

// ===== EVENTOS =====
document.addEventListener('click', function(event) {
    if (!event.target.closest('.menu-item')) {
        cerrarTodosSubmenus();
    }
});

window.addEventListener('resize', function() {
    if (esPaginaGaleria) return;
    construirMenuAdaptable();
});

// ============================================================
// INICIALIZACIÓN PRINCIPAL
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    
    
    // --- Verificación de Sesión y Saludo ---
    async function verificarSesion() {
        const { data: { session } } = await supabaseClient.auth.getSession();
        const contenedorSaludo = document.getElementById('contenedorSaludo');
        const spanNombre = document.getElementById('usuarioNombreLogueado');

        if (session) {
            if (contenedorSaludo && spanNombre) {
                const nombre = session.user.user_metadata?.nombre || "Usuario";
                spanNombre.textContent = nombre;
                contenedorSaludo.style.display = 'flex';
            }
            gestionarBuzon(session.user.id);
            // Actualizar botón inicio después de verificar sesión
            actualizarBotonInicio();
        } else {
            gestionarBuzon(null);
            // Actualizar botón inicio después de verificar sesión
            actualizarBotonInicio();
        }
    }

    // --- Identificador de la última gran actualización ---
    const ID_ULTIMA_NOVEDAD = 'v1.2_reloj_y_logros'; 

    // --- Lógica del Buzón de Novedades ---
    async function gestionarBuzon(userId) {
        const btnBuzon = document.getElementById('btnBuzon');
        const notif = document.getElementById('notifBuzon');

        if (!userId) {
            if (btnBuzon) {
                if (notif) notif.style.display = 'block';
                btnBuzon.onclick = () => mostrarInvitacionRegistro();
            }
            return;
        }
        
        const bienvenidaVista = localStorage.getItem(`bienvenida_${userId}`);
        const novedadVista = localStorage.getItem(`novedad_${userId}`);

        if (!bienvenidaVista || novedadVista !== ID_ULTIMA_NOVEDAD) {
            if (notif) notif.style.display = 'block';
        }

        if (!bienvenidaVista) {
            setTimeout(() => mostrarBienvenida(userId), 2500);
        }

        if (btnBuzon) {
            btnBuzon.onclick = () => {
                if (notif) notif.style.display = 'none';
                
                const yaVioBienvenida = localStorage.getItem(`bienvenida_${userId}`);
                const yaVioNovedad = localStorage.getItem(`novedad_${userId}`);

                if (yaVioBienvenida && yaVioNovedad !== ID_ULTIMA_NOVEDAD) {
                    mostrarNovedades(userId);
                } else {
                    mostrarInstrucciones();
                }
            };
        }
    }



function mostrarSoporte() {
    // Detectar modo oscuro
    const isDarkMode = document.body.classList.contains('dark-mode') || 
                       localStorage.getItem('theme') === 'dark';
    
    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;
    
    // Colores según modo
    const textColor = isDarkMode ? '#ffffff' : '#2c1b4e';
    const subTextColor = isDarkMode ? '#d0c0e0' : '#7f8c8d';
    const bgColor = isDarkMode ? '#1a1a2e' : '#fdfaff';
    const cardBg = isDarkMode ? 'rgba(255,255,255,0.06)' : '#fdfaff';
    const borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : '#e0d0f0';
    
    Swal.fire({
        title: '',
        background: bgColor,
        width: isMobile ? '92%' : undefined,
        maxWidth: isMobile ? '420px' : undefined,
        padding: isMobile ? '1.5rem 1rem' : '2rem',
        position: 'center',
        html: `
            <div style="text-align: center; padding: 0; max-height: 85vh; overflow-y: auto; overflow-x: hidden; scrollbar-width: none; -ms-overflow-style: none; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; margin: 0 auto;">
                <style>
                    .swal-soporte-scroll::-webkit-scrollbar {
                        display: none;
                        width: 0;
                        height: 0;
                    }
                </style>
                <div class="swal-soporte-scroll" style="padding: 0; width: 100%; max-width: 100%; display: flex; flex-direction: column; align-items: center; margin: 0 auto;">
                    <!-- Círculo con imagen -->
                    <div style="display: flex; justify-content: center; margin-top: ${isMobile ? '5px' : '5px'}; margin-bottom: ${isMobile ? '10px' : '15px'}; width: 100%;">
                        <div style="width: ${isMobile ? '70px' : '80px'}; height: ${isMobile ? '70px' : '80px'}; border-radius: 50%; background: linear-gradient(135deg, #f0e6ff, #e6fffa); padding: ${isMobile ? '5px' : '5px'}; box-shadow: 0 8px 25px rgba(155, 89, 182, 0.2); flex-shrink: 0;">
                            <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                                <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        </div>
                    </div>

                    <h2 style="color: ${textColor}; font-weight: 800; font-size: ${isMobile ? '1.3rem' : '28px'}; margin-bottom: ${isMobile ? '8px' : '8px'}; display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; text-align: center;">
                        <i class="fas fa-headset" style="color: #9b59b6; font-size: ${isMobile ? '1.4rem' : '32px'};"></i>
                        <span style="text-align: center;">Soporte Medicurativo</span>
                    </h2>
                    
                    <div style="background: ${isDarkMode ? 'rgba(155,89,182,0.15)' : '#f8f0ff'}; padding: ${isMobile ? '16px' : '25px'}; border-radius: ${isMobile ? '30px' : '60px'}; margin: ${isMobile ? '8px 0' : '15px 0'}; border: 2px solid ${isDarkMode ? 'rgba(155,89,182,0.2)' : '#f0e6ff'}; width: 100%; box-sizing: border-box;">
                        <p style="font-size: ${isMobile ? '0.9rem' : '18px'}; color: ${textColor}; margin: 8px 0; line-height: 1.8; font-weight: 500; text-align: center;">
                            Hola, somos el equipo Medicurativo.<br>
                            ¿En qué te podemos ayudar?<br>
                            <span style="color: #9b59b6; font-weight: 600;">Cuéntanos qué necesitas.</span>
                        </p>

                        <!-- Gmail -->
                        <div style="background: linear-gradient(135deg, #2c1b4e, #4a2360); padding: ${isMobile ? '12px 16px' : '16px 20px'}; border-radius: 50px; margin: ${isMobile ? '10px 0' : '15px 0'}; display: flex; align-items: center; justify-content: center; gap: 12px; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(44, 27, 78, 0.3); width: 100%; box-sizing: border-box;" 
                             onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                            <i class="fas fa-envelope" style="font-size: ${isMobile ? '1.1rem' : '24px'}; color: white;"></i>
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=joacoxx2340@gmail.com&su=Soporte%20Medicurativo&body=Hola%2C%20somos%20el%20equipo%20Medicurativo.%20%C2%BFEn%20qu%C3%A9%20te%20podemos%20ayudar%3F%20Cu%C3%A9ntanos.%0A%0AP%C3%A1gina%20o%20secci%C3%B3n%3A%0AProblema%20o%20duda%3A%0ADescripci%C3%B3n%3A%0A" 
                               target="_blank" rel="noopener" 
                               style="color: white; font-size: ${isMobile ? '0.9rem' : '18px'}; font-weight: 600; text-decoration: none; letter-spacing: 0.5px;">
                                Gmail
                            </a>
                            <i class="fas fa-arrow-right" style="color: white; font-size: ${isMobile ? '0.8rem' : '16px'};"></i>
                        </div>

                        <!-- WhatsApp -->
                        <div style="background: linear-gradient(135deg, #27ae60, #1a8a4a); padding: ${isMobile ? '12px 16px' : '16px 20px'}; border-radius: 50px; margin: ${isMobile ? '10px 0' : '15px 0'}; display: flex; align-items: center; justify-content: center; gap: 12px; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3); cursor: pointer; width: 100%; box-sizing: border-box;"
                             onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'"
                             onclick="abrirWhatsAppDirecto()">
                            <i class="fab fa-whatsapp" style="font-size: ${isMobile ? '1.1rem' : '24px'}; color: white;"></i>
                            <span style="color: white; font-size: ${isMobile ? '0.9rem' : '18px'}; font-weight: 600; letter-spacing: 0.5px;">
                                WhatsApp
                            </span>
                            <i class="fas fa-arrow-right" style="color: white; font-size: ${isMobile ? '0.8rem' : '16px'};"></i>
                        </div>

                        <!-- Bot Medi -->
                        <div style="background: linear-gradient(135deg, #9b59b6, #7a3d91); padding: ${isMobile ? '12px 16px' : '16px 20px'}; border-radius: 50px; margin: ${isMobile ? '10px 0' : '15px 0'}; display: flex; align-items: center; justify-content: center; gap: 12px; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(155, 89, 182, 0.3); width: 100%; box-sizing: border-box;"
                             onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                            <i class="fas fa-robot" style="font-size: ${isMobile ? '1.1rem' : '24px'}; color: white;"></i>
                            <a href="bot.html" 
                               style="color: white; font-size: ${isMobile ? '0.9rem' : '18px'}; font-weight: 600; text-decoration: none; letter-spacing: 0.5px;">
                                Bot Medi
                            </a>
                            <i class="fas fa-arrow-right" style="color: white; font-size: ${isMobile ? '0.8rem' : '16px'};"></i>
                        </div>

                        <div style="margin-top: ${isMobile ? '12px' : '20px'}; padding: ${isMobile ? '10px' : '15px'}; background: ${cardBg}; border-radius: ${isMobile ? '20px' : '30px'}; border: 1px solid ${borderColor}; width: 100%; box-sizing: border-box;">
                            <p style="font-size: ${isMobile ? '0.8rem' : '15px'}; color: ${textColor}; margin: 0; line-height: 1.6; text-align: center;">
                                <i class="fas fa-info-circle" style="color: #9b59b6; font-size: ${isMobile ? '0.9rem' : '18px'};"></i>
                                <br>
                                Puedes escribir por Gmail, WhatsApp o hablar con Bot Medi.
                                <br>
                                <span style="color: ${subTextColor}; font-size: ${isMobile ? '0.75rem' : '0.9rem'};">
                                    Describe qué estabas haciendo, en qué página pasó y si puedes agrega una captura.
                                </span>
                                <br>
                                <strong style="color: #9b59b6;">Respondemos lo antes posible.</strong>
                            </p>
                        </div>
                    </div>

                    <!-- Badges de soporte -->
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: ${isMobile ? '10px' : '15px'}; flex-wrap: wrap; width: 100%;">
                        <span style="background: ${isDarkMode ? 'rgba(155,89,182,0.2)' : '#f0e6ff'}; padding: ${isMobile ? '5px 12px' : '8px 18px'}; border-radius: 30px; font-size: ${isMobile ? '0.7rem' : '0.85rem'}; color: ${textColor}; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-envelope" style="color: #9b59b6;"></i> Gmail
                        </span>
                        <span style="background: ${isDarkMode ? 'rgba(39,174,96,0.2)' : '#e6fffa'}; padding: ${isMobile ? '5px 12px' : '8px 18px'}; border-radius: 30px; font-size: ${isMobile ? '0.7rem' : '0.85rem'}; color: ${textColor}; display: flex; align-items: center; gap: 6px;">
                            <i class="fab fa-whatsapp" style="color: #27ae60;"></i> WhatsApp
                        </span>
                        <span style="background: ${isDarkMode ? 'rgba(241,196,15,0.2)' : '#fff9e6'}; padding: ${isMobile ? '5px 12px' : '8px 18px'}; border-radius: 30px; font-size: ${isMobile ? '0.7rem' : '0.85rem'}; color: ${textColor}; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-robot" style="color: #f1c40f;"></i> Bot Medi
                        </span>
                    </div>

                    <div style="margin-top: ${isMobile ? '10px' : '15px'}; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%;">
                        <i class="fas fa-check-circle" style="font-size: ${isMobile ? '0.9rem' : '20px'}; color: #27ae60;"></i>
                        <span style="color: ${subTextColor}; font-size: ${isMobile ? '0.75rem' : '0.9rem'}; font-weight: 500; text-align: center;">Soporte gratuito por Gmail, WhatsApp y Bot Medi</span>
                    </div>

                    <div style="margin-top: ${isMobile ? '12px' : '15px'}; width: 100%; display: flex; justify-content: center;">
                        <button onclick="Swal.close()" style="background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; border: none; padding: ${isMobile ? '10px 30px' : '12px 40px'}; border-radius: 50px; font-weight: 700; cursor: pointer; font-size: ${isMobile ? '0.9rem' : '1rem'}; box-shadow: 0 8px 20px rgba(155, 89, 182, 0.3); transition: all 0.3s; width: ${isMobile ? '100%' : 'auto'};" 
                                onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        customClass: { 
            popup: 'swal-soporte-popup',
            closeButton: 'custom-close-btn-left'
        },
        didOpen: () => {
            // Forzar centrado en móvil con JavaScript directo
            if (isMobile) {
                // Esperar un momento para que SweetAlert renderice
                setTimeout(() => {
                    // Obtener el popup
                    const popup = document.querySelector('.swal-soporte-popup');
                    if (popup) {
                        // Forzar estilos para centrar y agregar más borde
                        popup.style.position = 'fixed';
                        popup.style.top = '50%';
                        popup.style.left = '50%';
                        popup.style.transform = 'translate(-50%, -50%)';
                        popup.style.margin = '0';
                        popup.style.width = '92%';
                        popup.style.maxWidth = '420px';
                        popup.style.maxHeight = '90vh';
                        popup.style.display = 'flex';
                        popup.style.alignItems = 'center';
                        popup.style.justifyContent = 'center';
                        popup.style.overflow = 'hidden';
                        popup.style.padding = '1.5rem 1rem';
                        popup.style.borderRadius = '20px';
                        popup.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)';
                    }
                    
                    // Obtener el contenedor HTML
                    const htmlContainer = document.querySelector('.swal-soporte-popup .swal2-html-container');
                    if (htmlContainer) {
                        htmlContainer.style.display = 'flex';
                        htmlContainer.style.justifyContent = 'center';
                        htmlContainer.style.alignItems = 'center';
                        htmlContainer.style.width = '100%';
                        htmlContainer.style.padding = '0';
                        htmlContainer.style.margin = '0';
                        htmlContainer.style.overflow = 'hidden';
                        htmlContainer.style.maxHeight = '90vh';
                    }
                    
                    // Obtener el contenedor de contenido
                    const contentDiv = document.querySelector('.swal-soporte-popup .swal2-html-container > div');
                    if (contentDiv) {
                        contentDiv.style.width = '100%';
                        contentDiv.style.display = 'flex';
                        contentDiv.style.flexDirection = 'column';
                        contentDiv.style.alignItems = 'center';
                        contentDiv.style.margin = '0 auto';
                    }
                }, 50);
            } else {
                // Para PC también agregar más padding
                const popup = document.querySelector('.swal-soporte-popup');
                if (popup) {
                    popup.style.padding = '2rem';
                    popup.style.borderRadius = '24px';
                    popup.style.boxShadow = '0 20px 60px rgba(0,0,0,0.25)';
                }
            }
        }
    });
}

// CSS específico mejorado con más borde
(function addSoporteMobileStyles() {
    if (document.getElementById('swal-soporte-mobile-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'swal-soporte-mobile-styles';
    style.textContent = `
        .swal-soporte-scroll::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
        }
        
        .swal-soporte-scroll {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
        }
        
        /* Forzar centrado y más borde en móvil */
        @media (max-width: 768px) {
            .swal-soporte-popup.swal2-popup {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                margin: 0 !important;
                width: 92% !important;
                max-width: 420px !important;
                max-height: 90vh !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 1.5rem 1rem !important;
                border-radius: 20px !important;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
                box-sizing: border-box !important;
            }
            
            .swal-soporte-popup .swal2-html-container {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                max-height: 90vh !important;
                overflow: hidden !important;
            }
            
            .swal-soporte-popup .swal2-html-container > div {
                width: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                margin: 0 auto !important;
                padding: 0 !important;
            }
            
            /* Botón de cerrar más grande */
            .swal-soporte-popup .swal2-close {
                font-size: 2.5rem !important;
                padding: 0.8rem !important;
                margin: 0.5rem !important;
            }
        }

        
        /* Estilos para PC también */
        .swal-soporte-popup.swal2-popup {
            padding: 2rem !important;
            border-radius: 24px !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.25) !important;
        }
    `;
    document.head.appendChild(style);
})();
// ⬇️ EXPONER FUNCIÓN GLOBALMENTE ⬇️
window.mostrarSoporte = mostrarSoporte;
// ⬇️ FUNCIÓN PARA ABRIR WHATSAPP DIRECTO (APP O WEB) ⬇️
function abrirWhatsAppDirecto() {
    const numero = '573114232761';
    const mensaje = 'Hola equipo Medicurativo, necesito ayuda con:%0A%0A📌 Página: %0A🛑 Problema: %0A📝 Descripción: %0A%0A🙏 Gracias, respondan lo antes posible.';
    
    // Intentar abrir con el esquema de la app (whatsapp://)
    const appUrl = `whatsapp://send?phone=${numero}&text=${mensaje}`;
    
    // Fallback: si no abre la app, usar web
    const webUrl = `https://wa.me/${numero}?text=${mensaje}`;
    
    // Intentar abrir la app primero
    const win = window.open(appUrl, '_blank');
    
    // Si no se pudo abrir (o se cerró), abrir web
    if (!win || win.closed) {
        window.open(webUrl, '_blank');
    }
}

// ⬇️ EXPONER FUNCIONES GLOBALMENTE ⬇️
window.mostrarSoporte = mostrarSoporte;
window.abrirWhatsAppDirecto = abrirWhatsAppDirecto;
 // ===== FUNCIÓN MOSTRAR MISIÓN =====
window.mostrarMision = function() {
    // Detectar modo oscuro
    const isDarkMode = document.body.classList.contains('dark-mode') || 
                       localStorage.getItem('theme') === 'dark';
    
    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;
    
    // Colores según modo
    const textColor = isDarkMode ? '#ffffff' : '#2c1b4e';
    const subTextColor = isDarkMode ? '#d0c0e0' : '#7f8c8d';
    const bgColor = isDarkMode ? '#1a1a2e' : '#fdfaff';
    const cardBg = isDarkMode ? 'rgba(255,255,255,0.06)' : '#fdfaff';
    const cardBg2 = isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f2ff';
    const borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : '#f0e6ff';
    
    Swal.fire({
        title: '',
        background: bgColor,
        width: isMobile ? '92%' : undefined,
        maxWidth: isMobile ? '420px' : undefined,
        padding: isMobile ? '1rem' : undefined,
        html: `
            <div style="text-align: center; padding: ${isMobile ? '0px' : '5px'};">
                <div style="display: flex; justify-content: center; margin-top: ${isMobile ? '0px' : '5px'}; margin-bottom: ${isMobile ? '12px' : '15px'};">
                    <div style="width: ${isMobile ? '70px' : '80px'}; height: ${isMobile ? '70px' : '80px'}; border-radius: 50%; background: linear-gradient(135deg, #f0e6ff, #e6fffa); padding: ${isMobile ? '5px' : '5px'}; box-shadow: 0 8px 25px rgba(155, 89, 182, 0.2);">
                        <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                            <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                </div>

                <h2 style="color: ${textColor}; font-weight: 800; margin-bottom: ${isMobile ? '8px' : '8px'}; font-size: ${isMobile ? '1.4rem' : '1.6rem'};">
                    Nuestra Misión
                </h2>
                
                <div style="text-align: left; background: ${cardBg}; padding: ${isMobile ? '18px' : '20px'}; border-radius: ${isMobile ? '25px' : '30px'}; border: 2px solid ${borderColor}; box-shadow: 0 5px 15px rgba(0,0,0,0.02);">
                    <p style="color: ${textColor}; font-size: ${isMobile ? '0.95rem' : '1rem'}; line-height: ${isMobile ? '1.7' : '1.8'}; text-align: center;">
                        <i class="fas fa-quote-left" style="color: #9b59b6; font-size: ${isMobile ? '1.1rem' : '1.2rem'};"></i>
                        Esta página web está hecha para ayudarte en conocimiento en temas
                        que nos ayudan a <strong style="color: #9b59b6;">crecer como persona</strong>
                        en esta vida y ser <strong style="color: #9b59b6;">mejores cada día</strong>.
                    </p>
                    
                    <div style="background: ${cardBg2}; padding: ${isMobile ? '14px' : '15px'}; border-radius: ${isMobile ? '18px' : '20px'}; margin: ${isMobile ? '14px 0' : '15px 0'}; border-left: 5px solid #9b59b6;">
                        <p style="color: ${textColor}; font-size: ${isMobile ? '0.95rem' : '1rem'}; font-weight: 500; text-align: center; margin: 0;">
                            🌱 <strong>Crecemos juntos, un tema a la vez</strong>
                        </p>
                    </div>
                </div>
                
                <div style="margin-top: ${isMobile ? '18px' : '20px'}; display: flex; justify-content: center;">
                    <button onclick="Swal.close()" style="background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; border: none; padding: ${isMobile ? '12px 35px' : '12px 40px'}; border-radius: 50px; font-weight: 600; cursor: pointer; font-size: ${isMobile ? '0.95rem' : '1rem'}; box-shadow: 0 8px 20px rgba(155, 89, 182, 0.3); transition: 0.3s;">
                        ✨ Entendido
                    </button>
                </div>
                <p style="margin-top: ${isMobile ? '14px' : '15px'}; font-size: ${isMobile ? '0.75rem' : '0.8rem'}; color: ${subTextColor}; font-style: italic;">"El conocimiento es el primer paso hacia la transformación."</p>
            </div>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        customClass: { 
            popup: 'swal-popup-redondo swal-mision-popup',
            closeButton: 'custom-close-btn-left'
        },
        didOpen: () => {
            // Forzar centrado en móvil
            if (isMobile) {
                const popup = document.querySelector('.swal-mision-popup');
                if (popup) {
                    popup.style.margin = '0 auto';
                    popup.style.left = '50%';
                    popup.style.transform = 'translateX(-50%)';
                    popup.style.position = 'fixed';
                    popup.style.top = '50%';
                    popup.style.transform = 'translate(-50%, -50%)';
                }
            }
        }
    });
};

// CSS específico para centrar en móvil
(function addMisionMobileStyles() {
    if (document.getElementById('swal-mision-mobile-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'swal-mision-mobile-styles';
    style.textContent = `
        @media (max-width: 768px) {
            .swal-mision-popup {
                width: 92% !important;
                max-width: 420px !important;
                margin: 0 auto !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                position: fixed !important;
                top: 50% !important;
                transform: translate(-50%, -50%) !important;
            }
        }
    `;
    document.head.appendChild(style);
})();
    function mostrarNovedades(userId) {
        Swal.fire({
            title: '🚀 ¡Nuevas Actualizaciones!',
            html: `
                <div style="text-align: left; padding: 10px;">
                    <p style="color: #9b59b6; font-weight: 700; margin-bottom: 15px;">Hemos mejorado tu experiencia:</p>
                    <div style="background: #fdfaff; padding: 15px; border-radius: 20px; border: 1px solid #e0d0f0;">
                        <ul style="margin: 0; padding-left: 20px; color: #2c1b4e; font-size: 0.9rem; line-height: 1.6;">
                            <li><strong>Reloj Dinámico:</strong> Ahora tienes fecha y hora en tiempo real.</li>
                            <li><strong>Barra de Progreso:</strong> Visualiza cómo avanza tu día con colores.</li>
                            <li><strong>Logros Reales:</strong> Gana trofeos al personalizar tu perfil.</li>
                            <li><strong>Nueva Comunidad:</strong> Comparte frases e imágenes con otros usuarios.</li>
                        </ul>
                    </div>
                    <p style="font-size: 0.85rem; color: #7f8c8d; text-align: center; margin-top: 15px;">Vuelve a pulsar el buzón cuando quieras ver el manual de uso.</p>
                </div>
            `,
            confirmButtonText: '¡Entendido!',
            confirmButtonColor: '#9b59b6',
            customClass: { popup: 'swal-popup-redondo' }
        }).then(() => {
            localStorage.setItem(`novedad_${userId}`, ID_ULTIMA_NOVEDAD);
        });
    }

    function mostrarInvitacionRegistro() {
    // Detectar modo oscuro
    const isDarkMode = document.body.classList.contains('dark-mode') || 
                       localStorage.getItem('theme') === 'dark';
    
    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;
    
    // Colores según modo
    const textColor = isDarkMode ? '#ffffff' : '#2c1b4e';
    const subTextColor = isDarkMode ? '#d0c0e0' : '#7f8c8d';
    const bgColor = isDarkMode ? '#1a1a2e' : '#fdfaff';
    const cardBg = isDarkMode ? 'rgba(255,255,255,0.06)' : '#fdfaff';
    const borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : '#f0e6ff';
    
    Swal.fire({
        title: '',
        background: bgColor,
        width: isMobile ? '92%' : undefined,
        maxWidth: isMobile ? '420px' : undefined,
        padding: isMobile ? '1.5rem 1rem' : '2rem',
        position: 'center',
        html: `
            <div style="text-align: center; padding: 0; max-height: 85vh; overflow-y: auto; overflow-x: hidden; scrollbar-width: none; -ms-overflow-style: none; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; margin: 0 auto;">
                <style>
                    .swal-invitacion-scroll::-webkit-scrollbar {
                        display: none;
                        width: 0;
                        height: 0;
                    }
                </style>
                <div class="swal-invitacion-scroll" style="padding: 0; width: 100%; max-width: 100%; display: flex; flex-direction: column; align-items: center; margin: 0 auto;">
                    <!-- Círculo con imagen -->
                    <div style="display: flex; justify-content: center; margin-top: ${isMobile ? '5px' : '10px'}; margin-bottom: ${isMobile ? '15px' : '20px'}; width: 100%;">
                        <div style="width: ${isMobile ? '75px' : '90px'}; height: ${isMobile ? '75px' : '90px'}; border-radius: 50%; background: linear-gradient(135deg, #f0e6ff, #e6fffa); padding: 5px; box-shadow: 0 8px 25px rgba(155, 89, 182, 0.2); flex-shrink: 0;">
                            <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                                <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        </div>
                    </div>

                    <h2 style="color: ${textColor}; font-weight: 800; margin-bottom: ${isMobile ? '6px' : '8px'}; width: 100%; text-align: center; font-size: ${isMobile ? '1.4rem' : '1.8rem'};">
                        ¿Qué puedes hacer aquí?
                    </h2>
                    <p style="color: #9b59b6; font-weight: 600; margin-bottom: ${isMobile ? '15px' : '20px'}; text-align: center; font-size: ${isMobile ? '0.95rem' : '1rem'};">
                        Tu espacio de crecimiento personal 🌿
                    </p>
                    
                    <div style="text-align: left; background: ${cardBg}; padding: ${isMobile ? '16px' : '20px'}; border-radius: 30px; border: 2px solid ${borderColor}; box-shadow: 0 5px 20px rgba(0,0,0,0.05); max-height: 300px; overflow-y: auto; width: 100%; box-sizing: border-box;">
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: #27ae60; font-size: 0.85rem; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;"><i class="fas fa-check-circle"></i> Disponible sin cuenta</h4>
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px; text-align: left;">
                                <div style="background: #e6fffa; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-th-list" style="color: #27ae60; font-size: 0.8rem;"></i></div>
                                <p style="margin: 0; color: ${textColor}; font-size: ${isMobile ? '0.85rem' : '0.9rem'}; text-align: left;">Ver todas las <strong>categorías</strong> y sus reflexiones.</p>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px; text-align: left;">
                                <div style="background: #f0e6ff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-search" style="color: #9b59b6; font-size: 0.8rem;"></i></div>
                                <p style="margin: 0; color: ${textColor}; font-size: ${isMobile ? '0.85rem' : '0.9rem'}; text-align: left;"><strong>Buscar</strong> temas de inspiración libremente.</p>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px; text-align: left;">
                                <div style="background: #eaf6ff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-images" style="color: #3498db; font-size: 0.8rem;"></i></div>
                                <p style="margin: 0; color: ${textColor}; font-size: ${isMobile ? '0.85rem' : '0.9rem'}; text-align: left;">Explorar la <strong>galería</strong> de imágenes reflexivas.</p>
                            </div>
                        </div>

                        <div>
                            <h4 style="color: #e67e22; font-size: 0.85rem; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;"><i class="fas fa-lock"></i> Solo con cuenta</h4>
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px; text-align: left;">
                                <div style="background: #fff9e6; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-star" style="color: #f39c12; font-size: 0.8rem;"></i></div>
                                <p style="margin: 0; color: ${textColor}; font-size: ${isMobile ? '0.85rem' : '0.9rem'}; text-align: left;"><strong>Gana Estrellas:</strong> Avanza en el sistema y desbloquea nuevos niveles.</p>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px; text-align: left;">
                                <div style="background: #fff9e6; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-trophy" style="color: #f1c40f; font-size: 0.8rem;"></i></div>
                                <p style="margin: 0; color: ${textColor}; font-size: ${isMobile ? '0.85rem' : '0.9rem'}; text-align: left;"><strong>Completar logros:</strong> Desbloquea trofeos y medallas.</p>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px; text-align: left;">
                                <div style="background: #e8f8f5; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-book" style="color: #1abc9c; font-size: 0.8rem;"></i></div>
                                <p style="margin: 0; color: ${textColor}; font-size: ${isMobile ? '0.85rem' : '0.9rem'}; text-align: left;"><strong>Diario Personal:</strong> Guarda tus pensamientos en un espacio privado.</p>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px; text-align: left;">
                                <div style="background: #fff0f5; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-star" style="color: #e84393; font-size: 0.8rem;"></i></div>
                                <p style="margin: 0; color: ${textColor}; font-size: ${isMobile ? '0.85rem' : '0.9rem'}; text-align: left;"><strong>Calificar</strong> y dar like a las reflexiones.</p>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px; text-align: left;">
                                <div style="background: #fff0f5; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-users" style="color: #27ae60; font-size: 0.8rem;"></i></div>
                                <p style="margin: 0; color: ${textColor}; font-size: ${isMobile ? '0.85rem' : '0.9rem'}; text-align: left;"><strong>Comunidad:</strong> Comparte y participa con otros usuarios.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: ${isMobile ? '15px' : '20px'}; width: 100%; display: flex; justify-content: center;">
                        <button onclick="window.location.href='login.html'" style="background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; border: none; padding: ${isMobile ? '12px 25px' : '14px 30px'}; border-radius: 50px; font-weight: 700; cursor: pointer; width: ${isMobile ? '100%' : '100%'}; box-shadow: 0 8px 20px rgba(155, 89, 182, 0.3); font-size: ${isMobile ? '0.95rem' : '1rem'}; transition: 0.3s;">✨ ¡Crear cuenta y desbloquear todo!</button>
                    </div>
                    <p style="margin-top: ${isMobile ? '10px' : '12px'}; font-size: ${isMobile ? '0.75rem' : '0.8rem'}; color: ${subTextColor}; font-style: italic; text-align: center; width: 100%;">"La paz interior es el mejor regalo que te puedes dar hoy."</p>
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        customClass: { 
            popup: 'swal-invitacion-popup',
            closeButton: 'custom-close-btn-left'
        },
        didOpen: () => {
            // Forzar centrado en móvil con JavaScript directo
            if (isMobile) {
                setTimeout(() => {
                    const popup = document.querySelector('.swal-invitacion-popup');
                    if (popup) {
                        popup.style.position = 'fixed';
                        popup.style.top = '50%';
                        popup.style.left = '50%';
                        popup.style.transform = 'translate(-50%, -50%)';
                        popup.style.margin = '0';
                        popup.style.width = '92%';
                        popup.style.maxWidth = '420px';
                        popup.style.maxHeight = '90vh';
                        popup.style.display = 'flex';
                        popup.style.alignItems = 'center';
                        popup.style.justifyContent = 'center';
                        popup.style.overflow = 'hidden';
                        popup.style.padding = '1.5rem 1rem';
                        popup.style.borderRadius = '20px';
                        popup.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)';
                    }
                    
                    const htmlContainer = document.querySelector('.swal-invitacion-popup .swal2-html-container');
                    if (htmlContainer) {
                        htmlContainer.style.display = 'flex';
                        htmlContainer.style.justifyContent = 'center';
                        htmlContainer.style.alignItems = 'center';
                        htmlContainer.style.width = '100%';
                        htmlContainer.style.padding = '0';
                        htmlContainer.style.margin = '0';
                        htmlContainer.style.overflow = 'hidden';
                        htmlContainer.style.maxHeight = '90vh';
                    }
                    
                    const contentDiv = document.querySelector('.swal-invitacion-popup .swal2-html-container > div');
                    if (contentDiv) {
                        contentDiv.style.width = '100%';
                        contentDiv.style.display = 'flex';
                        contentDiv.style.flexDirection = 'column';
                        contentDiv.style.alignItems = 'center';
                        contentDiv.style.margin = '0 auto';
                    }
                }, 50);
            } else {
                // Para PC también agregar más padding
                const popup = document.querySelector('.swal-invitacion-popup');
                if (popup) {
                    popup.style.padding = '2rem';
                    popup.style.borderRadius = '24px';
                    popup.style.boxShadow = '0 20px 60px rgba(0,0,0,0.25)';
                }
            }
        }
    });
}

// CSS específico para invitación con más borde
(function addInvitacionMobileStyles() {
    if (document.getElementById('swal-invitacion-mobile-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'swal-invitacion-mobile-styles';
    style.textContent = `
        .swal-invitacion-scroll::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
        }
        
        .swal-invitacion-scroll {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
        }
        
        /* Forzar centrado y más borde en móvil */
        @media (max-width: 768px) {
            .swal-invitacion-popup.swal2-popup {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                margin: 0 !important;
                width: 92% !important;
                max-width: 420px !important;
                max-height: 90vh !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 1.5rem 1rem !important;
                border-radius: 20px !important;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
                box-sizing: border-box !important;
            }
            
            .swal-invitacion-popup .swal2-html-container {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                max-height: 90vh !important;
                overflow: hidden !important;
            }
            
            .swal-invitacion-popup .swal2-html-container > div {
                width: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                margin: 0 auto !important;
                padding: 0 !important;
            }
            
            .swal-invitacion-popup .swal2-close {
                font-size: 2.5rem !important;
                padding: 0.8rem !important;
                margin: 0.5rem !important;
            }
        }
        
        /* Estilos para PC también */
        .swal-invitacion-popup.swal2-popup {
            padding: 2rem !important;
            border-radius: 24px !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.25) !important;
        }
    `;
    document.head.appendChild(style);
})();

// ⬇️ EXPONER FUNCIÓN GLOBALMENTE ⬇️
window.mostrarInvitacionRegistro = mostrarInvitacionRegistro;
    

    function mostrarBienvenida(userId) {
        Swal.fire({
            title: '¡Bienvenido a tu Espacio de Luz! ',
            html: `
                <div style="text-align: center; padding: 10px;">
                    <img src="imganes/logosmedi.png" style="width: 120px; margin-bottom: 20px; animation: pulse 2s infinite;">
                    <p style="color: #2c1b4e; font-size: 1.1rem; line-height: 1.6; font-style: italic;">
                        "Cada día es una nueva oportunidad para florecer. Estamos felices de que hoy hayas elegido sanar y crecer con nosotros."
                    </p>
                    <div style="margin-top: 20px; padding: 15px; background: #fdfaff; border-radius: 20px; border: 1px solid #e0d0f0;">
                        <p style="color: #9b59b6; font-weight: 700; margin: 0;">¡Tu viaje hacia el bienestar comienza aquí!</p>
                    </div>
                </div>
            `,
            confirmButtonText: 'Comenzar mi viaje',
            confirmButtonColor: '#9b59b6',
            customClass: { popup: 'swal-popup-redondo' },
            allowOutsideClick: false
        }).then(() => {
            localStorage.setItem(`bienvenida_${userId}`, 'true');
            mostrarInstrucciones();
        });
    }

  function mostrarInstrucciones() {
    // Detectar modo oscuro
    const isDarkMode = document.body.classList.contains('dark-mode') || 
                       localStorage.getItem('theme') === 'dark';
    
    // Colores según modo
    const textColor = isDarkMode ? '#ffffff' : '#2c1b4e';
    const subTextColor = isDarkMode ? '#d0c0e0' : '#7f8c8d';
    const bgColor = isDarkMode ? '#1a1a2e' : '#fdfaff';
    const cardBg = isDarkMode ? 'rgba(255,255,255,0.06)' : '#fdfaff';
    const borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : '#f0e6ff';
    
    Swal.fire({
        title: '',
        background: bgColor,
        html: `
            <div style="text-align: center; padding: 5px;">
                <!-- Círculo con imagen arriba del título -->
                <div style="display: flex; justify-content: center; margin-top: 5px; margin-bottom: 15px;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #f0e6ff, #e6fffa); padding: 5px; box-shadow: 0 8px 25px rgba(155, 89, 182, 0.2);">
                        <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                            <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                </div>

                <h2 style="color: ${textColor}; font-weight: 800; margin-bottom: 8px;">¡Bienvenido a Medicurativo!</h2>
                <p style="color: #9b59b6; font-weight: 600; margin-bottom: 20px;">Tu espacio para sanar y crecer día a día.</p>
                
                <div style="text-align: left; background: ${cardBg}; padding: 20px; border-radius: 30px; border: 2px solid ${borderColor}; box-shadow: 0 5px 15px rgba(0,0,0,0.02);">
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                        <div style="background: #fff9e6; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-trophy" style="color: #f1c40f;"></i></div>
                        <p style="margin: 0; color: ${textColor}; font-size: 0.95rem;"><strong>Gana Logros:</strong> Completando misiones sencillas que ayudan en la experiencia contigo mismo.</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                        <div style="background: #f0e6ff; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-search" style="color: #9b59b6;"></i></div>
                        <p style="margin: 0; color: ${textColor}; font-size: 0.95rem;"><strong>Buscador Inteligente:</strong> Encuentra la reflexión exacta que necesitas hoy.</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                        <div style="background: #e6fffa; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-users" style="color: #27ae60;"></i></div>
                        <p style="margin: 0; color: ${textColor}; font-size: 0.95rem;"><strong>Comunidad:</strong> Interactua con el contenido de los demas usuarios que mas impacten.</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                        <div style="background: #fff0f5; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-star" style="color: #ff7675;"></i></div>
                        <p style="margin: 0; color: ${textColor}; font-size: 0.95rem;"><strong>Califica:</strong> Tu opinión nos ayuda a crecer como comunidad.</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                        <div style="background: #fff9e6; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-rocket" style="color: #f39c12;"></i></div>
                        <p style="margin: 0; color: ${textColor}; font-size: 0.95rem;"><strong>Gana Estrellas:</strong> Avanza en el sistema y desbloquea nuevos niveles y recompensas.</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                        <div style="background: #e8f8f5; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-book" style="color: #1abc9c;"></i></div>
                        <p style="margin: 0; color: ${textColor}; font-size: 0.95rem;"><strong>Diario Personal:</strong> Guarda tus pensamientos más íntimos en un espacio privado donde solo tú puedes verlos.</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="background: #fdf2e9; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-share-alt" style="color: #e67e22;"></i></div>
                        <p style="margin: 0; color: ${textColor}; font-size: 0.95rem;"><strong>Contenido Propio:</strong> Sube tus propias reflexiones e inspiraciones a la comunidad para que otros también se motiven.</p>
                    </div>
                </div>
                <p style="margin-top: 20px; font-size: 0.85rem; color: ${subTextColor}; font-style: italic;">"La paz interior comienza en el momento en que decides no permitir que otra persona o evento controle tus emociones."</p>
            </div>
        `,
        confirmButtonText: '✨ ¡Empezar ahora!',
        confirmButtonColor: '#9b59b6',
        showCloseButton: true,
        closeButtonHtml: '✕',
        customClass: { 
            popup: 'swal-popup-redondo',
            closeButton: 'custom-close-btn-left'
        }
    });
}

// ⬇️ EXPONER FUNCIÓN GLOBALMENTE ⬇️
window.mostrarInstrucciones = mostrarInstrucciones;
    // --- Función para actualizar la calificación global ---
    window.actualizarPromedioGlobal = async function() {
        const container = document.getElementById('contenedorPromedioGlobal');
        const valorText = document.getElementById('valorPromedioGlobal');
        const valorTextMovil = document.getElementById('valorPromedioGlobalMovil');
        
        const { data: opiniones } = await supabaseClient.from('opciones').select('estrellas');

        if (opiniones && opiniones.length > 0) {
            const suma = opiniones.reduce((acc, op) => acc + op.estrellas, 0);
            const promedio = (suma / opiniones.length).toFixed(1);
            
            if (valorText) {
                valorText.textContent = promedio;
            }
            
            if (valorTextMovil) valorTextMovil.textContent = promedio;
            if (container) container.style.display = 'flex';
        }
    }

    // Solo ejecutar en páginas que no sean comunidad
    if (!esPaginaComunidad) {
        actualizarPromedioGlobal();
    }
    verificarSesion();

    // --- Manejo de errores de Supabase en la URL ---
    const hash = window.location.hash;
    if (hash && hash.includes('error')) {
        const params = new URLSearchParams(hash.replace('#', '?'));
        const errorDesc = params.get('error_description');
        
        if (errorDesc) {
            Swal.fire({
                title: 'Error de Acceso',
                text: errorDesc.replace(/\+/g, ' '),
                icon: 'error',
                confirmButtonColor: '#9b59b6',
                customClass: { popup: 'swal-popup-redondo' }
            });
            window.history.replaceState(null, null, window.location.pathname);
        }
    }
    
    // --- Lógica de Modo Oscuro ---
    const darkModeBtn = document.getElementById('darkModeToggle');

    if (darkModeBtn && document.body.classList.contains('dark-mode')) {
        darkModeBtn.querySelector('i').className = 'fas fa-sun';
    }

    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            darkModeBtn.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // --- Lógica del Buscador (solo en páginas que no son comunidad) ---
    if (!esPaginaComunidad) {
        const inputBusqueda = document.getElementById('inputBusqueda');
        const sugerenciasCont = document.getElementById('sugerenciasBusqueda');

        if (inputBusqueda && sugerenciasCont) {
            inputBusqueda.addEventListener('input', (e) => {
                const valorOriginal = e.target.value;
                const valor = valorOriginal.toLowerCase();
                if (valor.length > 1) {
                    const filtrados = temas.filter(t => t.nombre.toLowerCase().includes(valor));
                    if (filtrados.length > 0) {
                        sugerenciasCont.innerHTML = filtrados.map(t => {
                            const regex = new RegExp(`(${valorOriginal})`, 'gi');
                            const nombreResaltado = t.nombre.replace(regex, '<span class="highlight">$1</span>');
                            return `
                            <div class="sugerencia-item" onclick="seleccionarSugerencia(${t.id}); clickSound.play();">
                                <i class="fas ${t.icono}"></i> ${nombreResaltado}
                            </div>
                        `}).join('');
                        sugerenciasCont.classList.add('mostrar');
                    } else {
                        sugerenciasCont.innerHTML = `<div class="sugerencia-item" style="text-align: center; opacity: 0.6; cursor: default;">No encontrado</div>`;
                        sugerenciasCont.classList.add('mostrar');
                    }
                } else {
                    sugerenciasCont.classList.remove('mostrar');
                }
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.buscador-destacado')) sugerenciasCont.classList.remove('mostrar');
            });
        }

        window.seleccionarSugerencia = function(id) {
            const tema = temas.find(t => t.id === id);
            if (tema) {
                mostrarTema(tema);
                inputBusqueda.value = '';
                sugerenciasCont.classList.remove('mostrar');
                temaPrincipal.scrollIntoView({ behavior: 'smooth', block: 'center' });

                document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('activo'));
                const btnCat = document.querySelector(`.menu-item[data-cat="${tema.cat}"] .menu-btn`);
                if (btnCat) btnCat.classList.add('activo');
            }
        };
    }

    function obtenerTituloPorEstrellas(cantidad) {
    if (cantidad >= 9) return '🌟 Leyenda Medicurativo';
    if (cantidad >= 7) return '⭐ Maestro del Crecimiento';
    if (cantidad >= 5) return '✨ Explorador de Luz';
    if (cantidad >= 3) return '🌱 Aprendiz de la Vida';
    if (cantidad >= 1) return '🌿 Iniciado en el Camino';
    return '🕊️ Buscador de Paz';
}

// Exponer función
window.obtenerTituloPorEstrellas = obtenerTituloPorEstrellas;



    // --- Listeners de botones ---
    document.getElementById('btnAyuda')?.addEventListener('click', window.mostrarAyuda);
    document.getElementById('btnMision')?.addEventListener('click', window.mostrarMision);
    document.getElementById('btnSoporte')?.addEventListener('click', window.mostrarSoporte);
    document.getElementById('btnAgradecimientos')?.addEventListener('click', window.mostrarAgradecimientos);
    

// ================================================
// VARIABLES GLOBALES (DECLARAR AL INICIO)
// ================================================
window.totalEstrellas = 0;
window.totalPublicaciones = 0;
window.userIdGlobal = null;

// ================================================
// FUNCIÓN PARA OBTENER ESTRELLAS DEL USUARIO DESDE TABLA LOGROS
// ================================================
window.obtenerEstrellasUsuario = async function(userId) {
    try {
        console.log('🔍 Buscando estrellas para usuario:', userId);
        
        // Obtener los logros del usuario desde la tabla 'logros'
        const { data: logrosData, error: logrosError } = await supabaseClient
            .from('logros')
            .select('*')
            .eq('usuario_id', userId)
            .maybeSingle();
        
        if (logrosError) {
            console.error('❌ Error al obtener logros:', logrosError);
            return [];
        }
        
        if (!logrosData) {
            console.log('⚠️ No se encontraron logros para el usuario');
            return [];
        }
        
        // Lista de todos los logros posibles (keys que representan logros)
        const keysLogros = [
            'cambio_nombre',
            'cambio_genero',
            'completado_perfil',
            'primera_publicacion',
            'cinco_publicaciones',
            'primera_reflexion',
            'cinco_reflexiones',
            'diez_reflexiones',
            'reflexion_emocion'
        ];
        
        // Filtrar solo los logros que están en true (completados)
        const estrellas = keysLogros.filter(key => logrosData[key] === true);
        
        console.log('⭐ Estrellas encontradas:', estrellas.length, estrellas);
        return estrellas;
        
    } catch (error) {
        console.error('❌ Error al obtener estrellas:', error);
        return [];
    }
};

// ================================================
// FUNCIÓN PARA CONTAR PUBLICACIONES DEL USUARIO
// ================================================
window.contarPublicacionesUsuario = async function(userId) {
    try {
        const { count, error } = await supabaseClient
            .from('publicaciones')
            .select('*', { count: 'exact', head: true })
            .eq('usuario_id', userId);
        
        if (error) {
            console.error('❌ Error al contar publicaciones:', error);
            return 0;
        }
        
        console.log('📊 Publicaciones encontradas:', count || 0);
        return count || 0;
        
    } catch (error) {
        console.error('❌ Excepción al contar publicaciones:', error);
        return 0;
    }
};

// ================================================
// FUNCIÓN PARA VERIFICAR Y GUARDAR LOGROS
// ================================================
async function verificarLogros(userId) {
    try {
        console.log('🔍 Verificando logros para usuario:', userId);
        
        // Obtener datos del usuario
        const { data: userData } = await supabaseClient
            .from('usuarios')
            .select('nombre, genero_id')
            .eq('id', userId)
            .single();

        const tieneNombre = userData && userData.nombre && userData.nombre !== 'Amigo' && userData.nombre !== 'No definido';
        const tieneGenero = userData && userData.genero_id !== null;

        // Contar publicaciones
        const { count: countPublicaciones } = await supabaseClient
            .from('publicaciones')
            .select('*', { count: 'exact', head: true })
            .eq('usuario_id', userId);

        // Contar reflexiones (diario)
        const { count: countReflexiones } = await supabaseClient
            .from('diarios')
            .select('*', { count: 'exact', head: true })
            .eq('usuario_id', userId);

        // Verificar reflexión con emoción
        const { data: reflexionesConEmocion } = await supabaseClient
            .from('diarios')
            .select('id')
            .eq('usuario_id', userId)
            .not('emocion', 'is', null)
            .limit(1);

        const tieneReflexionConEmocion = reflexionesConEmocion && reflexionesConEmocion.length > 0;

        // Construir objeto de logros
        const logros = {
            cambio_nombre: tieneNombre,
            cambio_genero: tieneGenero,
            completado_perfil: tieneNombre && tieneGenero,
            primera_publicacion: countPublicaciones >= 1,
            cinco_publicaciones: countPublicaciones >= 5,
            primera_reflexion: countReflexiones >= 1,
            cinco_reflexiones: countReflexiones >= 5,
            diez_reflexiones: countReflexiones >= 10,
            reflexion_emocion: tieneReflexionConEmocion
        };

        console.log('📊 Logros verificados:', logros);

        // Guardar o actualizar en la tabla logros
        const { error } = await supabaseClient
            .from('logros')
            .upsert({
                usuario_id: userId,
                ...logros,
                actualizado_en: new Date().toISOString()
            });

        if (error) {
            console.error('❌ Error al guardar logros:', error);
        } else {
            console.log('✅ Logros guardados correctamente');
        }

        return logros;

    } catch (error) {
        console.error('❌ Error en verificarLogros:', error);
        return null;
    }
}

// ================================================
// FUNCIÓN PARA RECLAMAR LOGRO (DAR ESTRELLA)
// ================================================
async function reclamarLogro(userId, logroKey, logroTexto) {
    try {
        // Primero verificar si el logro está completado
        const { data: logrosData, error: logrosError } = await supabaseClient
            .from('logros')
            .select(logroKey)
            .eq('usuario_id', userId)
            .maybeSingle();

        if (logrosError) throw logrosError;

        if (!logrosData || logrosData[logroKey] !== true) {
            Swal.fire({
                title: '⚠️ Logro no completado',
                text: `Aún no has completado el logro: "${logroTexto}"`,
                icon: 'info',
                confirmButtonColor: '#9b59b6',
                customClass: { popup: 'swal-popup-redondo' }
            });
            return false;
        }

        // Verificar si ya fue reclamado (usando tabla reclamos)
        const { data: existe, error: checkError } = await supabaseClient
            .from('reclamos')
            .select('id')
            .eq('usuario_id', userId)
            .eq('logro_key', logroKey)
            .maybeSingle();

        if (checkError) throw checkError;

        if (existe) {
            Swal.fire({
                title: '⭐ Ya reclamaste esta estrella',
                text: `Ya reclamaste la estrella por "${logroTexto}"`,
                icon: 'info',
                confirmButtonColor: '#9b59b6',
                customClass: { popup: 'swal-popup-redondo' }
            });
            return false;
        }

        // Reclamar el logro (guardar en reclamos)
        const { error: insertError } = await supabaseClient
            .from('reclamos')
            .insert({
                usuario_id: userId,
                logro_key: logroKey
            });

        if (insertError) {
            if (insertError.code === '42501') {
                Swal.fire({
                    title: '⚠️ Error de permisos',
                    text: 'No se pudo reclamar la estrella. Contacta al administrador.',
                    icon: 'error',
                    confirmButtonColor: '#ff7675',
                    customClass: { popup: 'swal-popup-redondo' }
                });
                return false;
            }
            throw insertError;
        }

        // Éxito - mostrar confeti y estrella
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#f1c40f', '#ffd700', '#9b59b6']
            });
        }

        // Actualizar contador de estrellas global
        const estrellasActuales = await window.obtenerEstrellasUsuario(userId);
        window.totalEstrellas = estrellasActuales.length;

        Swal.fire({
            title: '⭐ ¡Estrella Reclamada!',
            html: `
                <div style="text-align: center; padding: 10px;">
                    <div style="font-size: 4rem; margin-bottom: 10px;">⭐</div>
                    <p style="color: #2c1b4e; font-weight: 600;">¡Has ganado una estrella por:</p>
                    <p style="color: #9b59b6; font-weight: 800; font-size: 1.1rem;">"${logroTexto}"</p>
                    <p style="color: #7f8c8d; font-size: 0.85rem; margin-top: 10px;">Sigue así, cada logro cuenta 🌟</p>
                </div>
            `,
            icon: 'success',
            timer: 2500,
            showConfirmButton: false,
            customClass: { popup: 'swal-popup-redondo' }
        });

        // Sonido de logro
        if (window.achievementSound) {
            window.achievementSound.currentTime = 0;
            window.achievementSound.play().catch(() => {});
        }

        return true;

    } catch (error) {
        console.error('❌ Error al reclamar logro:', error);
        Swal.fire({
            title: 'Error',
            text: 'No pudimos reclamar tu estrella. Intenta de nuevo.',
            icon: 'error',
            confirmButtonColor: '#ff7675',
            customClass: { popup: 'swal-popup-redondo' }
        });
        return false;
    }
}

window.getMarcoSeleccionado = async function() {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        const metadataMarco = session?.user?.user_metadata?.marco_seleccionado;
        if (metadataMarco) {
            return metadataMarco;
        }
    } catch (error) {
        console.warn('No se pudo leer el marco desde auth metadata:', error);
    }

    try {
        const guardado = localStorage.getItem('medicurativo.marco_seleccionado');
        if (guardado) return guardado;
    } catch (error) {
        console.warn('No se pudo leer el marco desde localStorage:', error);
    }

    return 'marco_base';
};

window.guardarMarcoSeleccionado = async function(marcoId) {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        const usuarioId = session?.user?.id || window.userIdGlobal;

        if (session?.user) {
            await supabaseClient.auth.updateUser({ data: { marco_seleccionado: marcoId } });
        }

        if (usuarioId) {
            try {
                await supabaseClient.from('usuarios').update({ marco_seleccionado: marcoId }).eq('id', usuarioId);
            } catch (error) {
                console.warn('No se pudo guardar el marco en usuarios, se usará fallback local:', error);
            }
        }

        localStorage.setItem('medicurativo.marco_seleccionado', marcoId);
        return true;
    } catch (error) {
        localStorage.setItem('medicurativo.marco_seleccionado', marcoId);
        console.error('No se pudo guardar el marco:', error);
        return false;
    }
};

// ================================================
// FUNCIÓN PARA MOSTRAR MARCOS EN SWEETALERT
// ================================================
window.mostrarMarcosSweetAlert = async function() {
    console.log('📊 ABRIENDO MARCOS - Estrellas:', window.totalEstrellas, 'Publicaciones:', window.totalPublicaciones);

    const { data: { session } } = await supabaseClient.auth.getSession();
    const usuarioId = session?.user?.id || window.userIdGlobal;

    // Si no hay datos, recargar del usuario actual
    if (window.totalEstrellas === 0 && window.totalPublicaciones === 0 && window.userIdGlobal) {
        console.log('🔄 Recargando datos del usuario...');
        const estrellas = await window.obtenerEstrellasUsuario(window.userIdGlobal);
        const publicaciones = await window.contarPublicacionesUsuario(window.userIdGlobal);
        window.totalEstrellas = estrellas.length;
        window.totalPublicaciones = publicaciones;
        console.log('🔄 Datos recargados - Estrellas:', window.totalEstrellas, 'Publicaciones:', window.totalPublicaciones);
    }
    
    // Definir los marcos disponibles
    const marcosDisponibles = [
        {
            id: 'marco_base',
            nombre: 'Marco Base',
            imagen: 'imganes/marco.png',
            estrellasRequeridas: 0,
            publicacionesRequeridas: 0,
            descripcion: 'Marco inicial para todos los usuarios'
        },
        {
            id: 'marco_nivel1',
            nombre: 'Marco Bronce',
            imagen: 'imganes/marco1.png',
            estrellasRequeridas: 3,
            publicacionesRequeridas: 0,
            descripcion: 'Alcanza 3 estrellas'
        },
        {
            id: 'marco_nivel2',
            nombre: 'Marco Plata',
            imagen: 'imganes/marco2.png',
            estrellasRequeridas: 5,
            publicacionesRequeridas: 0,
            descripcion: 'Alcanza 5 estrellas'
        },
        {
            id: 'marco_nivel3',
            nombre: 'Marco Oro',
            imagen: 'imganes/marco3.png',
            estrellasRequeridas: 9,
            publicacionesRequeridas: 0,
            descripcion: 'Alcanza 9 estrellas'
        },
        {
            id: 'marco_comunidad',
            nombre: '🌟 Marco Comunidad',
            imagen: 'imganes/comunidad.png',
            estrellasRequeridas: 0,
            publicacionesRequeridas: 10,
            descripcion: '¡Haz 10 publicaciones en la comunidad!'
        }
    ];

    // Obtener datos del usuario desde las variables globales
    const estrellasUsuario = window.totalEstrellas || 0;
    const publicacionesUsuario = window.totalPublicaciones || 0;

    let marcoSeleccionadoActual = await window.getMarcoSeleccionado();

    console.log('📊 DATOS FINALES - Estrellas:', estrellasUsuario, 'Publicaciones:', publicacionesUsuario);

    // Generar HTML para cada marco
    let marcosHtml = '';
    marcosDisponibles.forEach(marco => {
        const cumpleEstrellas = estrellasUsuario >= marco.estrellasRequeridas;
        const cumplePublicaciones = publicacionesUsuario >= marco.publicacionesRequeridas;
        
        const desbloqueado = (marco.estrellasRequeridas === 0 && marco.publicacionesRequeridas === 0) 
            ? true 
            : cumpleEstrellas && cumplePublicaciones;
        
        const claseEstado = desbloqueado ? 'desbloqueado' : 'bloqueado';
        
        let textoEstado = '';
        if (marco.publicacionesRequeridas > 0) {
            textoEstado = desbloqueado 
                ? '✅ Desbloqueado' 
                : `🔒 Requiere ${marco.publicacionesRequeridas} publicaciones (tienes ${publicacionesUsuario})`;
        } else if (marco.estrellasRequeridas > 0) {
            textoEstado = desbloqueado 
                ? '✅ Desbloqueado' 
                : `🔒 Requiere ${marco.estrellasRequeridas} ⭐ (tienes ${estrellasUsuario})`;
        } else {
            textoEstado = '✅ Siempre disponible';
        }
        
        const claseTextoEstado = desbloqueado ? 'desbloqueado-text' : 'bloqueado-text';
        const esSeleccionado = marcoSeleccionadoActual === marco.id;
        const botonSeleccionar = desbloqueado ? `<button class="swal-perfil-btn" style="margin-top:8px; padding:8px 12px; font-size:0.8rem; ${esSeleccionado ? 'background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white;' : ''}" onclick="window.seleccionarMarco('${marco.id}', '${usuarioId}')">${esSeleccionado ? '✅ Seleccionado' : 'Elegir marco'}</button>` : '';

        marcosHtml += `
            <div class="marco-item ${claseEstado} ${esSeleccionado ? 'marco-item-seleccionado' : ''}">
                <img src="${marco.imagen}" alt="${marco.nombre}" loading="lazy" 
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Crect width=%22120%22 height=%22120%22 fill=%22%23333%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23fff%22 font-size=%2214%22%3EMarco%3C/text%3E%3C/svg%3E'">
                <span class="nombre-marco">${marco.nombre}</span>
                <span class="estado-marco ${claseTextoEstado}">${textoEstado}</span>
                <small style="display:block; font-size:0.65rem; color:#7f8c8d; margin-top:4px;">${marco.descripcion}</small>
                ${desbloqueado ? `<span style="font-size:1.2rem; margin-top:4px; display:block;">${marco.id === 'marco_comunidad' ? '🌟' : '👑'}</span>` : ''}
                ${botonSeleccionar}
            </div>
        `;
    });

    // Mostrar SweetAlert con los marcos
    Swal.fire({
        title: '🏆 Todos los Marcos',
        html: `
            <div style="max-height: 500px; overflow-y: auto; padding: 5px;">
                <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 15px; flex-wrap: wrap;">
                    <p style="color: #b0a4e3; font-size: 0.9rem; margin: 0;">
                        <i class="fas fa-star" style="color: #ffd700;"></i> 
                        Tus estrellas: ${'⭐'.repeat(Math.min(estrellasUsuario, 10))} (${estrellasUsuario})
                    </p>
                    <p style="color: #b0a4e3; font-size: 0.9rem; margin: 0;">
                        <i class="fas fa-users" style="color: #9b59b6;"></i> 
                        Tus publicaciones: ${publicacionesUsuario}
                    </p>
                </div>
                <div class="marcos-grid">
                    ${marcosHtml}
                </div>
                <p style="color: #7f8c8d; font-size: 0.75rem; margin-top: 15px; font-style: italic;">
                    <i class="fas fa-info-circle"></i> 
                    ${publicacionesUsuario >= 10 ? '🎉 ¡Felicidades! Has desbloqueado el Marco Comunidad.' : 'Comparte más en la comunidad para desbloquear el marco especial.'}
                </p>
            </div>
        `,
        showConfirmButton: true,
        confirmButtonColor: '#ffd700',
        confirmButtonText: 'Cerrar',
        customClass: {
            popup: 'swal-popup-redondo'
        }
    });
};

window.seleccionarMarco = async function(marcoId, usuarioId) {
    const guardado = await window.guardarMarcoSeleccionado(marcoId);

    if (guardado) {
        Swal.fire({
            title: '¡Marco actualizado! ✨',
            text: 'Tu selección se ha guardado y se verá en tu perfil.',
            icon: 'success',
            confirmButtonColor: '#9b59b6',
            customClass: { popup: 'swal-popup-redondo' }
        }).then(() => {
            if (document.getElementById('btnPerfil')) {
                document.getElementById('btnPerfil').click();
            }
        });
    } else {
        Swal.fire({
            title: 'No se pudo guardar',
            text: 'Intenta de nuevo en unos segundos.',
            icon: 'error',
            confirmButtonColor: '#ff7675',
            customClass: { popup: 'swal-popup-redondo' }
        });
    }
};

// ================================================
// FUNCIÓN PARA RECLAMAR LOGRO DESDE MODAL
// ================================================
window.reclamarLogroDesdeModal = async function(logroKey, logroTexto, userId) {
    Swal.close();
    setTimeout(async () => {
        const reclamado = await reclamarLogro(userId, logroKey, logroTexto);
        if (reclamado) {
            // Recargar el perfil
            document.getElementById('btnPerfil')?.click();
        }
    }, 300);
};

// ============================================================
// --- Lógica de Perfil de Usuario ---
// ============================================================
document.getElementById('btnPerfil')?.addEventListener('click', async function() {
    // ============================================================
    // MOSTRAR SWEETALERT DE CARGANDO
    // ============================================================
    let loadingSwal = null;
    
    function mostrarLoading() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const bgColor = isDarkMode ? '#1a1a2e' : '#fdfaff';
        const textColor = isDarkMode ? '#ffffff' : '#2c1b4e';
        
        loadingSwal = Swal.fire({
            title: '',
            html: `
                <div style="text-align: center; padding: 10px 5px;">
                    <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                        <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #f0e6ff, #e6fffa); padding: 4px; box-shadow: 0 8px 25px rgba(155, 89, 182, 0.2);">
                            <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                                <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-bottom: 6px;">
                        <div class="loading-spinner" style="width: 28px; height: 28px; border: 3px solid #f0e6ff; border-top: 3px solid #9b59b6; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
                        <span style="color: ${textColor}; font-weight: 700; font-size: 1.2rem;">Cargando perfil...</span>
                    </div>
                    <p style="color: #9b59b6; font-size: 0.85rem; margin-top: 4px; font-weight: 500;">
                        <i class="fas fa-spa" style="margin-right: 6px;"></i> Preparando tu experiencia
                    </p>
                    <style>
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    </style>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: false,
            allowOutsideClick: false,
            background: bgColor,
            customClass: { 
                popup: 'swal-loading-popup'
            }
        });
    }

    try {
        mostrarLoading();

        const { data: { session } } = await supabaseClient.auth.getSession();

        if (!session) {
            if (loadingSwal) loadingSwal.close();
            return Swal.fire({
                title: 'Mi Cuenta',
                text: 'Inicia sesión para ver tu perfil y personalizar tu experiencia.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Ir a Login',
                confirmButtonColor: '#9b59b6'
            }).then(r => r.isConfirmed && (window.location.href = 'login.html'));
        }

        const userId = session.user.id;
        const nombre = session.user.user_metadata?.nombre || "No definido";
        const correo = session.user.email;
        const generoId = session.user.user_metadata?.genero_id;
        const avatar = generoId == 1 ? '👨‍💻' : (generoId == 2 ? '👩‍💻' : '👤');
        const generoTexto = generoId == 1 ? "Caballero" : (generoId == 2 ? "Dama" : "No especificado");

        // ============================================================
        // OBTENER RESULTADO DEL TEST DE PERSONALIDAD
        // ============================================================
        let resultadoTest = null;
        try {
            const { data: testData, error: testError } = await supabaseClient
                .from('test_resultados')
                .select('tipo_personalidad, titulo, icono, subtitulo')
                .eq('usuario_id', userId)
                .order('fecha_realizado', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (!testError && testData) {
                resultadoTest = testData;
            }
        } catch (e) {
            console.log('No se pudo obtener el test:', e);
        }

        // ============================================================
        // VERIFICAR LOGROS DEL USUARIO
        // ============================================================
        await verificarLogros(userId);

        // ============================================================
        // OBTENER ESTRELLAS DEL USUARIO (DESDE TABLA LOGROS)
        // ============================================================
        let estrellasReclamadas = [];
        try {
            estrellasReclamadas = await window.obtenerEstrellasUsuario(userId);
            console.log('⭐ Estrellas obtenidas:', estrellasReclamadas.length, estrellasReclamadas);
        } catch (e) {
            console.error('❌ Error al obtener estrellas:', e);
        }
        const totalEstrellas = estrellasReclamadas.length;

        // ============================================================
        // CONTAR PUBLICACIONES DEL USUARIO
        // ============================================================
        let totalPublicaciones = 0;
        try {
            totalPublicaciones = await window.contarPublicacionesUsuario(userId);
            console.log('📊 Publicaciones obtenidas:', totalPublicaciones);
        } catch (e) {
            console.error('❌ Error al contar publicaciones:', e);
        }

        // ================================================
        // ACTUALIZAR VARIABLES GLOBALES
        // ================================================
        window.totalEstrellas = totalEstrellas;
        window.totalPublicaciones = totalPublicaciones;
        window.userIdGlobal = userId;

        console.log('🌍 VARIABLES GLOBALES - Estrellas:', window.totalEstrellas, 'Publicaciones:', window.totalPublicaciones);

        // ================================================
        // TÍTULO, COLOR Y MARCO SEGÚN ESTRELLAS Y PUBLICACIONES
        // ================================================
        let tituloUsuario = '🕊️ Buscador de Paz';
        let fraseUsuario = 'Cada día es una nueva oportunidad para crecer';
        let colorNombre = '#2c1b4e';
        let colorBordePerfil = '#e0d0f0';
        let tamañoNombre = '1.4rem';
        let marcoAvatar = '';
        let tamañoAvatar = '60px';
        let tamañoMarco = '130px';
        let imagenMarco = 'imganes/marco.png';
        let decoracionAvatar = '';
        let efectoFondo = '';
        let mostrarEfecto = false;
        let marcoSeleccionado = await window.getMarcoSeleccionado();
        
        let estrellasVisuales = '';
        let glowEstrella = '';

        const marcoMap = {
            marco_base: { imagen: 'imganes/marco.png', titulo: '🕊️ Buscador de Paz', frase: 'Cada día es una nueva oportunidad para crecer', color: '#2c1b4e', borde: '#e0d0f0', tamañoNombre: '1.4rem', tamañoMarco: '130px', tamañoAvatar: '60px' },
            marco_nivel1: { imagen: 'imganes/marco1.png', titulo: '🌱 Aprendiz de la Vida', frase: '🌻 Cada paso te acerca más a tu esencia', color: '#d4a017', borde: '#d4a017', tamañoNombre: '1.5rem', tamañoMarco: '130px', tamañoAvatar: '70px' },
            marco_nivel2: { imagen: 'imganes/marco2.png', titulo: '✨ Explorador de Luz', frase: '🌱 Sigues brillando en tu viaje interior', color: '#e8b800', borde: '#e8b800', tamañoNombre: '1.6rem', tamañoMarco: '140px', tamañoAvatar: '75px' },
            marco_nivel3: { imagen: 'imganes/marco3.png', titulo: '🌟 Leyenda Medicurativo', frase: '✨ Iluminas el camino de los demás con tu luz', color: '#ffd700', borde: '#ffd700', tamañoNombre: '2rem', tamañoMarco: '160px', tamañoAvatar: '85px' },
            marco_comunidad: { imagen: 'imganes/comunidad.png', titulo: '🌟 Leyenda Medicurativo', frase: '✨ Iluminas el camino de los demás con tu luz', color: '#ffd700', borde: '#ffd700', tamañoNombre: '2rem', tamañoMarco: '160px', tamañoAvatar: '85px' }
        };

        const marcoGuardado = marcoMap[marcoSeleccionado] || marcoMap.marco_base;
        const tieneMarcoComunidad = totalPublicaciones >= 10;
        const marcoSeleccionadoEsValido = marcoSeleccionado === 'marco_base' ||
            (marcoSeleccionado === 'marco_nivel1' && totalEstrellas >= 3) ||
            (marcoSeleccionado === 'marco_nivel2' && totalEstrellas >= 5) ||
            (marcoSeleccionado === 'marco_nivel3' && totalEstrellas >= 9) ||
            (marcoSeleccionado === 'marco_comunidad' && totalPublicaciones >= 10);
        const marcoElegido = marcoSeleccionadoEsValido
            ? marcoSeleccionado
            : (tieneMarcoComunidad ? 'marco_comunidad' : totalEstrellas >= 9 ? 'marco_nivel3' : totalEstrellas >= 5 ? 'marco_nivel2' : totalEstrellas >= 3 ? 'marco_nivel1' : 'marco_base');
        console.log('🎯 ¿Tiene marco comunidad?', tieneMarcoComunidad, 'Publicaciones:', totalPublicaciones);

        if (tieneMarcoComunidad && marcoElegido === 'marco_comunidad') {
            // ⭐ MARCO COMUNIDAD (prioridad máxima)
            tituloUsuario = '🌟 Leyenda Medicurativo';
            fraseUsuario = '✨ Iluminas el camino de los demás con tu luz';
            colorNombre = '#ffd700';
            colorBordePerfil = '#ffd700';
            tamañoNombre = '2rem';
            tamañoMarco = '160px';
            tamañoAvatar = '85px';
            imagenMarco = 'imganes/comunidad.png';
            marcoAvatar = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${tamañoMarco};
                height: ${tamañoMarco};
                background: url('${imagenMarco}') no-repeat center center;
                background-size: contain;
                z-index: 10;
                animation: glowMarcoPremium 2s ease-in-out infinite;
                pointer-events: none;
                filter: drop-shadow(0 0 30px rgba(255,215,0,0.5));
            `;
            decoracionAvatar = `
                <div style="position: absolute; top: -20px; right: -20px; font-size: 2rem; animation: pulse 2s infinite; z-index: 15;">👑</div>
            `;
            mostrarEfecto = true;
            efectoFondo = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; overflow: hidden;">
                    <div style="position: absolute; top: 10%; left: 5%; font-size: 2rem; animation: floatStar 8s ease-in-out infinite;">⭐</div>
                    <div style="position: absolute; top: 20%; right: 10%; font-size: 1.5rem; animation: floatStar 10s ease-in-out infinite 2s;">✨</div>
                    <div style="position: absolute; bottom: 30%; left: 8%; font-size: 1.8rem; animation: floatStar 9s ease-in-out infinite 4s;">🌟</div>
                    <div style="position: absolute; bottom: 20%; right: 5%; font-size: 2.2rem; animation: floatStar 7s ease-in-out infinite 1s;">⭐</div>
                </div>
            `;
            glowEstrella = `
                <div style="position: relative; display: inline-block;">
                    <div style="font-size: 6rem; animation: pulseGlow 2s ease-in-out infinite; text-shadow: 0 0 40px rgba(255,215,0,0.8), 0 0 80px rgba(255,215,0,0.4), 0 0 120px rgba(255,215,0,0.2);">
                        ⭐
                    </div>
                </div>
            `;
            
        } else if (marcoElegido === 'marco_nivel3' && totalEstrellas >= 9) {
            tituloUsuario = '🌟 Leyenda Medicurativo';
            fraseUsuario = '✨ Iluminas el camino de los demás con tu luz';
            colorNombre = '#ffd700';
            colorBordePerfil = '#ffd700';
            tamañoNombre = '2rem';
            tamañoMarco = '160px';
            tamañoAvatar = '85px';
            imagenMarco = 'imganes/marco3.png';
            marcoAvatar = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${tamañoMarco};
                height: ${tamañoMarco};
                background: url('${imagenMarco}') no-repeat center center;
                background-size: contain;
                z-index: 10;
                animation: glowMarcoPremium 2s ease-in-out infinite;
                pointer-events: none;
                filter: drop-shadow(0 0 30px rgba(255,215,0,0.5));
            `;
            decoracionAvatar = `
                <div style="position: absolute; top: -20px; right: -20px; font-size: 2rem; animation: pulse 2s infinite; z-index: 15;">👑</div>
            `;
            mostrarEfecto = true;
            efectoFondo = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; overflow: hidden;">
                    <div style="position: absolute; top: 10%; left: 5%; font-size: 2rem; animation: floatStar 8s ease-in-out infinite;">⭐</div>
                    <div style="position: absolute; top: 20%; right: 10%; font-size: 1.5rem; animation: floatStar 10s ease-in-out infinite 2s;">✨</div>
                    <div style="position: absolute; bottom: 30%; left: 8%; font-size: 1.8rem; animation: floatStar 9s ease-in-out infinite 4s;">🌟</div>
                    <div style="position: absolute; bottom: 20%; right: 5%; font-size: 2.2rem; animation: floatStar 7s ease-in-out infinite 1s;">⭐</div>
                </div>
            `;
            glowEstrella = `
                <div style="position: relative; display: inline-block;">
                    <div style="font-size: 6rem; animation: pulseGlow 2s ease-in-out infinite; text-shadow: 0 0 40px rgba(255,215,0,0.8), 0 0 80px rgba(255,215,0,0.4), 0 0 120px rgba(255,215,0,0.2);">
                        ⭐
                    </div>
                </div>
            `;
        } else if (marcoElegido === 'marco_nivel2' && totalEstrellas >= 5) {
            tituloUsuario = '⭐ Maestro del Crecimiento';
            fraseUsuario = '🌿 Has alcanzado la sabiduría del alma';
            colorNombre = '#c0a000';
            colorBordePerfil = '#c0a000';
            tamañoNombre = '1.8rem';
            tamañoMarco = '150px';
            tamañoAvatar = '80px';
            imagenMarco = 'imganes/marco2.png';
            marcoAvatar = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${tamañoMarco};
                height: ${tamañoMarco};
                background: url('${imagenMarco}') no-repeat center center;
                background-size: contain;
                z-index: 10;
                animation: glowMarco 2s ease-in-out infinite;
                pointer-events: none;
                filter: drop-shadow(0 0 20px rgba(192,160,0,0.4));
            `;
            decoracionAvatar = `
                <div style="position: absolute; top: -15px; right: -15px; font-size: 1.5rem; z-index: 15;">⭐</div>
            `;
            mostrarEfecto = true;
            efectoFondo = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; overflow: hidden;">
                    <div style="position: absolute; top: 15%; left: 8%; font-size: 1.5rem; animation: floatStar 9s ease-in-out infinite;">✨</div>
                    <div style="position: absolute; bottom: 25%; right: 10%; font-size: 1.8rem; animation: floatStar 8s ease-in-out infinite 3s;">⭐</div>
                    <div style="position: absolute; top: 45%; left: 3%; font-size: 1.2rem; animation: floatStar 7s ease-in-out infinite 1s;">🌟</div>
                </div>
            `;
            glowEstrella = `
                <div style="position: relative; display: inline-block;">
                    <div style="font-size: 5rem; animation: pulseGlow 2s ease-in-out infinite; text-shadow: 0 0 30px rgba(192,160,0,0.7), 0 0 60px rgba(192,160,0,0.3);">
                        ⭐
                    </div>
                </div>
            `;
        } else if (marcoElegido === 'marco_nivel1' && totalEstrellas >= 3) {
            tituloUsuario = '✨ Explorador de Luz';
            fraseUsuario = '🌱 Sigues brillando en tu viaje interior';
            colorNombre = '#e8b800';
            colorBordePerfil = '#e8b800';
            tamañoNombre = '1.6rem';
            tamañoMarco = '140px';
            tamañoAvatar = '75px';
            imagenMarco = 'imganes/marco1.png';
            marcoAvatar = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${tamañoMarco};
                height: ${tamañoMarco};
                background: url('${imagenMarco}') no-repeat center center;
                background-size: contain;
                z-index: 10;
                animation: glowMarco 2s ease-in-out infinite;
                pointer-events: none;
                filter: drop-shadow(0 0 15px rgba(232,184,0,0.3));
            `;
            decoracionAvatar = `
                <div style="position: absolute; top: -12px; right: -12px; font-size: 1.3rem; z-index: 15;">✨</div>
            `;
            mostrarEfecto = true;
            efectoFondo = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; overflow: hidden;">
                    <div style="position: absolute; top: 20%; left: 10%; font-size: 1.3rem; animation: floatStar 10s ease-in-out infinite;">✨</div>
                    <div style="position: absolute; bottom: 30%; right: 8%; font-size: 1.5rem; animation: floatStar 8s ease-in-out infinite 2s;">⭐</div>
                </div>
            `;
            glowEstrella = `
                <div style="position: relative; display: inline-block;">
                    <div style="font-size: 4.5rem; animation: pulseGlow 2s ease-in-out infinite; text-shadow: 0 0 25px rgba(232,184,0,0.6), 0 0 50px rgba(232,184,0,0.25);">
                        ⭐
                    </div>
                </div>
            `;
        } else if (totalEstrellas >= 3) {
            tituloUsuario = '🌱 Aprendiz de la Vida';
            fraseUsuario = '🌻 Cada paso te acerca más a tu esencia';
            colorNombre = '#d4a017';
            colorBordePerfil = '#d4a017';
            tamañoNombre = '1.5rem';
            tamañoMarco = '130px';
            tamañoAvatar = '70px';
            imagenMarco = 'imganes/marco.png';
            marcoAvatar = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${tamañoMarco};
                height: ${tamañoMarco};
                background: url('${imagenMarco}') no-repeat center center;
                background-size: contain;
                z-index: 10;
                pointer-events: none;
            `;
            decoracionAvatar = '';
            mostrarEfecto = false;
            estrellasVisuales = '⭐'.repeat(3);
        } else if (totalEstrellas >= 1) {
            tituloUsuario = '🌿 Iniciado en el Camino';
            fraseUsuario = '🌺 Has dado el primer paso hacia tu bienestar';
            colorNombre = '#b8860b';
            colorBordePerfil = '#b8860b';
            tamañoNombre = '1.4rem';
            tamañoMarco = '120px';
            tamañoAvatar = '65px';
            imagenMarco = 'imganes/marco.png';
            marcoAvatar = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${tamañoMarco};
                height: ${tamañoMarco};
                background: url('${imagenMarco}') no-repeat center center;
                background-size: contain;
                z-index: 10;
                pointer-events: none;
            `;
            decoracionAvatar = '';
            mostrarEfecto = false;
            estrellasVisuales = '⭐';
        }

        const tieneMarco = totalEstrellas > 0 || totalPublicaciones >= 10 || marcoElegido !== 'marco_base';

        let estrellasDisplay = '';
        if (totalEstrellas >= 3) {
            estrellasDisplay = glowEstrella;
        } else if (totalEstrellas > 0) {
            estrellasDisplay = `<span style="font-size: 3rem; letter-spacing: 8px;">${estrellasVisuales}</span>`;
        }

        if (marcoElegido !== 'marco_base' && marcoElegido !== 'marco_nivel1' && marcoElegido !== 'marco_nivel2' && marcoElegido !== 'marco_nivel3' && marcoElegido !== 'marco_comunidad') {
            imagenMarco = 'imganes/marco.png';
        }

        if (marcoGuardado && marcoGuardado.imagen && marcoSeleccionadoEsValido) {
            imagenMarco = marcoGuardado.imagen;
            tituloUsuario = marcoGuardado.titulo;
            fraseUsuario = marcoGuardado.frase;
            colorNombre = marcoGuardado.color;
            colorBordePerfil = marcoGuardado.borde;
            tamañoNombre = marcoGuardado.tamañoNombre;
            tamañoMarco = marcoGuardado.tamañoMarco;
            tamañoAvatar = marcoGuardado.tamañoAvatar;
        }

        if (mostrarEfecto && typeof confetti === 'function') {
            setTimeout(() => {
                confetti({
                    particleCount: 60,
                    spread: 70,
                    origin: { y: 0.3 },
                    colors: ['#ffd700', '#f1c40f', '#e8b800', '#c0a000', '#ffffff']
                });
                setTimeout(() => {
                    confetti({
                        particleCount: 40,
                        spread: 50,
                        origin: { y: 0.4, x: 0.3 },
                        colors: ['#ffd700', '#f39c12', '#f1c40f']
                    });
                    confetti({
                        particleCount: 40,
                        spread: 50,
                        origin: { y: 0.4, x: 0.7 },
                        colors: ['#ffd700', '#f39c12', '#f1c40f']
                    });
                }, 400);
            }, 300);
        }

        // ================================================
        // CONSTRUIR ETIQUETA DEL TEST
        // ================================================
        let testBadgeHtml = '';
        if (resultadoTest) {
            let tituloLimpio = resultadoTest.titulo || 'Test de Personalidad';
            tituloLimpio = tituloLimpio.replace(/^[^\w\s]+\s*/, '').trim();
            
            const iconoTest = resultadoTest.icono || '🧠';
            
            let badgeColor = '#9b59b6';
            let badgeBg = 'rgba(155, 89, 182, 0.15)';
            let borderColor = '#9b59b660';
            if (resultadoTest.tipo_personalidad === 'alegre') {
                badgeColor = '#f1c40f';
                badgeBg = 'rgba(241, 196, 15, 0.18)';
                borderColor = '#f1c40f70';
            } else if (resultadoTest.tipo_personalidad === 'amoroso') {
                badgeColor = '#e84393';
                badgeBg = 'rgba(232, 67, 147, 0.15)';
                borderColor = '#e8439370';
            } else if (resultadoTest.tipo_personalidad === 'sabio') {
                badgeColor = '#3498db';
                badgeBg = 'rgba(52, 152, 219, 0.15)';
                borderColor = '#3498db70';
            } else if (resultadoTest.tipo_personalidad === 'elegante') {
                badgeColor = '#27ae60';
                badgeBg = 'rgba(39, 174, 96, 0.15)';
                borderColor = '#27ae6070';
            } else if (resultadoTest.tipo_personalidad === 'fuerte') {
                badgeColor = '#e67e22';
                badgeBg = 'rgba(230, 126, 34, 0.15)';
                borderColor = '#e67e2270';
            }
            
            testBadgeHtml = `
                <span style="
                    display: inline-block;
                    background: ${badgeBg};
                    color: ${badgeColor};
                    font-size: 0.8rem;
                    font-weight: 700;
                    padding: 5px 14px 5px 12px;
                    border-radius: 50px;
                    margin-left: 10px;
                    vertical-align: middle;
                    border: 2px solid ${borderColor};
                    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
                    white-space: nowrap;
                    letter-spacing: 0.3px;
                    line-height: 1.5;
                ">
                    ${iconoTest} ${tituloLimpio}
                </span>
            `;
        }

        // ================================================
        // CONSTRUIR AVATAR CON MARCO
        // ================================================
        let avatarHtml = '';
        if (tieneMarco) {
            avatarHtml = `
                <div style="position: relative; display: inline-block; margin-bottom: 5px;">
                    <div style="position: relative; width: ${tamañoMarco}; height: ${tamañoMarco}; margin: 0 auto;">
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 5; font-size: ${tamañoAvatar}; line-height: 1; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
                            ${avatar}
                        </div>
                        <div style="${marcoAvatar}"></div>
                        ${decoracionAvatar}
                    </div>
                </div>
            `;
        } else {
            avatarHtml = `
                <div style="position: relative; display: inline-block; margin-bottom: 5px;">
                    <div style="font-size: ${tamañoAvatar}; display: inline-block; border-radius: 50%;">
                        ${avatar}
                    </div>
                </div>
            `;
        }

        if (loadingSwal) loadingSwal.close();

        // ================================================
        // MOSTRAR SWEETALERT DEL PERFIL
        // ================================================
        Swal.fire({
            title: 'Perfil de Usuario',
            html: `
                <div style="text-align: center; padding: 5px; position: relative; z-index: 10;">
                    ${efectoFondo}
                    ${avatarHtml}
                    <h3 class="swal-perfil-nombre" style="color: ${colorNombre}; transition: color 0.5s ease; margin-bottom: 2px; font-size: ${tamañoNombre}; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 2px;">
                        ${nombre}
                        ${testBadgeHtml}
                    </h3>
                    ${totalEstrellas > 0 ? `
                        <div style="margin: 5px 0;">
                            ${estrellasDisplay}
                        </div>
                        <div style="font-size: 1.1rem; font-weight: 600; color: ${colorNombre}; margin: 5px 0 8px 0;">
                            ${tituloUsuario}
                        </div>
                        <div style="font-size: 0.9rem; color: #7f8c8d; font-style: italic; margin-bottom: 10px; padding: 8px 16px; background: rgba(155, 89, 182, 0.06); border-radius: 20px; display: inline-block;">
                            "${fraseUsuario}"
                        </div>
                    ` : `
                        <p class="swal-perfil-genero" style="margin-top: 2px;">${generoTexto}</p>
                        <div style="font-size: 0.85rem; color: #b0a4e3; margin: 8px 0; font-style: italic;">
                            🌱 Comienza tu viaje de crecimiento
                        </div>
                    `}
                    
                    <div class="swal-perfil-info-box">
                        <small>Correo Electrónico</small>
                        <p>${correo}</p>
                    </div>

                    <div class="swal-perfil-section">
                        <div class="swal-perfil-section-header personal" data-target="personal-content">
                            <span><i class="fas fa-user-edit"></i> Datos Personales</span>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                        <div class="swal-perfil-section-content" id="personal-content">
                            <button onclick="window.editarNombre()" class="swal-perfil-btn"><i class="fas fa-user-edit"></i> Editar Nombre</button>
                            <button onclick="window.editarGenero()" class="swal-perfil-btn"><i class="fas fa-venus-mars"></i> Editar Género</button>
                        </div>
                    </div>

                    <div class="swal-perfil-section">
                        <div class="swal-perfil-section-header security" data-target="security-content">
                            <span><i class="fas fa-key"></i> Seguridad</span>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                        <div class="swal-perfil-section-content" id="security-content">
                            <button onclick="window.recuperarPassword()" class="swal-perfil-btn"><i class="fas fa-key"></i> Cambiar Contraseña</button>
                        </div>
                    </div>

                    <div class="swal-perfil-section">
                        <div class="swal-perfil-section-header test" data-target="test-content" style="border-left-color: #9b59b6;">
                            <span><i class="fas fa-brain" style="color: #9b59b6;"></i> Test de Personalidad</span>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                        <div class="swal-perfil-section-content" id="test-content">
                            <button onclick="window.location.href='test.html'" class="swal-perfil-btn" style="background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; border: none; padding: 12px 24px; border-radius: 30px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(155, 89, 182, 0.3);">
                                <i class="fas fa-brain"></i> Realizar Test de Personalidad
                            </button>
                            <p style="font-size: 0.75rem; color: #b0a4e3; margin-top: 6px; font-style: italic;">
                                Descubre tu tipo de personalidad y fortalezas
                            </p>
                        </div>
                    </div>

                    <!-- 🆕 SECCIÓN: MARCOS -->
                    <div class="swal-perfil-section">
                        <div class="swal-perfil-section-header marcos" data-target="marcos-content" style="border-left-color: #ffd700;">
                            <span><i class="fas fa-image" style="color: #ffd700;"></i> Marcos</span>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                        <div class="swal-perfil-section-content" id="marcos-content">
                            <button onclick="window.mostrarMarcosSweetAlert()" class="swal-perfil-btn" style="background: linear-gradient(135deg, #ffd700, #f0c000); color: #333; border: none; padding: 12px 24px; border-radius: 30px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);">
                                <i class="fas fa-image"></i> Ver todos los Marcos disponibles
                            </button>
                            <p style="font-size: 0.75rem; color: #b0a4e3; margin-top: 6px; font-style: italic;">
                                Desbloquea marcos según tu nivel de estrellas y publicaciones
                            </p>
                        </div>
                    </div>

                    <div class="swal-perfil-section">
                        <div class="swal-perfil-section-header rating" data-target="rating-content">
                            <span><i class="fas fa-star"></i> Calificación de Página</span>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                        <div class="swal-perfil-section-content" id="rating-content">
                            <div id="userRatingDisplay" style="padding: 10px;">Cargando...</div>
                            <button onclick="window.mostrarCalificacionSweetAlert()" class="swal-perfil-btn"><i class="fas fa-star-half-alt"></i> Calificar / Ver Opiniones</button>
                        </div>
                    </div>

                    <div class="swal-perfil-section">
                        <div class="swal-perfil-section-header achievements" data-target="achievements-content">
                            <span><i class="fas fa-trophy"></i> Mis Logros</span>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                        <div class="swal-perfil-section-content" id="achievements-content">
                            <div id="userAchievementsDisplay">Cargando...</div>
                            <button id="btnVerTodosLogros" class="swal-perfil-btn" style="margin-top: 10px; background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; border: none; padding: 8px 20px; border-radius: 30px; font-weight: 600; cursor: pointer; display: none;">
                                <i class="fas fa-list-ul"></i> Ver todos los logros
                            </button>
                        </div>
                    </div>

                    <div class="swal-perfil-section">
                        <div class="swal-perfil-section-header diary" data-target="diary-content">
                            <span><i class="fas fa-book"></i> Mi Diario Personal</span>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                        <div class="swal-perfil-section-content" id="diary-content">
                            <button onclick="window.location.href='diario.html'" class="swal-perfil-btn"><i class="fas fa-edit"></i> Escribir en mi Diario</button>
                        </div>
                    </div>

                    <div class="swal-perfil-section">
                        <div class="swal-perfil-section-header about" data-target="about-content">
                            <span><i class="fas fa-users"></i> ¿Quiénes somos?</span>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                        <div class="swal-perfil-section-content" id="about-content">
                            <button onclick="window.location.href='somos.html'" class="swal-perfil-btn"><i class="fas fa-info-circle"></i> Conoce más sobre nosotros</button>
                        </div>
                    </div>

                    <div class="swal-perfil-section">
                        <div class="swal-perfil-section-header session" data-target="session-content">
                            <span><i class="fas fa-sign-out-alt"></i> Mi Sesión</span>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                        <div class="swal-perfil-section-content" id="session-content">
                            <button id="btnLogout" class="swal-perfil-btn swal-perfil-btn-logout"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            customClass: { 
                popup: `swal-popup-redondo swal-popup-perfil ${totalEstrellas > 0 ? 'swal-perfil-borde-' + totalEstrellas : ''}`,
                closeButton: 'swal2-close-custom'
            },
            didOpen: () => {
                const popup = document.querySelector('.swal-popup-perfil');
                if (popup && (totalEstrellas > 0 || totalPublicaciones >= 10)) {
                    popup.style.border = `3px solid ${colorBordePerfil}`;
                    popup.style.boxShadow = `0 25px 60px ${colorBordePerfil}40, 0 0 40px ${colorBordePerfil}20`;
                }

                const style = document.createElement('style');
                style.textContent = `
                    @keyframes floatStar {
                        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
                        50% { transform: translateY(-30px) rotate(20deg); opacity: 1; }
                    }
                    @keyframes pulseGlow {
                        0%, 100% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.1); opacity: 0.8; }
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                    @keyframes glowMarco {
                        0%, 100% { filter: drop-shadow(0 0 15px rgba(255,215,0,0.3)); }
                        50% { filter: drop-shadow(0 0 35px rgba(255,215,0,0.7)); }
                    }
                    @keyframes glowMarcoPremium {
                        0%, 100% { 
                            filter: drop-shadow(0 0 25px rgba(255,215,0,0.5));
                            transform: translate(-50%, -50%) scale(1);
                        }
                        50% { 
                            filter: drop-shadow(0 0 50px rgba(255,215,0,0.9));
                            transform: translate(-50%, -50%) scale(1.05);
                        }
                    }
                    /* Estilos para la galería de marcos */
                    .marcos-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 20px;
                        padding: 15px;
                        margin-top: 10px;
                    }
                    .marco-item {
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 15px;
                        padding: 15px;
                        text-align: center;
                        transition: all 0.3s ease;
                        border: 2px solid transparent;
                        cursor: default;
                    }
                    .marco-item:hover {
                        transform: translateY(-5px);
                        border-color: rgba(255, 215, 0, 0.3);
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    }
                    .marco-item.desbloqueado {
                        border-color: #ffd700;
                        background: rgba(255, 215, 0, 0.08);
                    }
                    .marco-item-seleccionado {
                        border-color: #9b59b6 !important;
                        box-shadow: 0 0 0 2px rgba(155, 89, 182, 0.25), 0 10px 25px rgba(155, 89, 182, 0.2);
                        transform: translateY(-3px);
                    }
                    .marco-item.bloqueado {
                        opacity: 0.5;
                        filter: grayscale(1);
                    }
                    .marco-item img {
                        width: 100%;
                        max-width: 120px;
                        height: auto;
                        border-radius: 10px;
                        margin-bottom: 8px;
                    }
                    .marco-item .nombre-marco {
                        font-size: 0.9rem;
                        font-weight: 600;
                        color: #fff;
                        display: block;
                        margin-top: 5px;
                    }
                    .marco-item .estado-marco {
                        font-size: 0.75rem;
                        color: #b0a4e3;
                        display: block;
                        margin-top: 3px;
                    }
                    .marco-item .estado-marco.desbloqueado-text {
                        color: #ffd700;
                    }
                    .marco-item .estado-marco.bloqueado-text {
                        color: #e74c3c;
                    }
                `;
                document.head.appendChild(style);

                document.querySelectorAll('.swal-perfil-section-header').forEach(header => {
                    header.addEventListener('click', function() {
                        const targetId = this.dataset.target;
                        const content = document.getElementById(targetId);
                        if (content) {
                            content.classList.toggle('show');
                            this.classList.toggle('expanded');
                        }
                    });
                });

                // Cargar calificación
                (async () => {
                    try {
                        const { data } = await supabaseClient.from('opciones').select('estrellas').eq('usuario_id', userId);
                        const container = document.getElementById('userRatingDisplay');
                        if (data && data.length > 0) {
                            const avg = (data.reduce((s, o) => s + o.estrellas, 0) / data.length).toFixed(1);
                            container.innerHTML = `<p style="font-size: 1.1rem; font-weight: 700;">Tu promedio: <span style="color: #f1c40f;">${avg} ★</span></p>`;
                        } else {
                            container.innerHTML = `<p style="font-size: 0.9rem; opacity: 0.7;">Aún no has calificado.</p>`;
                        }
                    } catch (error) {
                        console.error('Error al cargar calificación:', error);
                    }
                })();

                // Cargar logros
                (async () => {
                    const container = document.getElementById('userAchievementsDisplay');
                    const btnVerTodos = document.getElementById('btnVerTodosLogros');
                    container.innerHTML = '<div style="text-align: center; padding: 10px;"><i class="fas fa-spinner fa-spin"></i> Cargando logros...</div>';

                    try {
                        const { data: logrosData, error } = await supabaseClient
                            .from('logros')
                            .select('*')
                            .eq('usuario_id', userId)
                            .maybeSingle();

                        if (error) throw error;

                        const listaLogros = [
                            { key: 'cambio_nombre', icono: 'fa-id-card', texto: 'Identidad Única', desc: 'Cambiaste tu nombre' },
                            { key: 'cambio_genero', icono: 'fa-venus-mars', texto: 'Autenticidad', desc: 'Definiste tu género' },
                            { key: 'completado_perfil', icono: 'fa-check-circle', texto: 'Perfil Completado', desc: 'Todos tus datos listos' },
                            { key: 'primera_publicacion', icono: 'fa-share-alt', texto: 'Comunidad Activa', desc: 'Primera publicación' },
                            { key: 'cinco_publicaciones', icono: 'fa-users', texto: 'Miembro Destacado', desc: '5 publicaciones' },
                            { key: 'primera_reflexion', icono: 'fa-book', texto: 'Escritor Novato', desc: 'Primera reflexión' },
                            { key: 'cinco_reflexiones', icono: 'fa-pen-fancy', texto: 'Escritor Dedicado', desc: '5 reflexiones' },
                            { key: 'diez_reflexiones', icono: 'fa-feather-alt', texto: 'Maestro Escritor', desc: '10 reflexiones' },
                            { key: 'reflexion_emocion', icono: 'fa-face-smile', texto: 'Emocional', desc: 'Reflexión con emoción' }
                        ];

                        let logros = logrosData;
                        if (!logros) {
                            logros = {
                                cambio_nombre: false,
                                cambio_genero: false,
                                completado_perfil: false,
                                primera_publicacion: false,
                                cinco_publicaciones: false,
                                primera_reflexion: false,
                                cinco_reflexiones: false,
                                diez_reflexiones: false,
                                reflexion_emocion: false
                            };
                        }

                        const completados = [];
                        const pendientes = [];

                        listaLogros.forEach(logro => {
                            if (logros[logro.key] === true) {
                                completados.push(logro);
                            } else {
                                pendientes.push(logro);
                            }
                        });
                   
                        if (completados.length === 0) {
                            container.innerHTML = `
                                <div style="text-align: center; padding: 15px;">
                                    <i class="fas fa-trophy" style="font-size: 2rem; color: #d5c6e0; margin-bottom: 8px; display: block;"></i>
                                    <p style="font-size: 0.9rem; color: #7f8c8d;">Aún no has desbloqueado logros.</p>
                                    <p style="font-size: 0.8rem; color: #b0a4e3;">Escribe en tu diario, publica en la comunidad y completa tu perfil 🏆</p>
                                </div>
                            `;
                            btnVerTodos.style.display = 'none';
                            return;
                        }

                        const primeros3 = completados.slice(0, 3);
                        let html = '';

                        primeros3.forEach(logro => {
                            const reclamado = estrellasReclamadas.includes(logro.key);
                            html += `
                                <div class="achievement-card" style="background: linear-gradient(135deg, #fdfaff, #f3e9ff); border-radius: 15px; padding: 10px 14px; margin-bottom: 8px; display: flex; align-items: center; gap: 12px; border-left: 4px solid #f1c40f; transition: all 0.3s ease;">
                                    <i class="fas ${logro.icono}" style="color: #f1c40f; font-size: 1.2rem; width: 28px; text-align: center;"></i>
                                    <div style="flex: 1; text-align: left;">
                                        <strong style="font-size: 0.85rem; color: #2c1b4e;">${logro.texto}</strong>
                                        <br>
                                        <small style="color: #7f8c8d; font-size: 0.7rem;">${logro.desc}</small>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        ${reclamado ? '<i class="fas fa-star" style="color: #f1c40f; font-size: 1.2rem;"></i>' : ''}
                                        <i class="fas fa-check-circle" style="color: #27ae60; font-size: 1.1rem;"></i>
                                    </div>
                                </div>
                            `;
                        });

                        const totalCompletados = completados.length;
                        const totalPendientes = pendientes.length;

                        html += `
                            <div style="text-align: center; margin-top: 8px; font-size: 0.8rem; color: #7f8c8d;">
                                <i class="fas fa-star" style="color: #f1c40f;"></i>
                                ${totalCompletados} de ${listaLogros.length} logros completados
                                ${totalPendientes > 0 ? `· <span style="color: #b0a4e3;">${totalPendientes} pendientes</span>` : ''}
                            </div>
                        `;

                        container.innerHTML = html;

                        if (completados.length > 3 || pendientes.length > 0) {
                            btnVerTodos.style.display = 'block';
                            btnVerTodos.onclick = () => {
                                mostrarTodosLosLogros(completados, pendientes, estrellasReclamadas, userId);
                            };
                        } else {
                            btnVerTodos.style.display = 'none';
                        }

                    } catch (error) {
                        console.error('Error al cargar logros:', error);
                        container.innerHTML = `<p style="font-size: 0.9rem; color: #ff7675;">Error al cargar logros.</p>`;
                        btnVerTodos.style.display = 'none';
                    }
                })();

                // Función mostrarTodosLosLogros
                function mostrarTodosLosLogros(completados, pendientes, estrellasReclamadas, userId) {
                    const esMovil = window.innerWidth <= 768;
                    
                    let html = `
                        <div style="max-height: ${esMovil ? '65vh' : '450px'}; overflow-y: auto; padding-right: 5px;">
                            <style>
                                .modal-logros-scroll::-webkit-scrollbar {
                                    width: 4px;
                                }
                                .modal-logros-scroll::-webkit-scrollbar-track {
                                    background: #f0e6ff;
                                    border-radius: 10px;
                                }
                                .modal-logros-scroll::-webkit-scrollbar-thumb {
                                    background: #9b59b6;
                                    border-radius: 10px;
                                }
                                .titulo-logros-completados {
                                    background: linear-gradient(135deg, #27ae60, #2ecc71);
                                    padding: 10px 20px;
                                    border-radius: 50px;
                                    display: inline-block;
                                    color: white;
                                    font-weight: 700;
                                    font-size: 0.95rem;
                                    box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
                                    letter-spacing: 0.5px;
                                    margin-bottom: 5px;
                                }
                                .titulo-logros-pendientes {
                                    background: linear-gradient(135deg, #8e44ad, #9b59b6);
                                    padding: 10px 20px;
                                    border-radius: 50px;
                                    display: inline-block;
                                    color: white;
                                    font-weight: 700;
                                    font-size: 0.95rem;
                                    box-shadow: 0 4px 15px rgba(142, 68, 173, 0.3);
                                    letter-spacing: 0.5px;
                                    margin-bottom: 5px;
                                }
                                .contador-logros {
                                    background: rgba(255,255,255,0.3);
                                    padding: 2px 12px;
                                    border-radius: 50px;
                                    font-size: 0.75rem;
                                    margin-left: 8px;
                                }
                                .badge-estrellas {
                                    background: linear-gradient(135deg, #f1c40f, #f39c12);
                                    color: white;
                                    padding: 6px 16px;
                                    border-radius: 50px;
                                    font-weight: 700;
                                    font-size: 0.8rem;
                                    display: inline-block;
                                    box-shadow: 0 2px 10px rgba(241, 196, 15, 0.3);
                                }
                                .badge-estrellas i {
                                    margin-right: 5px;
                                }
                                .logo-logros {
                                    width: 70px;
                                    height: 70px;
                                    border-radius: 50%;
                                    object-fit: cover;
                                    border: 3px solid #9b59b6;
                                    box-shadow: 0 5px 20px rgba(155, 89, 182, 0.3);
                                    margin-bottom: 8px;
                                    display: block;
                                    margin-left: auto;
                                    margin-right: auto;
                                }
                            </style>
                            <div style="text-align: center; margin-bottom: 8px;">
                                <img src="imganes/logosmedi.png" alt="Medicurativo" class="logo-logros">
                            </div>
                            <div style="text-align: center; margin-bottom: 15px;">
                                <span style="color: #2c1b4e; font-weight: 800; font-size: 1.2rem;">🏆 Todos mis Logros</span>
                            </div>
                            <div class="modal-logros-scroll" style="max-height: ${esMovil ? '50vh' : '350px'}; overflow-y: auto; padding-right: 8px;">
                                <div style="margin-bottom: 20px;">
                                    <div style="text-align: center;">
                                        <span class="titulo-logros-completados">
                                            <i class="fas fa-check-circle" style="margin-right: 8px;"></i>
                                            Logros Completados
                                            <span class="contador-logros">${completados.length}</span>
                                        </span>
                                    </div>
                                `;

                    if (completados.length === 0) {
                        html += `<p style="text-align: center; color: #7f8c8d; font-size: 0.85rem; padding: 15px 0;">Aún no has completado logros</p>`;
                    } else {
                        completados.forEach(logro => {
                            const reclamado = estrellasReclamadas.includes(logro.key);
                            html += `
                                <div style="background: linear-gradient(135deg, #f0faf0, #e8f5e9); border-radius: 12px; padding: 10px 14px; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; border-left: 4px solid #27ae60; transition: transform 0.2s;">
                                    <i class="fas ${logro.icono}" style="color: #27ae60; font-size: 1rem; width: 24px; text-align: center; flex-shrink: 0;"></i>
                                    <div style="flex: 1; text-align: left; min-width: 0;">
                                        <strong style="font-size: 0.85rem; color: #2c1b4e; display: block; word-wrap: break-word;">${logro.texto}</strong>
                                        <small style="color: #7f8c8d; font-size: 0.7rem; display: block;">${logro.desc}</small>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
                                        ${reclamado ? '<i class="fas fa-star" style="color: #f1c40f; font-size: 1.1rem; text-shadow: 0 0 10px rgba(241, 196, 15, 0.3);"></i>' : ''}
                                        ${!reclamado ? `<button onclick="window.reclamarLogroDesdeModal('${logro.key}', '${logro.texto}', '${userId}')" style="background: linear-gradient(135deg, #f1c40f, #f39c12); color: white; border: none; padding: 4px 12px; border-radius: 20px; font-size: 0.65rem; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.3s; box-shadow: 0 2px 8px rgba(241, 196, 15, 0.3);">
                                            ⭐ Reclamar
                                        </button>` : ''}
                                    </div>
                                </div>
                            `;
                        });
                    }

                    html += `
                                </div>
                                <div style="border-top: 2px dashed #e0d0f0; padding-top: 20px; margin-top: 5px;">
                                    <div style="text-align: center;">
                                        <span class="titulo-logros-pendientes">
                                            <i class="fas fa-hourglass-half" style="margin-right: 8px;"></i>
                                            Logros Pendientes
                                            <span class="contador-logros">${pendientes.length}</span>
                                        </span>
                                    </div>
                    `;

                    if (pendientes.length === 0) {
                        html += `<p style="text-align: center; color: #27ae60; font-size: 0.9rem; padding: 15px 0;">🎉 ¡Has completado TODOS los logros!</p>`;
                    } else {
                        pendientes.forEach(logro => {
                            html += `
                                <div style="background: #faf8ff; border-radius: 12px; padding: 10px 14px; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; border-left: 4px solid #d5c6e0; opacity: 0.6; transition: opacity 0.2s;">
                                    <i class="fas ${logro.icono}" style="color: #b0a4e3; font-size: 1rem; width: 24px; text-align: center; flex-shrink: 0;"></i>
                                    <div style="flex: 1; text-align: left; min-width: 0;">
                                        <strong style="font-size: 0.85rem; color: #7f8c8d; display: block; word-wrap: break-word;">${logro.texto}</strong>
                                        <small style="color: #b0a4e3; font-size: 0.7rem; display: block;">${logro.desc}</small>
                                    </div>
                                    <i class="fas fa-lock" style="color: #b0a4e3; font-size: 1rem; flex-shrink: 0;"></i>
                                </div>
                            `;
                        });
                    }

                    html += `
                                </div>
                                <div style="text-align: center; margin-top: 15px; padding: 10px 15px; background: linear-gradient(135deg, #fdfaff, #f8f4ff); border-radius: 12px; border: 1px solid #f0e6ff;">
                                    <span class="badge-estrellas">
                                        <i class="fas fa-star"></i>
                                        Estrellas reclamadas: ${estrellasReclamadas.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    `;

                    Swal.fire({
                        title: '',
                        html: html,
                        confirmButtonColor: '#9b59b6',
                        confirmButtonText: 'Cerrar ✕',
                        showCloseButton: true,
                        closeButtonHtml: '✕',
                        customClass: {
                            popup: 'swal-ver-todas swal-popup-redondo',
                            confirmButton: 'swal2-confirm-custom',
                            closeButton: 'swal2-close-custom'
                        },
                        buttonsStyling: false,
                        width: esMovil ? '95%' : '550px',
                        maxWidth: esMovil ? '95%' : '600px',
                        padding: '20px'
                    });
                }

                // Recuperar Contraseña
                window.recuperarPassword = async function() {
                    const { value: email } = await Swal.fire({
                        title: '',
                        html: `
                            <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                                <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 3px solid #9b59b6; box-shadow: 0 5px 20px rgba(155, 89, 182, 0.3);">
                                    <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                            </div>
                            <p style="color: #2c1b4e; font-weight: 700; font-size: 1.3rem; margin-bottom: 4px;">Recuperar Contraseña</p>
                            <p style="color: #7f8c8d; font-size: 0.9rem; margin-bottom: 18px;">Te enviaremos un enlace para crear una nueva</p>
                            <div style="position: relative; width: 100%;">
                                <div style="position: relative;">
                                    <i class="fas fa-envelope" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #9b59b6; font-size: 1rem; opacity: 0.7;"></i>
                                    <input type="email" id="swal-input-email" placeholder="tu-correo@ejemplo.com" style="
                                        width: 100%;
                                        padding: 14px 16px 14px 46px;
                                        border: 2px solid #e8d9ff;
                                        border-radius: 50px;
                                        font-size: 1rem;
                                        outline: none;
                                        transition: all 0.3s ease;
                                        background: #fdfaff;
                                        color: #2c1b4e;
                                        font-family: inherit;
                                        box-sizing: border-box;
                                    " onfocus="this.style.borderColor='#9b59b6'; this.style.boxShadow='0 0 0 4px rgba(155,89,182,0.15)'" onblur="this.style.borderColor='#e8d9ff'; this.style.boxShadow='none'">
                                </div>
                            </div>
                            <div id="email-error" style="display: none; color: #e74c3c; font-size: 0.85rem; margin-top: 8px; text-align: left; padding-left: 5px;">
                                <i class="fas fa-exclamation-circle" style="margin-right: 6px;"></i>
                                <span id="email-error-message">Por favor ingresa un correo válido</span>
                            </div>
                        `,
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Enviar enlace ✨',
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#9b59b6',
                        cancelButtonColor: '#bdc3c7',
                        background: '#fdfaff',
                        reverseButtons: true,
                        customClass: { 
                            popup: 'swal-popup-redondo',
                            closeButton: 'swal-close-button-styled'
                        },
                        showCloseButton: true,
                        didOpen: () => {
                            const input = document.getElementById('swal-input-email');
                            if (input) setTimeout(() => input.focus(), 100);
                        },
                        preConfirm: () => {
                            const input = document.getElementById('swal-input-email');
                            const errorDiv = document.getElementById('email-error');
                            const errorMsg = document.getElementById('email-error-message');
                            const email = input.value.trim();
                            if (!email) {
                                errorMsg.textContent = '¡Necesitamos tu correo electrónico!';
                                errorDiv.style.display = 'block';
                                input.style.borderColor = '#e74c3c';
                                input.style.boxShadow = '0 0 0 4px rgba(231, 76, 60, 0.15)';
                                return false;
                            }
                            if (!email.includes('@') || !email.includes('.')) {
                                errorMsg.textContent = 'Ingresa un correo electrónico válido (ej: usuario@dominio.com)';
                                errorDiv.style.display = 'block';
                                input.style.borderColor = '#e74c3c';
                                input.style.boxShadow = '0 0 0 4px rgba(231, 76, 60, 0.15)';
                                return false;
                            }
                            errorDiv.style.display = 'none';
                            input.style.borderColor = '#27ae60';
                            input.style.boxShadow = '0 0 0 4px rgba(39, 174, 96, 0.15)';
                            return email;
                        }
                    });

                    if (email) {
                        Swal.showLoading();
                        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                            redirectTo: 'https://programas2024.github.io/medicuraty/restablecer.html',
                        });
                        if (error) {
                            Swal.fire({
                                title: '',
                                html: `
                                    <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                                        <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 3px solid #e74c3c; box-shadow: 0 5px 20px rgba(231, 76, 60, 0.3);">
                                            <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                                        </div>
                                    </div>
                                    <p style="color: #e74c3c; font-weight: 700; font-size: 1.2rem; margin-bottom: 4px;">⚠️ Algo salió mal</p>
                                    <p style="color: #7f8c8d; font-size: 0.95rem; margin: 0;">${error.message || 'No pudimos enviar el enlace. Revisa tu conexión.'}</p>
                                `,
                                confirmButtonColor: '#9b59b6',
                                confirmButtonText: 'Intentar de nuevo',
                                showCloseButton: true,
                                customClass: { 
                                    popup: 'swal-popup-redondo',
                                    closeButton: 'swal-close-button-styled'
                                },
                                background: '#fdfaff'
                            });
                        } else {
                            Swal.fire({
                                title: '',
                                html: `
                                    <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                                        <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 3px solid #27ae60; box-shadow: 0 5px 20px rgba(39, 174, 96, 0.3);">
                                            <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                                        </div>
                                    </div>
                                    <p style="color: #2c1b4e; font-weight: 700; font-size: 1.2rem; margin-bottom: 4px;">📨 ¡Revisa tu correo!</p>
                                    <p style="color: #7f8c8d; font-size: 0.95rem; margin: 0;">
                                        Hemos enviado un enlace a <strong style="color: #9b59b6;">${email}</strong>
                                    </p>
                                    <p style="color: #bdc3c7; font-size: 0.8rem; margin-top: 10px;">
                                        <i class="fas fa-info-circle"></i> Si no lo ves, revisa la carpeta de spam
                                    </p>
                                `,
                                confirmButtonColor: '#9b59b6',
                                confirmButtonText: 'Entendido 💜',
                                showCloseButton: true,
                                customClass: { 
                                    popup: 'swal-popup-redondo',
                                    closeButton: 'swal-close-button-styled'
                                },
                                background: '#fdfaff'
                            });
                        }
                    }
                };

                // Logout
                document.getElementById('btnLogout')?.addEventListener('click', async () => {
                    await supabaseClient.auth.signOut();
                    window.location.href = 'index.html';
                });
            }
        });

    } catch (error) {
        console.error('Error al abrir perfil:', error);
        if (loadingSwal) loadingSwal.close();
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al cargar tu perfil.',
            icon: 'error',
            confirmButtonColor: '#ff7675',
            customClass: { popup: 'swal-popup-redondo' }
        });
    }
});

// ============================================================
// FUNCIONES DE EDICIÓN (Nombre y Género)
// ============================================================
window.editarNombre = async function() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const bgColor = isDarkMode ? '#1a1a2e' : '#fdfaff';
    const textColor = isDarkMode ? '#ffffff' : '#2c1b4e';
    const inputBg = isDarkMode ? '#252525' : '#fdfaff';
    const inputBorder = isDarkMode ? '#3a3a3a' : '#e8d9ff';
    
    const { data: { session } } = await supabaseClient.auth.getSession();
    const nombreActual = session?.user?.user_metadata?.nombre || '';
    
    const { value: nuevoNombre } = await Swal.fire({
        title: '',
        html: `
            <div style="text-align: center; padding: 5px;">
                <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #f0e6ff, #e6fffa); padding: 4px; box-shadow: 0 8px 25px rgba(155, 89, 182, 0.2); border: 3px solid #9b59b6;">
                        <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                            <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                </div>
                <h2 style="color: ${textColor}; font-weight: 800; margin-bottom: 4px; font-size: 1.3rem;">✏️ Editar Nombre</h2>
                <p style="color: #9b59b6; font-weight: 500; font-size: 0.9rem; margin-bottom: 18px;">
                    <i class="fas fa-user-edit" style="margin-right: 6px;"></i>
                    Actualiza tu nombre de usuario
                </p>
                
                <div style="position: relative; width: 100%;">
                    <div style="position: relative;">
                        <i class="fas fa-user" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #9b59b6; font-size: 1rem; opacity: 0.7; z-index: 2;"></i>
                        <input 
                            type="text" 
                            id="swal-input-nombre" 
                            value="${nombreActual}" 
                            placeholder="Tu nombre aquí..." 
                            style="
                                width: 100%;
                                padding: 14px 16px 14px 46px;
                                border: 2px solid ${inputBorder};
                                border-radius: 50px;
                                font-size: 1rem;
                                outline: none;
                                transition: all 0.3s ease;
                                background: ${inputBg};
                                color: ${textColor};
                                font-family: inherit;
                                box-sizing: border-box;
                            " 
                            onfocus="this.style.borderColor='#9b59b6'; this.style.boxShadow='0 0 0 4px rgba(155,89,182,0.15)'" 
                            onblur="this.style.borderColor='${inputBorder}'; this.style.boxShadow='none'"
                        >
                    </div>
                </div>
                
                <div id="nombre-error" style="display: none; color: #e74c3c; font-size: 0.85rem; margin-top: 10px; text-align: left; padding-left: 5px;">
                    <i class="fas fa-exclamation-circle" style="margin-right: 6px;"></i>
                    <span id="nombre-error-message">El nombre no puede estar vacío</span>
                </div>
                
                <p style="margin-top: 12px; font-size: 0.75rem; color: #b0a4e3; font-style: italic;">
                    <i class="fas fa-info-circle"></i> Elige un nombre que te represente (mínimo 2 caracteres)
                </p>
            </div>
        `,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Guardar ✨',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#9b59b6',
        cancelButtonColor: '#bdc3c7',
        background: bgColor,
        reverseButtons: true,
        customClass: { 
            popup: 'swal-popup-redondo',
            closeButton: 'swal-close-button-styled'
        },
        showCloseButton: true,
        didOpen: () => {
            const input = document.getElementById('swal-input-nombre');
            if (input) {
                setTimeout(() => {
                    input.focus();
                    input.select();
                }, 100);
            }
        },
        preConfirm: () => {
            const input = document.getElementById('swal-input-nombre');
            const errorDiv = document.getElementById('nombre-error');
            const errorMsg = document.getElementById('nombre-error-message');
            const nombre = input.value.trim();
            
            if (!nombre || nombre.length < 2) {
                errorMsg.textContent = 'El nombre debe tener al menos 2 caracteres';
                errorDiv.style.display = 'block';
                input.style.borderColor = '#e74c3c';
                input.style.boxShadow = '0 0 0 4px rgba(231, 76, 60, 0.15)';
                return false;
            }
            
            if (nombre.length > 50) {
                errorMsg.textContent = 'El nombre no puede tener más de 50 caracteres';
                errorDiv.style.display = 'block';
                input.style.borderColor = '#e74c3c';
                input.style.boxShadow = '0 0 0 4px rgba(231, 76, 60, 0.15)';
                return false;
            }
            
            errorDiv.style.display = 'none';
            input.style.borderColor = '#27ae60';
            input.style.boxShadow = '0 0 0 4px rgba(39, 174, 96, 0.15)';
            
            return nombre;
        }
    });

    if (nuevoNombre) {
        const loadingBg = isDarkMode ? '#1a1a2e' : '#fdfaff';
        const loadingText = isDarkMode ? '#ffffff' : '#2c1b4e';
        
        Swal.fire({
            title: '',
            html: `
                <div style="text-align: center; padding: 10px 5px;">
                    <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                        <div style="width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #f0e6ff, #e6fffa); padding: 4px; box-shadow: 0 8px 25px rgba(155, 89, 182, 0.2);">
                            <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                                <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-bottom: 6px;">
                        <div class="loading-spinner" style="width: 24px; height: 24px; border: 3px solid #f0e6ff; border-top: 3px solid #9b59b6; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
                        <span style="color: ${loadingText}; font-weight: 700; font-size: 1.1rem;">Actualizando tu elección...</span>
                    </div>
                    <p style="color: #9b59b6; font-size: 0.8rem; margin-top: 4px; font-weight: 500;">
                        <i class="fas fa-spa" style="margin-right: 6px;"></i> Un momento por favor
                    </p>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: false,
            allowOutsideClick: false,
            background: loadingBg,
            customClass: { 
                popup: 'swal-loading-popup'
            }
        });

        try {
            const { error: updateError } = await supabaseClient.auth.updateUser({
                data: { nombre: nuevoNombre }
            });

            if (updateError) throw updateError;

            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                await supabaseClient
                    .from('usuarios')
                    .update({ nombre: nuevoNombre })
                    .eq('id', session.user.id);
            }

            // Verificar logros después de cambiar nombre
            await verificarLogros(session.user.id);

            if (window.actualizarSaludo) {
                setTimeout(() => {
                    window.actualizarSaludo();
                }, 500);
            }

            Swal.close();

            Swal.fire({
                title: '',
                html: `
                    <div style="text-align: center; padding: 5px;">
                        <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 4px; box-shadow: 0 8px 25px rgba(39, 174, 96, 0.2); border: 3px solid #27ae60;">
                                <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                                    <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                            </div>
                        </div>
                        <p style="color: #27ae60; font-weight: 700; font-size: 1.5rem; margin-bottom: 4px;">✅ ¡Nombre actualizado!</p>
                        <p style="color: #7f8c8d; font-size: 0.95rem; margin: 0;">
                            Ahora te llamas <strong style="color: #9b59b6;">${nuevoNombre}</strong>
                        </p>
                        <p style="color: #b0a4e3; font-size: 0.8rem; margin-top: 10px; font-style: italic;">
                            <i class="fas fa-sparkles" style="color: #f1c40f;"></i>
                            Tu identidad única ha sido actualizada
                        </p>
                    </div>
                `,
                icon: 'success',
                confirmButtonColor: '#9b59b6',
                confirmButtonText: 'Ver Perfil 💜',
                showCloseButton: true,
                customClass: { 
                    popup: 'swal-popup-redondo',
                    closeButton: 'swal-close-button-styled'
                },
                background: bgColor
            }).then(() => {
                document.getElementById('btnPerfil')?.click();
            });

        } catch (error) {
            console.error('Error al actualizar nombre:', error);
            Swal.close();
            Swal.fire({
                title: '',
                html: `
                    <div style="text-align: center; padding: 5px;">
                        <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #fde8e8, #fce4e4); padding: 4px; box-shadow: 0 8px 25px rgba(231, 76, 60, 0.15); border: 3px solid #e74c3c;">
                                <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                                    <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                            </div>
                        </div>
                        <p style="color: #e74c3c; font-weight: 700; font-size: 1.2rem; margin-bottom: 4px;">⚠️ Error al actualizar</p>
                        <p style="color: #7f8c8d; font-size: 0.95rem; margin: 0;">
                            ${error.message || 'No se pudo actualizar el nombre. Intenta de nuevo.'}
                        </p>
                    </div>
                `,
                icon: 'error',
                confirmButtonColor: '#e74c3c',
                confirmButtonText: 'Intentar de nuevo',
                showCloseButton: true,
                customClass: { 
                    popup: 'swal-popup-redondo',
                    closeButton: 'swal-close-button-styled'
                },
                background: bgColor
            });
        }
    }
};

window.editarGenero = async function() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const bgColor = isDarkMode ? '#1a1a2e' : '#fdfaff';
    const textColor = isDarkMode ? '#ffffff' : '#2c1b4e';
    const optionBg = isDarkMode ? '#252525' : '#fdfaff';
    const optionBorder = isDarkMode ? '#3a3a3a' : '#f0e6ff';
    
    const { data: { session } } = await supabaseClient.auth.getSession();
    const generoActual = session?.user?.user_metadata?.genero_id || null;
    
    const generos = [
        { id: 1, nombre: 'Hombre', emoji: '👨', desc: 'Masculino' },
        { id: 2, nombre: 'Mujer', emoji: '👩', desc: 'Femenino' }
    ];
    
    let opcionesHtml = '';
    generos.forEach(g => {
        const selected = generoActual === g.id ? 'selected' : '';
        opcionesHtml += `
            <div class="genero-option ${selected}" data-id="${g.id}" style="
                display: flex;
                align-items: center;
                gap: 14px;
                padding: 14px 20px;
                border: 2px solid ${optionBorder};
                border-radius: 16px;
                background: ${optionBg};
                cursor: pointer;
                transition: all 0.3s ease;
                margin-bottom: 8px;
                ${selected ? `border-color: #9b59b6; background: rgba(155, 89, 182, 0.08); box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.1);` : ''}
            ">
                <div style="font-size: 2rem; width: 44px; text-align: center; flex-shrink: 0;">${g.emoji}</div>
                <div style="flex: 1; text-align: left;">
                    <div style="font-weight: 700; color: ${textColor}; font-size: 1.1rem;">${g.nombre}</div>
                    <div style="font-size: 0.8rem; color: #7f8c8d;">${g.desc}</div>
                </div>
                <div style="
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 2px solid ${selected ? '#9b59b6' : '#d5c6e0'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: all 0.3s ease;
                    ${selected ? 'background: #9b59b6;' : ''}
                ">
                    ${selected ? '<div style="width: 10px; height: 10px; border-radius: 50%; background: white;"></div>' : ''}
                </div>
            </div>
        `;
    });

    const { value: generoId } = await Swal.fire({
        title: '',
        html: `
            <div style="text-align: center; padding: 5px;">
                <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #f0e6ff, #e6fffa); padding: 4px; box-shadow: 0 8px 25px rgba(155, 89, 182, 0.2); border: 3px solid #9b59b6;">
                        <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                            <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                </div>
                <h2 style="color: ${textColor}; font-weight: 800; margin-bottom: 4px; font-size: 1.3rem;">🌸 Editar Género</h2>
                <p style="color: #9b59b6; font-weight: 500; font-size: 0.9rem; margin-bottom: 18px;">
                    <i class="fas fa-venus-mars" style="margin-right: 6px;"></i>
                    Selecciona tu identidad de género
                </p>
                
                <div style="text-align: left; margin-top: 5px;">
                    ${opcionesHtml}
                </div>
                
                <p style="margin-top: 12px; font-size: 0.75rem; color: #b0a4e3; font-style: italic;">
                    <i class="fas fa-heart" style="color: #e84393;"></i>
                    Tu identidad es valiosa y respetada
                </p>
            </div>
        `,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Guardar ✨',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#9b59b6',
        cancelButtonColor: '#bdc3c7',
        background: bgColor,
        reverseButtons: true,
        customClass: { 
            popup: 'swal-popup-redondo',
            closeButton: 'swal-close-button-styled'
        },
        showCloseButton: true,
        didOpen: () => {
            document.querySelectorAll('.genero-option').forEach(opt => {
                opt.addEventListener('click', function() {
                    document.querySelectorAll('.genero-option').forEach(o => {
                        o.classList.remove('selected');
                        o.style.borderColor = '#f0e6ff';
                        o.style.background = '#fdfaff';
                        o.style.boxShadow = 'none';
                        const circle = o.querySelector('div:last-child');
                        if (circle) {
                            circle.style.borderColor = '#d5c6e0';
                            circle.style.background = 'transparent';
                            circle.innerHTML = '';
                        }
                    });
                    
                    this.classList.add('selected');
                    this.style.borderColor = '#9b59b6';
                    this.style.background = 'rgba(155, 89, 182, 0.08)';
                    this.style.boxShadow = '0 0 0 3px rgba(155, 89, 182, 0.1)';
                    
                    const circle = this.querySelector('div:last-child');
                    if (circle) {
                        circle.style.borderColor = '#9b59b6';
                        circle.style.background = '#9b59b6';
                        circle.innerHTML = '<div style="width: 10px; height: 10px; border-radius: 50%; background: white;"></div>';
                    }
                });
            });
        },
        preConfirm: () => {
            const selected = document.querySelector('.genero-option.selected');
            if (!selected) {
                Swal.showValidationMessage('Por favor selecciona una opción');
                return false;
            }
            return parseInt(selected.dataset.id);
        }
    });

    if (generoId) {
        const loadingBg = isDarkMode ? '#1a1a2e' : '#fdfaff';
        const loadingText = isDarkMode ? '#ffffff' : '#2c1b4e';
        
        Swal.fire({
            title: '',
            html: `
                <div style="text-align: center; padding: 10px 5px;">
                    <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                        <div style="width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #f0e6ff, #e6fffa); padding: 4px; box-shadow: 0 8px 25px rgba(155, 89, 182, 0.2);">
                            <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                                <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-bottom: 6px;">
                        <div class="loading-spinner" style="width: 24px; height: 24px; border: 3px solid #f0e6ff; border-top: 3px solid #9b59b6; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
                        <span style="color: ${loadingText}; font-weight: 700; font-size: 1.1rem;">Actualizando tu elección...</span>
                    </div>
                    <p style="color: #9b59b6; font-size: 0.8rem; margin-top: 4px; font-weight: 500;">
                        <i class="fas fa-spa" style="margin-right: 6px;"></i> Un momento por favor
                    </p>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: false,
            allowOutsideClick: false,
            background: loadingBg,
            customClass: { 
                popup: 'swal-loading-popup'
            }
        });

        try {
            const { error: updateError } = await supabaseClient.auth.updateUser({
                data: { genero_id: generoId }
            });

            if (updateError) throw updateError;

            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                await supabaseClient
                    .from('usuarios')
                    .update({ genero_id: generoId })
                    .eq('id', session.user.id);
            }

            // Verificar logros después de cambiar género
            await verificarLogros(session.user.id);

            const generoSeleccionado = generos.find(g => g.id === generoId);
            const nombreGenero = generoSeleccionado ? generoSeleccionado.nombre : 'No especificado';
            const emojiGenero = generoSeleccionado ? generoSeleccionado.emoji : '👤';

            Swal.close();

            Swal.fire({
                title: '',
                html: `
                    <div style="text-align: center; padding: 5px;">
                        <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 4px; box-shadow: 0 8px 25px rgba(39, 174, 96, 0.2); border: 3px solid #27ae60;">
                                <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                                    <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                            </div>
                        </div>
                        <p style="color: #27ae60; font-weight: 700; font-size: 1.5rem; margin-bottom: 4px;">✅ ¡Género actualizado!</p>
                        <p style="color: #7f8c8d; font-size: 0.95rem; margin: 0;">
                            Ahora te identificas como <strong style="color: #9b59b6;">${emojiGenero} ${nombreGenero}</strong>
                        </p>
                        <p style="color: #b0a4e3; font-size: 0.8rem; margin-top: 10px; font-style: italic;">
                            <i class="fas fa-sparkles" style="color: #f1c40f;"></i>
                            Tu autenticidad brilla con luz propia
                        </p>
                    </div>
                `,
                icon: 'success',
                confirmButtonColor: '#9b59b6',
                confirmButtonText: 'Ver Perfil 💜',
                showCloseButton: true,
                customClass: { 
                    popup: 'swal-popup-redondo',
                    closeButton: 'swal-close-button-styled'
                },
                background: bgColor
            }).then(() => {
                document.getElementById('btnPerfil')?.click();
            });

        } catch (error) {
            console.error('Error al actualizar género:', error);
            Swal.close();
            Swal.fire({
                title: '',
                html: `
                    <div style="text-align: center; padding: 5px;">
                        <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #fde8e8, #fce4e4); padding: 4px; box-shadow: 0 8px 25px rgba(231, 76, 60, 0.15); border: 3px solid #e74c3c;">
                                <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                                    <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                            </div>
                        </div>
                        <p style="color: #e74c3c; font-weight: 700; font-size: 1.2rem; margin-bottom: 4px;">⚠️ Error al actualizar</p>
                        <p style="color: #7f8c8d; font-size: 0.95rem; margin: 0;">
                            ${error.message || 'No se pudo actualizar el género. Intenta de nuevo.'}
                        </p>
                    </div>
                `,
                icon: 'error',
                confirmButtonColor: '#e74c3c',
                confirmButtonText: 'Intentar de nuevo',
                showCloseButton: true,
                customClass: { 
                    popup: 'swal-popup-redondo',
                    closeButton: 'swal-close-button-styled'
                },
                background: bgColor
            });
        }
    }
};

// ============================================================
// FUNCIÓN PARA ACTUALIZAR EL SALUDO
// ============================================================
async function actualizarSaludo() {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (session) {
            const nombre = session.user.user_metadata?.nombre || 'Amigo';
            const spanNombre = document.getElementById('usuarioNombreLogueado');
            const contenedorSaludo = document.getElementById('contenedorSaludo');
            
            if (spanNombre) {
                spanNombre.style.transition = 'all 0.3s ease';
                spanNombre.style.opacity = '0.5';
                spanNombre.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    spanNombre.textContent = nombre;
                    spanNombre.style.opacity = '1';
                    spanNombre.style.transform = 'scale(1)';
                }, 200);
            }
            
            if (contenedorSaludo) {
                contenedorSaludo.style.display = 'flex';
                contenedorSaludo.style.animation = 'fadeIn 0.8s ease';
            }
            
            actualizarSaludoDinamico();
        } else {
            ocultarSaludo();
        }
    } catch (error) {
        console.error('Error al actualizar saludo:', error);
        ocultarSaludo();
    }
}

function actualizarSaludoDinamico() {
    const saludoSpan = document.getElementById('saludoDinamico');
    if (!saludoSpan) return;
    
    const hora = new Date().getHours();
    let saludo = '';
    
    if (hora >= 5 && hora < 12) {
        saludo = '🌅 ¡Buenos días! Que tengas un hermoso día';
    } else if (hora >= 12 && hora < 18) {
        saludo = '☀️ ¡Buenas tardes! Sigue brillando con luz propia';
    } else if (hora >= 18 && hora < 22) {
        saludo = '🌅 ¡Buenas noches! Disfruta de esta hermosa tarde';
    } else {
        saludo = '🌙 ¡Buenas noches! Descansa y sueña bonito';
    }
    
    saludoSpan.textContent = saludo;
}

function ocultarSaludo() {
    const contenedorSaludo = document.getElementById('contenedorSaludo');
    if (contenedorSaludo) {
        contenedorSaludo.style.display = 'none';
    }
}

// ============================================================
// FUNCIÓN PARA OBTENER ESTRELLAS DEL USUARIO (SIN ERRORES)
// ============================================================
window.obtenerEstrellasReclamadas = async function(userId) {
    try {
        console.log('🔍 Buscando estrellas para usuario:', userId);
        
        // Obtener los logros del usuario desde la tabla 'logros'
        const { data: logrosData, error: logrosError } = await supabaseClient
            .from('logros')
            .select('*')
            .eq('usuario_id', userId)
            .maybeSingle();
        
        if (logrosError) {
            console.error('❌ Error al obtener logros:', logrosError);
            return [];
        }
        
        if (!logrosData) {
            console.log('⚠️ No se encontraron logros para el usuario');
            return [];
        }
        
        // Lista de todos los logros posibles (keys que representan logros)
        const keysLogros = [
            'cambio_nombre',
            'cambio_genero',
            'completado_perfil',
            'primera_publicacion',
            'cinco_publicaciones',
            'primera_reflexion',
            'cinco_reflexiones',
            'diez_reflexiones',
            'reflexion_emocion'
        ];
        
        // Filtrar solo los logros que están en true (completados)
        const estrellas = keysLogros.filter(key => logrosData[key] === true);
        
        console.log('⭐ Estrellas encontradas:', estrellas.length, estrellas);
        return estrellas;
        
    } catch (error) {
        console.error('❌ Error al obtener estrellas:', error);
        return [];
    }
};

// También mantener el alias para compatibilidad
window.obtenerEstrellasUsuario = window.obtenerEstrellasReclamadas;
window.actualizarSaludo = actualizarSaludo;
window.verificarLogros = verificarLogros;
window.reclamarLogro = reclamarLogro;

// ============================================================
// INICIALIZAR SALUDO AL CARGAR LA PÁGINA
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        actualizarSaludo();
    }, 500);
});
// Exponer funciones globalmente
window.reclamarLogro = reclamarLogro;
window.obtenerEstrellasReclamadas = obtenerEstrellasReclamadas;
    // --- Función global para Calificación y Ver Opiniones ---
    window.mostrarCalificacionSweetAlert = async function() {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) {
            return Swal.fire({
                title: '¡Inicia sesión!',
                text: 'Necesitas una cuenta para dejar tu calificación.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Ir a Login',
                confirmButtonColor: '#9b59b6'
            }).then(r => r.isConfirmed && (window.location.href = 'login.html'));
        }

        let ratingSeleccionado = 0;

        Swal.fire({
    title: '✨ ¡Tu Opinión Cuenta!',
    html: `
        <div style="padding: 10px;">
            <p style="color: #4a2d6e; margin-bottom: 15px;">Danos tu calificación para seguir mejorando:</p>
            <div id="starContainer" style="font-size: 2.5rem; color: #f1c40f; margin-bottom: 20px; cursor: pointer; display: flex; justify-content: center; gap: 5px;">
                <i class="far fa-star" data-value="1"></i><i class="far fa-star" data-value="2"></i><i class="far fa-star" data-value="3"></i><i class="far fa-star" data-value="4"></i><i class="far fa-star" data-value="5"></i>
            </div>
            <textarea id="swal-comment" class="swal2-textarea" placeholder="Escribe un breve comentario..." style="border-radius: 20px; border: 2px solid #e0d0f0; width: 90%; height: 80px; font-size: 0.9rem;"></textarea>
        </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Enviar Calificación',
    cancelButtonText: 'Cerrar',
    confirmButtonColor: '#9b59b6',
    cancelButtonColor: '#ff7675',
    background: '#fdfaff',
    reverseButtons: true, // 🔥 Invierte el orden: Confirmar a la derecha, Cancelar a la izquierda
    buttonsStyling: false,
    customClass: {
        popup: 'swal-popup-redondo',
        confirmButton: 'btn-confirm-custom',
        cancelButton: 'btn-cancel-custom',
        actions: 'custom-actions' // 🔥 Clase para el contenedor
    },
            didOpen: () => {
                document.querySelectorAll('#starContainer i').forEach(s => {
                    s.onclick = (e) => {
                        ratingSeleccionado = e.target.dataset.value;
                        document.querySelectorAll('#starContainer i').forEach((st, idx) => {
                            if (idx < ratingSeleccionado) {
                                st.classList.replace('far', 'fas');
                            } else {
                                st.classList.replace('fas', 'far');
                            }
                        });
                    };
                    s.onmouseenter = (e) => e.target.style.transform = 'scale(1.2)';
                    s.onmouseleave = (e) => e.target.style.transform = 'scale(1)';
                });
            },
            preConfirm: () => {
                const comment = document.getElementById('swal-comment').value;
                if (!ratingSeleccionado) return Swal.showValidationMessage('Elige estrellas');
                return { rating: ratingSeleccionado, comment };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await supabaseClient.from('opciones').insert({ usuario_id: session.user.id, estrellas: result.value.rating, comentario: result.value.comment });

                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#f1c40f', '#9b59b6']
                    });
                }

                Swal.fire({
                    title: '¡Muchas Gracias!',
                    text: 'Tu opinión ha sido guardada con éxito.',
                    icon: 'success',
                    confirmButtonColor: '#9b59b6',
                    customClass: { popup: 'swal-popup-redondo' }
                });
            }
        });
    };

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;
    
    // Si es móvil, los botones se ocultan pero los eventos siguen activos
    // Si quieres que los eventos se ejecuten solo en PC, puedes hacer:
    if (isMobile) {
        // En móvil, desactivar los eventos (opcional)
        // O mantenerlos activos pero ocultos
        console.log('Modo móvil: botones info ocultos');
    }
});

 // --- Función global para Ver Opiniones ---
window.verOpinionesSweetAlert = async function() {
    const { data: allOpinions, error } = await supabaseClient
        .from('opciones')
        .select('estrellas, comentario, creado_en, usuarios(nombre)')
    if (error) return Swal.fire('Error', 'No pudimos cargar las opiniones.', 'error');

    // Detectar modo oscuro
    const isDarkMode = document.body.classList.contains('dark-mode') || 
                       localStorage.getItem('theme') === 'dark';
    
    // Colores según modo
    const textColor = isDarkMode ? '#ffffff' : '#2c1b4e';
    const subTextColor = isDarkMode ? '#d0c0e0' : '#7f8c8d';
    const cardBg = isDarkMode ? 'rgba(255,255,255,0.08)' : 'white';
    const cardTextColor = isDarkMode ? '#ffffff' : '#4a2d6e';
    const cardSubTextColor = isDarkMode ? '#d0c0e0' : '#b0a4e3';
    const bgColor = isDarkMode ? '#1a1a2e' : '#fdfaff';

    // Determinar si es móvil
    const isMobile = window.innerWidth <= 768;

    const renderOpinionsList = (ops) => {
        if (!ops || ops.length === 0) return '<p style="text-align:center; opacity:0.6; padding: 20px; color:' + subTextColor + ';">Aún no hay opiniones. ¡Sé el primero!</p>';
        return ops.map(op => `
            <div style="background: ${cardBg}; padding: ${isMobile ? '12px' : '18px'}; border-radius: ${isMobile ? '16px' : '20px'}; margin-bottom: ${isMobile ? '10px' : '14px'}; border-left: ${isMobile ? '5px' : '6px'} solid #f1c40f; text-align: left; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:${isMobile ? '6px' : '10px'};">
                    <div style="display:flex; align-items:center; gap: ${isMobile ? '6px' : '10px'};">
                        <i class="fas fa-user-circle" style="color: #9b59b6; font-size: ${isMobile ? '0.9rem' : '1.3rem'};"></i>
                        <strong style="font-size: ${isMobile ? '0.8rem' : '1.1rem'}; color: ${textColor};">${op.usuarios?.nombre || 'Usuario'}</strong>
                    </div>
                    <span style="color: #f1c40f; font-size: ${isMobile ? '0.8rem' : '1.2rem'}; letter-spacing: 2px;">${'★'.repeat(op.estrellas)}${'☆'.repeat(5-op.estrellas)}</span>
                </div>
                <p style="font-size: ${isMobile ? '0.8rem' : '1.05rem'}; margin: 0; color: ${cardTextColor}; font-style: italic; line-height: ${isMobile ? '1.3' : '1.6'};">"${op.comentario}"</p>
                <div style="text-align: right; margin-top: ${isMobile ? '4px' : '8px'};">
                    <small style="color: ${cardSubTextColor}; font-size: ${isMobile ? '0.65rem' : '0.85rem'};">${new Date(op.creado_en).toLocaleDateString()}</small>
                </div>
            </div>
        `).join('');
    };

    Swal.fire({
        title: '',
        html: `
            <div style="text-align: center; width: 100%; display: flex; flex-direction: column; align-items: center; padding: 0;">
                <!-- Círculo con imagen -->
                <div style="display: flex; justify-content: center; margin-top: ${isMobile ? '0px' : '10px'}; margin-bottom: ${isMobile ? '8px' : '20px'}; width: 100%;">
                    <div style="width: ${isMobile ? '50px' : '90px'}; height: ${isMobile ? '50px' : '90px'}; border-radius: 50%; background: linear-gradient(135deg, #f0e6ff, #e6fffa); padding: ${isMobile ? '3px' : '6px'}; box-shadow: 0 4px 15px rgba(155, 89, 182, 0.15);">
                        <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                            <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                </div>

                <h2 style="color: ${textColor}; font-weight: 800; margin-bottom: ${isMobile ? '4px' : '12px'}; text-align: center; width: 100%; font-size: ${isMobile ? '1rem' : '1.8rem'};">
                    <i class="fas fa-comments" style="color: #9b59b6;"></i> Comunidad Medicurativo
                </h2>
                
                <!-- Contenedor con scroll interno -->
                <div style="padding: ${isMobile ? '2px' : '5px'}; max-height: ${isMobile ? '250px' : '450px'}; overflow-y: auto; scrollbar-width: none; -ms-overflow-style: none; margin: ${isMobile ? '5px 0 0 0' : '15px 0 0 0'}; width: 100%; max-width: 700px; text-align: left;">
                    <style>
                        /* Ocultar scrollbar en todos los navegadores */
                        .swal-ver-opiniones-scroll::-webkit-scrollbar {
                            display: none;
                            width: 0;
                            height: 0;
                        }
                    </style>
                    <div class="swal-ver-opiniones-scroll" style="padding: ${isMobile ? '2px' : '5px'};">
                        ${renderOpinionsList(allOpinions ? [...allOpinions].reverse() : [])}
                    </div>
                </div>
                <p style="font-size: ${isMobile ? '0.7rem' : '1rem'}; color: ${subTextColor}; margin-top: ${isMobile ? '8px' : '20px'}; text-align: center; width: 100%; opacity: 0.8; font-weight: ${isMobile ? '400' : '500'};">
                    Gracias por ayudarnos a crecer día tras día ❤️
                </p>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        background: bgColor,
        width: isMobile ? '92%' : '650px',
        maxWidth: isMobile ? '400px' : '750px',
        padding: isMobile ? '0.8rem' : '2rem',
        customClass: { 
            popup: 'swal-popup-redondo swal-ver-opiniones',
            closeButton: 'custom-close-btn-right',
            htmlContainer: 'swal-html-ver-opiniones'
        },
        didOpen: () => {
            // Forzar centrado y tamaño
            const popup = document.querySelector('.swal-ver-opiniones');
            if (popup) {
                popup.style.margin = '0 auto';
                popup.style.display = 'flex';
                popup.style.flexDirection = 'column';
                popup.style.alignItems = 'center';
                popup.style.justifyContent = 'center';
                
                if (isMobile) {
                    popup.style.maxHeight = '85vh';
                    popup.style.height = 'auto';
                    popup.style.borderRadius = '20px';
                } else {
                    popup.style.maxHeight = '85vh';
                    popup.style.height = 'auto';
                    popup.style.borderRadius = '28px';
                    popup.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)';
                }
            }
            
            // Mover el botón de cerrar a la derecha
            const closeBtn = document.querySelector('.swal-ver-opiniones .swal2-close');
            if (closeBtn) {
                closeBtn.style.position = 'absolute';
                closeBtn.style.right = '15px';
                closeBtn.style.top = '15px';
                closeBtn.style.left = 'auto';
                closeBtn.style.fontSize = isMobile ? '1.5rem' : '2.2rem';
                closeBtn.style.padding = '5px 12px';
            }
        }
    });
};

// CSS específico solo para este Swal
(function addSpecificStyles() {
    if (document.getElementById('swal-ver-opiniones-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'swal-ver-opiniones-styles';
    style.textContent = `
        .swal-ver-opiniones {
            margin-left: auto !important;
            margin-right: auto !important;
            left: 0 !important;
            right: 0 !important;
            position: relative !important;
        }
        
        /* Botón cerrar a la derecha */
        .swal-ver-opiniones .swal2-close {
            position: absolute !important;
            right: 15px !important;
            top: 15px !important;
            left: auto !important;
            padding: 5px 12px !important;
            transition: all 0.3s ease !important;
        }
        
        .swal-ver-opiniones .swal2-close:hover {
            transform: rotate(90deg) !important;
            color: #9b59b6 !important;
        }
        
        /* Ocultar scrollbar en el contenedor interno */
        .swal-ver-opiniones-scroll::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
        }
        
        .swal-ver-opiniones-scroll {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
        }
        
        @media (max-width: 768px) {
            .swal-ver-opiniones {
                width: 92% !important;
                max-width: 400px !important;
                margin: 0 auto !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                position: fixed !important;
                top: 50% !important;
                transform: translate(-50%, -50%) !important;
                max-height: 85vh !important;
                padding: 1rem !important;
                border-radius: 20px !important;
            }
            
            .swal-html-ver-opiniones {
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                display: flex !important;
                justify-content: center !important;
                max-height: calc(85vh - 60px) !important;
            }
            
            .swal2-popup.swal-ver-opiniones .swal2-html-container {
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                max-height: calc(85vh - 60px) !important;
            }
            
            .swal-ver-opiniones .swal2-close {
                font-size: 1.5rem !important;
                padding: 5px 10px !important;
                right: 5px !important;
                top: 5px !important;
            }
        }
        
        @media (min-width: 769px) {
            .swal-ver-opiniones {
                width: 650px !important;
                max-width: 750px !important;
                padding: 2rem !important;
                border-radius: 28px !important;
                box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
            }
            
            .swal-html-ver-opiniones {
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            
            .swal2-popup.swal-ver-opiniones .swal2-html-container {
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
            }
        }
    `;
    document.head.appendChild(style);
})();

    document.getElementById('btnVerOpiniones')?.addEventListener('click', () => {
        window.verOpinionesSweetAlert();
    });

    // --- Lógica del Splash Screen ---
    const loaderMessages = [
        "La vida es linda...",
        "Saludos para ti...",
        "Creciendo juntos...",
        "Medicurativo te da la bienvenida...",
        "Tu bienestar es lo primero..."
    ];
    let msgIndex = 0;
    const loaderMsgElem = document.getElementById('loader-message');
    
    const msgInterval = setInterval(() => {
        if (loaderMsgElem) {
            loaderMsgElem.style.opacity = '0';
            setTimeout(() => {
                msgIndex = (msgIndex + 1) % loaderMessages.length;
                loaderMsgElem.textContent = loaderMessages[msgIndex];
                loaderMsgElem.style.opacity = '1';
            }, 300);
        }
    }, 2000);

    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            clearInterval(msgInterval);
        }, 800);
    }

    // --- Lógica del Reloj Dinámico ---
    function actualizarReloj() {
        const ahora = new Date();
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        const fechaTexto = `${dias[ahora.getDay()]}, ${ahora.getDate()} de ${meses[ahora.getMonth()]}`;
        const horaTexto = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

        const elReloj = document.getElementById('relojTexto');
        const elRelojIcono = document.getElementById('iconoRelojDinamico');
        const elSaludoTexto = document.getElementById('saludoDinamico');
        const contenedorReloj = document.getElementById('contenedorRelojVisual');
        const barraProgreso = document.getElementById('barraProgresoDia');
        const hora = ahora.getHours();
        const diaSemana = ahora.getDay();
        const esFinDeSemana = (diaSemana === 0 || diaSemana === 6);
        const saludoSemana = esFinDeSemana ? ' ¡Feliz fin de semana!' : ' ¡Feliz semana!';

        if (elReloj) {
            elReloj.innerHTML = `<span>${fechaTexto}</span> <span style="margin: 0 10px; color: #e0d0f0;">|</span> <span style="color: #9b59b6; font-weight: 800;">${horaTexto}</span>`;
        }

        if (elSaludoTexto) {
            if (hora >= 6 && hora < 12) {
                elSaludoTexto.textContent = `${saludoSemana} Qué alegría empezar el día contigo! ☀️`;
            } else if (hora >= 12 && hora < 19) {
                elSaludoTexto.textContent = `${saludoSemana} Es un gusto verte esta tarde! 🌿`;
            } else {
                elSaludoTexto.textContent = `${saludoSemana} Qué bueno verte antes de descansar! ✨`;
            }
        }

        if (elRelojIcono) {
            if (hora >= 6 && hora < 12) {
                elRelojIcono.className = 'fas fa-cloud-sun';
                elRelojIcono.style.color = '#f1c40f';
            } else if (hora >= 12 && hora < 19) {
                elRelojIcono.className = 'fas fa-sun';
                elRelojIcono.style.color = '#f39c12';
            } else {
                elRelojIcono.className = 'fas fa-moon';
                elRelojIcono.style.color = '#9b59b6';
            }
        }

        if (barraProgreso) {
            const minutosTotales = 24 * 60;
            const minutosPasados = (hora * 60) + ahora.getMinutes();
            const porcentaje = (minutosPasados / minutosTotales) * 100;
            barraProgreso.style.width = porcentaje + '%';

            if (esFinDeSemana) {
                barraProgreso.style.backgroundColor = '#e84393';
            } else {
                if (hora >= 6 && hora < 12) {
                    barraProgreso.style.backgroundColor = '#f1c40f';
                } else if (hora >= 12 && hora < 19) {
                    barraProgreso.style.backgroundColor = '#f39c12';
                } else {
                    barraProgreso.style.backgroundColor = '#9b59b6';
                }
            }
        }

        if (contenedorReloj) {
            if (hora >= 6 && hora < 12) {
                contenedorReloj.style.backgroundColor = '#fffdf0';
            } else if (hora >= 12 && hora < 19) {
                contenedorReloj.style.backgroundColor = '#f0f8ff';
            } else {
                contenedorReloj.style.backgroundColor = '#fdfaff';
            }
        }
    }
    actualizarReloj();
    setInterval(actualizarReloj, 1000);

    // Solo construir el menú dinámico de temas si no estamos en la página de galería
    if (!esPaginaGaleria) {
        construirMenuAdaptable();
        // Actualizar el menú móvil también
        actualizarMenuMovil();
    }

});
