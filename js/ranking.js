// ============================================================
// RANKING.JS - Ranking con actualización automática de carisma
// ============================================================

let rankingSwalInstance = null;
let perfilAbierto = false;

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

// ===== DETECTAR DISPOSITIVO =====
function esDispositivoMovil() {
    return window.innerWidth <= 768;
}

// ===== ABRIR RANKING (CON ACTUALIZACIÓN AUTOMÁTICA) =====
function abrirRanking() {
    if (rankingCache && (Date.now() - ultimaActualizacionRanking) < 5000) {
        mostrarRanking(rankingCache);
        return;
    }

    Swal.fire({
        title: '<span style="color:#2c1b4e;font-weight:800;font-size:1.1rem;">🏆 Actualizando ranking...</span>',
        html: `
            <div style="display:flex;flex-direction:column;align-items:center;padding:8px 0;">
                <div style="width:45px;height:45px;border:3px solid #f0e6ff;border-top-color:#9b59b6;border-radius:50%;animation:spin 0.6s linear infinite;margin-bottom:12px;"></div>
                <p style="color:#7f5f9b;font-size:0.85rem;">Calculando carisma de todos los usuarios...</p>
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
    const isMobile = esDispositivoMovil();
    
    Swal.fire({
        title: '<span style="color:#2c1b4e;font-weight:800;font-size:1.1rem;">🏆 Sin datos aún</span>',
        html: `
            <div style="text-align:center; padding: 8px 5px;">
                <div style="background: linear-gradient(145deg, #f8f0ff, #f0e6ff); padding: 20px 15px; border-radius: 40px; margin: 8px 0;">
                    <div style="width:80px;height:80px;margin:0 auto 12px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 25px rgba(155,89,182,0.15);">
                        <img src="imganes/logosmedi.png" alt="Medicurativo" style="width:60px;height:60px;object-fit:contain;border-radius:50%;">
                    </div>
                    <p style="margin:0 0 6px;color:#2c1b4e;font-size:0.95rem;font-weight:700;">
                        Aún no hay usuarios registrados
                    </p>
                    <p style="margin:0;color:#7f5f9b;font-size:0.8rem;">
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
        didOpen: () => {
            const popup = document.querySelector('.swal2-popup');
            if (popup) {
                popup.style.borderRadius = '24px';
                popup.style.padding = isMobile ? '20px 18px' : '30px 35px';
                if (!isMobile) {
                    popup.style.width = '500px';
                }
            }
        }
    });
}

