// ============================================================
// RANKING.JS - Ranking con sistema de seguimiento
// ============================================================

let rankingSwalInstance = null;
let perfilAbierto = false;
let usuarioActualGlobal = null;

// ===== CACHE EN MEMORIA =====
let rankingCache = null;
let ultimaActualizacionRanking = 0;
const CACHE_TTL = 30000; // 30 segundos de cache

// ===== CONFIGURACIÓN DE SUPABASE =====
const SUPABASE_CONFIG = {
    selectLimit: 1000,
    timeout: 8000,
    retryCount: 2
};

// ===== OBTENER USUARIO ACTUAL (CON RESPALDO) =====
function obtenerUsuarioActual() {
    if (window.usuarioActual && window.usuarioActual.id) {
        usuarioActualGlobal = window.usuarioActual;
        return window.usuarioActual;
    }
    
    if (typeof usuarioActual !== 'undefined' && usuarioActual && usuarioActual.id) {
        console.log('✅ Usuario obtenido de variable global usuarioActual:', usuarioActual);
        window.usuarioActual = usuarioActual;
        usuarioActualGlobal = usuarioActual;
        return usuarioActual;
    }
    
    try {
        const usuarioGuardado = localStorage.getItem('usuarioActual');
        if (usuarioGuardado) {
            const usuario = JSON.parse(usuarioGuardado);
            if (usuario && usuario.id) {
                console.log('✅ Usuario obtenido de localStorage:', usuario);
                window.usuarioActual = usuario;
                usuarioActualGlobal = usuario;
                return usuario;
            }
        }
    } catch (e) {
        console.warn('⚠️ Error al leer localStorage:', e);
    }
    
    try {
        const usuarioSesion = sessionStorage.getItem('usuarioActual');
        if (usuarioSesion) {
            const usuario = JSON.parse(usuarioSesion);
            if (usuario && usuario.id) {
                console.log('✅ Usuario obtenido de sessionStorage:', usuario);
                window.usuarioActual = usuario;
                usuarioActualGlobal = usuario;
                return usuario;
            }
        }
    } catch (e) {
        console.warn('⚠️ Error al leer sessionStorage:', e);
    }
    
    console.warn('⚠️ No se encontró usuario actual en ninguna parte');
    usuarioActualGlobal = null;
    return null;
}

// ===== DETECTAR DISPOSITIVO =====
function esDispositivoMovil() {
    return window.innerWidth <= 768;
}

