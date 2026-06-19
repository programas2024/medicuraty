const botMessages = document.getElementById('botMessages');
const botForm = document.getElementById('botForm');
const botInput = document.getElementById('botInput');
const botMic = document.getElementById('botMic');
const btnClearChat = document.getElementById('btnClearChat');
const suggestionsContainer = document.getElementById('suggestionsContainer');
const tabButtons = document.querySelectorAll('.tab-btn');

// Efectos de sonido
const messageSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3');
messageSound.volume = 0.15;

const respuestas = [
    {
        claves: ['registro', 'registrar', 'registrarme', 'crear cuenta', 'cuenta nueva', 'unirme'],
        texto: 'Para registrarte, entra a Inicio y toca el icono de usuario o ve directo a login.html. Alli puedes cambiar al formulario de registro, escribir tu correo, crear una contrasena y completar tus datos. Si el sistema pide confirmacion, revisa tu correo antes de iniciar sesion.'
    },
    {
        claves: ['iniciar sesion', 'inicio sesion', 'login', 'entrar', 'correo', 'contrasena', 'contraseña'],
        texto: 'Para iniciar sesion, abre login.html desde el boton de usuario. Escribe tu correo y contrasena. Cuando entres, la pagina te lleva a la experiencia principal, donde aparecen perfil, logros, buzon, opiniones y mas funciones de comunidad.'
    },
    {
        claves: ['galeria', 'imagenes', 'foto', 'publicacion', 'publicaciones', 'destacados', 'recientes', 'valorado', 'valorados'],
        texto: 'La galeria es la zona visual de Medicurativo. Tiene Galeria completa, Destacados, Recientes y Mas Valorado. Al tocar una imagen se abre en grande, muestra su posicion de popularidad y el boton de apoyo con corazon.'
    },
    {
        claves: ['like', 'apoyar', 'corazon', 'me gusta', 'publicacion', 'apoyo'],
        texto: 'El corazon sirve para apoyar una publicacion de la galeria. En galeria2, si no tienes cuenta, aparece el aviso para crearla. Con cuenta iniciada, tu apoyo se guarda y ayuda a ordenar la seccion Mas Valorado.'
    },
    {
        claves: ['gracias', 'agradecimientos', 'agradecer'],
        texto: 'El boton Gracias abre un mensaje de agradecimientos. Es una parte emocional de la pagina: reconoce a quienes visitan, apoyan, leen, comparten y ayudan a que Medicurativo siga creciendo.'
    },
    {
        claves: ['mision', 'objetivo', 'proposito', 'propósito'],
        texto: 'La Mision explica el proposito de Medicurativo: ayudarte a crecer como persona con temas, reflexiones e ideas que invitan a pensar, mejorar y encontrar un momento de calma.'
    },
    {
        claves: ['soporte', 'ayuda', 'problema', 'error', 'gmail', 'whatsapp', 'contacto'],
        texto: 'En Soporte puedes escribir por Gmail, WhatsApp o entrar aqui con Bot Medi. Para recibir mejor ayuda, cuenta que pagina estabas usando, que intentabas hacer, que paso y si puedes agrega una captura.'
    },
    {
        claves: ['perfil', 'nombre', 'genero', 'género', 'usuario', 'personalizar'],
        texto: 'El Perfil aparece cuando inicias sesion. Desde alli puedes editar tu nombre, definir tu genero, cambiar contrasena, ver tu calificacion, revisar logros y cerrar sesion.'
    },
    {
        claves: ['logro', 'logros', 'trofeo', 'trofeos'],
        texto: 'Los logros son reconocimientos dentro de la cuenta. Por ejemplo, puedes desbloquearlos al personalizar tu perfil, cambiar tu nombre o definir tu genero.'
    },
    {
        claves: ['calificar', 'calificacion', 'calificación', 'estrella', 'estrellas', 'opiniones', 'opinion', 'opinión'],
        texto: 'La calificacion permite dejar estrellas y ayudar a mejorar la pagina. Tambien puedes ver opiniones de otros usuarios. Para calificar necesitas una cuenta.'
    },
    {
        claves: ['buzon', 'buzón', 'novedades', 'actualizaciones', 'manual'],
        texto: 'El buzon muestra novedades, bienvenida e instrucciones de uso. Si no tienes cuenta, puede invitarte a registrarte; si tienes cuenta, guarda lo que ya viste.'
    },
    {
        claves: ['categoria', 'categorias', 'categoría', 'valores', 'crecimiento', 'emociones', 'liderazgo', 'especiales'],
        texto: 'Las categorias organizan el contenido principal: Valores, Crecimiento, Emociones, Liderazgo, Especiales y Galeria. En movil se abren desde el menu de categorias.'
    },
    {
        claves: ['oscuro', 'modo oscuro', 'luna', 'tema'],
        texto: 'El boton de luna activa el modo oscuro. Sirve para leer con menos brillo y cambiar la apariencia de la pagina cuando prefieres un fondo mas suave para la vista.'
    },
    {
        claves: ['compartir', 'whatsapp', 'enviar'],
        texto: 'Puedes compartir reflexiones por WhatsApp desde los botones de compartir. La pagina prepara un mensaje con el tema o la imagen para que lo envies facilmente.'
    },
    {
        claves: ['recuperar', 'restablecer', 'olvide', 'olvidé', 'clave', 'password'],
        texto: 'Si olvidaste tu contrasena, usa la opcion de recuperacion en login o entra a restablecer.html. Alli puedes seguir el proceso para actualizar tu acceso.'
    },
    {
        claves: ['salir', 'cerrar sesion', 'cerrar sesión', 'logout'],
        texto: 'Para cerrar sesion, entra a tu Perfil y busca la seccion de sesion. Alli esta el boton Cerrar Sesion, que te devuelve al inicio.'
    },
    {
        claves: ['trata', 'medicurativo', 'pagina', 'que es', 'qué es'],
        texto: 'Medicurativo es un espacio digital para crecimiento personal, reflexion y calma. Reune temas sobre valores, emociones, liderazgo, fechas especiales y una galeria visual para inspirarte.'
    }
];

