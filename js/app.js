// 1. Cargar y aplicar preferencia de tema INMEDIATAMENTE para evitar parpadeo blanco
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// Inicializar Supabase
const supabaseUrl = 'https://eryakdyoscrctqunqkvt.supabase.co';
const supabaseKey = 'sb_publishable_ekj-F2tgLWWOGHuFCSyx-g_8_moXDKa';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Hacer temaPrincipal global
// ===== BASE DE DATOS =====

// Sonido de interfaz (Click suave)
const clickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
clickSound.volume = 0.2; // Volumen bajo para que sea elegante

const successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');
successSound.volume = 0.3;

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

// Categorías con colores (INCLUYENDO GALERÍA)
const categorias = [
    { id: 'valores', nombre: 'Valores', icono: 'fa-hand-sparkles', color: '#1e6f9c', colorFondo: '#0a3b55' },
    { id: 'crecimiento', nombre: 'Crecimiento', icono: 'fa-seedling', color: '#8e44ad', colorFondo: '#4a2360' },
    { id: 'emociones', nombre: 'Emociones', icono: 'fa-heart', color: '#c44569', colorFondo: '#822b4a' },
    { id: 'liderazgo', nombre: 'Liderazgo', icono: 'fa-crown', color: '#0e7c5c', colorFondo: '#064e39' },
    { id: 'especial', nombre: 'Especiales', icono: 'fa-calendar-star', color: '#e67e22', colorFondo: '#a55c17' },
    { id: 'galeria', nombre: 'Galería', icono: 'fa-images', color: '#9b59b6', colorFondo: '#4a2360' }
];

// Elementos DOM
const menuHorizontal = document.getElementById('menuHorizontal');
const temaPrincipal = document.getElementById('temaPrincipal');
const esPaginaGaleria = window.location.pathname.includes('galeria.html');

// Hacer temaPrincipal global para otros scripts
window.temaPrincipal = temaPrincipal;
window.categorias = categorias; // Hacer categorias global

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

    // Diseño único para todos los temas usando el objeto tema
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

