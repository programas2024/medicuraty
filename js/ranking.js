// ============================================================
// RANKING.JS - Ranking de usuarios más activos (VERSIÓN RESPONSIVE)
// ============================================================

// ===== ABRIR RANKING =====
function abrirRanking() {
    // Mostrar loading
    Swal.fire({
        title: '<span style="color:#2c1b4e;font-weight:800;font-size:1.3rem;">🏆 Cargando ranking...</span>',
        html: `
            <div style="display:flex;flex-direction:column;align-items:center;padding:10px 0;">
                <div style="width:60px;height:60px;border:4px solid #f0e6ff;border-top-color:#9b59b6;border-radius:50%;animation:spin 0.8s linear infinite;margin-bottom:15px;"></div>
                <p style="color:#7f5f9b;font-size:0.95rem;">Obteniendo los usuarios más activos...</p>
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
                popup.style.borderRadius = '30px';
                popup.style.padding = '30px 25px';
            }
        }
    });

    // Cargar datos
    cargarRanking();
}

// ===== CARGAR RANKING DE USUARIOS =====
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

        console.log('📊 Cargando ranking de usuarios...');

        const { data: publicacionesData, error: publicacionesError } = await supabaseClient
            .from('publicaciones')
            .select(`
                usuario_id,
                likes,
                usuarios!publicaciones_usuario_id_fkey (
                    id,
                    nombre,
                    avatar,
                    genero_id
                )
            `)
            .eq('estado', 'aprobado');

        if (publicacionesError) {
            console.error('❌ Error al obtener publicaciones:', publicacionesError);
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron obtener los datos del ranking.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
                customClass: { popup: 'swal-popup-redondo' }
            });
            return;
        }

        console.log('📊 Publicaciones aprobadas obtenidas:', publicacionesData?.length || 0);

        const usuariosMap = {};

        publicacionesData?.forEach(pub => {
            const userId = pub.usuario_id;
            const usuario = pub.usuarios;

            if (!usuariosMap[userId]) {
                usuariosMap[userId] = {
                    id: userId,
                    nombre: usuario?.nombre || 'Usuario',
                    totalPublicaciones: 0,
                    totalLikes: 0
                };
            }

            usuariosMap[userId].totalPublicaciones += 1;
            usuariosMap[userId].totalLikes += (pub.likes || 0);
        });

        const ranking = Object.values(usuariosMap)
            .sort((a, b) => b.totalLikes - a.totalLikes || b.totalPublicaciones - a.totalPublicaciones);

        console.log('📊 Ranking generado:', ranking);

        if (ranking.length === 0) {
            Swal.fire({
                title: '<span style="color:#2c1b4e;font-weight:800;font-size:1.3rem;">🏆 Sin datos aún</span>',
                html: `
                    <div style="text-align:center; padding: 10px 5px;">
                        <div style="background: linear-gradient(145deg, #f8f0ff, #f0e6ff); padding: 25px 20px; border-radius: 50px; margin: 10px 0;">
                            <div style="width:100px;height:100px;margin:0 auto 16px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 25px rgba(155,89,182,0.2);">
                                <img src="imganes/logosmedi.png" alt="Medicurativo" style="width:70px;height:70px;object-fit:contain;border-radius:50%;">
                            </div>
                            <p style="margin:0 0 8px;color:#2c1b4e;font-size:1.05rem;font-weight:700;line-height:1.5;">
                                Aún no hay publicaciones aprobadas
                            </p>
                            <p style="margin:0;color:#7f5f9b;font-size:0.88rem;line-height:1.5;">
                                ¡Sé el primero en compartir algo hermoso! ✨
                            </p>
                        </div>
                    </div>
                `,
                showConfirmButton: true,
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#9b59b6',
                customClass: { popup: 'swal-popup-redondo' }
            });
            return;
        }

        // ===== CONSTRUIR TABLA RESPONSIVE =====
        const medallas = ['🥇', '🥈', '🥉'];
        const coloresMedalla = ['#f1c40f', '#bdc3c7', '#e67e22'];

        let rankingHTML = `
            <div style="
                max-height: 450px; 
                overflow-y: auto; 
                padding: 5px 5px 10px; 
                width: 100%;
            ">
                <p style="
                    color: #7f8c8d; 
                    font-size: 0.85rem; 
                    text-align: center; 
                    margin-bottom: 16px;
                ">
                    <i class="fas fa-fire" style="color: #e67e22;"></i> 
                    Los usuarios más activos de la comunidad
                </p>

                <!-- HEADER DE LA TABLA -->
                <div style="
                    display: grid;
                    grid-template-columns: 40px 1fr 80px 80px;
                    gap: 6px;
                    padding: 8px 10px;
                    background: #f3e9ff;
                    border-radius: 12px;
                    margin-bottom: 10px;
                    font-weight: 700;
                    font-size: 0.7rem;
                    color: #2c1b4e;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                ">
                    <div style="text-align: center;">#</div>
                    <div style="padding-left: 4px;">Usuario</div>
                    <div style="text-align: center; font-size: 0.6rem;">
                        <span class="hide-mobile-480">📝</span> Public.
                    </div>
                    <div style="text-align: center; font-size: 0.6rem;">
                        <span class="hide-mobile-480">❤️</span> Likes
                    </div>
                </div>
        `;

        // FILAS
        ranking.forEach((usuario, index) => {
            const posicion = index + 1;
            const medalla = posicion <= 3 ? medallas[index] : `#${posicion}`;
            const colorMedalla = posicion <= 3 ? coloresMedalla[index] : '#9b59b6';
            const esTop3 = posicion <= 3;
            const esUsuarioActual = usuarioActual && usuario.id === usuarioActual.id;

            let bgColor = 'rgba(155, 89, 182, 0.04)';
            if (esTop3) {
                bgColor = 'linear-gradient(135deg, #fef9e7, #fdebd0)';
            } else if (esUsuarioActual) {
                bgColor = 'rgba(155, 89, 182, 0.15)';
            }

            // Borde especial para el usuario actual
            let borderStyle = `border-left: 3px solid ${colorMedalla};`;
            if (esUsuarioActual) {
                borderStyle = `border-left: 3px solid #9b59b6; border-right: 3px solid #9b59b6;`;
            }

            rankingHTML += `
                <div style="
                    display: grid;
                    grid-template-columns: 40px 1fr 80px 80px;
                    gap: 6px;
                    padding: 8px 10px;
                    margin-bottom: 5px;
                    background: ${bgColor};
                    border-radius: 10px;
                    ${borderStyle}
                    font-size: 0.8rem;
                    color: #2c1b4e;
                    align-items: center;
                    transition: 0.2s;
                    ${esUsuarioActual ? 'box-shadow: 0 0 0 2px rgba(155, 89, 182, 0.25);' : ''}
                ">
                    <!-- Posición -->
                    <div style="
                        text-align: center;
                        font-weight: 800;
                        font-size: ${esTop3 ? '1.1rem' : '0.8rem'};
                        color: ${colorMedalla};
                    ">
                        ${medalla}
                    </div>

                    <!-- Nombre del usuario -->
                    <div style="
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        padding-left: 4px;
                        font-size: 0.8rem;
                    ">
                        <span style="overflow: hidden; text-overflow: ellipsis;">${usuario.nombre}</span>
                        ${esUsuarioActual ? '<span style="font-size: 0.5rem; background: #9b59b6; color: white; padding: 2px 8px; border-radius: 8px; flex-shrink: 0; font-weight: 700;">Tú</span>' : ''}
                        ${posicion === 1 ? '<span style="font-size: 0.7rem; flex-shrink: 0;">👑</span>' : ''}
                    </div>

                    <!-- Publicaciones -->
                    <div style="text-align: center; font-weight: 600; color: #9b59b6; font-size: 0.85rem;">
                        ${usuario.totalPublicaciones}
                    </div>

                    <!-- Likes -->
                    <div style="text-align: center; font-weight: 600; color: #e74c3c; font-size: 0.85rem;">
                        ${usuario.totalLikes}
                    </div>
                </div>
            `;
        });

        rankingHTML += `
            <div style="
                margin-top: 16px; 
                padding-top: 12px; 
                border-top: 2px solid #f0edf5; 
                text-align: center;
            ">
                <p style="
                    font-size: 0.65rem; 
                    color: #b0a4c4; 
                    margin: 0;
                ">
                    <i class="fas fa-feather"></i> 
                    Publica y recibe likes para subir en el ranking
                </p>
            </div>
        </div>`;

        // ===== MOSTRAR SWEETALERT CON LOGO =====
        Swal.fire({
            title: '',
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
                    <!-- Logo de Medicurativo -->
                    <div style="
                        width:70px;
                        height:70px;
                        border-radius:50%;
                        background:linear-gradient(145deg, #f8f0ff, #f0e6ff);
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        padding:12px;
                        box-shadow:0 4px 20px rgba(155,89,182,0.15);
                        margin-bottom:4px;
                    ">
                        <img src="imganes/logosmedi.png" alt="Medicurativo" style="width:100%;height:100%;object-fit:contain;border-radius:50%;">
                    </div>
                    <h2 style="
                        color:#2c1b4e;
                        font-weight:800;
                        font-size:1.2rem;
                        margin:0;
                        display:flex;
                        align-items:center;
                        gap:8px;
                    ">
                        <span>🏆</span> Ranking de la comunidad
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
            maxWidth: '600px',
            didOpen: () => {
                const popup = document.querySelector('.swal2-popup');
                if (popup) {
                    popup.style.borderRadius = '24px';
                    popup.style.padding = '18px 16px 22px';
                }
            }
        });

    } catch (error) {
        console.error('❌ Error en cargarRanking:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al cargar el ranking.',
            icon: 'error',
            confirmButtonColor: '#e74c3c',
            customClass: { popup: 'swal-popup-redondo' }
        });
    }
}

// ===== EXPONER FUNCIONES GLOBALMENTE =====
window.abrirRanking = abrirRanking;
window.cargarRanking = cargarRanking;

console.log('✅ Ranking.js cargado correctamente');