const respuestasRapidas = [
    'Tambien puedo explicarte como registrarte, iniciar sesion, usar el perfil, apoyar publicaciones, ver opiniones o contactar soporte.',
    'Si me preguntas por un boton especifico, te digo para que sirve y donde encontrarlo.',
    'Puedo orientarte por secciones: Inicio, Galeria, Perfil, Buzon, Mision, Gracias, Soporte y Login.'
];

const sugerenciasPorCategoria = {
    general: [
        { label: "¿De qué trata Medicurativo?", question: "De que trata Medicurativo" },
        { label: "Misión de Medicurativo", question: "mision" },
        { label: "¿Para qué sirve el botón Gracias?", question: "Para que sirve Gracias" },
        { label: "Necesito soporte", question: "Necesito soporte" }
    ],
    cuenta: [
        { label: "¿Cómo registrarme?", question: "Como registrarme" },
        { label: "¿Cómo iniciar sesión?", question: "Como iniciar sesion" },
        { label: "Mi perfil", question: "perfil" },
        { label: "¿Qué son los logros?", question: "logros" },
        { label: "Recuperar clave", question: "recuperar" }
    ],
    funciones: [
        { label: "¿Cómo uso la galería?", question: "Como uso la galeria" },
        { label: "Me gusta / Likes", question: "like" },
        { label: "Calificar la página", question: "calificar" },
        { label: "Modo Oscuro", question: "modo oscuro" },
        { label: "Compartir reflexiones", question: "compartir" }
    ]
};

