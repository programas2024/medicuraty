// ===== ALERTA DE AGRADECIMIENTOS - VERSIÓN RESPONSIVE =====
function mostrarAgradecimientos() {
    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;
    
    Swal.fire({
        ...estiloBase,
        title: `<span style="font-size: ${isMobile ? '28px' : '42px'}; font-weight: 700; color: #2c1b4e;">🙏 AGRADECIMIENTOS</span>`,
        html: `
            <div style="text-align: center; padding: 5px; max-height: ${isMobile ? '70vh' : '500px'}; overflow-y: auto; scrollbar-width: none;">
                
                <!-- MENSAJE PRINCIPAL -->
                <div style="background: linear-gradient(145deg, #2c1b4e, #4a2d6e); padding: ${isMobile ? '20px 15px' : '30px 20px'}; border-radius: ${isMobile ? '40px' : '70px'}; margin: 10px 0;">
                    <i class="fas fa-heart" style="font-size: ${isMobile ? '40px' : '60px'}; color: #ffb8d9;"></i>
                    <p style="color: white; font-size: ${isMobile ? '16px' : '24px'}; line-height: 1.4;">
                        Gracias a todos por hacer parte de mi proyecto<br>
                        <strong style="font-size: ${isMobile ? '18px' : '28px'}; color: #ffeaa7;">que surgió por los valores, experiencias</strong><br>
                        y con el objetivo de darle<br>
                        <span style="background: #e84393; padding: ${isMobile ? '3px 12px' : '5px 20px'}; border-radius: 50px; color: white; font-weight: 700; font-size: ${isMobile ? '14px' : '24px'};">MOTIVACIÓN</span>
                    </p>
                </div>

                <!-- PADRES -->
                <div style="background: linear-gradient(145deg, #ffd1dc, #ffe5f0); padding: ${isMobile ? '15px' : '25px'}; border-radius: ${isMobile ? '40px' : '80px'}; margin: 10px 0;">
                    <i class="fas fa-heart" style="font-size: ${isMobile ? '30px' : '50px'}; color: #e84393;"></i>
                    <h3 style="font-size: ${isMobile ? '22px' : '32px'}; color: #2c1b4e;">👨‍👩‍👧 PADRES</h3>
                    <p style="font-size: ${isMobile ? '14px' : '20px'}; color: #1a1a2e;">
                        "Por siempre enseñarme tantas cosas bonitas<br>y brindarme tanta confianza en mí"
                    </p>
                    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                        <span style="background: white; padding: ${isMobile ? '8px 15px' : '12px 30px'}; border-radius: 60px; font-size: ${isMobile ? '12px' : '18px'}; border: 2px solid #e84393;">💖 FLOR ELBA</span>
                        <span style="background: white; padding: ${isMobile ? '8px 15px' : '12px 30px'}; border-radius: 60px; font-size: ${isMobile ? '12px' : '18px'}; border: 2px solid #e84393;">💙 JOSÉ JESÚS</span>
                    </div>
                </div>

                <!-- FAMILIA -->
                <div style="background: linear-gradient(145deg, #b3e0cf, #d4f0e0); padding: ${isMobile ? '15px' : '25px'}; border-radius: ${isMobile ? '40px' : '80px'}; margin: 10px 0;">
                    <i class="fas fa-users" style="font-size: ${isMobile ? '30px' : '50px'}; color: #0e7c5c;"></i>
                    <h3 style="font-size: ${isMobile ? '22px' : '32px'}; color: #2c1b4e;">👪 FAMILIA</h3>
                    <p style="font-size: ${isMobile ? '12px' : '18px'}; color: #1a1a2e;">
                        "Por ser mi ejemplo de salir adelante, constantes,<br>siempre con alegría"
                    </p>
                    <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                        ${['ELVIA ROSA', 'BARNEY', 'FABIÁN DAVID', 'FABIÁN ARISTÓBULO', 'JOSÉ ARLEX', 'DARIO', 'JUAN CARLOS', 'LIS DANY', 'PEDRO', 'EDUAR ANTONIO', 'CLAUDIA MILENA'].map(nombre => 
                            `<span style="background: white; padding: ${isMobile ? '5px 12px' : '10px 22px'}; border-radius: 50px; font-size: ${isMobile ? '10px' : '16px'}; border: 1px solid #0e7c5c;">${nombre}</span>`
                        ).join('')}
                    </div>
                </div>

                <!-- AMIGOS -->
                <div style="background: linear-gradient(145deg, #fbc1d0, #ffd9e3); padding: ${isMobile ? '15px' : '25px'}; border-radius: ${isMobile ? '40px' : '80px'}; margin: 10px 0;">
                    <i class="fas fa-heart" style="font-size: ${isMobile ? '30px' : '50px'}; color: #c44569;"></i>
                    <h3 style="font-size: ${isMobile ? '22px' : '32px'}; color: #2c1b4e;">🤝 AMIGOS</h3>
                    <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                        ${['DANIEL ARBOLEDA', 'HERNEY BENAVIDEZ', 'ANGIE RODRÍGUEZ', 'VICTORIA MANRIQUE', 'ANDRÉS TORO', 'ANGELA ROMERO', 'NICOLAS GUTIERREZ', 'MILAGROS RAMIREZ'].map(nombre => 
                            `<span style="background: white; padding: ${isMobile ? '5px 12px' : '12px 25px'}; border-radius: 60px; font-size: ${isMobile ? '10px' : '16px'}; border: 1px solid #c44569;">${nombre}</span>`
                        ).join('')}
                    </div>
                </div>

                <!-- CIERRE -->
                <div style="background: #2c1b4e; padding: ${isMobile ? '15px' : '25px'}; border-radius: ${isMobile ? '40px' : '100px'}; margin: 10px 0;">
                    <p style="color: white; font-size: ${isMobile ? '20px' : '28px'}; font-weight: 700;">¡GRACIAS TOTALES!</p>
                    <p style="color: #f1c40f; font-size: ${isMobile ? '14px' : '20px'};">❤️ Este proyecto es de todos ❤️</p>
                </div>
            </div>
        `,  // ← ESTE CIERRE FALTABA
        width: isMobile ? '95%' : '750px',
        customClass: {
            popup: 'swal-popup-agradecimientos'
        }
    });
}

// Estilo único para este popup
const agradecimientosStyle = document.createElement('style');
agradecimientosStyle.innerHTML = `
    .swal-popup-agradecimientos {
        border-radius: 50px !important;
        border: 4px solid white !important;
        padding: 15px !important;
    }
    
    @media (max-width: 768px) {
        .swal-popup-agradecimientos {
            border-radius: 30px !important;
            padding: 10px !important;
        }
    }
`;
document.head.appendChild(agradecimientosStyle);