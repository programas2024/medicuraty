// ============================================================
// RANKING.JS - Ranking de usuarios más activos (VERSIÓN ULTRA RÁPIDA)
// ============================================================

let rankingSwalInstance = null;
let perfilAbierto = false;

// ===== CACHE EN MEMORIA =====
let rankingCache = null;
let ultimaActualizacionRanking = 0;
const CACHE_TTL = 30000; // 30 segundos de cache

// ===== CONFIGURACIÓN DE SUPABASE =====
const SUPABASE_CONFIG = {
    selectLimit: 1000, // Límite para consultas
    timeout: 5000, // Timeout de 5 segundos
    retryCount: 2 // Reintentos en caso de error
};

// ===== ABRIR RANKING =====
function abrirRanking() {
    // Si hay cache y no ha expirado, mostrar directamente
    if (rankingCache && (Date.now() - ultimaActualizacionRanking) < CACHE_TTL) {
        mostrarRanking(rankingCache);
        return;
    }

    // Mostrar loading optimizado
    Swal.fire({
        title: '<span style="color:#2c1b4e;font-weight:800;font-size:1.1rem;">🏆 Cargando ranking...</span>',
        html: `
            <div style="display:flex;flex-direction:column;align-items:center;padding:8px 0;">
                <div style="width:45px;height:45px;border:3px solid #f0e6ff;border-top-color:#9b59b6;border-radius:50%;animation:spin 0.6s linear infinite;margin-bottom:12px;"></div>
                <p style="color:#7f5f9b;font-size:0.85rem;">Usuarios más activos...</p>
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
        didOpen: () => {
            const popup = document.querySelector('.swal2-popup');
            if (popup) {
                popup.style.borderRadius = '24px';
                popup.style.padding = '20px 20px';
            }
        }
    });

    cargarRanking();
}

// ===== CARGAR RANKING CON CONSULTA ULTRA RÁPIDA =====
async function cargarRanking() {
    try {
        if (typeof supabaseClient === 'undefined' || !supabaseClient) {
            console.error('❌ Supabase no disponible');
            Swal.fire({
                title: 'Error',
                text: 'No se pudo conectar con la base de datos.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
                customClass: { popup: 'swal-popup-redondo' }
            });
            return;
        }

        console.log('📊 Cargando ranking...');

        // ===== OPTIMIZACIÓN 1: Consulta con límite y campos específicos =====
        const startTime = performance.now();
        
        const { data, error } = await Promise.race([
            supabaseClient
                .from('publicaciones')
                .select(`
                    usuario_id,
                    likes,
                    usuarios (nombre)
                `)
                .eq('estado', 'aprobado')
                .limit(SUPABASE_CONFIG.selectLimit),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), SUPABASE_CONFIG.timeout)
            )
        ]);

        const endTime = performance.now();
        console.log(`⏱️ Ranking cargado en ${(endTime - startTime).toFixed(0)}ms`);

        if (error) {
            console.error('❌ Error:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            mostrarRankingVacio();
            return;
        }

        // ===== OPTIMIZACIÓN 2: Procesamiento con Map y reduce =====
        const usuariosMap = new Map();
        
        // Procesamiento optimizado con forEach
        data.forEach(pub => {
            const userId = pub.usuario_id;
            if (!usuariosMap.has(userId)) {
                usuariosMap.set(userId, {
                    id: userId,
                    nombre: pub.usuarios?.nombre || 'Usuario',
                    totalPublicaciones: 0,
                    totalLikes: 0
                });
            }
            const user = usuariosMap.get(userId);
            user.totalPublicaciones += 1;
            user.totalLikes += (pub.likes || 0);
        });

        // ===== OPTIMIZACIÓN 3: Ordenamiento eficiente =====
        const ranking = Array.from(usuariosMap.values())
            .sort((a, b) => {
                // Ordenar por likes primero, luego por publicaciones
                const diffLikes = b.totalLikes - a.totalLikes;
                if (diffLikes !== 0) return diffLikes;
                return b.totalPublicaciones - a.totalPublicaciones;
            })
            .slice(0, 100); // Solo top 100 para mejor rendimiento

        // Guardar en cache
        rankingCache = ranking;
        ultimaActualizacionRanking = Date.now();

        if (ranking.length === 0) {
            mostrarRankingVacio();
            return;
        }

        mostrarRanking(ranking);

    } catch (error) {
        console.error('❌ Error:', error);
        
        if (error.message === 'Timeout') {
            Swal.fire({
                title: '⏰ Tiempo de espera',
                text: 'El servidor está tardando. ¿Reintentar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Reintentar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#9b59b6',
                customClass: { popup: 'swal-popup-redondo' }
            }).then((result) => {
                if (result.isConfirmed) cargarRanking();
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al cargar el ranking.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
                customClass: { popup: 'swal-popup-redondo' }
            });
        }
    }
}

// ===== MOSTRAR RANKING VACÍO =====
function mostrarRankingVacio() {
    Swal.fire({
        title: '<span style="color:#2c1b4e;font-weight:800;font-size:1.1rem;">🏆 Sin datos aún</span>',
        html: `
            <div style="text-align:center; padding: 8px 5px;">
                <div style="background: linear-gradient(145deg, #f8f0ff, #f0e6ff); padding: 20px 15px; border-radius: 40px; margin: 8px 0;">
                    <div style="width:80px;height:80px;margin:0 auto 12px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 25px rgba(155,89,182,0.15);">
                        <img src="imganes/logosmedi.png" alt="Medicurativo" style="width:60px;height:60px;object-fit:contain;border-radius:50%;">
                    </div>
                    <p style="margin:0 0 6px;color:#2c1b4e;font-size:0.95rem;font-weight:700;">
                        Aún no hay publicaciones aprobadas
                    </p>
                    <p style="margin:0;color:#7f5f9b;font-size:0.8rem;">
                        ¡Sé el primero en compartir algo! ✨
                    </p>
                </div>
            </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#9b59b6',
        customClass: { popup: 'swal-popup-redondo' }
    });
}