// ===== DETECTAR MODO OSCURO =====
function esModoOscuro() {
    return document.documentElement.classList.contains('dark') || 
           document.body.classList.contains('dark') ||
           (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
}

// ============================================================
// SISTEMA DE SEGUIDORES
// ============================================================

async function usuarioSigue(seguidoId) {
    try {
        const usuarioActual = obtenerUsuarioActual();
        if (!usuarioActual) return false;
        
        const { data, error } = await supabaseClient
            .from('seguidores')
            .select('id')
            .eq('seguidor_id', usuarioActual.id)
            .eq('seguido_id', seguidoId)
            .maybeSingle();
            
        if (error) {
            console.error('❌ Error al verificar seguimiento:', error);
            return false;
        }
        
        return !!data;
    } catch (error) {
        console.error('❌ Error en usuarioSigue:', error);
        return false;
    }
}

async function obtenerConteoSeguidores(usuarioId) {
    try {
        const { count, error } = await supabaseClient
            .from('seguidores')
            .select('id', { count: 'exact', head: true })
            .eq('seguido_id', usuarioId);
            
        if (error) {
            console.error('❌ Error al obtener conteo:', error);
            return 0;
        }
        
        return count || 0;
    } catch (error) {
        console.error('❌ Error en obtenerConteoSeguidores:', error);
        return 0;
    }
}

// ============================================================
// FUNCIONES PARA MOSTRAR MENSAJES (SweetAlert) - CON MODO OSCURO
// ============================================================
// ============================================================
// FUNCIONES PARA MOSTRAR MENSAJES (SweetAlert) - CON TÍTULOS ROSADOS
// ============================================================

function mostrarMensajeLoginRequerido() {
    return new Promise((resolve) => {
        const isMobile = esDispositivoMovil();
        const isDarkMode = esModoOscuro();
        
        const bgColor = isDarkMode ? '#1a1a2e' : '#ffffff';
        const subTextColor = isDarkMode ? '#b0a0c8' : '#7f5f9b';
        const cardBg = isDarkMode ? 'rgba(255,255,255,0.08)' : '#f8f0ff';
        const borderColor = isDarkMode ? 'rgba(155,89,182,0.3)' : 'rgba(155,89,182,0.15)';
        // Título en rosado suave para ambos modos
        const tituloColor = '#ff6b9d';
        
        Swal.fire({
            title: '',
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:10px 0;">
                    <div style="
                        width:80px;
                        height:80px;
                        border-radius:50%;
                        background:${cardBg};
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        padding:15px;
                        box-shadow:0 4px 15px ${borderColor};
                        border:1px solid ${borderColor};
                    ">
                        <img src="imganes/logomedi.png" alt="Medicurativo" style="width:100%;height:100%;object-fit:contain;border-radius:50%;">
                    </div>
                    <h2 style="color:${tituloColor};font-weight:700;font-size:1.1rem;margin:0;text-shadow:0 2px 8px rgba(0,0,0,0.1);">
                        🔒 Inicia sesión
                    </h2>
                    <p style="color:${subTextColor};font-size:0.9rem;margin:0;text-align:center;max-width:280px;">
                        Por favor, inicia sesión para seguir a otros usuarios y conectar con la comunidad.
                    </p>
                    <button onclick="cerrarSwal()" style="
                        background:#9b59b6;
                        color:white;
                        border:none;
                        padding:10px 30px;
                        border-radius:12px;
                        font-weight:600;
                        font-size:0.9rem;
                        cursor:pointer;
                        transition:all 0.2s;
                    "
                    onmouseover="this.style.transform='scale(1.05)'"
                    onmouseout="this.style.transform='scale(1)'"
                    >Entendido</button>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            customClass: { popup: 'swal-popup-redondo' },
            width: isMobile ? 'auto' : '400px',
            maxWidth: isMobile ? 'auto' : '90vw',
            background: bgColor,
            didOpen: () => {
                const popup = document.querySelector('.swal2-popup');
                if (popup) {
                    popup.style.borderRadius = '24px';
                    popup.style.padding = '20px 25px';
                    popup.style.border = `1px solid ${borderColor}`;
                }
            },
            willClose: () => {
                resolve();
            }
        });
    });
}

function mostrarMensajeExito() {
    return new Promise((resolve) => {
        const isMobile = esDispositivoMovil();
        const isDarkMode = esModoOscuro();
        
        const bgColor = isDarkMode ? '#1a1a2e' : '#ffffff';
        const subTextColor = isDarkMode ? '#b0a0c8' : '#7f5f9b';
        const cardBg = isDarkMode ? 'rgba(255,255,255,0.08)' : '#f8f0ff';
        const borderColor = isDarkMode ? 'rgba(46,204,113,0.3)' : 'rgba(155,89,182,0.15)';
        // Título en rosado suave para ambos modos
        const tituloColor = '#ff6b9d';
        
        Swal.fire({
            title: '',
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 0;">
                    <div style="
                        width:80px;
                        height:80px;
                        border-radius:50%;
                        background:${cardBg};
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        padding:15px;
                        box-shadow:0 4px 15px ${borderColor};
                        animation: pulse 0.5s ease;
                        border:1px solid ${borderColor};
                    ">
                        <img src="imganes/logomedi.png" alt="Medicurativo" style="width:100%;height:100%;object-fit:contain;border-radius:50%;">
                    </div>
                    <h2 style="color:${tituloColor};font-weight:700;font-size:1.1rem;margin:0;text-shadow:0 2px 8px rgba(0,0,0,0.1);">
                        ✅ ¡Seguido con éxito!
                    </h2>
                    <p style="color:${subTextColor};font-size:0.9rem;margin:0;text-align:center;">
                        Ahora verás las publicaciones de este usuario en tu feed.
                    </p>
                    <style>
                        @keyframes pulse {
                            0% { transform: scale(0.8); }
                            50% { transform: scale(1.1); }
                            100% { transform: scale(1); }
                        }
                    </style>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: '¡Genial!',
            confirmButtonColor: '#9b59b6',
            customClass: { popup: 'swal-popup-redondo' },
            width: isMobile ? 'auto' : '400px',
            maxWidth: isMobile ? 'auto' : '90vw',
            background: bgColor,
            didOpen: () => {
                const popup = document.querySelector('.swal2-popup');
                if (popup) {
                    popup.style.borderRadius = '24px';
                    popup.style.padding = '20px 25px';
                    popup.style.border = `1px solid ${borderColor}`;
                }
            },
            willClose: () => {
                resolve();
            }
        });
    });
}

function mostrarMensajeYaSigues() {
    return new Promise((resolve) => {
        const isMobile = esDispositivoMovil();
        const isDarkMode = esModoOscuro();
        
        const bgColor = isDarkMode ? '#1a1a2e' : '#ffffff';
        const subTextColor = isDarkMode ? '#b0a0c8' : '#7f5f9b';
        const cardBg = isDarkMode ? 'rgba(255,255,255,0.08)' : '#f8f0ff';
        const borderColor = isDarkMode ? 'rgba(241,196,15,0.3)' : 'rgba(155,89,182,0.15)';
        // Título en rosado suave para ambos modos
        const tituloColor = '#ff6b9d';
        
        Swal.fire({
            title: '',
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 0;">
                    <div style="
                        width:70px;
                        height:70px;
                        border-radius:50%;
                        background:${cardBg};
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        padding:12px;
                        box-shadow:0 4px 15px ${borderColor};
                        border:1px solid ${borderColor};
                    ">
                        <img src="imganes/logomedi.png" alt="Medicurativo" style="width:100%;height:100%;object-fit:contain;border-radius:50%;">
                    </div>
                    <p style="color:${tituloColor};font-size:0.95rem;font-weight:600;margin:0;text-shadow:0 2px 8px rgba(0,0,0,0.1);">
                        Ya sigues a este usuario
                    </p>
                    <p style="color:${subTextColor};font-size:0.8rem;margin:0;">
                        👀 Puedes ver su actividad en tu feed
                    </p>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#9b59b6',
            customClass: { popup: 'swal-popup-redondo' },
            width: isMobile ? 'auto' : '380px',
            maxWidth: isMobile ? 'auto' : '90vw',
            background: bgColor,
            didOpen: () => {
                const popup = document.querySelector('.swal2-popup');
                if (popup) {
                    popup.style.borderRadius = '20px';
                    popup.style.padding = '20px 25px';
                    popup.style.border = `1px solid ${borderColor}`;
                }
            },
            willClose: () => {
                resolve();
            }
        });
    });
}

function mostrarMensajeDejasteDeSeguir() {
    return new Promise((resolve) => {
        const isMobile = esDispositivoMovil();
        const isDarkMode = esModoOscuro();
        
        const bgColor = isDarkMode ? '#1a1a2e' : '#ffffff';
        const subTextColor = isDarkMode ? '#b0a0c8' : '#7f5f9b';
        const cardBg = isDarkMode ? 'rgba(255,255,255,0.08)' : '#f8f0ff';
        const borderColor = isDarkMode ? 'rgba(231,76,60,0.3)' : 'rgba(155,89,182,0.15)';
        // Título en rosado suave para ambos modos
        const tituloColor = '#ff6b9d';
        
        Swal.fire({
            title: '',
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 0;">
                    <div style="
                        width:70px;
                        height:70px;
                        border-radius:50%;
                        background:${cardBg};
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        padding:12px;
                        box-shadow:0 4px 15px ${borderColor};
                        border:1px solid ${borderColor};
                    ">
                        <img src="imganes/logomedi.png" alt="Medicurativo" style="width:100%;height:100%;object-fit:contain;border-radius:50%;">
                    </div>
                    <p style="color:${tituloColor};font-size:0.95rem;font-weight:600;margin:0;text-shadow:0 2px 8px rgba(0,0,0,0.1);">
                        Dejaste de seguir al usuario
                    </p>
                    <p style="color:${subTextColor};font-size:0.8rem;margin:0;">
                        Ya no verás sus publicaciones en tu feed
                    </p>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#9b59b6',
            customClass: { popup: 'swal-popup-redondo' },
            width: isMobile ? 'auto' : '380px',
            maxWidth: isMobile ? 'auto' : '90vw',
            background: bgColor,
            didOpen: () => {
                const popup = document.querySelector('.swal2-popup');
                if (popup) {
                    popup.style.borderRadius = '20px';
                    popup.style.padding = '20px 25px';
                    popup.style.border = `1px solid ${borderColor}`;
                }
            },
            willClose: () => {
                resolve();
            }
        });
    });
}

function mostrarMensajeError(mensaje) {
    return new Promise((resolve) => {
        const isMobile = esDispositivoMovil();
        const isDarkMode = esModoOscuro();
        
        const bgColor = isDarkMode ? '#1a1a2e' : '#ffffff';
        const textColor = isDarkMode ? '#e8dff0' : '#2c1b4e';
        const borderColor = isDarkMode ? 'rgba(231,76,60,0.4)' : 'rgba(231,76,60,0.2)';
        // Título en rosado suave para ambos modos
        const tituloColor = '#ff6b9d';
        
        Swal.fire({
            title: `<span style="color:${tituloColor};">Error</span>`,
            text: mensaje || 'Ocurrió un error. Intenta de nuevo.',
            icon: 'error',
            confirmButtonColor: '#e74c3c',
            customClass: { popup: 'swal-popup-redondo' },
            width: isMobile ? 'auto' : '400px',
            maxWidth: isMobile ? 'auto' : '90vw',
            background: bgColor,
            color: textColor,
            didOpen: () => {
                const popup = document.querySelector('.swal2-popup');
                if (popup) {
                    popup.style.borderRadius = '20px';
                    popup.style.border = `1px solid ${borderColor}`;
                }
                // Forzar el título a rosado
                const titleElement = document.querySelector('.swal2-title');
                if (titleElement) {
                    titleElement.style.color = '#ff6b9d';
                    titleElement.style.setProperty('color', '#ff6b9d', 'important');
                }
            },
            willClose: () => {
                resolve();
            }
        });
    });
}

function mostrarMensajeNoPuedesSeguirte() {
    return new Promise((resolve) => {
        const isMobile = esDispositivoMovil();
        const isDarkMode = esModoOscuro();
        
        const bgColor = isDarkMode ? '#1a1a2e' : '#ffffff';
        const subTextColor = isDarkMode ? '#b0a0c8' : '#7f5f9b';
        const cardBg = isDarkMode ? 'rgba(255,255,255,0.08)' : '#f8f0ff';
        const borderColor = isDarkMode ? 'rgba(241,196,15,0.3)' : 'rgba(155,89,182,0.15)';
        // Título en rosado suave para ambos modos
        const tituloColor = '#ff6b9d';
        
        Swal.fire({
            title: '',
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 0;">
                    <div style="
                        width:70px;
                        height:70px;
                        border-radius:50%;
                        background:${cardBg};
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        padding:12px;
                        box-shadow:0 4px 15px ${borderColor};
                        border:1px solid ${borderColor};
                    ">
                        <img src="imganes/logomedi.png" alt="Medicurativo" style="width:100%;height:100%;object-fit:contain;border-radius:50%;">
                    </div>
                    <p style="color:${tituloColor};font-size:0.95rem;font-weight:600;margin:0;text-shadow:0 2px 8px rgba(0,0,0,0.1);">
                        😅 No puedes seguirte a ti mismo
                    </p>
                    <p style="color:${subTextColor};font-size:0.8rem;margin:0;">
                        ¡Sé tu propio fan! Pero no hace falta seguirte 😉
                    </p>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#9b59b6',
            customClass: { popup: 'swal-popup-redondo' },
            width: isMobile ? 'auto' : '380px',
            maxWidth: isMobile ? 'auto' : '90vw',
            background: bgColor,
            didOpen: () => {
                const popup = document.querySelector('.swal2-popup');
                if (popup) {
                    popup.style.borderRadius = '20px';
                    popup.style.padding = '20px 25px';
                    popup.style.border = `1px solid ${borderColor}`;
                }
            },
            willClose: () => {
                resolve();
            }
        });
    });
}


// ============================================================
// FUNCIONES PRINCIPALES DE SEGUIMIENTO
// ============================================================

async function seguirUsuario(seguidoId) {
    try {
        console.log('🔍 Intentando seguir al usuario:', seguidoId);
        
        const usuarioActual = obtenerUsuarioActual();
        console.log('🔍 Usuario actual:', usuarioActual);
        
        if (!usuarioActual) {
            console.log('⚠️ Usuario no logueado');
            await mostrarMensajeLoginRequerido();
            return false;
        }
        
        if (usuarioActual.id === seguidoId) {
            console.log('⚠️ Intentando seguirse a sí mismo');
            await mostrarMensajeNoPuedesSeguirte();
            return false;
        }
        
        const yaSigue = await usuarioSigue(seguidoId);
        console.log('🔍 ¿Ya sigue?', yaSigue);
        
        if (yaSigue) {
            await mostrarMensajeYaSigues();
            return false;
        }
        
        console.log('📝 Insertando seguimiento...');
        const { error } = await supabaseClient
            .from('seguidores')
            .insert({
                seguidor_id: usuarioActual.id,
                seguido_id: seguidoId
            });
            
        if (error) {
            console.error('❌ Error al seguir:', error);
            throw error;
        }
        
        console.log('✅ Seguimiento exitoso');
        await mostrarMensajeExito();
        return true;
        
    } catch (error) {
        console.error('❌ Error en seguirUsuario:', error);
        await mostrarMensajeError('No se pudo seguir al usuario. Intenta de nuevo.');
        return false;
    }
}

async function dejarDeSeguir(seguidoId) {
    try {
        console.log('🔍 Intentando dejar de seguir al usuario:', seguidoId);
        
        const usuarioActual = obtenerUsuarioActual();
        console.log('🔍 Usuario actual:', usuarioActual);
        
        if (!usuarioActual) {
            await mostrarMensajeLoginRequerido();
            return false;
        }
        
        console.log('📝 Eliminando seguimiento...');
        const { error } = await supabaseClient
            .from('seguidores')
            .delete()
            .eq('seguidor_id', usuarioActual.id)
            .eq('seguido_id', seguidoId);
            
        if (error) {
            console.error('❌ Error al dejar de seguir:', error);
            throw error;
        }
        
        console.log('✅ Dejó de seguir exitosamente');
        await mostrarMensajeDejasteDeSeguir();
        return true;
        
    } catch (error) {
        console.error('❌ Error en dejarDeSeguir:', error);
        await mostrarMensajeError('No se pudo dejar de seguir al usuario.');
        return false;
    }
}

function cerrarSwal() {
    Swal.close();
}

async function handleSeguirClick(usuarioId, yaSigue) {
    console.log('🖱️ Click en seguir/dejar de seguir para:', usuarioId);
    console.log('🔍 ¿Ya sigue?', yaSigue);
    
    try {
        if (yaSigue) {
            await dejarDeSeguir(usuarioId);
        } else {
            await seguirUsuario(usuarioId);
        }
        
        setTimeout(() => {
            Swal.close();
            verPerfilUsuario(usuarioId);
        }, 800);
        
    } catch (error) {
        console.error('❌ Error en handleSeguirClick:', error);
        mostrarMensajeError('Ocurrió un error. Intenta de nuevo.');
    }
}

// ===== ABRIR RANKING (CON ACTUALIZACIÓN AUTOMÁTICA Y MODO OSCURO) =====
function abrirRanking() {
    const usuarioActual = obtenerUsuarioActual();
    console.log('🔍 abrirRanking() llamado');
    console.log('🔍 usuarioActual obtenido:', usuarioActual);
    
    if (rankingCache && (Date.now() - ultimaActualizacionRanking) < 5000) {
        console.log('📦 Usando cache del ranking');
        mostrarRanking(rankingCache);
        return;
    }

    const isDarkMode = esModoOscuro();
    const bgColor = isDarkMode ? '#1a1a2e' : '#ffffff';
    const textColor = isDarkMode ? '#e8dff0' : '#2c1b4e';
    const subTextColor = isDarkMode ? '#b0a0c8' : '#7f5f9b';
    const borderColor = isDarkMode ? 'rgba(155,89,182,0.3)' : 'rgba(155,89,182,0.15)';

    Swal.fire({
        title: `<span style="color:${textColor};font-weight:800;font-size:1.1rem;">🏆 Actualizando ranking...</span>`,
        html: `
            <div style="display:flex;flex-direction:column;align-items:center;padding:8px 0;">
                <div style="width:45px;height:45px;border:3px solid ${isDarkMode ? '#3a2a4e' : '#f0e6ff'};border-top-color:#9b59b6;border-radius:50%;animation:spin 0.6s linear infinite;margin-bottom:12px;"></div>
                <p style="color:${subTextColor};font-size:0.85rem;">Calculando carisma de todos los usuarios...</p>
            </div>
            <style>
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        customClass: { popup: 'swal-popup-redondo' },
        background: bgColor,
        didOpen: () => {
            const popup = document.querySelector('.swal2-popup');
            if (popup) {
                popup.style.borderRadius = '24px';
                popup.style.padding = '20px 20px';
                popup.style.border = `1px solid ${borderColor}`;
                if (!esDispositivoMovil()) {
                    popup.style.width = '500px';
                    popup.style.maxWidth = '90vw';
                }
            }
        }
    });

    cargarRanking();
}

// ===== ACTUALIZAR CARISMA DE TODOS LOS USUARIOS =====
async function actualizarCarismaTodosLosUsuarios() {
    try {
        console.log('🔄 Actualizando carisma de todos los usuarios...');
        const startTime = performance.now();

        const { data: usuarios, error: userError } = await supabaseClient
            .from('usuarios')
            .select('id, nombre');

        if (userError) {
            console.error('❌ Error al obtener usuarios:', userError);
            return false;
        }

        if (!usuarios || usuarios.length === 0) {
            console.log('⚠️ No hay usuarios para actualizar');
            return true;
        }

        console.log(`📊 ${usuarios.length} usuarios encontrados`);

        const { data: publicaciones, error: pubError } = await supabaseClient
            .from('publicaciones')
            .select('usuario_id, likes')
            .eq('estado', 'aprobado');

        if (pubError) {
            console.error('❌ Error al obtener publicaciones:', pubError);
            return false;
        }

        const likesPorUsuario = {};
        publicaciones.forEach(pub => {
            const userId = pub.usuario_id;
            likesPorUsuario[userId] = (likesPorUsuario[userId] || 0) + (pub.likes || 0);
        });

        console.log(`📊 ${Object.keys(likesPorUsuario).length} usuarios con likes`);

        const updates = [];
        usuarios.forEach(usuario => {
            const nuevoCarisma = likesPorUsuario[usuario.id] || 0;
            updates.push({
                id: usuario.id,
                carisma: nuevoCarisma
            });
        });

        const batchSize = 10;
        let actualizados = 0;
        
        for (let i = 0; i < updates.length; i += batchSize) {
            const batch = updates.slice(i, i + batchSize);
            const promises = batch.map(update => 
                supabaseClient
                    .from('usuarios')
                    .update({ carisma: update.carisma })
                    .eq('id', update.id)
            );
            
            const results = await Promise.all(promises);
            const errores = results.filter(r => r.error);
            
            if (errores.length === 0) {
                actualizados += batch.length;
            } else {
                console.error('❌ Errores en batch:', errores);
            }
        }

        const endTime = performance.now();
        console.log(`✅ ${actualizados} usuarios actualizados en ${(endTime - startTime).toFixed(0)}ms`);
        
        return true;

    } catch (error) {
        console.error('❌ Error en actualizarCarismaTodosLosUsuarios:', error);
        return false;
    }
}

// ===== CARGAR RANKING CON ACTUALIZACIÓN PREVIA =====
async function cargarRanking() {
    try {
        console.log('📊 Cargando ranking...');
        const usuarioActual = obtenerUsuarioActual();
        console.log('🔍 usuarioActual en cargarRanking:', usuarioActual);

        if (typeof supabaseClient === 'undefined' || !supabaseClient) {
            console.error('❌ Supabase no disponible');
            const isDarkMode = esModoOscuro();
            Swal.fire({
                title: 'Error',
                text: 'No se pudo conectar con la base de datos.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
                customClass: { popup: 'swal-popup-redondo' },
                background: isDarkMode ? '#1a1a2e' : '#ffffff',
                color: isDarkMode ? '#e8dff0' : '#2c1b4e'
            });
            return;
        }

        await actualizarCarismaTodosLosUsuarios();

        const startTime = performance.now();
        
        const { data: usuarios, error: userError } = await supabaseClient
            .from('usuarios')
            .select('id, nombre, carisma')
            .order('carisma', { ascending: false })
            .limit(100);

        const endTime = performance.now();
        console.log(`⏱️ Ranking cargado en ${(endTime - startTime).toFixed(0)}ms`);

        if (userError) {
            console.error('❌ Error:', userError);
            throw userError;
        }

        if (!usuarios || usuarios.length === 0) {
            mostrarRankingVacio();
            return;
        }

        console.log('📋 Usuarios del ranking:', usuarios);

        const { data: publicaciones, error: pubError } = await supabaseClient
            .from('publicaciones')
            .select('usuario_id')
            .eq('estado', 'aprobado');

        if (!pubError && publicaciones) {
            const conteoPublicaciones = {};
            publicaciones.forEach(pub => {
                conteoPublicaciones[pub.usuario_id] = (conteoPublicaciones[pub.usuario_id] || 0) + 1;
            });

            usuarios.forEach(user => {
                user.totalPublicaciones = conteoPublicaciones[user.id] || 0;
            });
        }

        rankingCache = usuarios;
        ultimaActualizacionRanking = Date.now();

        mostrarRanking(usuarios);

    } catch (error) {
        console.error('❌ Error:', error);
        
        Swal.close();
        
        if (error.message === 'Timeout') {
            const isDarkMode = esModoOscuro();
            Swal.fire({
                title: '⏰ Tiempo de espera',
                text: 'El servidor está tardando. ¿Reintentar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Reintentar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#9b59b6',
                customClass: { popup: 'swal-popup-redondo' },
                background: isDarkMode ? '#1a1a2e' : '#ffffff',
                color: isDarkMode ? '#e8dff0' : '#2c1b4e'
            }).then((result) => {
                if (result.isConfirmed) cargarRanking();
            });
        } else {
            const isDarkMode = esModoOscuro();
            Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al cargar el ranking.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
                customClass: { popup: 'swal-popup-redondo' },
                background: isDarkMode ? '#1a1a2e' : '#ffffff',
                color: isDarkMode ? '#e8dff0' : '#2c1b4e'
            });
        }
    }
}

// ===== MOSTRAR RANKING VACÍO (CON MODO OSCURO) =====
function mostrarRankingVacio() {
    const isMobile = esDispositivoMovil();
    const isDarkMode = esModoOscuro();
    
    const bgColor = isDarkMode ? '#1a1a2e' : '#ffffff';
    const textColor = isDarkMode ? '#e8dff0' : '#2c1b4e';
    const subTextColor = isDarkMode ? '#b0a0c8' : '#7f5f9b';
    const cardBg = isDarkMode ? 'rgba(255,255,255,0.08)' : '#f8f0ff';
    const borderColor = isDarkMode ? 'rgba(155,89,182,0.3)' : 'rgba(155,89,182,0.15)';
    
    Swal.fire({
        title: `<span style="color:${textColor};font-weight:800;font-size:1.1rem;">🏆 Sin datos aún</span>`,
        html: `
            <div style="text-align:center; padding: 8px 5px;">
                <div style="background: ${cardBg}; padding: 20px 15px; border-radius: 40px; margin: 8px 0; border: 1px solid ${borderColor};">
                    <div style="width:80px;height:80px;margin:0 auto 12px;border-radius:50%;background:${isDarkMode ? '#2a1a3e' : 'white'};display:flex;align-items:center;justify-content:center;box-shadow:0 8px 25px rgba(155,89,182,0.15);">
                        <img src="imganes/logosmedi.png" alt="Medicurativo" style="width:60px;height:60px;object-fit:contain;border-radius:50%;">
                    </div>
                    <p style="margin:0 0 6px;color:${textColor};font-size:0.95rem;font-weight:700;">
                        Aún no hay usuarios registrados
                    </p>
                    <p style="margin:0;color:${subTextColor};font-size:0.8rem;">
                        ¡Sé el primero en unirte a la comunidad! ✨
                    </p>
                </div>
            </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#9b59b6',
        customClass: { popup: 'swal-popup-redondo' },
        width: isMobile ? 'auto' : '500px',
        maxWidth: isMobile ? 'auto' : '90vw',
        background: bgColor,
        didOpen: () => {
            const popup = document.querySelector('.swal2-popup');
            if (popup) {
                popup.style.borderRadius = '24px';
                popup.style.padding = isMobile ? '20px 18px' : '30px 35px';
                popup.style.border = `1px solid ${borderColor}`;
                if (!isMobile) {
                    popup.style.width = '500px';
                }
            }
        }
    });
}

// ===== MOSTRAR RANKING (CON MODO OSCURO) =====
function mostrarRanking(ranking) {
    console.log('📊 mostrarRanking() llamado');
    const usuarioActual = obtenerUsuarioActual();
    console.log('🔍 usuarioActual en mostrarRanking:', usuarioActual);
    
    const isMobile = esDispositivoMovil();
    const isDarkMode = esModoOscuro();
    const medallas = ['🥇', '🥈', '🥉'];
    const coloresMedalla = ['#f1c40f', '#bdc3c7', '#e67e22'];
    
    // Colores modo oscuro
    const bgColor = isDarkMode ? '#1a1a2e' : '#ffffff';
    const textColor = isDarkMode ? '#e8dff0' : '#2c1b4e';
    const subTextColor = isDarkMode ? '#b0a0c8' : '#7f8c8d';
    const cardBg = isDarkMode ? 'rgba(255,255,255,0.06)' : '#f3e9ff';
    const borderColor = isDarkMode ? 'rgba(155,89,182,0.3)' : 'rgba(155,89,182,0.15)';
    const headerBg = isDarkMode ? 'rgba(155,89,182,0.15)' : '#f3e9ff';

    let rankingHTML = `
        <div style="
            max-height: ${isMobile ? '400px' : '500px'}; 
            overflow-y: auto; 
            padding: 2px 2px 8px; 
            width: 100%;
        ">
            <p style="
                color: ${subTextColor}; 
                font-size: ${isMobile ? '0.75rem' : '0.85rem'}; 
                text-align: center; 
                margin-bottom: 12px;
            ">
                <i class="fas fa-sync" style="color: #9b59b6;"></i> 
                Actualizado automáticamente
            </p>

            <div style="
                display: grid;
                grid-template-columns: ${isMobile ? '35px 1fr 70px 70px' : '45px 1fr 90px 90px'};
                gap: ${isMobile ? '4px' : '8px'};
                padding: ${isMobile ? '6px 8px' : '10px 15px'};
                background: ${headerBg};
                border-radius: ${isMobile ? '10px' : '14px'};
                margin-bottom: 8px;
                font-weight: 700;
                font-size: ${isMobile ? '0.6rem' : '0.7rem'};
                color: ${textColor};
                text-transform: uppercase;
                letter-spacing: 0.3px;
            ">
                <div style="text-align: center;">#</div>
                <div style="text-align: left; padding-left: 4px;">Usuario</div>
                <div style="text-align: center;">📝 Post</div>
                <div style="text-align: center;">❤️ Likes</div>
            </div>
    `;

    const displayRanking = ranking.slice(0, isMobile ? 50 : 100);
    const totalUsuarios = ranking.length;

    displayRanking.forEach((usuario, index) => {
        const posicion = index + 1;
        const medalla = posicion <= 3 ? medallas[index] : `#${posicion}`;
        const colorMedalla = posicion <= 3 ? coloresMedalla[index] : '#9b59b6';
        const esTop3 = posicion <= 3;
        
        const esUsuarioActual = usuarioActual && usuario.id === usuarioActual.id;
        const esMedicurativo = usuario.nombre.toLowerCase().includes('medicurativo');

        let bgColorRow = isDarkMode ? 'rgba(255,255,255,0.05)' : '#f5ebe0';
        if (esUsuarioActual) {
            bgColorRow = isDarkMode ? 'rgba(155,89,182,0.25)' : '#d4b8a8';
        }

        let borderStyle = `border-left: ${isMobile ? '2.5px' : '4px'} solid ${colorMedalla};`;
        if (esUsuarioActual) {
            borderStyle = `border-left: ${isMobile ? '2.5px' : '4px'} solid #9b59b6; border-right: ${isMobile ? '2.5px' : '4px'} solid #9b59b6;`;
        }

        let nombreDisplay = '';
        
        if (esUsuarioActual) {
            nombreDisplay = `
                <span style="color:#9b59b6;font-weight:800;display:flex;align-items:center;gap:4px;font-size:${isMobile ? '0.75rem' : '0.9rem'};">
                    <span>${usuario.nombre}</span>
                    <span style="
                        font-size:${isMobile ? '0.45rem' : '0.55rem'};
                        background:#9b59b6;
                        color:white;
                        padding:${isMobile ? '1px 6px' : '2px 10px'};
                        border-radius:6px;
                        font-weight:700;
                        flex-shrink:0;
                    ">Tú</span>
                </span>
            `;
        } else if (esMedicurativo) {
            const badgeText = isMobile ? 'Of' : 'Oficial';
            nombreDisplay = `
                <img src="imganes/medicu.png" alt="Medicurativo" style="
                    width: ${isMobile ? '18px' : '24px'}; 
                    height: ${isMobile ? '18px' : '24px'}; 
                    border-radius: 50%; object-fit: cover;
                    margin-right: 3px; vertical-align: middle; border: 1.5px solid #f1c40f;
                    flex-shrink: 0;
                ">
                <span style="vertical-align: middle;font-size:${isMobile ? '0.75rem' : '0.9rem'};font-weight:700;color:${textColor};">
                    ${usuario.nombre}
                    <span style="
                        font-size:${isMobile ? '0.4rem' : '0.55rem'};
                        background:linear-gradient(135deg,#f1c40f,#f39c12);
                        color:#2c1b4e;
                        padding:${isMobile ? '1px 5px' : '2px 10px'};
                        border-radius:8px;
                        font-weight:800;
                        display:inline-flex;
                        align-items:center;
                        gap:2px;
                        box-shadow:0 2px 8px rgba(241,196,15,0.3);
                        margin-left:3px;
                        flex-shrink:0;
                    ">
                        <i class="fas fa-crown" style="font-size:${isMobile ? '0.35rem' : '0.6rem'};"></i>
                        ${badgeText}
                    </span>
                    <i class="fas fa-check-circle" style="color:#2ecc71;font-size:${isMobile ? '0.5rem' : '0.8rem'};margin-left:2px;text-shadow:0 0 10px rgba(46,204,113,0.3);"></i>
                </span>
            `;
        } else {
            nombreDisplay = `
                <span style="font-size:${isMobile ? '0.75rem' : '0.9rem'};font-weight:600;color:${textColor};">
                    ${usuario.nombre}
                </span>
            `;
        }

        let calidadIcon = '';
        if (!esMedicurativo && !esUsuarioActual) {
            const promedio = usuario.totalPublicaciones > 0 ? (usuario.carisma / usuario.totalPublicaciones) : 0;
            if (promedio >= 10) calidadIcon = '🏆';
            else if (promedio >= 5) calidadIcon = '⭐';
            else if (promedio >= 2) calidadIcon = '👍';
            else if (promedio >= 1) calidadIcon = '📝';
            else calidadIcon = '🆕';
        }

        rankingHTML += `
            <div style="
                display: grid;
                grid-template-columns: ${isMobile ? '35px 1fr 70px 70px' : '45px 1fr 90px 90px'};
                gap: ${isMobile ? '4px' : '8px'};
                padding: ${isMobile ? '6px 8px' : '10px 15px'};
                margin-bottom: ${isMobile ? '3px' : '5px'};
                background: ${bgColorRow};
                border-radius: ${isMobile ? '8px' : '12px'};
                ${borderStyle}
                font-size: ${isMobile ? '0.7rem' : '0.85rem'};
                color: ${textColor};
                align-items: center;
                transition: all 0.15s ease;
                ${esUsuarioActual ? `box-shadow: 0 0 0 2px rgba(155, 89, 182, 0.3);` : ''}
                cursor: pointer;
            "
            onclick="verPerfilUsuario('${usuario.id}')"
            onmouseover="this.style.transform='scale(1.01)'; this.style.boxShadow='0 2px 10px rgba(155,89,182,0.12)'"
            onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='${esUsuarioActual ? '0 0 0 2px rgba(155, 89, 182, 0.3)' : 'none'}'"
            >
                <div style="text-align:center;font-weight:800;font-size:${esTop3 ? (isMobile ? '0.95rem' : '1.2rem') : (isMobile ? '0.7rem' : '0.85rem')};color:${colorMedalla};">
                    ${medalla}
                </div>
                <div style="font-weight:600;display:flex;align-items:center;gap:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:4px;font-size:${isMobile ? '0.75rem' : '0.9rem'};text-align:left;">
                    <span style="overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;font-size:${isMobile ? '0.75rem' : '0.9rem'};">
                        ${nombreDisplay}
                    </span>
                    ${calidadIcon ? `<span style="font-size:${isMobile ? '0.5rem' : '0.7rem'};margin-left:2px;flex-shrink:0;">${calidadIcon}</span>` : ''}
                    ${posicion === 1 && !esUsuarioActual ? `<span style="font-size:${isMobile ? '0.6rem' : '0.8rem'};flex-shrink:0;margin-left:1px;">👑</span>` : ''}
                </div>
                <div style="text-align:center;font-weight:600;color:#9b59b6;font-size:${isMobile ? '0.75rem' : '0.9rem'};">${usuario.totalPublicaciones || 0}</div>
                <div style="text-align:center;font-weight:600;color:#e74c3c;font-size:${isMobile ? '0.75rem' : '0.9rem'};">${usuario.carisma || 0}</div>
            </div>
        `;
    });

    if (totalUsuarios > (isMobile ? 50 : 100)) {
        rankingHTML += `
            <div style="text-align:center;padding:8px 0;color:${subTextColor};font-size:${isMobile ? '0.7rem' : '0.8rem'};">
                <i class="fas fa-ellipsis-h"></i> Y ${totalUsuarios - (isMobile ? 50 : 100)} usuarios más...
            </div>
        `;
    }

    rankingHTML += `
        <div style="margin-top:12px;padding-top:8px;border-top:1.5px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#f0edf5'};text-align:center;">
            <p style="font-size:${isMobile ? '0.55rem' : '0.65rem'};color:${subTextColor};margin:0;">
                <i class="fas fa-crown" style="color:#f1c40f;"></i> 
                Usuarios con <strong>Oficial</strong> son verificados
            </p>
            <p style="font-size:${isMobile ? '0.5rem' : '0.6rem'};color:${subTextColor};margin:4px 0 0 0;">
                <i class="fas fa-sync" style="color:#9b59b6;"></i> 
                El carisma se actualiza automáticamente
            </p>
        </div>
    </div>`;

    Swal.fire({
        title: '',
        html: `
            <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
                <div style="width:${isMobile ? '60px' : '80px'};height:${isMobile ? '60px' : '80px'};border-radius:50%;background:${isDarkMode ? 'rgba(255,255,255,0.08)' : 'linear-gradient(145deg,#f8f0ff,#f0e6ff)'};display:flex;align-items:center;justify-content:center;padding:${isMobile ? '10px' : '15px'};box-shadow:0 4px 15px rgba(155,89,182,0.12);margin-bottom:2px;border:1px solid ${borderColor};">
                    <img src="imganes/logosmedi.png" alt="Medicurativo" style="width:100%;height:100%;object-fit:contain;border-radius:50%;">
                </div>
                <h2 style="color:${textColor};font-weight:800;font-size:${isMobile ? '1rem' : '1.3rem'};margin:0;display:flex;align-items:center;gap:6px;">
                    <span>🏆</span> Ranking
                </h2>
            </div>
            ${rankingHTML}
        `,
        showConfirmButton: true,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#9b59b6',
        showCloseButton: true,
        customClass: { 
            popup: 'swal-popup-redondo swal-ranking',
            confirmButton: 'swal-confirm-btn'
        },
        width: isMobile ? 'auto' : '700px',
        maxWidth: isMobile ? 'auto' : '90vw',
        background: bgColor,
        didOpen: () => {
            const popup = document.querySelector('.swal2-popup');
            if (popup) {
                popup.style.borderRadius = '24px';
                popup.style.padding = isMobile ? '14px 14px 18px' : '25px 30px 30px';
                popup.style.border = `1px solid ${borderColor}`;
                if (!isMobile) {
                    popup.style.width = '700px';
                }
            }
            rankingSwalInstance = Swal;
        },
        willClose: () => {
            rankingSwalInstance = null;
            perfilAbierto = false;
        }
    });
}

// ===== FUNCIÓN PARA OBTENER LA POSICIÓN EN EL RANKING =====
async function obtenerPosicionRanking(userId) {
    try {
        if (rankingCache) {
            const index = rankingCache.findIndex(u => u.id === userId);
            if (index !== -1) {
                return index + 1;
            }
        }

        const { data: usuarios, error } = await supabaseClient
            .from('usuarios')
            .select('id')
            .order('carisma', { ascending: false });

        if (error || !usuarios) return null;

        const posicion = usuarios.findIndex(u => u.id === userId);
        return posicion !== -1 ? posicion + 1 : null;
    } catch (error) {
        console.error('Error al obtener posición:', error);
        return null;
    }
}

// ===== VER PERFIL (CON MODO OSCURO) =====
async function verPerfilUsuario(userId) {
    if (perfilAbierto) return;
    perfilAbierto = true;
    
    try {
        const isMobile = esDispositivoMovil();
        const isDarkMode = esModoOscuro();
        const usuarioActual = obtenerUsuarioActual();
        
        // Colores modo oscuro
        const bgColor = isDarkMode ? '#1a1a2e' : '#ffffff';
        const textColor = isDarkMode ? '#e8dff0' : '#2c1b4e';
        const subTextColor = isDarkMode ? '#b0a0c8' : '#7f5f9b';
        const borderColor = isDarkMode ? 'rgba(155,89,182,0.3)' : 'rgba(155,89,182,0.15)';

        const loadingSwal = Swal.fire({
            title: 'Cargando perfil...',
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;padding:15px 0;">
                    <div style="width:40px;height:40px;border:3px solid ${isDarkMode ? '#3a2a4e' : '#f0e6ff'};border-top-color:#9b59b6;border-radius:50%;animation:spin 0.5s linear infinite;margin-bottom:10px;"></div>
                    <p style="color:${subTextColor};font-size:0.8rem;">Cargando información...</p>
                </div>
                <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            customClass: { popup: 'swal-popup-redondo' },
            width: isMobile ? 'auto' : '400px',
            maxWidth: isMobile ? 'auto' : '90vw',
            background: bgColor,
            target: document.body
        });

        const { data: usuario, error: userError } = await supabaseClient
            .from('usuarios')
            .select('id, nombre, carisma')
            .eq('id', userId)
            .single();

        if (userError || !usuario) {
            loadingSwal.close();
            Swal.fire({
                title: 'Error',
                text: 'No se pudo cargar el perfil del usuario.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
                customClass: { popup: 'swal-popup-redondo' },
                background: bgColor,
                color: textColor
            });
            perfilAbierto = false;
            return;
        }

        const posicionRanking = await obtenerPosicionRanking(userId);
        const conteoSeguidores = await obtenerConteoSeguidores(userId);
        const sigue = usuarioActual ? await usuarioSigue(userId) : false;
        const esMiPerfil = usuarioActual && usuarioActual.id === userId;

        const { data: publicaciones, error: pubError } = await supabaseClient
            .from('publicaciones')
            .select('likes')
            .eq('usuario_id', userId)
            .eq('estado', 'aprobado');

        const totalPublicaciones = publicaciones?.length || 0;
        const totalLikes = publicaciones?.reduce((sum, pub) => sum + (pub.likes || 0), 0) || 0;
        const promedioLikes = totalPublicaciones > 0 ? (totalLikes / totalPublicaciones).toFixed(1) : 0;

        let calidadTexto = '';
        let calidadColor = '';
        let calidadEmoji = '';

        if (promedioLikes >= 10) {
            calidadTexto = 'Excelente';
            calidadColor = '#8e44ad';
            calidadEmoji = '🏆';
        } else if (promedioLikes >= 5) {
            calidadTexto = 'Muy Bueno';
            calidadColor = '#2ecc71';
            calidadEmoji = '🌟';
        } else if (promedioLikes >= 2) {
            calidadTexto = 'Bueno';
            calidadColor = '#3498db';
            calidadEmoji = '👍';
        } else if (promedioLikes >= 1) {
            calidadTexto = 'Regular';
            calidadColor = '#f39c12';
            calidadEmoji = '📝';
        } else {
            calidadTexto = 'Sin likes';
            calidadColor = '#b0a4c4';
            calidadEmoji = '🆕';
        }

        if (totalLikes !== usuario.carisma) {
            const { error: updateError } = await supabaseClient
                .from('usuarios')
                .update({ carisma: totalLikes })
                .eq('id', userId);

            if (!updateError) {
                usuario.carisma = totalLikes;
                rankingCache = null;
                ultimaActualizacionRanking = 0;
            }
        }

        loadingSwal.close();

        const carisma = usuario.carisma || 0;
        const esMedicurativo = usuario.nombre.toLowerCase().includes('medicurativo');

        let borderColorPerfil = '#d1c4e9';
        if (esMedicurativo) borderColorPerfil = '#f1c40f';
        else if (carisma >= 60) borderColorPerfil = '#8e44ad';
        else if (carisma >= 50) borderColorPerfil = '#e74c3c';
        else if (carisma >= 40) borderColorPerfil = '#3498db';
        else if (carisma >= 30) borderColorPerfil = '#2ecc71';
        else if (carisma >= 20) borderColorPerfil = '#f1c40f';
        else if (carisma >= 10) borderColorPerfil = '#f39c12';

        const nombreColor = '#ff6b9d';
        const nombreTextShadow = '0 2px 8px rgba(0,0,0,0.3)';
        
        const carismaColor = isDarkMode ? '#ffffff' : '#2c1b4e';
        const bgCardColor = isDarkMode ? 'rgba(255,255,255,0.08)' : '#f8f0ff';

        let avatarHTML;
        const avatarSize = isMobile ? '80px' : '100px';
        const fontSize = isMobile ? '2rem' : '2.5rem';
        
        if (esMedicurativo) {
            avatarHTML = `
                <div style="width:${avatarSize};height:${avatarSize};border-radius:50%;border:${isMobile ? '3.5px' : '4px'} solid #f1c40f;overflow:hidden;box-shadow:0 4px 20px rgba(241,196,15,0.4);background:${isDarkMode ? '#2a1a3e' : '#f8f0ff'};display:flex;align-items:center;justify-content:center;">
                    <img src="imganes/logosmedi.png" style="width:100%;height:100%;object-fit:cover;">
                </div>
            `;
        } else {
            const inicial = usuario.nombre.charAt(0).toUpperCase();
            const colores = ['#9b59b6','#3498db','#2ecc71','#e74c3c','#f39c12','#1abc9c','#e67e22','#8e44ad'];
            const color = colores[Math.floor(Math.random() * colores.length)];
            avatarHTML = `
                <div style="width:${avatarSize};height:${avatarSize};border-radius:50%;border:${isMobile ? '3.5px' : '4px'} solid ${borderColorPerfil};overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.08);background:${color};display:flex;align-items:center;justify-content:center;">
                    <span style="font-size:${fontSize};font-weight:800;color:white;text-shadow:0 2px 4px rgba(0,0,0,0.1);">${inicial}</span>
                </div>
            `;
        }

        let posicionHTML = '';
        if (posicionRanking) {
            const posicionTexto = posicionRanking <= 3 ? ['#1', '#2', '#3'][posicionRanking - 1] : `#${posicionRanking}`;
            const colorPosicion = posicionRanking <= 3 ? ['#f1c40f', '#bdc3c7', '#e67e22'][posicionRanking - 1] : '#9b59b6';
            
            posicionHTML = `
                <span style="
                    display:inline-flex;
                    align-items:center;
                    gap:4px;
                    background:${colorPosicion}22;
                    padding:${isMobile ? '2px 8px' : '4px 12px'};
                    border-radius:12px;
                    border:1.5px solid ${colorPosicion};
                    font-size:${isMobile ? '0.65rem' : '0.8rem'};
                    font-weight:700;
                    color:${colorPosicion};
                ">
                    🏆 ${posicionTexto}
                </span>
            `;
        }

        // ===== BOTÓN SEGUIR (AHORA TODOS PUEDEN SER SEGUIDOS) =====
let botonSeguirHTML = '';
// Solo mostrar el botón si NO es tu propio perfil
// Ahora incluye a Medicurativo también
if (!esMiPerfil) {
    const textoBoton = sigue ? 'Dejar de seguir' : 'Seguir';
    const colorBoton = sigue ? '#e74c3c' : '#9b59b6';
    const icono = sigue ? 'fa-user-minus' : 'fa-user-plus';
    
    botonSeguirHTML = `
        <button 
            onclick="handleSeguirClick('${usuario.id}', ${sigue})"
            style="
                background:${colorBoton};
                color:white;
                border:none;
                padding:${isMobile ? '6px 18px' : '8px 24px'};
                border-radius:20px;
                font-weight:600;
                font-size:${isMobile ? '0.75rem' : '0.85rem'};
                cursor:pointer;
                transition:all 0.2s;
                display:flex;
                align-items:center;
                gap:6px;
                box-shadow:0 2px 10px ${colorBoton}44;
            "
            onmouseover="this.style.transform='scale(1.05)'"
            onmouseout="this.style.transform='scale(1)'"
        >
            <i class="fas ${icono}"></i>
            ${textoBoton}
        </button>
    `;
} else {
    // Es tu propio perfil
    botonSeguirHTML = `
        <span style="
            background:${isDarkMode ? 'rgba(255,255,255,0.08)' : '#f0edf5'};
            color:${isDarkMode ? '#b0a0c8' : '#b0a4c4'};
            padding:${isMobile ? '6px 18px' : '8px 24px'};
            border-radius:20px;
            font-weight:600;
            font-size:${isMobile ? '0.75rem' : '0.85rem'};
            display:flex;
            align-items:center;
            gap:6px;
        ">
            <i class="fas fa-user"></i>
            Tu perfil
        </span>
    `;
}

        await Swal.fire({
            title: '',
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;gap:${isMobile ? '8px' : '12px'};padding:2px 0;">
                    ${avatarHTML}
                    
                    <h2 id="perfil-nombre-usuario" style="
                        margin:0;
                        color:${nombreColor};
                        text-shadow: ${nombreTextShadow};
                        font-size:${isMobile ? '1.1rem' : '1.4rem'};
                        font-weight:700;
                        display:flex;
                        align-items:center;
                        gap:8px;
                        flex-wrap:wrap;
                        justify-content:center;
                    ">
                        ${posicionHTML}
                        <span>${usuario.nombre}</span>
                        ${esMedicurativo ? `
                            <span style="
                                font-size:${isMobile ? '0.45rem' : '0.55rem'};
                                background:linear-gradient(135deg,#f1c40f,#f39c12);
                                color:#2c1b4e;
                                padding:${isMobile ? '2px 10px' : '3px 14px'};
                                border-radius:12px;
                                font-weight:800;
                                display:inline-flex;
                                align-items:center;
                                gap:4px;
                                box-shadow:0 2px 8px rgba(241,196,15,0.4);
                            ">
                            <i class="fas fa-crown" style="font-size:${isMobile ? '0.5rem' : '0.7rem'};"></i>
                            Oficial
                            </span>
                            <i class="fas fa-check-circle" style="color:#2ecc71;font-size:${isMobile ? '0.8rem' : '1rem'};margin-left:2px;text-shadow:0 0 10px rgba(46,204,113,0.3);"></i>
                        ` : ''}
                    </h2>

                    ${esMedicurativo ? `
                        <p style="margin:0;color:#f39c12;font-size:${isMobile ? '0.65rem' : '0.8rem'};font-weight:600;display:flex;align-items:center;gap:6px;">
                            <i class="fas fa-badge-check" style="color:#2ecc71;"></i>
                            Cuenta Oficial Verificada
                        </p>
                    ` : ''}
                    
                    ${botonSeguirHTML}
                    
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:${isMobile ? '8px' : '12px'};width:100%;max-width:${isMobile ? '300px' : '400px'};margin-top:2px;">
                        <div style="background:${bgCardColor};padding:${isMobile ? '8px' : '12px'};border-radius:${isMobile ? '8px' : '12px'};text-align:center;border:1px solid ${borderColor};">
                            <div style="font-size:${isMobile ? '0.55rem' : '0.65rem'};color:${subTextColor};text-transform:uppercase;letter-spacing:0.3px;">Public.</div>
                            <div style="font-size:${isMobile ? '1.2rem' : '1.6rem'};font-weight:800;color:${isDarkMode ? '#c8a0e0' : '#9b59b6'};">${totalPublicaciones}</div>
                        </div>
                        <div style="background:${isDarkMode ? 'rgba(255,255,255,0.08)' : '#fff5f5'};padding:${isMobile ? '8px' : '12px'};border-radius:${isMobile ? '8px' : '12px'};text-align:center;border:1px solid ${borderColor};">
                            <div style="font-size:${isMobile ? '0.55rem' : '0.65rem'};color:${subTextColor};text-transform:uppercase;letter-spacing:0.3px;">Likes</div>
                            <div style="font-size:${isMobile ? '1.2rem' : '1.6rem'};font-weight:800;color:#e74c3c;">${totalLikes}</div>
                        </div>
                        <div style="background:${isDarkMode ? 'rgba(255,255,255,0.08)' : '#fef9e7'};padding:${isMobile ? '8px' : '12px'};border-radius:${isMobile ? '8px' : '12px'};text-align:center;border:${isMobile ? '2px' : '3px'} solid ${borderColorPerfil};">
                            <div style="font-size:${isMobile ? '0.55rem' : '0.65rem'};color:${subTextColor};text-transform:uppercase;letter-spacing:0.3px;">${esMedicurativo ? '👑 Oficial' : '✨ Carisma'}</div>
                            <div style="font-size:${isMobile ? '1.2rem' : '1.6rem'};font-weight:800;color:${carismaColor};">${carisma}</div>
                        </div>
                    </div>

                    <div style="
                        background:${isDarkMode ? 'rgba(255,255,255,0.06)' : '#f0f0ff'};
                        padding:${isMobile ? '8px' : '12px'};
                        border-radius:${isMobile ? '8px' : '12px'};
                        text-align:center;
                        width:100%;
                        max-width:${isMobile ? '300px' : '400px'};
                        margin-top:${isMobile ? '4px' : '8px'};
                        border: 1.5px solid ${calidadColor}33;
                    ">
                        <div style="
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            gap:${isMobile ? '8px' : '16px'};
                            flex-wrap:wrap;
                        ">
                            <div>
                                <div style="
                                    font-size:${isMobile ? '0.45rem' : '0.55rem'};
                                    color:${subTextColor};
                                    text-transform:uppercase;
                                    letter-spacing:0.3px;
                                ">
                                    <i class="fas fa-chart-line" style="color:#9b59b6;"></i> 
                                    Promedio por publicación
                                </div>
                                <div style="
                                    font-size:${isMobile ? '1.3rem' : '1.7rem'};
                                    font-weight:800;
                                    color:${carismaColor};
                                ">
                                    ❤️ ${promedioLikes}
                                </div>
                            </div>
                            <div style="
                                padding:${isMobile ? '4px 12px' : '6px 16px'};
                                background:${calidadColor}22;
                                border-radius:20px;
                                border: 1.5px solid ${calidadColor};
                            ">
                                <span style="font-size:${isMobile ? '1rem' : '1.2rem'};">
                                    ${calidadEmoji}
                                </span>
                                <span style="
                                    font-size:${isMobile ? '0.65rem' : '0.8rem'};
                                    font-weight:700;
                                    color:${calidadColor};
                                ">
                                    ${calidadTexto}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style="
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        gap:${isMobile ? '12px' : '20px'};
                        width:100%;
                        padding:${isMobile ? '6px' : '10px'};
                        background:${isDarkMode ? 'rgba(255,255,255,0.05)' : '#faf5ff'};
                        border-radius:${isMobile ? '10px' : '14px'};
                        margin-top:${isMobile ? '2px' : '4px'};
                        border:1px solid ${borderColor};
                    ">
                        <div style="text-align:center;">
                            <div style="font-size:${isMobile ? '1.2rem' : '1.6rem'};font-weight:800;color:#9b59b6;">${conteoSeguidores}</div>
                            <div style="font-size:${isMobile ? '0.55rem' : '0.65rem'};color:${subTextColor};">Seguidores</div>
                        </div>
                        <div style="width:1px;height:${isMobile ? '25px' : '35px'};background:${isDarkMode ? 'rgba(255,255,255,0.1)' : '#e8e0f0'};"></div>
                        <div style="text-align:center;">
                            <div style="font-size:${isMobile ? '1.2rem' : '1.6rem'};font-weight:800;color:#9b59b6;">${totalPublicaciones}</div>
                            <div style="font-size:${isMobile ? '0.55rem' : '0.65rem'};color:${subTextColor};">Publicaciones</div>
                        </div>
                    </div>

                    <p style="color:${subTextColor};font-size:${isMobile ? '0.55rem' : '0.65rem'};margin-top:4px;text-align:center;border-top:1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#f0edf5'};padding-top:8px;width:100%;">
                        <i class="fas fa-sync" style="color:#9b59b6;"></i> 
                        El carisma se actualiza automáticamente
                        ${esMedicurativo ? '<br><i class="fas fa-crown" style="color:#f1c40f;"></i> Usuario Oficial verificado por Medicurativo' : ''}
                    </p>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#9b59b6',
            showCloseButton: true,
            customClass: { 
                popup: 'swal-popup-redondo'
            },
            width: isMobile ? 'auto' : '450px',
            maxWidth: isMobile ? 'auto' : '90vw',
            background: bgColor,
            target: document.body,
            didOpen: () => {
                const popup = document.querySelector('.swal2-popup');
                if (popup) {
                    popup.style.borderRadius = '20px';
                    popup.style.padding = isMobile ? '16px 14px 18px' : '25px 30px 30px';
                    popup.style.border = `${isMobile ? '3px' : '4px'} solid ${borderColorPerfil}`;
                    popup.style.boxShadow = `0 8px 32px ${borderColorPerfil}33`;
                    if (!isMobile) {
                        popup.style.width = '450px';
                    }
                }

                setTimeout(() => {
                    const nombreElement = document.getElementById('perfil-nombre-usuario');
                    if (nombreElement) {
                        nombreElement.style.color = '#ff6b9d';
                        nombreElement.style.setProperty('color', '#ff6b9d', 'important');
                        nombreElement.style.textShadow = '0 2px 8px rgba(0,0,0,0.3)';
                    }
                    
                    const htmlContainer = document.querySelector('.swal2-html-container');
                    if (htmlContainer) {
                        const h2Elements = htmlContainer.querySelectorAll('h2');
                        h2Elements.forEach(el => {
                            el.style.color = '#ff6b9d';
                            el.style.setProperty('color', '#ff6b9d', 'important');
                            el.style.textShadow = '0 2px 8px rgba(0,0,0,0.3)';
                        });
                    }
                }, 50);
            },
            willClose: () => { 
                perfilAbierto = false;
                setTimeout(() => {
                    if (!perfilAbierto) {
                        abrirRanking();
                    }
                }, 100);
            }
        });

        perfilAbierto = false;

    } catch (error) {
        console.error('❌ Error en perfil:', error);
        Swal.close();
        
        const isDarkMode = esModoOscuro();
        const bgColor = isDarkMode ? '#1a1a2e' : '#ffffff';
        const textColor = isDarkMode ? '#e8dff0' : '#2c1b4e';
        
        if (error.message === 'Timeout') {
            Swal.fire({
                title: '⏰ Tiempo de espera',
                text: 'El servidor está tardando. ¿Reintentar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Reintentar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#9b59b6',
                customClass: { popup: 'swal-popup-redondo' },
                background: bgColor,
                color: textColor
            }).then((result) => {
                if (result.isConfirmed) verPerfilUsuario(userId);
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al cargar el perfil.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
                customClass: { popup: 'swal-popup-redondo' },
                background: bgColor,
                color: textColor
            });
        }
        perfilAbierto = false;
    }
}

// ===== EXPONER FUNCIONES =====
window.abrirRanking = abrirRanking;
window.cargarRanking = cargarRanking;
window.verPerfilUsuario = verPerfilUsuario;
window.actualizarCarismaTodosLosUsuarios = actualizarCarismaTodosLosUsuarios;
window.seguirUsuario = seguirUsuario;
window.dejarDeSeguir = dejarDeSeguir;
window.cerrarSwal = cerrarSwal;
window.handleSeguirClick = handleSeguirClick;

console.log('✅ Ranking.js cargado correctamente (con sistema de seguimiento y modo oscuro)');