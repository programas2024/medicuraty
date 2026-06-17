// ===== LÓGICA PARA EDICIÓN DE PERFIL =====

window.editarNombre = async function() {
    // Obtenemos la sesión actual para saber el nombre actual
    if (typeof supabaseClient === 'undefined') return console.error("SupabaseClient no está definido");
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return;

    const nombreActual = session.user.user_metadata?.nombre || "";

    const { value: nuevoNombre } = await Swal.fire({
        title: '✨ Editar tu Nombre',
        input: 'text',
        inputLabel: '¿Cómo quieres que te saludemos en Medicurativo?',
        inputValue: nombreActual,
        showCancelButton: true,
        confirmButtonText: 'Guardar cambios',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#9b59b6',
        cancelButtonColor: '#ff7675',
        reverseButtons: true, // Esto pone el botón de "Guardar cambios" a la derecha
        customClass: { popup: 'swal-popup-redondo' },
        inputValidator: (value) => {
            if (!value) {
                return '¡El nombre no puede estar vacío!';
            }
        }
    });

    if (nuevoNombre && nuevoNombre !== nombreActual) {
        // Segundo SweetAlert: Actualizando
        try {
            Swal.fire({
                title: 'Actualizando nombre...',
                text: 'Estamos sincronizando tus datos con Medicurativo.',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); },
                customClass: { popup: 'swal-popup-redondo' }
            });
            
            console.log("Iniciando actualización para:", session.user.id);

            // 1. Actualizamos los metadatos en Auth
            const { error: authError } = await supabaseClient.auth.updateUser({
                data: { nombre: nuevoNombre }
            });
            if (authError) throw authError;

            // 2. Sincronizamos con la tabla public.usuarios
            const { error: tableError } = await supabaseClient
                .from('usuarios')
                .update({ nombre: nuevoNombre })
                .eq('id', session.user.id);
            if (tableError) throw tableError;

            // 3. Manejo de Logros (Solo se gana una vez)
            const { data: currentLogros } = await supabaseClient.from('logros').select('*').eq('usuario_id', session.user.id).maybeSingle();
            const yaTeniaLogro = currentLogros?.cambio_nombre === true;

            if (!yaTeniaLogro) {
                await supabaseClient.from('logros').upsert({ 
                    usuario_id: session.user.id, 
                    cambio_nombre: true,
                    cambio_genero: currentLogros ? currentLogros.cambio_genero : false
                }, { onConflict: 'usuario_id' });

                // Sonido de logro
                if (window.achievementSound) {
                    window.achievementSound.currentTime = 0;
                    window.achievementSound.play().catch(() => {});
                }

                // Confeti solo la primera vez
                if (typeof confetti === 'function') {
                    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#f1c40f', '#9b59b6'] });
                }
            }

            Swal.fire({
                title: !yaTeniaLogro ? '¡LOGRO DESBLOQUEADO! 🏆' : '¡Nombre Actualizado!',
                html: `
                    <div style="text-align: center;">
                        ${!yaTeniaLogro ? '<p style="color: #f39c12; font-weight: bold; margin-bottom: 10px;">¡Ganaste el trofeo "Identidad Única"!</p>' : ''}
                        <p style="color: #4a2d6e; font-size: 1rem; margin-bottom: 15px;">Tu nuevo nombre en la comunidad es:</p>
                        <div style="background: #f8f2ff; padding: 15px; border-radius: 25px; border: 2px solid #e0d0f0;">
                            <span style="color: #9b59b6; font-weight: 800; font-size: 1.3rem;">${nuevoNombre}</span>
                        </div>
                    </div>
                `,
                icon: !yaTeniaLogro ? 'success' : undefined,
                imageUrl: yaTeniaLogro ? 'imganes/logosmedi.png' : undefined,
                imageWidth: 100,
                imageHeight: 100,
                confirmButtonText: 'Excelente',
                confirmButtonColor: '#9b59b6',
                customClass: { popup: 'swal-popup-redondo' }
            });

            // Actualizamos el saludo en la página principal si existe
            const spanNombre = document.getElementById('usuarioNombreLogueado');
            if (spanNombre) spanNombre.textContent = nuevoNombre;

        } catch (err) {
            console.error("Fallo de sincronización:", err);
            Swal.fire({
                title: 'Error de Sincronización',
                text: 'No pudimos actualizar tu nombre: ' + (err.message || 'Error de permisos'),
                icon: 'warning'
            });
        }
    }
};

window.editarGenero = async function() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return;

    const generoActual = session.user.user_metadata?.genero_id || "";

    const { value: nuevoGenero } = await Swal.fire({
        title: '✨ Cambiar Género',
        input: 'select',
        inputOptions: {
            '1': 'Hombre',
            '2': 'Mujer'
        },
        inputPlaceholder: 'Selecciona tu género',
        inputValue: generoActual,
        showCancelButton: true,
        confirmButtonText: 'Guardar cambios',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#9b59b6',
        cancelButtonColor: '#ff7675',
        reverseButtons: true,
        customClass: { popup: 'swal-popup-redondo' }
    });

    if (nuevoGenero && nuevoGenero !== generoActual) {
        Swal.fire({
            title: 'Actualizando datos...',
            text: 'Sincronizando con Medicurativo.',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); },
            customClass: { popup: 'swal-popup-redondo' }
        });

        try {
            // 1. Update Auth
            const genId = parseInt(nuevoGenero);
            const { error: authError } = await supabaseClient.auth.updateUser({ 
                data: { genero_id: genId } 
            });
            if (authError) throw authError;

            // 2. Update Tabla Usuarios
            const { error: tableError } = await supabaseClient
                .from('usuarios')
                .update({ genero_id: genId })
                .eq('id', session.user.id);
            if (tableError) throw tableError;

            // 3. Manejo de Logros (Solo se gana una vez)
            const { data: currentLogros } = await supabaseClient.from('logros').select('*').eq('usuario_id', session.user.id).maybeSingle();
            const yaTeniaLogro = currentLogros?.cambio_genero === true;

            if (!yaTeniaLogro) {
                await supabaseClient.from('logros').upsert({ 
                    usuario_id: session.user.id, 
                    cambio_genero: true,
                    cambio_nombre: currentLogros ? currentLogros.cambio_nombre : false
                }, { onConflict: 'usuario_id' });

                // Sonido de logro
                if (window.achievementSound) {
                    window.achievementSound.currentTime = 0;
                    window.achievementSound.play().catch(() => {});
                }

                if (typeof confetti === 'function') {
                    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#f1c40f', '#9b59b6'] });
                }
            }

            Swal.fire({
                title: !yaTeniaLogro ? '¡LOGRO DESBLOQUEADO! 🏆' : '¡Género Actualizado!',
                text: !yaTeniaLogro ? '¡Ganaste el trofeo de Autenticidad!' : 'Tu perfil ha sido actualizado.',
                icon: !yaTeniaLogro ? 'success' : undefined,
                imageUrl: yaTeniaLogro ? 'imganes/logosmedi.png' : undefined,
                imageWidth: 100,
                imageHeight: 100,
                confirmButtonText: 'Genial',
                confirmButtonColor: '#9b59b6',
                customClass: { popup: 'swal-popup-redondo' }
            }).then(() => {
                location.reload(); // Recarga para actualizar avatares y UI de logros
            });

        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No pudimos actualizar tu género.', 'error');
        }
    }
};