// ===== MOSTRAR RANKING =====
function mostrarRanking(ranking) {
    const isMobile = esDispositivoMovil();
    const medallas = ['🥇', '🥈', '🥉'];
    const coloresMedalla = ['#f1c40f', '#bdc3c7', '#e67e22'];

    let rankingHTML = `
        <div style="
            max-height: ${isMobile ? '400px' : '500px'}; 
            overflow-y: auto; 
            padding: 2px 2px 8px; 
            width: 100%;
        ">
            <p style="
                color: #7f8c8d; 
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
                background: #f3e9ff;
                border-radius: ${isMobile ? '10px' : '14px'};
                margin-bottom: 8px;
                font-weight: 700;
                font-size: ${isMobile ? '0.6rem' : '0.7rem'};
                color: #2c1b4e;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            ">
                <div style="text-align: center;">#</div>
                <div style="text-align: left; padding-left: 4px;">Usuario</div>
                <div style="text-align: center;">📝</div>
                <div style="text-align: center;">❤️</div>
            </div>
    `;

    const displayRanking = ranking.slice(0, isMobile ? 50 : 100);
    const totalUsuarios = ranking.length;

    displayRanking.forEach((usuario, index) => {
        const posicion = index + 1;
        const medalla = posicion <= 3 ? medallas[index] : `#${posicion}`;
        const colorMedalla = posicion <= 3 ? coloresMedalla[index] : '#9b59b6';
        const esTop3 = posicion <= 3;
        const esUsuarioActual = window.usuarioActual && usuario.id === window.usuarioActual.id;
        const esMedicurativo = usuario.nombre.toLowerCase().includes('medicurativo');

        // ===== COLOR DE FONDO =====
        let bgColor = 'rgba(155, 89, 182, 0.03)';
        
        // 🔵 PRIORIDAD 1: Usuario actual - Color morado claro destacado
        if (esUsuarioActual) {
            bgColor = 'rgba(155, 89, 182, 0.2)';
        // 🟡 PRIORIDAD 2: Oficial - Fondo dorado
        } else if (esMedicurativo) {
            bgColor = 'linear-gradient(135deg, #fef9e7, #fdebd0)';
        // 🟢 PRIORIDAD 3: Top 3 - Fondo dorado también
        } else if (esTop3) {
            bgColor = 'linear-gradient(135deg, #fef9e7, #fdebd0)';
        }

        // ===== BORDE =====
        let borderStyle = `border-left: ${isMobile ? '2.5px' : '4px'} solid ${colorMedalla};`;
        // Si es el usuario actual, borde morado
        if (esUsuarioActual) {
            borderStyle = `border-left: ${isMobile ? '2.5px' : '4px'} solid #9b59b6; border-right: ${isMobile ? '2.5px' : '4px'} solid #9b59b6;`;
        // Si es oficial, borde dorado
        } else if (esMedicurativo) {
            borderStyle = `border-left: ${isMobile ? '2.5px' : '4px'} solid #f1c40f; border-right: ${isMobile ? '2.5px' : '4px'} solid #f1c40f;`;
        }

        // ===== NOMBRE DEL USUARIO =====
        let nombreDisplay = usuario.nombre;
        
        // Si es usuario actual, agregar indicador "Tú" y color morado
        if (esUsuarioActual) {
            nombreDisplay = `
                <span style="color:#9b59b6;font-weight:800;display:flex;align-items:center;gap:3px;font-size:${isMobile ? '0.75rem' : '0.9rem'};">
                    ${usuario.nombre}
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
        // Si es oficial, mostrar badge completo
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
                <span style="vertical-align: middle;font-size:${isMobile ? '0.75rem' : '0.9rem'};font-weight:700;color:#2c1b4e;">
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
        }

        // ===== ICONO DE CALIDAD POR PROMEDIO (solo para usuarios normales) =====
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
                background: ${bgColor};
                border-radius: ${isMobile ? '8px' : '12px'};
                ${borderStyle}
                font-size: ${isMobile ? '0.7rem' : '0.85rem'};
                color: #2c1b4e;
                align-items: center;
                transition: all 0.15s ease;
                ${esUsuarioActual ? 'box-shadow: 0 0 0 2px rgba(155, 89, 182, 0.3);' : ''}
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
            <div style="text-align:center;padding:8px 0;color:#b0a4c4;font-size:${isMobile ? '0.7rem' : '0.8rem'};">
                <i class="fas fa-ellipsis-h"></i> Y ${totalUsuarios - (isMobile ? 50 : 100)} usuarios más...
            </div>
        `;
    }

    rankingHTML += `
        <div style="margin-top:12px;padding-top:8px;border-top:1.5px solid #f0edf5;text-align:center;">
            <p style="font-size:${isMobile ? '0.55rem' : '0.65rem'};color:#b0a4c4;margin:0;">
                <i class="fas fa-crown" style="color:#f1c40f;"></i> 
                Usuarios con <strong>Oficial</strong> son verificados
            </p>
            <p style="font-size:${isMobile ? '0.5rem' : '0.6rem'};color:#b0a4c4;margin:4px 0 0 0;">
                <i class="fas fa-sync" style="color:#9b59b6;"></i> 
                El carisma se actualiza automáticamente
            </p>
        </div>
    </div>`;

    Swal.fire({
        title: '',
        html: `
            <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
                <div style="width:${isMobile ? '60px' : '80px'};height:${isMobile ? '60px' : '80px'};border-radius:50%;background:linear-gradient(145deg,#f8f0ff,#f0e6ff);display:flex;align-items:center;justify-content:center;padding:${isMobile ? '10px' : '15px'};box-shadow:0 4px 15px rgba(155,89,182,0.12);margin-bottom:2px;">
                    <img src="imganes/logosmedi.png" alt="Medicurativo" style="width:100%;height:100%;object-fit:contain;border-radius:50%;">
                </div>
                <h2 style="color:#2c1b4e;font-weight:800;font-size:${isMobile ? '1rem' : '1.3rem'};margin:0;display:flex;align-items:center;gap:6px;">
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
        didOpen: () => {
            const popup = document.querySelector('.swal2-popup');
            if (popup) {
                popup.style.borderRadius = '24px';
                popup.style.padding = isMobile ? '14px 14px 18px' : '25px 30px 30px';
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

// ===== VER PERFIL - CON ACTUALIZACIÓN AUTOMÁTICA =====
async function verPerfilUsuario(userId) {
    if (perfilAbierto) return;
    perfilAbierto = true;
    
    try {
        const isMobile = esDispositivoMovil();

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
            customClass: { popup: 'swal-popup-redondo' },
            width: isMobile ? 'auto' : '400px',
            maxWidth: isMobile ? 'auto' : '90vw'
        });

        const { data: usuario, error: userError } = await supabaseClient
            .from('usuarios')
            .select('id, nombre, carisma')
            .eq('id', userId)
            .single();

        if (userError || !usuario) {
            Swal.close();
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

        Swal.close();

        const carisma = usuario.carisma || 0;
        const esMedicurativo = usuario.nombre.toLowerCase().includes('medicurativo');

        let borderColor = '#d1c4e9';
        if (esMedicurativo) borderColor = '#f1c40f';
        else if (carisma >= 60) borderColor = '#8e44ad';
        else if (carisma >= 50) borderColor = '#e74c3c';
        else if (carisma >= 40) borderColor = '#3498db';
        else if (carisma >= 30) borderColor = '#2ecc71';
        else if (carisma >= 20) borderColor = '#f1c40f';
        else if (carisma >= 10) borderColor = '#f39c12';

        let avatarHTML;
        const avatarSize = isMobile ? '80px' : '100px';
        const fontSize = isMobile ? '2rem' : '2.5rem';
        
        if (esMedicurativo) {
            avatarHTML = `
                <div style="width:${avatarSize};height:${avatarSize};border-radius:50%;border:${isMobile ? '3.5px' : '4px'} solid #f1c40f;overflow:hidden;box-shadow:0 4px 20px rgba(241,196,15,0.4);background:#f8f0ff;display:flex;align-items:center;justify-content:center;">
                    <img src="imganes/medicu.png" style="width:100%;height:100%;object-fit:cover;">
                </div>
            `;
        } else {
            const inicial = usuario.nombre.charAt(0).toUpperCase();
            const colores = ['#9b59b6','#3498db','#2ecc71','#e74c3c','#f39c12','#1abc9c','#e67e22','#8e44ad'];
            const color = colores[Math.floor(Math.random() * colores.length)];
            avatarHTML = `
                <div style="width:${avatarSize};height:${avatarSize};border-radius:50%;border:${isMobile ? '3.5px' : '4px'} solid ${borderColor};overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.08);background:${color};display:flex;align-items:center;justify-content:center;">
                    <span style="font-size:${fontSize};font-weight:800;color:white;text-shadow:0 2px 4px rgba(0,0,0,0.1);">${inicial}</span>
                </div>
            `;
        }

        await Swal.fire({
            title: '',
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;gap:${isMobile ? '8px' : '12px'};padding:2px 0;">
                    ${avatarHTML}
                    <h2 style="margin:0;color:#2c1b4e;font-size:${isMobile ? '1.1rem' : '1.4rem'};font-weight:700;display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center;">
                        ${usuario.nombre}
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
                    
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:${isMobile ? '8px' : '12px'};width:100%;max-width:${isMobile ? '300px' : '400px'};margin-top:2px;">
                        <div style="background:linear-gradient(145deg,#f8f0ff,#f0e6ff);padding:${isMobile ? '8px' : '12px'};border-radius:${isMobile ? '8px' : '12px'};text-align:center;">
                            <div style="font-size:${isMobile ? '0.55rem' : '0.65rem'};color:#7f5f9b;text-transform:uppercase;letter-spacing:0.3px;">Public.</div>
                            <div style="font-size:${isMobile ? '1.2rem' : '1.6rem'};font-weight:800;color:#9b59b6;">${totalPublicaciones}</div>
                        </div>
                        <div style="background:linear-gradient(145deg,#fff5f5,#ffe8e8);padding:${isMobile ? '8px' : '12px'};border-radius:${isMobile ? '8px' : '12px'};text-align:center;">
                            <div style="font-size:${isMobile ? '0.55rem' : '0.65rem'};color:#c0392b;text-transform:uppercase;letter-spacing:0.3px;">Likes</div>
                            <div style="font-size:${isMobile ? '1.2rem' : '1.6rem'};font-weight:800;color:#e74c3c;">${totalLikes}</div>
                        </div>
                        <div style="background:linear-gradient(145deg,#fef9e7,#fdebd0);padding:${isMobile ? '8px' : '12px'};border-radius:${isMobile ? '8px' : '12px'};text-align:center;border:${isMobile ? '2px' : '3px'} solid ${borderColor};">
                            <div style="font-size:${isMobile ? '0.55rem' : '0.65rem'};color:#7f5f9b;text-transform:uppercase;letter-spacing:0.3px;">✨ ${esMedicurativo ? 'Oficial' : 'Carisma'}</div>
                            <div style="font-size:${isMobile ? '1.2rem' : '1.6rem'};font-weight:800;color:${borderColor};">${carisma}</div>
                        </div>
                    </div>

                    <div style="
                        background:linear-gradient(145deg, #f0f0ff, #e8e8ff);
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
                                    color:#7f5f9b;
                                    text-transform:uppercase;
                                    letter-spacing:0.3px;
                                ">
                                    <i class="fas fa-chart-line" style="color:#9b59b6;"></i> 
                                    Promedio por publicación
                                </div>
                                <div style="
                                    font-size:${isMobile ? '1.3rem' : '1.7rem'};
                                    font-weight:800;
                                    color:#2c1b4e;
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

                    <p style="color:#b0a4c4;font-size:${isMobile ? '0.55rem' : '0.65rem'};margin-top:4px;text-align:center;border-top:1px solid #f0edf5;padding-top:8px;width:100%;">
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
            customClass: { popup: 'swal-popup-redondo' },
            width: isMobile ? 'auto' : '450px',
            maxWidth: isMobile ? 'auto' : '90vw',
            didOpen: () => {
                const popup = document.querySelector('.swal2-popup');
                if (popup) {
                    popup.style.borderRadius = '20px';
                    popup.style.padding = isMobile ? '16px 14px 18px' : '25px 30px 30px';
                    popup.style.border = `${isMobile ? '3px' : '4px'} solid ${borderColor}`;
                    popup.style.boxShadow = `0 8px 32px ${borderColor}33`;
                    if (!isMobile) {
                        popup.style.width = '450px';
                    }
                }
            },
            willClose: () => { perfilAbierto = false; }
        });

        perfilAbierto = false;

    } catch (error) {
        console.error('❌ Error en perfil:', error);
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

// ===== EXPONER FUNCIONES =====
window.abrirRanking = abrirRanking;
window.cargarRanking = cargarRanking;
window.verPerfilUsuario = verPerfilUsuario;
window.actualizarCarismaTodosLosUsuarios = actualizarCarismaTodosLosUsuarios;

console.log('✅ Ranking.js cargado correctamente (Actualización Automática)');