// TTS: Síntesis de voz
let currentUtterance = null;
function hablarTexto(texto, btn) {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        if (btn.classList.contains('speaking')) {
            btn.classList.remove('speaking');
            return;
        }
    }

    document.querySelectorAll('.btn-tts.speaking').forEach(b => b.classList.remove('speaking'));

    currentUtterance = new SpeechSynthesisUtterance(texto);
    currentUtterance.lang = 'es-ES';
    
    currentUtterance.onstart = () => {
        btn.classList.add('speaking');
    };

    currentUtterance.onend = () => {
        btn.classList.remove('speaking');
    };

    currentUtterance.onerror = () => {
        btn.classList.remove('speaking');
    };

    window.speechSynthesis.speak(currentUtterance);
}

// Agregar mensaje al contenedor
function agregarMensaje(texto, tipo = 'bot', guardar = true) {
    const fila = document.createElement('div');
    fila.className = `message-row ${tipo}`;

    if (tipo === 'bot') {
        const avatar = document.createElement('img');
        avatar.className = 'message-avatar';
        avatar.src = 'imganes/logosmedi.png';
        avatar.alt = 'Bot Medi';
        fila.appendChild(avatar);
    }

    const burbuja = document.createElement('div');
    burbuja.className = 'message-bubble';
    burbuja.textContent = texto;
    fila.appendChild(burbuja);

    if (tipo === 'bot') {
        // Botón de texto a voz
        const ttsBtn = document.createElement('button');
        ttsBtn.className = 'btn-tts';
        ttsBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        ttsBtn.title = 'Escuchar respuesta';
        ttsBtn.addEventListener('click', () => hablarTexto(texto, ttsBtn));
        fila.appendChild(ttsBtn);

        // Sonido suave de notificación
        messageSound.play().catch(e => console.log('Sonido bloqueado por política del navegador:', e));
    }

    if (tipo === 'user') {
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-user"></i>';
        fila.appendChild(avatar);
    }

    botMessages.appendChild(fila);
    botMessages.scrollTop = botMessages.scrollHeight;

    if (guardar) {
        const chatHistory = JSON.parse(localStorage.getItem('medicurativo_chat') || '[]');
        chatHistory.push({ texto, tipo });
        localStorage.setItem('medicurativo_chat', JSON.stringify(chatHistory));
    }
}

let typingIndicator = null;

function mostrarIndicador() {
    if (typingIndicator) return;

    const fila = document.createElement('div');
    fila.className = 'message-row bot typing-indicator-row';

    const avatar = document.createElement('img');
    avatar.className = 'message-avatar';
    avatar.src = 'imganes/logosmedi.png';
    avatar.alt = 'Bot Medi';
    fila.appendChild(avatar);

    const burbuja = document.createElement('div');
    burbuja.className = 'message-bubble typing-bubble';
    burbuja.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    fila.appendChild(burbuja);

    botMessages.appendChild(fila);
    botMessages.scrollTop = botMessages.scrollHeight;
    typingIndicator = fila;
}

function ocultarIndicador() {
    if (typingIndicator) {
        typingIndicator.remove();
        typingIndicator = null;
    }
}

function responder(pregunta) {
    const normalizada = normalizar(pregunta);
    const encontrada = respuestas.find(item => item.claves.some(clave => normalizada.includes(normalizar(clave))));
    const texto = encontrada
        ? encontrada.texto
        : `No tengo una respuesta exacta todavía, pero conozco la página Medicurativo y puedo guiarte. ${respuestasRapidas[Math.floor(Math.random() * respuestasRapidas.length)]}`;

    mostrarIndicador();
    
    // Retraso dinámico simulando tiempo de escritura humana (1.2 a 2.5 segundos)
    const delay = Math.max(1200, Math.min(2500, texto.length * 8));

    setTimeout(() => {
        ocultarIndicador();
        agregarMensaje(texto);
    }, delay);
}

