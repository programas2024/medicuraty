// ===== CONFIGURACIÓN DE SWEETALERTS =====
// Estilo base para todos
const estiloBase = {
    background: '#fff9ff',
    confirmButtonColor: '#2c1b4e',
    confirmButtonText: 'Entendido',
    showCloseButton: true,
    closeButtonHtml: '×',
    customClass: {
        popup: 'swal-popup-redondo',
        closeButton: 'swal-close-button'
    },
    width: '500px',
    padding: '20px'
};

// ===== ALERTA DE AYUDA =====
function mostrarAyuda() {
    Swal.fire({
        ...estiloBase,
        title: '<span style="font-size: 28px; font-weight: 600; color: #2c1b4e;">✨ Medicurativo</span>',
        html: `
            <div style="text-align: left; max-height: 400px; overflow-y: auto; padding: 5px 15px 5px 5px; scrollbar-width: none; -ms-overflow-style: none;">
                
                <p style="font-size: 16px; margin: 15px 0 20px; color: #34495e; display: flex; align-items: center; gap: 10px; background: #f8f0ff; padding: 15px; border-radius: 40px;">
                    <i class="fas fa-heart" style="font-size: 24px; color: #e84393;"></i> 
                    <strong>Tu espacio de crecimiento personal</strong>
                </p>
                
                <div style="background: #f3ebff; padding: 15px; border-radius: 40px; margin: 15px 0;">
                    
                    <!-- VALORES -->
                    <div style="display: flex; align-items: center; gap: 12px; margin: 10px 0; background: white; padding: 12px 18px; border-radius: 40px; border-left: 5px solid #1e6f9c;">
                        <i class="fas fa-star" style="font-size: 24px; color: #1e6f9c; width: 35px;"></i>
                        <div style="flex: 1; font-size: 14px;">
                            <strong style="color: #1e6f9c;">Valores:</strong> 11 reflexiones
                        </div>
                    </div>
                    
                    <!-- CRECIMIENTO -->
                    <div style="display: flex; align-items: center; gap: 12px; margin: 10px 0; background: white; padding: 12px 18px; border-radius: 40px; border-left: 5px solid #8e44ad;">
                        <i class="fas fa-seedling" style="font-size: 24px; color: #8e44ad; width: 35px;"></i>
                        <div style="flex: 1; font-size: 14px;">
                            <strong style="color: #8e44ad;">Crecimiento:</strong> 9 temas
                        </div>
                    </div>
                    
                    <!-- EMOCIONES -->
                    <div style="display: flex; align-items: center; gap: 12px; margin: 10px 0; background: white; padding: 12px 18px; border-radius: 40px; border-left: 5px solid #c44569;">
                        <i class="fas fa-heart" style="font-size: 24px; color: #c44569; width: 35px;"></i>
                        <div style="flex: 1; font-size: 14px;">
                            <strong style="color: #c44569;">Emociones:</strong> 4 reflexiones
                        </div>
                    </div>
                    
                    <!-- LIDERAZGO -->
                    <div style="display: flex; align-items: center; gap: 12px; margin: 10px 0; background: white; padding: 12px 18px; border-radius: 40px; border-left: 5px solid #0e7c5c;">
                        <i class="fas fa-crown" style="font-size: 24px; color: #0e7c5c; width: 35px;"></i>
                        <div style="flex: 1; font-size: 14px;">
                            <strong style="color: #0e7c5c;">Liderazgo:</strong> 4 claves
                        </div>
                    </div>
                    
                    <!-- ESPECIALES -->
                    <div style="display: flex; align-items: center; gap: 12px; margin: 10px 0; background: white; padding: 12px 18px; border-radius: 40px; border-left: 5px solid #e67e22;">
                        <i class="fas fa-calendar-star" style="font-size: 24px; color: #e67e22; width: 35px;"></i>
                        <div style="flex: 1; font-size: 14px;">
                            <strong style="color: #e67e22;">Especiales:</strong> 3 fechas
                        </div>
                    </div>
                </div>
                
                <!-- TOTAL -->
                <div style="background: #ffeaa7; padding: 15px; border-radius: 40px; margin: 15px 0; text-align: center;">
                    <strong style="font-size: 20px; color: #2c1b4e;">31 temas</strong> 
                    <span style="font-size: 14px;">para reflexionar</span>
                </div>
                
                <!-- MENSAJE FINAL -->
                <div style="text-align: center; margin: 10px 0; font-size: 14px; color: #2c1b4e; background: #e8d8ff; padding: 12px; border-radius: 40px;">
                    <i class="fas fa-hand-pointer"></i> Haz clic en cualquier tema del menú
                </div>
            </div>
            
            <style>
                .swal2-html-container::-webkit-scrollbar { display: none; }
                .swal2-html-container { scrollbar-width: none; -ms-overflow-style: none; }
            </style>
        `,
        iconHtml: '<i class="fas fa-spa" style="font-size: 30px; color: #9b59b6;"></i>'
    });
}

