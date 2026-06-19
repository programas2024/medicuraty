// ===== COMUNIDAD.JS - LÓGICA COMPLETA PARA EL MURO SOCIAL =====

// Variable global para el usuario actual
window.usuarioActual = null;

// ===== OBTENER SESIÓN ACTUAL =====
async function obtenerUsuarioActual() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        window.usuarioActual = {
            id: session.user.id,
            email: session.user.email,
            nombre: session.user.user_metadata?.nombre || 'Usuario',
            avatar: session.user.user_metadata?.avatar || 'imganes/avatar-default.png'
        };
    }
    return window.usuarioActual;
}

// ===== CARGAR PUBLICACIONES =====
window.cargarPublicaciones = async () => {
    try {
        const { data: publicaciones, error } = await supabaseClient
            .from('publicaciones')
            .select(`
                *,
                usuarios!publicaciones_usuario_id_fkey(
                    nombre,
                    avatar
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error al cargar publicaciones:', error);
            return;
        }

        const muro = document.getElementById('muroComunidad');
        if (!publicaciones || publicaciones.length === 0) {
            muro.innerHTML = `
                <div style="text-align:center; padding: 40px 20px; background: white; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                    <i class="fas fa-leaf" style="font-size: 3rem; color: #9b59b6; opacity: 0.5;"></i>
                    <p style="color: #7f8c8d; margin-top: 20px; font-size: 1.1rem;">Todavía no hay publicaciones. ¡Sé el primero en compartir algo hermoso!</p>
                </div>
            `;
            return;
        }

        // Renderizar cada publicación
        muro.innerHTML = publicaciones.map(pub => {
            const esImagen = pub.tipo === 'imagen';
            const contenidoHTML = esImagen 
                ? `<img src="${pub.contenido}" alt="Publicación" loading="lazy" style="width:100%; border-radius: 16px; margin-top: 12px; max-height: 500px; object-fit: cover; cursor: pointer;" onclick="window.abrirImagenZoom('${pub.contenido}', 'Publicación')">` 
                : `<p style="font-size: 1.1rem; line-height: 1.6; color: #2c3e50; margin-top: 10px; white-space: pre-wrap;">${pub.contenido}</p>`;
            
            const avatar = pub.usuarios?.avatar || 'imganes/avatar-default.png';
            const nombre = pub.usuarios?.nombre || 'Usuario';
            const fecha = new Date(pub.created_at).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            });

            // Verificar si el usuario actual es el autor
            const esAutor = window.usuarioActual && pub.usuario_id === window.usuarioActual.id;

            return `
                <div class="publicacion-card" data-id="${pub.id}">
                    <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
                        <img src="${avatar}" alt="${nombre}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #e8e0f0;" onerror="this.src='imganes/avatar-default.png'">
                        <div>
                            <div style="font-weight: 700; color: #2c1b4e; font-size: 1rem;">${nombre}</div>
                            <div style="font-size: 0.75rem; color: #95a5a6; display: flex; align-items: center; gap: 6px;">
                                <i class="far fa-clock"></i> ${fecha}
                            </div>
                        </div>
                        ${esAutor ? `
                            <button class="btn-eliminar-publicacion" data-id="${pub.id}" title="Eliminar publicación">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        ` : ''}
                    </div>
                    ${contenidoHTML}
                    <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #f0edf5; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.85rem; color: #7f8c8d;"><i class="far fa-heart" style="color: #e74c3c;"></i> ${pub.likes || 0}</span>
                        <span style="font-size: 0.85rem; color: #95a5a6;"><i class="far fa-comment"></i> ${pub.comentarios || 0}</span>
                    </div>
                </div>
            `;
        }).join('');

        // Agregar event listeners para eliminar
        document.querySelectorAll('.btn-eliminar-publicacion').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const confirmar = await Swal.fire({
                    title: '¿Eliminar publicación?',
                    text: 'Esta acción no se puede deshacer.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#e74c3c',
                    cancelButtonColor: '#95a5a6',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                });
                if (confirmar.isConfirmed) {
                    await eliminarPublicacion(id);
                    await cargarPublicaciones();
                }
            });
        });
    } catch (error) {
        console.error('Error en cargarPublicaciones:', error);
    }
};

// ===== ELIMINAR PUBLICACIÓN =====
window.eliminarPublicacion = async (id) => {
    try {
        const { error } = await supabaseClient
            .from('publicaciones')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'No pudimos eliminar la publicación.', 'error');
            return;
        }
        
        Swal.fire({
            title: '¡Eliminada!',
            text: 'La publicación fue eliminada correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('Error en eliminarPublicacion:', error);
        Swal.fire('Error', 'Ocurrió un error al eliminar.', 'error');
    }
};

// ===== ABRIR MODAL PARA NUEVA PUBLICACIÓN =====
window.abrirModalPublicacion = () => {
    Swal.fire({
        title: 'Comparte con la comunidad',
        html: `
            <div style="display: flex; flex-direction: column; gap: 20px; align-items: center;">
                <div style="display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;">
                    <button id="opcionFrase" class="swal2-option-btn" style="padding: 14px 28px; border-radius: 60px; background: #f3e9ff; border: 2px solid #9b59b6; color: #2c1b4e; font-weight: 600; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s;">
                        <i class="fas fa-quote-left" style="color: #9b59b6;"></i> Frase
                    </button>
                    <button id="opcionImagen" class="swal2-option-btn" style="padding: 14px 28px; border-radius: 60px; background: #f3e9ff; border: 2px solid #9b59b6; color: #2c1b4e; font-weight: 600; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s;">
                        <i class="fas fa-image" style="color: #9b59b6;"></i> Imagen
                    </button>
                </div>
                <div id="contenedorPublicacion" style="width: 100%; max-width: 450px; display: none; flex-direction: column; gap: 16px;">
                    <textarea id="textoPublicacion" placeholder="Escribe tu frase o reflexión..." style="width: 100%; padding: 16px; border-radius: 20px; border: 2px solid #e0d6eb; resize: vertical; min-height: 100px; font-family: inherit; font-size: 1rem;"></textarea>
                    <input type="file" id="archivoImagen" accept="image/*" style="display: none;">
                    <div id="vistaPrevia" style="display: none; position: relative; width: 100%; border-radius: 20px; overflow: hidden; border: 2px solid #e0d6eb;">
                        <img id="imagenPrevia" src="" alt="Vista previa" style="width: 100%; max-height: 300px; object-fit: cover;">
                        <button id="quitarImagen" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.6); border: none; color: white; border-radius: 50%; width: 30px; height: 30px; font-size: 1rem; cursor: pointer;"><i class="fas fa-times"></i></button>
                    </div>
                    <button id="publicarBtn" class="swal2-confirm-btn" style="background: linear-gradient(145deg, #9b59b6, #8e44ad); border: none; padding: 14px; border-radius: 60px; color: white; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 12px rgba(155, 89, 182, 0.3);">
                        <i class="fas fa-cloud-upload-alt"></i> Publicar
                    </button>
                </div>
            </div>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        customClass: { popup: 'swal-popup-redondo' },
        width: '90%',
        didOpen: () => {
            const contenedor = document.getElementById('contenedorPublicacion');
            const textoArea = document.getElementById('textoPublicacion');
            const archivoInput = document.getElementById('archivoImagen');
            const vistaPrevia = document.getElementById('vistaPrevia');
            const imagenPrevia = document.getElementById('imagenPrevia');
            const quitarBtn = document.getElementById('quitarImagen');
            const publicarBtn = document.getElementById('publicarBtn');
            
            let tipoSeleccionado = null;
            let archivoSeleccionado = null;

            // Opción Frase
            document.getElementById('opcionFrase').addEventListener('click', () => {
                tipoSeleccionado = 'frase';
                contenedor.style.display = 'flex';
                archivoInput.style.display = 'none';
                vistaPrevia.style.display = 'none';
                textoArea.placeholder = 'Escribe tu frase o reflexión...';
                textoArea.value = '';
                archivoSeleccionado = null;
                document.querySelectorAll('.swal2-option-btn').forEach(b => {
                    b.style.background = '#f3e9ff';
                    b.style.color = '#2c1b4e';
                });
                document.getElementById('opcionFrase').style.background = '#9b59b6';
                document.getElementById('opcionFrase').style.color = 'white';
            });

            // Opción Imagen
            document.getElementById('opcionImagen').addEventListener('click', () => {
                tipoSeleccionado = 'imagen';
                contenedor.style.display = 'flex';
                archivoInput.style.display = 'block';
                archivoInput.click();
                textoArea.placeholder = 'Opcional: añade un pie de foto...';
                vistaPrevia.style.display = 'none';
                imagenPrevia.src = '';
                archivoSeleccionado = null;
                document.querySelectorAll('.swal2-option-btn').forEach(b => {
                    b.style.background = '#f3e9ff';
                    b.style.color = '#2c1b4e';
                });
                document.getElementById('opcionImagen').style.background = '#9b59b6';
                document.getElementById('opcionImagen').style.color = 'white';
            });

            // Manejar selección de archivo
            archivoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    archivoSeleccionado = file;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        imagenPrevia.src = ev.target.result;
                        vistaPrevia.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Quitar imagen
            quitarBtn.addEventListener('click', () => {
                archivoSeleccionado = null;
                vistaPrevia.style.display = 'none';
                imagenPrevia.src = '';
                archivoInput.value = '';
            });

            // Publicar
            publicarBtn.addEventListener('click', async () => {
                if (!tipoSeleccionado) {
                    Swal.fire('Selecciona un tipo', 'Elige entre frase o imagen.', 'info');
                    return;
                }
                const texto = textoArea.value.trim();
                if (tipoSeleccionado === 'frase' && !texto) {
                    Swal.fire('Frase vacía', 'Escribe una frase para compartir.', 'warning');
                    return;
                }
                if (tipoSeleccionado === 'imagen' && !archivoSeleccionado && !texto) {
                    Swal.fire('Sin contenido', 'Selecciona una imagen o escribe un pie de foto.', 'warning');
                    return;
                }

                // Obtener usuario actual
                const { data: { session } } = await supabaseClient.auth.getSession();
                if (!session) {
                    Swal.fire('Sesión no activa', 'Inicia sesión para publicar.', 'error');
                    return;
                }
                const usuarioId = session.user.id;

                let contenidoFinal = texto;
                let tipoFinal = tipoSeleccionado;

                // Si es imagen y hay archivo, subir a Supabase Storage
                if (tipoSeleccionado === 'imagen' && archivoSeleccionado) {
                    const ext = archivoSeleccionado.name.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
                    const filePath = `publicaciones/${fileName}`;
                    
                    const { data: uploadData, error: uploadError } = await supabaseClient
                        .storage
                        .from('publicaciones')
                        .upload(filePath, archivoSeleccionado);

                    if (uploadError) {
                        Swal.fire('Error al subir', 'No se pudo subir la imagen.', 'error');
                        console.error(uploadError);
                        return;
                    }

                    const { data: urlData } = supabaseClient
                        .storage
                        .from('publicaciones')
                        .getPublicUrl(filePath);

                    contenidoFinal = urlData.publicUrl;
                    tipoFinal = 'imagen';
                }

                // Insertar en la tabla publicaciones
                const { error: insertError } = await supabaseClient
                    .from('publicaciones')
                    .insert({
                        usuario_id: usuarioId,
                        tipo: tipoFinal,
                        contenido: contenidoFinal,
                        created_at: new Date().toISOString()
                    });

                if (insertError) {
                    Swal.fire('Error', 'No se pudo crear la publicación.', 'error');
                    console.error(insertError);
                } else {
                    Swal.fire({
                        title: '¡Publicado!',
                        text: 'Tu contribución está en el muro.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    Swal.close();
                    await cargarPublicaciones();
                }
            });
        }
    });
};

// ===== FUNCIÓN DE AYUDA PARA COMUNIDAD =====
window.mostrarAyudaComunidad = () => {
    Swal.fire({
        title: 'Comunidad Medicurativo',
        html: `
            <p style="text-align: left; color: #2c3e50; font-size: 1rem; line-height: 1.6;">
                <i class="fas fa-users" style="color: #9b59b6;"></i> Bienvenido al muro social.<br><br>
                <strong>📝 Subir frase o imagen:</strong> Haz clic en el botón morado y elige entre compartir una frase o una imagen.
                <br><br>
                <strong>🗑️ Eliminar:</strong> Solo puedes eliminar tus propias publicaciones (aparece un botón de papelera).
                <br><br>
                <strong>🔒 Privacidad:</strong> Todas las publicaciones son visibles para la comunidad. Sé respetuoso y comparte desde el corazón.
            </p>
        `,
        icon: 'info',
        confirmButtonColor: '#9b59b6',
        confirmButtonText: 'Entendido'
    });
};

// ===== INICIALIZAR AL CARGAR LA PÁGINA =====
document.addEventListener('DOMContentLoaded', async () => {
    // Obtener usuario actual
    await obtenerUsuarioActual();
    
    // Cargar publicaciones
    await cargarPublicaciones();

    // Evento para abrir el modal de nueva publicación
    const btnSubir = document.getElementById('btnSubirPublicacion');
    if (btnSubir) {
        btnSubir.addEventListener('click', () => {
            abrirModalPublicacion();
        });
    }

    // Evento para ayuda
    const btnAyuda = document.getElementById('btnAyuda');
    if (btnAyuda) {
        btnAyuda.addEventListener('click', () => {
            mostrarAyudaComunidad();
        });
    }
});

// ===== ZOOM DE IMÁGENES =====
window.abrirImagenZoom = function(url, titulo) {
    Swal.fire({
        imageUrl: url,
        imageAlt: titulo,
        title: titulo || 'Imagen',
        showCloseButton: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-popup-redondo'
        },
        width: '90%',
        imageWidth: '100%',
        imageHeight: 'auto'
    });
};