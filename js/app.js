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
    { id: 'especial', nombre: 'Especiales', icono: 'fa-calendar-star', color: '#e67e22', colorFondo: '#a55c17' },
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
    
    // Colores según modo
    const textColor = isDarkMode ? '#ffffff' : '#2c1b4e';
    const subTextColor = isDarkMode ? '#d0c0e0' : '#7f8c8d';
    const bgColor = isDarkMode ? '#1a1a2e' : '#fdfaff';
    const cardBg = isDarkMode ? 'rgba(255,255,255,0.06)' : '#fdfaff';
    const borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : '#e0d0f0';
    
    Swal.fire({
        title: '',
        background: bgColor,
        html: `
            <div style="text-align: center; padding: 5px;">
                <!-- Círculo con imagen -->
                <div style="display: flex; justify-content: center; margin-top: 5px; margin-bottom: 15px;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #f0e6ff, #e6fffa); padding: 5px; box-shadow: 0 8px 25px rgba(155, 89, 182, 0.2);">
                        <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                            <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                </div>

                <h2 style="color: ${textColor}; font-weight: 800; font-size: 28px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 12px;">
                    <i class="fas fa-headset" style="color: #9b59b6; font-size: 32px;"></i>
                    Soporte Medicurativo
                </h2>
                
                <div style="background: ${isDarkMode ? 'rgba(155,89,182,0.15)' : '#f8f0ff'}; padding: 25px; border-radius: 60px; margin: 15px 0; border: 2px solid ${isDarkMode ? 'rgba(155,89,182,0.2)' : '#f0e6ff'};">
                    <p style="font-size: 18px; color: ${textColor}; margin: 10px 0; line-height: 1.8; font-weight: 500;">
                        Hola, somos el equipo Medicurativo.<br>
                        ¿En qué te podemos ayudar?<br>
                        <span style="color: #9b59b6; font-weight: 600;">Cuéntanos qué necesitas.</span>
                    </p>

                    <!-- Gmail -->
                    <div style="background: linear-gradient(135deg, #2c1b4e, #4a2360); padding: 16px 20px; border-radius: 50px; margin: 15px 0; display: flex; align-items: center; justify-content: center; gap: 12px; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(44, 27, 78, 0.3);" 
                         onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                        <i class="fas fa-envelope" style="font-size: 24px; color: white;"></i>
                        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=joacoxx2340@gmail.com&su=Soporte%20Medicurativo&body=Hola%2C%20somos%20el%20equipo%20Medicurativo.%20%C2%BFEn%20qu%C3%A9%20te%20podemos%20ayudar%3F%20Cu%C3%A9ntanos.%0A%0AP%C3%A1gina%20o%20secci%C3%B3n%3A%0AProblema%20o%20duda%3A%0ADescripci%C3%B3n%3A%0A" 
                           target="_blank" rel="noopener" 
                           style="color: white; font-size: 18px; font-weight: 600; text-decoration: none; letter-spacing: 0.5px;">
                            Gmail
                        </a>
                        <i class="fas fa-arrow-right" style="color: white; font-size: 16px;"></i>
                    </div>

                    <!-- WhatsApp -->
                    <div style="background: linear-gradient(135deg, #27ae60, #1a8a4a); padding: 16px 20px; border-radius: 50px; margin: 15px 0; display: flex; align-items: center; justify-content: center; gap: 12px; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3); cursor: pointer;"
                         onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'"
                         onclick="abrirWhatsAppDirecto()">
                        <i class="fab fa-whatsapp" style="font-size: 24px; color: white;"></i>
                        <span style="color: white; font-size: 18px; font-weight: 600; letter-spacing: 0.5px;">
                            WhatsApp
                        </span>
                        <i class="fas fa-arrow-right" style="color: white; font-size: 16px;"></i>
                    </div>

                    <!-- Bot Medi -->
                    <div style="background: linear-gradient(135deg, #9b59b6, #7a3d91); padding: 16px 20px; border-radius: 50px; margin: 15px 0; display: flex; align-items: center; justify-content: center; gap: 12px; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(155, 89, 182, 0.3);"
                         onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                        <i class="fas fa-robot" style="font-size: 24px; color: white;"></i>
                        <a href="bot.html" 
                           style="color: white; font-size: 18px; font-weight: 600; text-decoration: none; letter-spacing: 0.5px;">
                            Bot Medi
                        </a>
                        <i class="fas fa-arrow-right" style="color: white; font-size: 16px;"></i>
                    </div>

                    <div style="margin-top: 20px; padding: 15px; background: ${cardBg}; border-radius: 30px; border: 1px solid ${borderColor};">
                        <p style="font-size: 15px; color: ${textColor}; margin: 0; line-height: 1.6;">
                            <i class="fas fa-info-circle" style="color: #9b59b6; font-size: 18px;"></i>
                            <br>
                            Puedes escribir por Gmail, WhatsApp o hablar con Bot Medi.
                            <br>
                            <span style="color: ${subTextColor}; font-size: 0.9rem;">
                                Describe qué estabas haciendo, en qué página pasó y si puedes agrega una captura.
                            </span>
                            <br>
                            <strong style="color: #9b59b6;">Respondemos lo antes posible.</strong>
                        </p>
                    </div>
                </div>

                <!-- Badges de soporte -->
                <div style="display: flex; gap: 12px; justify-content: center; margin-top: 15px; flex-wrap: wrap;">
                    <span style="background: ${isDarkMode ? 'rgba(155,89,182,0.2)' : '#f0e6ff'}; padding: 8px 18px; border-radius: 30px; font-size: 0.85rem; color: ${textColor}; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-envelope" style="color: #9b59b6;"></i> Gmail
                    </span>
                    <span style="background: ${isDarkMode ? 'rgba(39,174,96,0.2)' : '#e6fffa'}; padding: 8px 18px; border-radius: 30px; font-size: 0.85rem; color: ${textColor}; display: flex; align-items: center; gap: 8px;">
                        <i class="fab fa-whatsapp" style="color: #27ae60;"></i> WhatsApp
                    </span>
                    <span style="background: ${isDarkMode ? 'rgba(241,196,15,0.2)' : '#fff9e6'}; padding: 8px 18px; border-radius: 30px; font-size: 0.85rem; color: ${textColor}; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-robot" style="color: #f1c40f;"></i> Bot Medi
                    </span>
                </div>

                <div style="margin-top: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <i class="fas fa-check-circle" style="font-size: 20px; color: #27ae60;"></i>
                    <span style="color: ${subTextColor}; font-size: 0.9rem; font-weight: 500;">Soporte gratuito por Gmail, WhatsApp y Bot Medi</span>
                </div>

                <div style="margin-top: 15px;">
                    <button onclick="Swal.close()" style="background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; border: none; padding: 12px 40px; border-radius: 50px; font-weight: 700; cursor: pointer; font-size: 1rem; box-shadow: 0 8px 20px rgba(155, 89, 182, 0.3); transition: all 0.3s; width: 100%;" 
                            onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                        Entendido
                    </button>
                </div>
            </div>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        customClass: { 
            popup: 'swal-popup-redondo',
            closeButton: 'custom-close-btn-left'
        }
    });
}

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
        html: `
            <div style="text-align: center; padding: 5px;">
                <div style="display: flex; justify-content: center; margin-top: 5px; margin-bottom: 15px;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #f0e6ff, #e6fffa); padding: 5px; box-shadow: 0 8px 25px rgba(155, 89, 182, 0.2);">
                        <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                            <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                </div>

                <h2 style="color: ${textColor}; font-weight: 800; margin-bottom: 8px;">Nuestra Misión</h2>
                
                <div style="text-align: left; background: ${cardBg}; padding: 20px; border-radius: 30px; border: 2px solid ${borderColor}; box-shadow: 0 5px 15px rgba(0,0,0,0.02);">
                    <p style="color: ${textColor}; font-size: 1rem; line-height: 1.8; text-align: center;">
                        <i class="fas fa-quote-left" style="color: #9b59b6; font-size: 1.2rem;"></i>
                        Esta página web está hecha para ayudarte en conocimiento en temas
                        que nos ayudan a <strong style="color: #9b59b6;">crecer como persona</strong>
                        en esta vida y ser <strong style="color: #9b59b6;">mejores cada día</strong>.
                    </p>
                    
                    <div style="background: ${cardBg2}; padding: 15px; border-radius: 20px; margin: 15px 0; border-left: 5px solid #9b59b6;">
                        <p style="color: ${textColor}; font-size: 1rem; font-weight: 500; text-align: center; margin: 0;">
                            🌱 <strong>Crecemos juntos, un tema a la vez</strong>
                        </p>
                    </div>
                </div>
                
                <div style="margin-top: 20px; display: flex; justify-content: center;">
                    <button onclick="Swal.close()" style="background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; border: none; padding: 12px 40px; border-radius: 50px; font-weight: 600; cursor: pointer; font-size: 1rem; box-shadow: 0 8px 20px rgba(155, 89, 182, 0.3); transition: 0.3s;">
                        ✨ Entendido
                    </button>
                </div>
                <p style="margin-top: 15px; font-size: 0.8rem; color: ${subTextColor}; font-style: italic;">"El conocimiento es el primer paso hacia la transformación."</p>
            </div>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        customClass: { 
            popup: 'swal-popup-redondo',
            closeButton: 'custom-close-btn-left'
        }
    });
};
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
                <!-- Círculo con imagen - Con margen superior reducido -->
                <div style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 20px;">
                    <div style="width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, #f0e6ff, #e6fffa); padding: 5px; box-shadow: 0 8px 25px rgba(155, 89, 182, 0.2);">
                        <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                            <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                </div>

                <h2 style="color: ${textColor}; font-weight: 800; margin-bottom: 8px;">¿Qué puedes hacer aquí?</h2>
                <p style="color: #9b59b6; font-weight: 600; margin-bottom: 20px;">Tu espacio de crecimiento personal 🌿</p>
                
                <div style="text-align: left; background: ${cardBg}; padding: 20px; border-radius: 30px; border: 2px solid ${borderColor}; box-shadow: 0 5px 20px rgba(0,0,0,0.05); max-height: 300px; overflow-y: auto;">
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: #27ae60; font-size: 0.85rem; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;"><i class="fas fa-check-circle"></i> Disponible sin cuenta</h4>
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                            <div style="background: #e6fffa; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-th-list" style="color: #27ae60; font-size: 0.8rem;"></i></div>
                            <p style="margin: 0; color: ${textColor}; font-size: 0.9rem;">Ver todas las <strong>categorías</strong> y sus reflexiones.</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                            <div style="background: #f0e6ff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-search" style="color: #9b59b6; font-size: 0.8rem;"></i></div>
                            <p style="margin: 0; color: ${textColor}; font-size: 0.9rem;"><strong>Buscar</strong> temas de inspiración libremente.</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="background: #eaf6ff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-images" style="color: #3498db; font-size: 0.8rem;"></i></div>
                            <p style="margin: 0; color: ${textColor}; font-size: 0.9rem;">Explorar la <strong>galería</strong> de imágenes reflexivas.</p>
                        </div>
                    </div>

                    <div>
                        <h4 style="color: #e67e22; font-size: 0.85rem; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;"><i class="fas fa-lock"></i> Solo con cuenta</h4>
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                            <div style="background: #fff9e6; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-star" style="color: #f39c12; font-size: 0.8rem;"></i></div>
                            <p style="margin: 0; color: ${textColor}; font-size: 0.9rem;"><strong>Gana Estrellas:</strong> Avanza en el sistema y desbloquea nuevos niveles.</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                            <div style="background: #fff9e6; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-trophy" style="color: #f1c40f; font-size: 0.8rem;"></i></div>
                            <p style="margin: 0; color: ${textColor}; font-size: 0.9rem;"><strong>Completar logros:</strong> Desbloquea trofeos y medallas.</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                            <div style="background: #e8f8f5; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-book" style="color: #1abc9c; font-size: 0.8rem;"></i></div>
                            <p style="margin: 0; color: ${textColor}; font-size: 0.9rem;"><strong>Diario Personal:</strong> Guarda tus pensamientos en un espacio privado.</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                            <div style="background: #fff0f5; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-star" style="color: #e84393; font-size: 0.8rem;"></i></div>
                            <p style="margin: 0; color: ${textColor}; font-size: 0.9rem;"><strong>Calificar</strong> y dar like a las reflexiones.</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="background: #fff0f5; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-users" style="color: #27ae60; font-size: 0.8rem;"></i></div>
                            <p style="margin: 0; color: ${textColor}; font-size: 0.9rem;"><strong>Comunidad:</strong> Comparte y participa con otros usuarios.</p>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px;">
                    <button onclick="window.location.href='login.html'" style="background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; border: none; padding: 14px 30px; border-radius: 50px; font-weight: 700; cursor: pointer; width: 100%; box-shadow: 0 8px 20px rgba(155, 89, 182, 0.3); font-size: 1rem; transition: 0.3s;">✨ ¡Crear cuenta y desbloquear todo!</button>
                </div>
                <p style="margin-top: 12px; font-size: 0.8rem; color: ${subTextColor}; font-style: italic;">"La paz interior es el mejor regalo que te puedes dar hoy."</p>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        customClass: { 
            popup: 'swal-popup-redondo',
            closeButton: 'custom-close-btn-left'
        }
    });
}

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
        
        const { data: opiniones } = await supabaseClient.from('comentarios').select('estrellas');

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
    