// ===== ALERTA DE MISIÓN =====
function mostrarMision() {
    Swal.fire({
        ...estiloBase,
        title: '<span style="font-size: 28px; font-weight: 600; color: #2c1b4e;">🎯 Nuestra Misión</span>',
        html: `
            <div style="text-align: center; padding: 20px;">
                <div style="background: linear-gradient(145deg, #c7b0e8, #e6d4fc); padding: 30px; border-radius: 60px; margin: 15px 0;">
                    <i class="fas fa-heart" style="font-size: 60px; color: #e84393; margin-bottom: 20px;"></i>
                    <p style="font-size: 18px; line-height: 1.8; color: #1a1a2e; font-weight: 500;">
                        Esta página web está hecha para ayudarte en<br>
                        <strong style="color: #2c1b4e; font-size: 22px;">conocimiento en temas</strong><br>
                        que nos ayudan a crecer como persona<br>
                        <strong style="color: #8e44ad;">en esta vida</strong><br>
                        y ser <strong style="color: #c44569;">mejores cada día</strong>.
                    </p>
                </div>
                
                <div style="background: #f3ebff; padding: 20px; border-radius: 50px; margin-top: 20px;">
                    <i class="fas fa-seedling" style="font-size: 40px; color: #0e7c5c;"></i>
                    <p style="font-size: 16px; color: #34495e; margin-top: 10px;">
                        Crecemos juntos, un tema a la vez
                    </p>
                </div>
            </div>
        `,
        iconHtml: '<i class="fas fa-bullseye" style="font-size: 30px; color: #e67e22;"></i>'
    });
}

// ===== ALERTA DE SOPORTE =====
function mostrarSoporte() {
    Swal.fire({
        ...estiloBase,
        title: '<span style="font-size: 28px; font-weight: 600; color: #2c1b4e;">📞 ¿Necesitas ayuda?</span>',
        html: `
            <div style="text-align: center; padding: 15px;">
                
                <div style="background: #f8f0ff; padding: 25px; border-radius: 60px; margin: 15px 0;">
                    <i class="fas fa-headset" style="font-size: 70px; color: #9b59b6; margin-bottom: 20px;"></i>
                    
                    <p style="font-size: 18px; color: #2c3e50; margin: 20px 0; line-height: 1.6;">
                        ¿Tienes problemas con la carga?<br>
                        ¿Algo no entiendes?<br>
                        ¿Necesitas soporte técnico?
                    </p>
                    
                    <div style="background: #2c1b4e; padding: 20px; border-radius: 50px; margin: 20px 0;">
                        <i class="fas fa-envelope" style="font-size: 30px; color: white; margin-right: 10px;"></i>
                        <a href="mailto:joacoxx2340@gmail.com" style="color: white; font-size: 20px; font-weight: 600; text-decoration: none;">
                            joacoxx2340@gmail.com
                        </a>
                    </div>
                    
                    <p style="font-size: 16px; color: #7f8c8d; margin-top: 15px;">
                        ✨ Respondemos lo antes posible ✨
                    </p>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 20px;">
                    <i class="fas fa-check-circle" style="font-size: 24px; color: #27ae60;"></i>
                    <span style="color: #34495e;">Soporte gratuito</span>
                </div>
            </div>
        `,
        iconHtml: '<i class="fas fa-headset" style="font-size: 30px; color: #9b59b6;"></i>'
    });
}

// Estilos adicionales - SOLO UNA VEZ y con nombre único
const sweetAlertStyles = document.createElement('style');
sweetAlertStyles.innerHTML = `
    .swal-popup-redondo {
        border-radius: 40px !important;
    }
    
    .swal-close-button {
        color: #2c1b4e !important;
        font-size: 28px !important;
        width: 40px !important;
        height: 40px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 50% !important;
        background: rgba(255,255,255,0.8) !important;
        right: 10px !important;
        top: 10px !important;
    }
    
    .swal-close-button:hover {
        background: white !important;
        color: #e74c3c !important;
    }
`;
document.head.appendChild(sweetAlertStyles);