function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9ñ\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function enviarPregunta(pregunta) {
    const texto = pregunta.trim();
    if (!texto) return;
    agregarMensaje(texto, 'user');
    botInput.value = '';
    responder(texto);
}

// Cargar sugerencias por categoría
function cargarSugerencias(categoria) {
    suggestionsContainer.innerHTML = '';
    const lista = sugerenciasPorCategoria[categoria] || [];
    lista.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'bot-suggestion';
        btn.textContent = item.label;
        btn.dataset.question = item.question;
        btn.addEventListener('click', () => enviarPregunta(item.question));
        suggestionsContainer.appendChild(btn);
    });
}

// Historial: Cargar chat guardado
function cargarHistorial() {
    const chatHistory = JSON.parse(localStorage.getItem('medicurativo_chat') || '[]');
    if (chatHistory.length > 0) {
        chatHistory.forEach(msg => {
            agregarMensaje(msg.texto, msg.tipo, false);
        });
    } else {
        // Carga animada del saludo de bienvenida inicial si no hay historial
        setTimeout(() => {
            mostrarIndicador();
            setTimeout(() => {
                ocultarIndicador();
                agregarMensaje('Hola, soy Bot Medi. Conozco las secciones principales de Medicurativo: registro, inicio de sesion, galeria, likes, perfil, logros, buzon, opiniones, mision, gracias y soporte. Preguntame lo que necesites.');
            }, 1500);
        }, 300);
    }
}

// Inicialización de escuchas
botForm.addEventListener('submit', (event) => {
    event.preventDefault();
    enviarPregunta(botInput.value);
});

// Pestañas de sugerencias
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        cargarSugerencias(btn.dataset.category);
    });
});

// Limpiar chat
if (btnClearChat) {
    btnClearChat.addEventListener('click', () => {
        Swal.fire({
            title: '¿Limpiar conversación?',
            text: "Se borrará todo el historial de este chat.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#9b59b6',
            cancelButtonColor: '#95a5a6',
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'Cancelar',
            background: document.body.classList.contains('dark-mode') ? '#19143c' : '#ffffff',
            color: document.body.classList.contains('dark-mode') ? '#ffffff' : '#2c1b4e'
        }).then((result) => {
            if (result.isConfirmed) {
                // Cancelar cualquier audio en reproducción
                if (window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                }
                localStorage.removeItem('medicurativo_chat');
                botMessages.innerHTML = '';
                // Mostrar bienvenida nuevamente
                mostrarIndicador();
                setTimeout(() => {
                    ocultarIndicador();
                    agregarMensaje('Hola, soy Bot Medi. Conozco las secciones principales de Medicurativo: registro, inicio de sesion, galeria, likes, perfil, logros, buzon, opiniones, mision, gracias y soporte. Preguntame lo que necesites.');
                }, 1200);
            }
        });
    });
}

// STT: Grabación por voz (Micrófono)
if (botMic) {
    let recognition = null;
    let isListening = false;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            isListening = true;
            botMic.classList.add('listening');
            botInput.placeholder = "Escuchando...";
        };

        recognition.onresult = (event) => {
            const resultText = event.results[0][0].transcript;
            botInput.value = resultText;
        };

        recognition.onend = () => {
            isListening = false;
            botMic.classList.remove('listening');
            botInput.placeholder = "Escribe tu pregunta...";
            if (botInput.value.trim() !== '') {
                setTimeout(() => enviarPregunta(botInput.value), 400);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            isListening = false;
            botMic.classList.remove('listening');
            botInput.placeholder = "Escribe tu pregunta...";
            Swal.fire({
                icon: 'error',
                title: 'Error de reconocimiento',
                text: 'No pudimos reconocer tu voz. Revisa los permisos de tu micrófono.',
                timer: 3000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        };

        botMic.addEventListener('click', () => {
            if (isListening) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });
    } else {
        botMic.style.display = 'none';
    }
}

// Carga Inicial
cargarSugerencias('general');
cargarHistorial();