// ===== FUNCIÓN PARA CONSTRUIR MENÚ ADAPTABLE =====
function construirMenuAdaptable(filtro = '') {
    if (!menuHorizontal) return;
    let html = '';
    const mobile = isMobile();
    
    categorias.forEach(cat => {
        
    if (cat.id === 'galeria') {
    // ✅ TANTO PC COMO MÓVIL: Redirigir a galeria2.html
    html += `
        <button class="menu-btn-categoria" onclick="window.location.href='galeria2.html'"
                style="border-left: 5px solid ${cat.color};">
            <i class="fas ${cat.icono}" style="color: ${cat.color};"></i>
            <span>${cat.nombre}</span>
        </button>
    `;


        } else {
            // Otras categorías (valores, crecimiento, etc.)
            if (mobile) {
                html += `
                    <button class="menu-btn-categoria" onclick="window.mostrarTemasCategoriaMobile(${JSON.stringify(cat).replace(/"/g, '&quot;')})"
                            style="border-left: 5px solid ${cat.color};">
                        <i class="fas ${cat.icono}" style="color: ${cat.color};"></i>
                        <span>${cat.nombre}</span>
                    </button>
                `;
            } else {
                // Filtrar temas por nombre si hay búsqueda
                const temasCat = temas.filter(t => 
                    t.cat === cat.id && 
                    t.nombre.toLowerCase().includes(filtro.toLowerCase())
                );

                // Solo mostrar categoría si tiene temas que coinciden
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
// ===== FUNCIONES PARA PC =====
window.toggleSubmenu = function(e, catId) {
    // Detección segura: si 'e' es un evento, lo usamos; si es un string, es el catId
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
        // Reproducir sonido al abrir
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
        } else {
            // Si no hay sesión, igual gestionamos el buzón para el invitado
            gestionarBuzon(null);
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
                // Usuario NO logueado: Mostramos el Swafire de invitación
                if (notif) notif.style.display = 'block'; // Activamos puntito para invitar a registrarse
                btnBuzon.onclick = () => mostrarInvitacionRegistro();
            }
            return;
        }
        
        const bienvenidaVista = localStorage.getItem(`bienvenida_${userId}`);
        const novedadVista = localStorage.getItem(`novedad_${userId}`);

        // Mostrar puntito si hay bienvenida pendiente O una novedad no leída
        if (!bienvenidaVista || novedadVista !== ID_ULTIMA_NOVEDAD) {
            if (notif) notif.style.display = 'block';
        }

        // Bienvenida automática solo para nuevos
        if (!bienvenidaVista) {
            setTimeout(() => mostrarBienvenida(userId), 2500);
        }

        // Evento del botón
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
        Swal.fire({
            title: '<span style="color: #2c1b4e; font-weight: 800;">🚀 ¡Descubre Medicurativo!</span>',
            html: `
                <div style="text-align: center; padding: 5px;">
                    <p style="color: #9b59b6; font-weight: 600; margin-bottom: 20px;">Tu refugio digital para la paz mental y el crecimiento personal.</p>
                    
                    <div style="text-align: left; background: #fdfaff; padding: 20px; border-radius: 30px; border: 2px solid #f0e6ff; box-shadow: 0 5px 20px rgba(0,0,0,0.05);">
                        <!-- LO QUE PUEDE HACER -->
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: #27ae60; font-size: 0.85rem; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;"><i class="fas fa-check-circle"></i> Disponible ahora</h4>
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                                <div style="background: #e6fffa; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-spa" style="color: #27ae60; font-size: 0.8rem;"></i></div>
                                <p style="margin: 0; color: #2c1b4e; font-size: 0.9rem;">Leer reflexiones sobre valores y crecimiento.</p>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="background: #f0e6ff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-search" style="color: #9b59b6; font-size: 0.8rem;"></i></div>
                                <p style="margin: 0; color: #2c1b4e; font-size: 0.9rem;">Buscador inteligente de inspiración.</p>
                            </div>
                        </div>

                        <!-- LO QUE ESTÁ BLOQUEADO -->
                        <div>
                            <h4 style="color: #e67e22; font-size: 0.85rem; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;"><i class="fas fa-lock"></i> Bloqueado para Invitados</h4>
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px; opacity: 0.8;">
                                <div style="background: #fff9e6; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-trophy" style="color: #f1c40f; font-size: 0.8rem;"></i></div>
                                <p style="margin: 0; color: #2c1b4e; font-size: 0.9rem;"><strong>Logros:</strong> Desbloquea trofeos al unirte.</p>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px; opacity: 0.8;">
                                <div style="background: #fff0f5; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-cloud-upload-alt" style="color: #ff7675; font-size: 0.8rem;"></i></div>
                                <p style="margin: 0; color: #2c1b4e; font-size: 0.9rem;"><strong>Subir Contenido:</strong> Sube tus propias reflexiones.</p>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px; opacity: 0.8;">
                                <div style="background: #e8f4fd; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-comment-alt" style="color: #3498db; font-size: 0.8rem;"></i></div>
                                <p style="margin: 0; color: #2c1b4e; font-size: 0.9rem;"><strong>Comunidad:</strong> Califica y comenta sobre la página.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 25px;">
                        <button onclick="window.location.href='login.html'" style="background: #9b59b6; color: white; border: none; padding: 16px 30px; border-radius: 50px; font-weight: 700; cursor: pointer; width: 100%; box-shadow: 0 8px 20px rgba(155, 89, 182, 0.3); transition: 0.3s;">✨ ¡Unirme y Desbloquear todo!</button>
                    </div>
                    <p style="margin-top: 15px; font-size: 0.8rem; color: #7f8c8d; font-style: italic;">"La paz interior es el mejor regalo que te puedes dar hoy."</p>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            customClass: { popup: 'swal-popup-redondo' }
        });
    }

    function mostrarBienvenida(userId) {
        Swal.fire({
            title: '¡Bienvenido a tu Espacio de Luz! 🌿',
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
        Swal.fire({
            title: '<span style="color: #2c1b4e; font-weight: 800;">🚀 ¡Bienvenido a Medicurativo!</span>',
            html: `
                <div style="text-align: center; padding: 5px;">
                    <p style="color: #9b59b6; font-weight: 600; margin-bottom: 20px;">Tu espacio para sanar y crecer día a día.</p>
                    
                    <div style="text-align: left; background: #fdfaff; padding: 20px; border-radius: 30px; border: 2px solid #f0e6ff; box-shadow: 0 5px 15px rgba(0,0,0,0.02);">
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                            <div style="background: #fff9e6; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-trophy" style="color: #f1c40f;"></i></div>
                            <p style="margin: 0; color: #2c1b4e; font-size: 0.95rem;"><strong>Gana Logros:</strong> Crea tu cuenta y personaliza tu perfil para ganar trofeos dorados.</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                            <div style="background: #f0e6ff; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-search" style="color: #9b59b6;"></i></div>
                            <p style="margin: 0; color: #2c1b4e; font-size: 0.95rem;"><strong>Buscador Inteligente:</strong> Encuentra la reflexión exacta que necesitas hoy.</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                            <div style="background: #e6fffa; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-star" style="color: #27ae60;"></i></div>
                            <p style="margin: 0; color: #2c1b4e; font-size: 0.95rem;"><strong>Comunidad:</strong> Califica la página y ayúdanos a llegar a más personas.</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="background: #fff0f5; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-upload" style="color: #ff7675;"></i></div>
                            <p style="margin: 0; color: #2c1b4e; font-size: 0.95rem;"><strong>Próximamente:</strong> ¡Podrás subir tus propias frases y compartirlas!</p>
                        </div>
                    </div>
                    <p style="margin-top: 20px; font-size: 0.85rem; color: #7f8c8d; font-style: italic;">"La paz interior comienza en el momento en que decides no permitir que otra persona o evento controle tus emociones."</p>
                </div>
            `,
            confirmButtonText: '✨ ¡Empezar ahora!',
            confirmButtonColor: '#9b59b6',
            customClass: { popup: 'swal-popup-redondo' }
        });
    }

    // --- Función para actualizar la calificación global ---
    window.actualizarPromedioGlobal = async function() {
        const container = document.getElementById('contenedorPromedioGlobal');
        const valorText = document.getElementById('valorPromedioGlobal');
        const valorTextMovil = document.getElementById('valorPromedioGlobalMovil');
        
        const { data: opiniones } = await supabaseClient.from('comentarios').select('estrellas');

        if (opiniones && opiniones.length > 0) {
            const suma = opiniones.reduce((acc, op) => acc + op.estrellas, 0);
            const promedio = (suma / opiniones.length).toFixed(1);
            
            // Actualizar header (PC) - Solo si el promedio no es 0
            if (valorText) {
                valorText.textContent = promedio;
            }
            
            // Actualizar menú móvil
            if (valorTextMovil) valorTextMovil.textContent = promedio;
            if (container) container.style.display = 'flex';
        }
    }

    actualizarPromedioGlobal();

    verificarSesion();

    // --- Manejo de errores de Supabase en la URL (#error=...) ---
    const hash = window.location.hash; // Mantenemos esta línea para el manejo de errores de Supabase
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
            // Limpiar la URL para que el error no se repita al recargar
            window.history.replaceState(null, null, window.location.pathname);
        }
    }
    
    // --- Lógica de Modo Oscuro ---
    const darkModeBtn = document.getElementById('darkModeToggle');

    // Sincronizar el icono del botón si existe
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

    // --- Lógica del Buscador ---
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
                        // Resaltado (Highlight) con color llamativo
                        const regex = new RegExp(`(${valorOriginal})`, 'gi');
                        const nombreResaltado = t.nombre.replace(regex, '<span class="highlight">$1</span>');
                        return `
                        <div class="sugerencia-item" onclick="seleccionarSugerencia(${t.id}); clickSound.play();">
                            <i class="fas ${t.icono}"></i> ${nombreResaltado}
                        </div>
                    `}).join('');
                    sugerenciasCont.classList.add('mostrar');
                } else {
                    // Mensaje cuando no hay temas encontrados
                    sugerenciasCont.innerHTML = `<div class="sugerencia-item" style="text-align: center; opacity: 0.6; cursor: default;">No encontrado</div>`;
                    sugerenciasCont.classList.add('mostrar');
                }
            } else {
                sugerenciasCont.classList.remove('mostrar');
            }
        });

        // Cerrar sugerencias al hacer clic fuera
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
            
            // Scroll suave hacia el tema seleccionado
            temaPrincipal.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Resaltar en el menú
            document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('activo'));
            const btnCat = document.querySelector(`.menu-item[data-cat="${tema.cat}"] .menu-btn`);
            if (btnCat) btnCat.classList.add('activo');
        }
    };

    // --- Listeners de botones ---
    document.getElementById('btnAyuda')?.addEventListener('click', window.mostrarAyuda);
    document.getElementById('btnMision')?.addEventListener('click', window.mostrarMision);
    document.getElementById('btnSoporte')?.addEventListener('click', window.mostrarSoporte);
    document.getElementById('btnAgradecimientos')?.addEventListener('click', window.mostrarAgradecimientos);
    
    // --- Lógica de Perfil de Usuario ---
    document.getElementById('btnPerfil')?.addEventListener('click', async () => {
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

        const nombre = session.user.user_metadata?.nombre || "No definido";
        const correo = session.user.email;
        const generoId = session.user.user_metadata?.genero_id;
        
        // Avatar según género
        const avatar = generoId == 1 ? '👨‍💻' : (generoId == 2 ? '👩‍💻' : '👤');
        const generoTexto = generoId == 1 ? "Caballero" : (generoId == 2 ? "Dama" : "No especificado");

        Swal.fire({
            title: 'Perfil de Usuario',
            html: `
                <div style="text-align: center; padding: 5px;">
                    <!-- Avatar y Datos Principales -->
                    <div style="font-size: 60px; margin-bottom: 15px;">${avatar}</div>
                    <h3 class="swal-perfil-nombre">${nombre}</h3>
                    <p class="swal-perfil-genero">${generoTexto}</p>
                    
                    <div class="swal-perfil-info-box">
                        <small>Correo Electrónico</small>
                        <p>${correo}</p>
                    </div>

                    <!-- Secciones Desplegables -->
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
            customClass: { popup: 'swal-popup-redondo swal-popup-perfil' },
            didOpen: () => {
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

                // Cargar Calificación Dinámica
                (async () => {
                    const { data } = await supabaseClient.from('comentarios').select('estrellas').eq('usuario_id', session.user.id);
                    const container = document.getElementById('userRatingDisplay');
                    if (data && data.length > 0) {
                        const avg = (data.reduce((s, o) => s + o.estrellas, 0) / data.length).toFixed(1);
                        container.innerHTML = `<p style="font-size: 1.1rem; font-weight: 700;">Tu promedio: <span style="color: #f1c40f;">${avg} ★</span></p>`;
                    } else {
                        container.innerHTML = `<p style="font-size: 0.9rem; opacity: 0.7;">Aún no has calificado.</p>`;
                    }
                })();

                // Cargar Logros Dinámicos
                (async () => {
                    const { data: logros } = await supabaseClient.from('logros').select('*').eq('usuario_id', session.user.id).maybeSingle();
                    const container = document.getElementById('userAchievementsDisplay');
                    if (logros && (logros.cambio_nombre || logros.cambio_genero)) {
                        let html = '';
                        if (logros.cambio_nombre) html += `<div class="achievement-card"><i class="fas fa-id-card"></i> <div><strong>Identidad Única</strong><br><small>Cambiaste tu nombre</small></div></div>`;
                        if (logros.cambio_genero) html += `<div class="achievement-card"><i class="fas fa-venus-mars"></i> <div><strong>Autenticidad</strong><br><small>Definiste tu género</small></div></div>`;
                        container.innerHTML = html;
                    } else {
                        container.innerHTML = `<p style="font-size: 0.9rem; opacity: 0.7;">Sin logros aún.</p>`;
                    }
                })();

                document.getElementById('btnLogout').addEventListener('click', async () => {
                    await supabaseClient.auth.signOut();
                    window.location.href = 'index.html';
                });
            }
        });
    }); // Cierra listener de perfil

    // --- Nueva función global para Calificación y Ver Opiniones ---
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
            customClass: { popup: 'swal-popup-redondo' },
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

                // Confeti de éxito
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
                }).then(() => {
                    // El perfil se mantiene abierto o se puede recargar si se desea ver el promedio actualizado
                });
            }
        });
    };

    // --- Nueva función global para Ver Opiniones (Estilo Bonito) ---
    window.verOpinionesSweetAlert = async function() {
        const { data: allOpinions, error } = await supabaseClient
            .from('comentarios')
            .select('estrellas, comentario, creado_en, usuarios(nombre)');

        if (error) return Swal.fire('Error', 'No pudimos cargar las opiniones.', 'error');

        const renderOpinionsList = (ops) => {
            if (!ops || ops.length === 0) return '<p style="text-align:center; opacity:0.6; padding: 20px;">Aún no hay opiniones. ¡Sé el primero!</p>';
            return ops.map(op => `
                <div style="background: white; padding: 15px; border-radius: 20px; margin-bottom: 12px; border-left: 6px solid #f1c40f; text-align: left; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <div style="display:flex; align-items:center; gap: 8px;">
                            <i class="fas fa-user-circle" style="color: #9b59b6; font-size: 1.1rem;"></i>
                            <strong style="font-size: 0.9rem; color: #2c1b4e;">${op.usuarios?.nombre || 'Usuario'}</strong>
                        </div>
                        <span style="color: #f1c40f; font-size: 0.9rem;">${'★'.repeat(op.estrellas)}${'☆'.repeat(5-op.estrellas)}</span>
                    </div>
                    <p style="font-size: 0.85rem; margin: 0; color: #4a2d6e; font-style: italic; line-height: 1.4;">"${op.comentario}"</p>
                    <div style="text-align: right; margin-top: 5px;">
                        <small style="color: #b0a4e3; font-size: 0.7rem;">${new Date(op.creado_en).toLocaleDateString()}</small>
                    </div>
                </div>
            `).join('');
        };

        Swal.fire({
            title: '<i class="fas fa-comments" style="color: #9b59b6;"></i> Comunidad Medicurativo',
            html: `
                <div style="padding: 5px; max-height: 450px; overflow-y: auto; scrollbar-width: none;">
                    ${renderOpinionsList(allOpinions ? [...allOpinions].reverse() : [])}
                </div>
                <p style="font-size: 0.8rem; color: #7f8c8d; margin-top: 15px;">Gracias por ayudarnos a crecer día tras día.</p>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            background: '#fdfaff',
            customClass: { popup: 'swal-popup-redondo' }
        });
    };

    // Listeners para los botones del header
    // El botón de Calificar se ha movido al SweetAlert de perfil.
    // Si se necesita un listener para un botón de Calificar en el header,
    // se debe añadir el botón al HTML y su listener aquí.
    // Ejemplo (si se decide añadir un botón de Calificar al header):
    // document.getElementById('btnCalificar')?.addEventListener('click', () => {
    //     window.mostrarCalificacionSweetAlert();
    // });

    document.getElementById('btnVerOpiniones')?.addEventListener('click', () => {
        window.verOpinionesSweetAlert();
    });

    // --- ELIMINAR EL BLOQUE REPETIDO QUE CAUSABA EL ERROR (Línea 1005 aprox) ---

    // --- Lógica del Splash Screen (Mejorada) ---
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

    // --- Retirada inmediata del Banner ---
    // No esperamos a 'window.load' (que espera imágenes). 
    // Usamos un pequeño delay de 500ms para que el usuario vea el logo y luego entramos.
    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            clearInterval(msgInterval);
        }, 800); // 800ms es suficiente para una bienvenida elegante pero veloz
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
        const diaSemana = ahora.getDay(); // 0: Domingo, 6: Sábado
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
                elRelojIcono.className = 'fas fa-cloud-sun'; // Mañana
                elRelojIcono.style.color = '#f1c40f';
            } else if (hora >= 12 && hora < 19) {
                elRelojIcono.className = 'fas fa-sun'; // Tarde
                elRelojIcono.style.color = '#f39c12';
            } else {
                elRelojIcono.className = 'fas fa-moon'; // Noche
                elRelojIcono.style.color = '#9b59b6';
            }
        }

        if (barraProgreso) {
            const minutosTotales = 24 * 60;
            const minutosPasados = (hora * 60) + ahora.getMinutes();
            const porcentaje = (minutosPasados / minutosTotales) * 100;
            barraProgreso.style.width = porcentaje + '%';

            // Cambiar color de la barra (Prioridad Fin de Semana)
            if (esFinDeSemana) {
                barraProgreso.style.backgroundColor = '#e84393'; // Festivo: Rosa vibrante
            } else {
                if (hora >= 6 && hora < 12) {
                    barraProgreso.style.backgroundColor = '#f1c40f'; // Mañana: Dorado
                } else if (hora >= 12 && hora < 19) {
                    barraProgreso.style.backgroundColor = '#f39c12'; // Tarde: Naranja cálido
                } else {
                    barraProgreso.style.backgroundColor = '#9b59b6'; // Noche: Morado místico
                }
            }
        }

        if (contenedorReloj) {
            if (hora >= 6 && hora < 12) {
                contenedorReloj.style.backgroundColor = '#fffdf0'; // Mañana: Amarillo crema
            } else if (hora >= 12 && hora < 19) {
                contenedorReloj.style.backgroundColor = '#f0f8ff'; // Tarde: Azul cielo muy claro
            } else {
                contenedorReloj.style.backgroundColor = '#fdfaff'; // Noche: Púrpura/Lila muy suave
            }
        }
    }
    actualizarReloj();
    setInterval(actualizarReloj, 1000);

    // Solo construir el menú dinámico de temas si no estamos en la página de galería
    if (!esPaginaGaleria) {
        construirMenuAdaptable();
    }
});