// --- Lógica de Perfil de Usuario ---
document.getElementById('btnPerfil')?.addEventListener('click', async function() {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();

        if (!session) {
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

        // Verificar logros ANTES de mostrar el perfil
        if (window.verificarLogros) {
            await window.verificarLogros(userId);
        }

        // Obtener estrellas reclamadas
        let estrellasReclamadas = [];
        if (window.obtenerEstrellasReclamadas) {
            estrellasReclamadas = await window.obtenerEstrellasReclamadas(userId);
        }
        const totalEstrellas = estrellasReclamadas.length;

        // ================================================
        // TÍTULO, COLOR Y MARCO SEGÚN ESTRELLAS
        // ================================================
        let tituloUsuario = '🕊️ Buscador de Paz';
        let fraseUsuario = 'Cada día es una nueva oportunidad para crecer';
        let colorNombre = '#2c1b4e';
        let colorBordePerfil = '#e0d0f0';
        let tamañoNombre = '1.4rem';
        let marcoAvatar = '';
        let tamañoAvatar = '60px';
        let decoracionAvatar = '';
        let efectoFondo = '';
        let mostrarEfecto = false;
        
        // Estrellas visuales
        let estrellasVisuales = '';
        let glowEstrella = '';
        
        if (totalEstrellas >= 9) {
            tituloUsuario = '🌟 Leyenda Medicurativo';
            fraseUsuario = '✨ Iluminas el camino de los demás con tu luz';
            colorNombre = '#ffd700';
            colorBordePerfil = '#ffd700';
            tamañoNombre = '2rem';
            marcoAvatar = `
                border: 4px solid #ffd700;
                box-shadow: 0 0 40px rgba(255, 215, 0, 0.6), 0 0 80px rgba(255, 215, 0, 0.2);
                background: radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%);
                padding: 12px;
            `;
            tamañoAvatar = '75px';
            decoracionAvatar = `
                <div style="position: absolute; top: -15px; right: -15px; font-size: 1.5rem; animation: pulse 2s infinite;">👑</div>
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
        } else if (totalEstrellas >= 7) {
            tituloUsuario = '⭐ Maestro del Crecimiento';
            fraseUsuario = '🌿 Has alcanzado la sabiduría del alma';
            colorNombre = '#c0a000';
            colorBordePerfil = '#c0a000';
            tamañoNombre = '1.8rem';
            marcoAvatar = `
                border: 4px solid #c0a000;
                box-shadow: 0 0 35px rgba(192, 160, 0, 0.5), 0 0 60px rgba(192, 160, 0, 0.15);
                background: radial-gradient(circle, rgba(192,160,0,0.12) 0%, transparent 70%);
                padding: 10px;
            `;
            tamañoAvatar = '70px';
            decoracionAvatar = `
                <div style="position: absolute; top: -12px; right: -12px; font-size: 1.3rem;">⭐</div>
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
        } else if (totalEstrellas >= 5) {
            tituloUsuario = '✨ Explorador de Luz';
            fraseUsuario = '🌱 Sigues brillando en tu viaje interior';
            colorNombre = '#e8b800';
            colorBordePerfil = '#e8b800';
            tamañoNombre = '1.6rem';
            marcoAvatar = `
                border: 4px solid #e8b800;
                box-shadow: 0 0 30px rgba(232, 184, 0, 0.4), 0 0 50px rgba(232, 184, 0, 0.1);
                background: radial-gradient(circle, rgba(232,184,0,0.1) 0%, transparent 70%);
                padding: 10px;
            `;
            tamañoAvatar = '65px';
            decoracionAvatar = `
                <div style="position: absolute; top: -10px; right: -10px; font-size: 1.2rem;">✨</div>
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
            marcoAvatar = `
                border: 3px solid #d4a017;
                box-shadow: 0 0 20px rgba(212, 160, 23, 0.3);
                background: radial-gradient(circle, rgba(212,160,23,0.08) 0%, transparent 70%);
                padding: 8px;
            `;
            tamañoAvatar = '60px';
            decoracionAvatar = '';
            mostrarEfecto = false;
            estrellasVisuales = '⭐'.repeat(3);
        } else if (totalEstrellas >= 1) {
            tituloUsuario = '🌿 Iniciado en el Camino';
            fraseUsuario = '🌺 Has dado el primer paso hacia tu bienestar';
            colorNombre = '#b8860b';
            colorBordePerfil = '#b8860b';
            tamañoNombre = '1.4rem';
            marcoAvatar = `
                border: 3px solid #b8860b;
                box-shadow: 0 0 15px rgba(184, 134, 11, 0.25);
                padding: 6px;
            `;
            tamañoAvatar = '55px';
            decoracionAvatar = '';
            mostrarEfecto = false;
            estrellasVisuales = '⭐';
        }

        const tieneMarco = totalEstrellas > 0;

        // Determinar qué mostrar en estrellas
        let estrellasDisplay = '';
        if (totalEstrellas >= 3) {
            // 3+ estrellas - mostrar solo una con glow
            estrellasDisplay = glowEstrella;
        } else if (totalEstrellas > 0) {
            // 1-2 estrellas - mostrar normales
            estrellasDisplay = `<span style="font-size: 3rem; letter-spacing: 8px;">${estrellasVisuales}</span>`;
        }

        // Efecto de confeti al abrir si tiene 5+ estrellas
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

        Swal.fire({
            title: 'Perfil de Usuario',
            html: `
                <div style="text-align: center; padding: 5px; position: relative; z-index: 10;">
                    ${efectoFondo}
                    <div style="position: relative; display: inline-block; margin-bottom: 5px;">
                        <div style="font-size: ${tamañoAvatar}; display: inline-block; border-radius: 50%; transition: all 0.5s ease; ${tieneMarco ? marcoAvatar : ''}">
                            ${avatar}
                        </div>
                        ${tieneMarco ? decoracionAvatar : ''}
                    </div>
                    <h3 class="swal-perfil-nombre" style="color: ${colorNombre}; transition: color 0.5s ease; margin-bottom: 2px; font-size: ${tamañoNombre};">
                        ${nombre}
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
                            <button onclick="window.location.href='restablecer.html'" class="swal-perfil-btn"><i class="fas fa-key"></i> Cambiar Contraseña</button>
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
                // Aplicar borde de color al SweetAlert según nivel
                const popup = document.querySelector('.swal-popup-perfil');
                if (popup && totalEstrellas > 0) {
                    popup.style.border = `3px solid ${colorBordePerfil}`;
                    popup.style.boxShadow = `0 25px 60px ${colorBordePerfil}40, 0 0 40px ${colorBordePerfil}20`;
                }

                // Inyectar animaciones CSS
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
                `;
                document.head.appendChild(style);

                // Toggle de secciones
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

                // Cargar calificación del usuario
                (async () => {
                    try {
                        const { data } = await supabaseClient.from('comentarios').select('estrellas').eq('usuario_id', userId);
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

                // ================================================
                // CARGAR LOGROS - MOSTRAR 3 CON OPCIÓN "VER MÁS"
                // ================================================
                (async () => {
                    const container = document.getElementById('userAchievementsDisplay');
                    const btnVerTodos = document.getElementById('btnVerTodosLogros');
                    container.innerHTML = '<div style="text-align: center; padding: 10px;"><i class="fas fa-spinner fa-spin"></i> Cargando logros...</div>';

                    try {
                        // Obtener logros de la tabla
                        const { data: logros, error } = await supabaseClient
                            .from('logros')
                            .select('*')
                            .eq('usuario_id', userId)
                            .maybeSingle();

                        if (error) throw error;

                        // Lista de todos los logros posibles
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

                        // Si no hay registros, crear uno por defecto
                        let logrosData = logros;
                        if (!logrosData) {
                            logrosData = {
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

                        // Separar logros completados y pendientes
                        const completados = [];
                        const pendientes = [];

                        listaLogros.forEach(logro => {
                            if (logrosData[logro.key] === true) {
                                completados.push(logro);
                            } else {
                                pendientes.push(logro);
                            }
                        });
                   
                        // Si no hay logros completados
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

                        // Mostrar SOLO 3 logros completados
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

                        // Mostrar contador de logros
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

                        // Mostrar botón "Ver más" si hay más de 3 logros o pendientes
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

                // ================================================
             // FUNCIÓN PARA MOSTRAR TODOS LOS LOGROS EN SWEETALERT BONITO
// ================================================
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
            </style>
            <div class="modal-logros-scroll" style="max-height: ${esMovil ? '65vh' : '450px'}; overflow-y: auto; padding-right: 8px;">
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
                        ${!reclamado ? `<button onclick="reclamarLogroDesdeModal('${logro.key}', '${logro.texto}', '${userId}')" style="background: linear-gradient(135deg, #f1c40f, #f39c12); color: white; border: none; padding: 4px 12px; border-radius: 20px; font-size: 0.65rem; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.3s; box-shadow: 0 2px 8px rgba(241, 196, 15, 0.3);">
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
        title: '<span style="color: #2c1b4e; font-weight: 800; font-size: 1.4rem;">🏆 Todos mis Logros</span>',
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

                // ================================================
                // FUNCIÓN PARA RECLAMAR DESDE EL MODAL
                // ================================================
                window.reclamarLogroDesdeModal = async function(logroKey, logroTexto, userId) {
                    // Cerrar el modal actual
                    Swal.close();
                    
                    // Esperar un momento y reclamar
                    setTimeout(async () => {
                        const reclamado = await window.reclamarLogro(userId, logroKey, logroTexto);
                        if (reclamado) {
                            // Recargar el perfil para actualizar las estrellas
                            document.getElementById('btnPerfil').click();
                        }
                    }, 300);
                };

                // Logout
                document.getElementById('btnLogout').addEventListener('click', async () => {
                    await supabaseClient.auth.signOut();
                    window.location.href = 'index.html';
                });
            }
        });
    } catch (error) {
        console.error('Error al abrir perfil:', error);
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
async function reclamarLogro(userId, logroKey, logroTexto) {
    try {
        // Verificar si ya fue reclamado
        const { data: existe, error: checkError } = await supabaseClient
            .from('reclamos')
            .select('id')
            .eq('usuario_id', userId)
            .eq('logro_key', logroKey)
            .maybeSingle();

        if (checkError) throw checkError;

        if (existe) {
            Swal.fire({
                title: 'Ya reclamaste esta estrella ⭐',
                text: `Ya reclamaste la estrella por "${logroTexto}"`,
                icon: 'info',
                confirmButtonColor: '#9b59b6',
                customClass: { popup: 'swal-popup-redondo' }
            });
            return false;
        }

        // Reclamar el logro
        const { error: insertError } = await supabaseClient
            .from('reclamos')
            .insert({
                usuario_id: userId,
                logro_key: logroKey
            });

        if (insertError) {
            // Error específico de RLS
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
        console.error('Error al reclamar logro:', error);
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
// ============================================================
// FUNCIÓN PARA VERIFICAR Y GUARDAR LOGROS
// ============================================================
async function verificarLogros(userId) {
    try {
        // Obtener datos del usuario
        const { data: userData } = await supabaseClient
            .from('usuarios')
            .select('nombre, genero_id')
            .eq('id', userId)
            .single();

        const tieneNombre = userData && userData.nombre && userData.nombre !== 'Amigo';
        const tieneGenero = userData && userData.genero_id !== null;

        // Contar publicaciones
        const { count: countPublicaciones } = await supabaseClient
            .from('publicaciones')
            .select('*', { count: 'exact', head: true })
            .eq('usuario_id', userId);

        // Contar reflexiones
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

        // Guardar o actualizar en la tabla logros
        const { error } = await supabaseClient
            .from('logros')
            .upsert({
                usuario_id: userId,
                ...logros,
                actualizado_en: new Date().toISOString()
            });

        if (error) {
            console.error('Error al guardar logros:', error);
        }

        return logros;

    } catch (error) {
        console.error('Error en verificarLogros:', error);
        return null;
    }
}

// Exponer función globalmente
window.verificarLogros = verificarLogros;

// ============================================================
// FUNCIÓN PARA RECLAMAR LOGRO (DAR ESTRELLA)
// ============================================================
async function reclamarLogro(userId, logroKey, logroTexto) {
    try {
        // Verificar si ya fue reclamado
        const { data: existe, error: checkError } = await supabaseClient
            .from('reclamos')
            .select('id')
            .eq('usuario_id', userId)
            .eq('logro_key', logroKey)
            .maybeSingle();

        if (checkError) throw checkError;

        if (existe) {
            Swal.fire({
                title: 'Ya reclamaste esta estrella ⭐',
                text: `Ya reclamaste la estrella por "${logroTexto}"`,
                icon: 'info',
                confirmButtonColor: '#9b59b6',
                customClass: { popup: 'swal-popup-redondo' }
            });
            return false;
        }

        // Reclamar el logro
        const { error: insertError } = await supabaseClient
            .from('reclamos')
            .insert({
                usuario_id: userId,
                logro_key: logroKey
            });

        if (insertError) throw insertError;

        // Éxito - mostrar confeti y estrella
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#f1c40f', '#ffd700', '#9b59b6']
            });
        }

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
        console.error('Error al reclamar logro:', error);
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

// Obtener estrellas reclamadas
async function obtenerEstrellasReclamadas(userId) {
    try {
        const { data, error } = await supabaseClient
            .from('reclamos')
            .select('logro_key')
            .eq('usuario_id', userId);

        if (error) throw error;
        return data.map(r => r.logro_key);

    } catch (error) {
        console.error('Error al obtener estrellas:', error);
        return [];
    }
}

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
                await supabaseClient.from('comentarios').insert({ usuario_id: session.user.id, estrellas: result.value.rating, comentario: result.value.comment });

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

    // --- Función global para Ver Opiniones ---
 window.verOpinionesSweetAlert = async function() {
    const { data: allOpinions, error } = await supabaseClient
        .from('comentarios')
        .select('estrellas, comentario, creado_en, usuarios(nombre)');

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

    const renderOpinionsList = (ops) => {
        if (!ops || ops.length === 0) return '<p style="text-align:center; opacity:0.6; padding: 20px; color:' + subTextColor + ';">Aún no hay opiniones. ¡Sé el primero!</p>';
        return ops.map(op => `
            <div style="background: ${cardBg}; padding: 15px; border-radius: 20px; margin-bottom: 12px; border-left: 6px solid #f1c40f; text-align: left; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div style="display:flex; align-items:center; gap: 8px;">
                        <i class="fas fa-user-circle" style="color: #9b59b6; font-size: 1.1rem;"></i>
                        <strong style="font-size: 0.9rem; color: ${textColor};">${op.usuarios?.nombre || 'Usuario'}</strong>
                    </div>
                    <span style="color: #f1c40f; font-size: 0.9rem;">${'★'.repeat(op.estrellas)}${'☆'.repeat(5-op.estrellas)}</span>
                </div>
                <p style="font-size: 0.85rem; margin: 0; color: ${cardTextColor}; font-style: italic; line-height: 1.4;">"${op.comentario}"</p>
                <div style="text-align: right; margin-top: 5px;">
                    <small style="color: ${cardSubTextColor}; font-size: 0.7rem;">${new Date(op.creado_en).toLocaleDateString()}</small>
                </div>
            </div>
        `).join('');
    };

    Swal.fire({
        title: '',
        html: `
            <div style="text-align: center;">
                <!-- Círculo con imagen arriba del título -->
                <div style="display: flex; justify-content: center; margin-top: 5px; margin-bottom: 15px;">
                    <div style="width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #f0e6ff, #e6fffa); padding: 4px; box-shadow: 0 8px 25px rgba(155, 89, 182, 0.2);">
                        <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center;">
                            <img src="imganes/logosmedi.png" alt="Medicurativo" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                </div>

                <h2 style="color: ${textColor}; font-weight: 800; margin-bottom: 8px;">
                    <i class="fas fa-comments" style="color: #9b59b6;"></i> Comunidad Medicurativo
                </h2>
                
                <div style="padding: 5px; max-height: 380px; overflow-y: auto; scrollbar-width: none; margin-top: 10px;">
                    ${renderOpinionsList(allOpinions ? [...allOpinions].reverse() : [])}
                </div>
                <p style="font-size: 0.8rem; color: ${subTextColor}; margin-top: 15px;">Gracias por ayudarnos a crecer día tras día.</p>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        background: bgColor,
        customClass: { 
            popup: 'swal-popup-redondo',
            closeButton: 'custom-close-btn-left'
        }
    });
};

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