// ===== MOSTRAR RANKING =====
function mostrarRanking(ranking) {
    const medallas = ['🥇', '🥈', '🥉'];
    const coloresMedalla = ['#f1c40f', '#bdc3c7', '#e67e22'];

    let rankingHTML = `
        <div style="
            max-height: 400px; 
            overflow-y: auto; 
            padding: 2px 2px 8px; 
            width: 100%;
        ">
            <p style="
                color: #7f8c8d; 
                font-size: 0.75rem; 
                text-align: center; 
                margin-bottom: 12px;
            ">
                <i class="fas fa-fire" style="color: #e67e22;"></i> 
                Top ${ranking.length} usuarios más activos
            </p>

            <div style="
                display: grid;
                grid-template-columns: 35px 1fr 70px 70px;
                gap: 4px;
                padding: 6px 8px;
                background: #f3e9ff;
                border-radius: 10px;
                margin-bottom: 8px;
                font-weight: 700;
                font-size: 0.6rem;
                color: #2c1b4e;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            ">
                <div style="text-align: center;">#</div>
                <div style="padding-left: 2px;">Usuario</div>
                <div style="text-align: center;">📝</div>
                <div style="text-align: center;">❤️</div>
            </div>
    `;

    // Mostrar solo top 50 para rendimiento visual
    const displayRanking = ranking.slice(0, 50);
    const totalUsuarios = ranking.length;

    displayRanking.forEach((usuario, index) => {
        const posicion = index + 1;
        const medalla = posicion <= 3 ? medallas[index] : `#${posicion}`;
        const colorMedalla = posicion <= 3 ? coloresMedalla[index] : '#9b59b6';
        const esTop3 = posicion <= 3;
        const esUsuarioActual = window.usuarioActual && usuario.id === window.usuarioActual.id;
        const esMedicurativo = usuario.nombre.toLowerCase().includes('medicurativo');

        let bgColor = 'rgba(155, 89, 182, 0.03)';
        if (esTop3) bgColor = 'linear-gradient(135deg, #fef9e7, #fdebd0)';
        else if (esUsuarioActual) bgColor = 'rgba(155, 89, 182, 0.12)';

        let borderStyle = `border-left: 2.5px solid ${colorMedalla};`;
        if (esUsuarioActual) borderStyle = `border-left: 2.5px solid #9b59b6; border-right: 2.5px solid #9b59b6;`;

        let nombreDisplay = usuario.nombre;
        if (esMedicurativo) {
            nombreDisplay = `
                <img src="imganes/medicu.png" alt="Medicurativo" style="
                    width: 18px; height: 18px; border-radius: 50%; object-fit: cover;
                    margin-right: 3px; vertical-align: middle; border: 1.5px solid #9b59b6;
                    flex-shrink: 0;
                ">
                <span style="vertical-align: middle;font-size:0.75rem;">${usuario.nombre}</span>
            `;
        }

        rankingHTML += `
            <div style="
                display: grid;
                grid-template-columns: 35px 1fr 70px 70px;
                gap: 4px;
                padding: 6px 8px;
                margin-bottom: 3px;
                background: ${bgColor};
                border-radius: 8px;
                ${borderStyle}
                font-size: 0.7rem;
                color: #2c1b4e;
                align-items: center;
                transition: all 0.15s ease;
                ${esUsuarioActual ? 'box-shadow: 0 0 0 1.5px rgba(155, 89, 182, 0.2);' : ''}
                cursor: pointer;
            "
            onclick="verPerfilUsuario('${usuario.id}')"
            onmouseover="this.style.transform='scale(1.01)'; this.style.boxShadow='0 2px 10px rgba(155,89,182,0.12)'"
            onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='${esUsuarioActual ? '0 0 0 1.5px rgba(155, 89, 182, 0.2)' : 'none'}'"
            >
                <div style="text-align:center;font-weight:800;font-size:${esTop3 ? '0.95rem' : '0.7rem'};color:${colorMedalla};">
                    ${medalla}
                </div>
                <div style="font-weight:600;display:flex;align-items:center;gap:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:2px;font-size:0.75rem;">
                    <span style="overflow:hidden;text-overflow:ellipsis;color:#2c1b4e;display:flex;align-items:center;font-size:0.75rem;">
                        ${nombreDisplay}
                    </span>
                    ${esUsuarioActual ? '<span style="font-size:0.45rem;background:#9b59b6;color:white;padding:1px 6px;border-radius:6px;flex-shrink:0;font-weight:700;margin-left:2px;">Tú</span>' : ''}
                    ${posicion === 1 ? '<span style="font-size:0.6rem;flex-shrink:0;margin-left:1px;">👑</span>' : ''}
                </div>
                <div style="text-align:center;font-weight:600;color:#9b59b6;font-size:0.75rem;">${usuario.totalPublicaciones}</div>
                <div style="text-align:center;font-weight:600;color:#e74c3c;font-size:0.75rem;">${usuario.totalLikes}</div>
            </div>
        `;
    });

    if (totalUsuarios > 50) {
        rankingHTML += `
            <div style="text-align:center;padding:8px 0;color:#b0a4c4;font-size:0.7rem;">
                <i class="fas fa-ellipsis-h"></i> Y ${totalUsuarios - 50} usuarios más...
            </div>
        `;
    }

    rankingHTML += `
        <div style="margin-top:12px;padding-top:8px;border-top:1.5px solid #f0edf5;text-align:center;">
            <p style="font-size:0.6rem;color:#b0a4c4;margin:0;">
                <i class="fas fa-feather"></i> Publica y recibe likes para subir
            </p>
        </div>
    </div>`;

    Swal.fire({
        title: '',
        html: `
            <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
                <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(145deg,#f8f0ff,#f0e6ff);display:flex;align-items:center;justify-content:center;padding:10px;box-shadow:0 4px 15px rgba(155,89,182,0.12);margin-bottom:2px;">
                    <img src="imganes/logosmedi.png" alt="Medicurativo" style="width:100%;height:100%;object-fit:contain;border-radius:50%;">
                </div>
                <h2 style="color:#2c1b4e;font-weight:800;font-size:1rem;margin:0;display:flex;align-items:center;gap:6px;">
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
        width: 'auto',
        maxWidth: '520px',
        didOpen: () => {
            const popup = document.querySelector('.swal2-popup');
            if (popup) {
                popup.style.borderRadius = '20px';
                popup.style.padding = '14px 14px 18px';
            }
            rankingSwalInstance = Swal;
        },
        willClose: () => {
            rankingSwalInstance = null;
            perfilAbierto = false;
        }
    });
}

// ===== VER PERFIL - ULTRA RÁPIDO =====
async function verPerfilUsuario(userId) {
    if (perfilAbierto) return;
    perfilAbierto = true;
    
    try {
        // Mostrar loading minimalista (SIN didOpen para evitar error)
        Swal.fire({
            title: 'Cargando perfil...',
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;padding:15px 0;">
                    <div style="width:40px;height:40px;border:3px solid #f0e6ff;border-top-color:#9b59b6;border-radius:50%;animation:spin 0.5s linear infinite;margin-bottom:10px;"></div>
                    <p style="color:#7f5f9b;font-size:0.8rem;">Cargando información...</p>
                </div>
                <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            customClass: { popup: 'swal-popup-redondo' }
        });

        // ===== OPTIMIZACIÓN: Consultas en paralelo con timeout =====
        const startTime = performance.now();
        
        const [usuarioResult, publicacionesResult] = await Promise.race([
            Promise.all([
                supabaseClient
                    .from('usuarios')
                    .select('id, nombre, carisma')
                    .eq('id', userId)
                    .single(),
                supabaseClient
                    .from('publicaciones')
                    .select('likes')
                    .eq('usuario_id', userId)
                    .eq('estado', 'aprobado')
                    .limit(500)
            ]),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 4000)
            )
        ]);

        const endTime = performance.now();
        console.log(`⏱️ Perfil cargado en ${(endTime - startTime).toFixed(0)}ms`);

        // Cerrar loading
        Swal.close();

        if (usuarioResult.error || !usuarioResult.data) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo cargar el perfil del usuario.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
                customClass: { popup: 'swal-popup-redondo' }
            });
            perfilAbierto = false;
            return;
        }

        const usuario = usuarioResult.data;
        const publicaciones = publicacionesResult.data || [];
        const totalPublicaciones = publicaciones.length;
        const totalLikes = publicaciones.reduce((sum, p) => sum + (p.likes || 0), 0);
        const carisma = usuario.carisma || 0;
        const esMedicurativo = usuario.nombre.toLowerCase().includes('medicurativo');

        // ===== CALCULAR BORDERCOLOR ANTES DE USARLO =====
        let borderColor = '#d1c4e9'; // Default (gris claro)
        if (esMedicurativo) borderColor = '#9b59b6'; // Morado especial
        else if (carisma >= 60) borderColor = '#8e44ad'; // Morado oscuro
        else if (carisma >= 50) borderColor = '#e74c3c'; // Rojo
        else if (carisma >= 40) borderColor = '#3498db'; // Azul
        else if (carisma >= 30) borderColor = '#2ecc71'; // Verde
        else if (carisma >= 20) borderColor = '#f1c40f'; // Amarillo
        else if (carisma >= 10) borderColor = '#f39c12'; // Naranja

        // Avatar
        let avatarHTML;
        if (esMedicurativo) {
            avatarHTML = `
                <div style="width:80px;height:80px;border-radius:50%;border:3.5px solid #9b59b6;overflow:hidden;box-shadow:0 4px 15px rgba(155,89,182,0.25);background:#f8f0ff;display:flex;align-items:center;justify-content:center;">
                    <img src="imganes/medicu.png" style="width:100%;height:100%;object-fit:cover;">
                </div>
            `;
        } else {
            const inicial = usuario.nombre.charAt(0).toUpperCase();
            const colores = ['#9b59b6','#3498db','#2ecc71','#e74c3c','#f39c12','#1abc9c','#e67e22','#8e44ad'];
            const color = colores[Math.floor(Math.random() * colores.length)];
            avatarHTML = `
                <div style="width:80px;height:80px;border-radius:50%;border:3.5px solid ${borderColor};overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.08);background:${color};display:flex;align-items:center;justify-content:center;">
                    <span style="font-size:2rem;font-weight:800;color:white;text-shadow:0 2px 4px rgba(0,0,0,0.1);">${inicial}</span>
                </div>
            `;
        }

        const puedeDarLike = window.usuarioActual && window.usuarioActual.id !== userId;

        // ===== MOSTRAR PERFIL CON BORDE DE COLOR =====
        await Swal.fire({
            title: '',
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:2px 0;">
                    ${avatarHTML}
                    <h2 style="margin:0;color:#2c1b4e;font-size:1.1rem;font-weight:700;display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center;">
                        ${usuario.nombre}
                        ${esMedicurativo ? '<span style="font-size:0.5rem;background:#9b59b6;color:white;padding:1px 8px;border-radius:10px;font-weight:600;"><i class="fas fa-gamepad"></i> Carisma</span>' : ''}
                    </h2>
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;width:100%;max-width:300px;margin-top:2px;">
                        <div style="background:linear-gradient(145deg,#f8f0ff,#f0e6ff);padding:8px;border-radius:8px;text-align:center;">
                            <div style="font-size:0.55rem;color:#7f5f9b;text-transform:uppercase;letter-spacing:0.3px;">Public.</div>
                            <div style="font-size:1.2rem;font-weight:800;color:#9b59b6;">${totalPublicaciones}</div>
                        </div>
                        <div style="background:linear-gradient(145deg,#fff5f5,#ffe8e8);padding:8px;border-radius:8px;text-align:center;">
                            <div style="font-size:0.55rem;color:#c0392b;text-transform:uppercase;letter-spacing:0.3px;">Likes</div>
                            <div style="font-size:1.2rem;font-weight:800;color:#e74c3c;">${totalLikes}</div>
                        </div>
                        <div style="background:linear-gradient(145deg,#fef9e7,#fdebd0);padding:8px;border-radius:8px;text-align:center;border:2px solid ${borderColor};">
                            <div style="font-size:0.55rem;color:#7f5f9b;text-transform:uppercase;letter-spacing:0.3px;">✨ Carisma</div>
                            <div style="font-size:1.2rem;font-weight:800;color:${borderColor};">${carisma}</div>
                        </div>
                    </div>
                    ${puedeDarLike ? `
                        <button onclick="darLikeCarisma('${userId}')" style="margin-top:6px;background:linear-gradient(135deg,#9b59b6,#8e44ad);color:white;border:none;padding:8px 25px;border-radius:20px;font-size:0.8rem;font-weight:600;cursor:pointer;transition:all 0.2s ease;box-shadow:0 3px 12px rgba(155,89,182,0.25);display:flex;align-items:center;gap:6px;margin:0 auto;">
                            <i class="fas fa-heart"></i> Dar Like (+10)
                        </button>
                    ` : `
                        ${!window.usuarioActual ? '<p style="color:#b0a4c4;font-size:0.7rem;margin-top:6px;">Inicia sesión para dar likes</p>' : ''}
                        ${window.usuarioActual && window.usuarioActual.id === userId ? '<p style="color:#b0a4c4;font-size:0.7rem;margin-top:6px;">No puedes darte like a ti mismo</p>' : ''}
                    `}
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#9b59b6',
            showCloseButton: true,
            customClass: { popup: 'swal-popup-redondo' },
            width: 'auto',
            maxWidth: '360px',
            didOpen: () => {
                const popup = document.querySelector('.swal2-popup');
                if (popup) {
                    popup.style.borderRadius = '18px';
                    popup.style.padding = '16px 14px 18px';
                    // BORDE DEL SWAL COMPLETO CON COLOR DE CARISMA
                    popup.style.border = `3px solid ${borderColor}`;
                    popup.style.boxShadow = `0 8px 32px ${borderColor}33`;
                }
            },
            willClose: () => { perfilAbierto = false; }
        });

        perfilAbierto = false;

    } catch (error) {
        console.error('Error en perfil:', error);
        Swal.close();
        
        if (error.message === 'Timeout') {
            Swal.fire({
                title: '⏰ Tiempo de espera',
                text: 'El servidor está tardando. ¿Reintentar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Reintentar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#9b59b6',
                customClass: { popup: 'swal-popup-redondo' }
            }).then((result) => {
                if (result.isConfirmed) verPerfilUsuario(userId);
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al cargar el perfil.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
                customClass: { popup: 'swal-popup-redondo' }
            });
        }
        perfilAbierto = false;
    }
}

// ===== DAR LIKE CARISMA - OPTIMIZADO =====
async function darLikeCarisma(userId) {
    try {
        if (!window.usuarioActual) {
            Swal.fire({
                title: 'Inicia sesión',
                text: 'Debes iniciar sesión para dar likes.',
                icon: 'info',
                confirmButtonColor: '#9b59b6',
                customClass: { popup: 'swal-popup-redondo' }
            });
            return;
        }
        if (window.usuarioActual.id === userId) {
            Swal.fire({
                title: 'No puedes',
                text: 'No puedes darte like a ti mismo.',
                icon: 'warning',
                confirmButtonColor: '#f39c12',
                customClass: { popup: 'swal-popup-redondo' }
            });
            return;
        }

        // Mostrar loading rápido
        Swal.fire({
            title: 'Dando like...',
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;padding:12px 0;">
                    <div style="width:35px;height:35px;border:3px solid #f0e6ff;border-top-color:#9b59b6;border-radius:50%;animation:spin 0.5s linear infinite;margin-bottom:8px;"></div>
                    <p style="color:#7f5f9b;font-size:0.8rem;">Sumando carisma...</p>
                </div>
                <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            customClass: { popup: 'swal-popup-redondo' }
        });

        // Consulta optimizada
        const startTime = performance.now();
        
        const { data: usuario, error: getError } = await Promise.race([
            supabaseClient
                .from('usuarios')
                .select('carisma, nombre')
                .eq('id', userId)
                .single(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 3000)
            )
        ]);

        if (getError) {
            Swal.close();
            Swal.fire({
                title: 'Error',
                text: 'No se pudo obtener el carisma.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
                customClass: { popup: 'swal-popup-redondo' }
            });
            return;
        }

        const nuevoCarisma = (usuario.carisma || 0) + 10;

        const { error: updateError } = await supabaseClient
            .from('usuarios')
            .update({ carisma: nuevoCarisma })
            .eq('id', userId);

        if (updateError) {
            Swal.close();
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar el carisma.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
                customClass: { popup: 'swal-popup-redondo' }
            });
            return;
        }

        const endTime = performance.now();
        console.log(`⏱️ Like dado en ${(endTime - startTime).toFixed(0)}ms`);

        Swal.close();

        await Swal.fire({
            title: '🎉 +10 Carisma',
            text: `¡${usuario.nombre} ahora tiene ${nuevoCarisma} carisma!`,
            icon: 'success',
            confirmButtonColor: '#9b59b6',
            timer: 1200,
            timerProgressBar: true,
            customClass: { popup: 'swal-popup-redondo' }
        });

        // Limpiar cache y recargar ranking
        rankingCache = null;
        ultimaActualizacionRanking = 0;
        
        if (rankingSwalInstance) {
            rankingSwalInstance.close();
            setTimeout(() => abrirRanking(), 200);
        }

    } catch (error) {
        console.error('Error al dar like:', error);
        Swal.close();
        
        if (error.message === 'Timeout') {
            Swal.fire({
                title: '⏰ Tiempo de espera',
                text: 'El servidor está tardando. ¿Reintentar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Reintentar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#9b59b6',
                customClass: { popup: 'swal-popup-redondo' }
            }).then((result) => {
                if (result.isConfirmed) darLikeCarisma(userId);
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al dar like.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
                customClass: { popup: 'swal-popup-redondo' }
            });
        }
    }
}

// ===== EXPONER FUNCIONES =====
window.abrirRanking = abrirRanking;
window.cargarRanking = cargarRanking;
window.verPerfilUsuario = verPerfilUsuario;
window.darLikeCarisma = darLikeCarisma;

console.log('✅ Ranking.js cargado correctamente (Versión Ultra Rápida)');