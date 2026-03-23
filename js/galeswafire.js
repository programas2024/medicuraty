// ===== ALERTA DE AYUDA PARA GALERÍA =====
function mostrarAyudaGaleria() {
    Swal.fire({
        ...estiloBase,
        title: '<span style="font-size: 28px; font-weight: 600; color: #2c1b4e;">📸 Galería Medicurativo</span>',
        html: `
            <div style="text-align: left; max-height: 400px; overflow-y: auto; padding: 5px 15px 5px 5px; scrollbar-width: none; -ms-overflow-style: none;">
                
                <p style="font-size: 16px; margin: 15px 0 20px; color: #34495e; display: flex; align-items: center; gap: 10px; background: #f8f0ff; padding: 15px; border-radius: 40px;">
                    <i class="fas fa-heart" style="font-size: 24px; color: #e84393;"></i> 
                    <strong>Imágenes que inspiran y motivan</strong>
                </p>
                
                <div style="background: #f3ebff; padding: 15px; border-radius: 40px; margin: 15px 0;">
                    
                    <!-- GALERÍA COMPLETA -->
                    <div style="display: flex; align-items: center; gap: 12px; margin: 10px 0; background: white; padding: 12px 18px; border-radius: 40px; border-left: 5px solid #9b59b6;">
                        <i class="fas fa-images" style="font-size: 24px; color: #9b59b6; width: 35px;"></i>
                        <div style="flex: 1; font-size: 14px;">
                            <strong style="color: #9b59b6;">Galería completa:</strong> Todas las imágenes de reflexión
                        </div>
                    </div>
                    
                    <!-- DESTACADOS -->
                    <div style="display: flex; align-items: center; gap: 12px; margin: 10px 0; background: white; padding: 12px 18px; border-radius: 40px; border-left: 5px solid #f39c12;">
                        <i class="fas fa-star" style="font-size: 24px; color: #f39c12; width: 35px;"></i>
                        <div style="flex: 1; font-size: 14px;">
                            <strong style="color: #f39c12;">Destacados:</strong> Las imágenes más especiales
                        </div>
                    </div>
                    
                    <!-- RECIENTES -->
                    <div style="display: flex; align-items: center; gap: 12px; margin: 10px 0; background: white; padding: 12px 18px; border-radius: 40px; border-left: 5px solid #27ae60;">
                        <i class="fas fa-clock" style="font-size: 24px; color: #27ae60; width: 35px;"></i>
                        <div style="flex: 1; font-size: 14px;">
                            <strong style="color: #27ae60;">Recientes:</strong> Últimas imágenes agregadas
                        </div>
                    </div>
                </div>
                
                <!-- MENSAJE MOTIVADOR -->
                <div style="background: linear-gradient(145deg, #9b59b6, #8e44ad); padding: 20px; border-radius: 40px; margin: 15px 0; text-align: center;">
                    <i class="fas fa-quote-left" style="font-size: 30px; color: white; opacity: 0.5; margin-bottom: 10px;"></i>
                    <p style="color: white; font-size: 18px; font-weight: 500; line-height: 1.5;">
                        "Cada imagen está diseñada para<br>inspirarte, motivarte y recordarte<br>lo valioso que eres"
                    </p>
                </div>
                
                <!-- DESCRIPCIÓN DE IMÁGENES -->
                <div style="background: #ffeaa7; padding: 15px; border-radius: 40px; margin: 15px 0;">
                    <h4 style="color: #2c1b4e; font-size: 18px; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-heart" style="color: #e84393;"></i> ¿Qué encontrarás?
                    </h4>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-check-circle" style="color: #27ae60;"></i> Animales que simbolizan valores
                        </li>
                        <li style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-check-circle" style="color: #27ae60;"></i> Momentos de paz y reflexión
                        </li>
                        <li style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-check-circle" style="color: #27ae60;"></i> Imágenes que transmiten emociones
                        </li>
                        <li style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-check-circle" style="color: #27ae60;"></i> Fotografías con mensajes positivos
                        </li>
                    </ul>
                </div>
                
              
                
                <!-- MENSAJE FINAL -->
                <div style="text-align: center; margin: 10px 0; font-size: 14px; color: #2c1b4e; background: #e8d8ff; padding: 12px; border-radius: 40px;">
                    <i class="fas fa-hand-pointer"></i> Haz clic en cualquier imagen para verla en grande
                </div>
            </div>
            
            <style>
                .swal2-html-container::-webkit-scrollbar { display: none; }
                .swal2-html-container { scrollbar-width: none; -ms-overflow-style: none; }
            </style>
        `,
        iconHtml: '<i class="fas fa-images" style="font-size: 30px; color: #9b59b6;"></i>'
    });
}