// Función central para aplicar los cambios visuales
const applyDOMChanges = () => {
  // 1. Modificación de Precios (Búsqueda por Nodos de Texto para evitar fallos de clases)
  const prices = [
    {old: '$149.000', new: '$74.500'},
    {old: '$289.000', new: '$144.500'},
    {old: '$449.000', new: '$224.500'},
    {old: '$149k', new: '$74.5 mil'}
  ];
  
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  const nodesToReplace = [];
  
  while(node = walker.nextNode()) {
    if (node.parentNode && (node.parentNode.closest('[data-discounted="true"]') || node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE' || node.parentNode.closest('#wa-widget'))) {
      continue;
    }
    for (let p of prices) {
      if(node.nodeValue.includes(p.old)) {
        nodesToReplace.push({node, p});
        break;
      }
    }
  }
  
  nodesToReplace.forEach(({node, p}) => {
    const span = document.createElement('span');
    span.dataset.discounted = "true";
    const displayOld = p.old.replace('k', ' mil');
    span.innerHTML = node.nodeValue.replace(p.old, `<s style="font-size:0.9em; opacity:1; margin-right:6px; color:red; -webkit-text-fill-color:red; font-weight:600; text-decoration-color:black;">${displayOld}</s><span style="font-weight:800;">${p.new}</span>`);
    node.parentNode.replaceChild(span, node);
  });

  // 1.5. Ocultar botón "Hablemos" de la barra superior
  const btns = Array.from(document.querySelectorAll('button'));
  const hablemosBtn = btns.find(btn => btn.textContent.trim().toLowerCase() === 'hablemos');
  if (hablemosBtn) {
    hablemosBtn.style.display = 'none';
  }

  // 1.8. Cambiar colores del Logo "IA" (Bandera Chilena) y ocultar el icono de cerebro
  const logoEl = document.querySelector('.logo');
  if (logoEl && !logoEl.dataset.styled) {
    // Ocultar el icono original de react (cerebro)
    const oldIcon = logoEl.querySelector('svg');
    if (oldIcon) oldIcon.style.display = 'none';

    Array.from(logoEl.childNodes).forEach(n => {
       if (n.nodeType === Node.TEXT_NODE && n.nodeValue.includes('IA Local Chile')) {
         const svgLogo = document.createElement('span');
         svgLogo.innerHTML = '<svg width="150" height="24" viewBox="0 0 150 24" style="vertical-align: middle; margin-bottom: 2px;"><defs><linearGradient id="gradI" x1="0" y1="0" x2="0" y2="1"><stop offset="50%" stop-color="#418cfb"/><stop offset="50%" stop-color="#ff3b30"/></linearGradient><linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1"><stop offset="50%" stop-color="#ffffff"/><stop offset="50%" stop-color="#ff3b30"/></linearGradient></defs><text x="0" y="18" font-family="Inter, sans-serif"><tspan fill="url(#gradI)" font-weight="900" font-size="19">I</tspan><tspan fill="url(#gradA)" font-weight="900" font-size="19">A</tspan><tspan fill="#ffffff" font-weight="700" font-size="19"> Local Chile</tspan></text></svg>';
         logoEl.replaceChild(svgLogo, n);
       }
    });
    logoEl.dataset.styled = "true";
  }

  // 1.9. Ocultar Logo del cerebro e "IA Local Chile" en el footer
  const allSpans = Array.from(document.querySelectorAll('span'));
  const footerSpan = allSpans.find(span => span.textContent.trim() === 'IA Local Chile' && !span.closest('.logo'));
  if (footerSpan && footerSpan.parentElement) {
    footerSpan.parentElement.style.display = 'none';
  }

  // 1.10. Añadir "LOCAL" en dorado al título principal
  const textGradientSpans = Array.from(document.querySelectorAll('span.text-gradient'));
  const iaSpan = textGradientSpans.find(span => span.textContent.includes('Inteligencia Artificial 24/7'));
  if (iaSpan && !iaSpan.dataset.localAdded) {
    iaSpan.innerHTML = 'Inteligencia Artificial 24/7 <span style="-webkit-text-fill-color: gold; color: gold; text-shadow: 0 0 10px rgba(255,215,0,0.5); font-weight: 900; margin-left: 5px;">LOCAL</span>';
    iaSpan.dataset.localAdded = "true";
  }

  // 2. Modificación del Botón Nativo de WhatsApp (Instantáneo)
  const waNative = Array.from(document.querySelectorAll('a[href*="wa.me"]')).find(el => el.id !== 'wa-link-btn');
  if (waNative) {
    if (!waNative.dataset.iconChanged) {
      const svg = waNative.querySelector('svg');
      if(svg) {
        svg.outerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.337a9.99 9.99 0 004.779 1.206h.004c5.505 0 9.988-4.478 9.989-9.984 0-5.508-4.484-9.985-9.993-9.985zm0 18.312h-.003a8.318 8.318 0 01-4.24-1.155l-.304-.18-3.147.804.84-3.006-.197-.313A8.32 8.32 0 013.685 11.98c.001-4.582 3.738-8.315 8.33-8.315 4.588 0 8.321 3.734 8.321 8.315 0 4.585-3.736 8.332-8.324 8.332zm4.568-6.223c-.25-.125-1.482-.731-1.713-.815-.23-.083-.399-.125-.568.125-.168.25-.646.815-.791.981-.146.166-.293.187-.543.062-1.071-.537-2.072-1.055-2.852-2.164-.202-.288.203-.271.691-1.242.083-.166.042-.312-.021-.437-.063-.125-.568-1.371-.778-1.877-.204-.492-.41-.425-.568-.433-.146-.008-.313-.008-.48-.008s-.438.062-.667.312c-.23.25-.876.856-.876 2.087s.897 2.422 1.022 2.589c.125.166 1.767 2.697 4.28 3.782 1.341.579 1.956.634 2.68.531.815-.116 2.428-.992 2.766-1.952.338-.96.338-1.783.237-1.952-.101-.166-.37-.271-.62-.396z"/></svg>';
      }
      waNative.dataset.iconChanged = "true";
    }
    
    // Clonar dimensiones y posición vertical
    const rect = waNative.getBoundingClientRect();
    if (rect.height > 0) {
       const viewportHeight = window.innerHeight;
       const waBottom = viewportHeight - rect.bottom;
       document.getElementById('wa-widget').style.bottom = waBottom + "px";
       const miWidget = document.getElementById('wa-btn');
       if(miWidget) {
         miWidget.style.width = rect.width + "px";
         miWidget.style.height = rect.height + "px";
       }
    }
  }
};

// Ejecutar inmediatamente por si ya está renderizado
applyDOMChanges();

// Usar MutationObserver para capturar el renderizado exacto de React (0 milisegundos de retraso)
const observer = new MutationObserver((mutations) => {
  applyDOMChanges();
});

observer.observe(document.body, { childList: true, subtree: true });

// --- LOGICA DEL CHAT INTERACTIVO (CON IA LOCAL) ---
let msgCount = 0;
const MAX_MESSAGES = 6; // Sistema Anti-Spam / Derivador de Ventas
const CLOUDFLARE_TUNNEL_URL = "https://quarterly-cambridge-raw-maternity.trycloudflare.com"; 

let chatHistory = JSON.parse(sessionStorage.getItem('wa_chat_history')) || [];

function renderHistory() {
  const chatMessages = document.getElementById('chat-messages');
  if(!chatMessages) return;
  
  chatMessages.innerHTML = `
    <div style="align-self: flex-start; background: white; border: 1px solid #eee; padding: 12px; border-radius: 12px; border-bottom-left-radius: 2px; max-width: 85%; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
      ¡Hola! 👋 Soy el Agente Virtual de <strong>IA Local Chile</strong>.<br><br>¿En qué rubro opera tu empresa para mostrarte cómo nuestra Inteligencia Artificial puede ahorrarte tiempo y escalar tus ventas?
    </div>
  `;

  if (chatHistory.length === 0) {
    // Mostrar chips de preguntas sugeridas
    chatMessages.innerHTML += `
      <div id="chat-chips" style="display: flex; flex-direction: column; gap: 6px; padding: 5px 0;">
        <button onclick="enviarMensaje('¿Cuánto cuesta?')" style="background: white; border: 1px solid #0055FF; color: #0055FF; padding: 8px 12px; border-radius: 16px; cursor: pointer; text-align: left; font-size: 13.5px; transition: all 0.2s;">¿Cuánto cuesta?</button>
        <button onclick="enviarMensaje('¿Cómo funciona la IA?')" style="background: white; border: 1px solid #0055FF; color: #0055FF; padding: 8px 12px; border-radius: 16px; cursor: pointer; text-align: left; font-size: 13.5px; transition: all 0.2s;">¿Cómo funciona la IA?</button>
        <button onclick="enviarMensaje('Agendar reunión')" style="background: white; border: 1px solid #0055FF; color: #0055FF; padding: 8px 12px; border-radius: 16px; cursor: pointer; text-align: left; font-size: 13.5px; transition: all 0.2s;">Agendar reunión</button>
      </div>
    `;
  }

  chatHistory.forEach(msg => {
    if(msg.role === 'user') {
      chatMessages.innerHTML += `
        <div style="align-self: flex-end; background: #E1F5FE; border: 1px solid #B3E5FC; padding: 12px; border-radius: 12px; border-bottom-right-radius: 2px; max-width: 85%; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          ${msg.content}
        </div>
      `;
      msgCount++;
    } else if(msg.role === 'ai') {
      chatMessages.innerHTML += `
        <div style="align-self: flex-start; background: white; border: 1px solid #eee; padding: 12px; border-radius: 12px; border-bottom-left-radius: 2px; max-width: 85%; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          ${msg.content.replace(/\n/g, '<br>')}
        </div>
      `;
    }
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Renderizar historial al cargar
document.addEventListener('DOMContentLoaded', () => {
  renderHistory();
});
// En caso de que el script se cargue tarde, renderizar inmediatamente
renderHistory();

// Hacer la función global para los onclick handlers
window.enviarMensaje = async function(textOverride = null) {
  const input = document.getElementById('chat-input');
  if(!input) return;
  const text = textOverride !== null ? textOverride : input.value.trim();
  if(!text) return;

  // Limpiar input y sumar contador
  input.value = '';
  msgCount++;

  // Guardar en historial
  chatHistory.push({ role: 'user', content: text });
  sessionStorage.setItem('wa_chat_history', JSON.stringify(chatHistory));

  const chatMessages = document.getElementById('chat-messages');

  // Eliminar chips si existen
  const chips = document.getElementById('chat-chips');
  if(chips) chips.remove();

  // Renderizar mensaje del usuario
  chatMessages.innerHTML += `
    <div style="align-self: flex-end; background: #E1F5FE; border: 1px solid #B3E5FC; padding: 12px; border-radius: 12px; border-bottom-right-radius: 2px; max-width: 85%; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
      ${text}
    </div>
  `;
  chatMessages.scrollTop = chatMessages.scrollHeight;



  // Renderizar indicador de "Escribiendo..."
  const typingId = 'typing-' + Date.now();
  chatMessages.innerHTML += `
    <div id="${typingId}" style="align-self: flex-start; background: white; border: 1px solid #eee; padding: 12px; border-radius: 12px; border-bottom-left-radius: 2px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); color: #888; font-style: italic;">
      Escribiendo...
    </div>
  `;
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    // Preparar historial para la IA (Sin memoria profunda para evitar trabas del modelo)
    const systemPrompt = "Eres el experto agente comercial B2B de IA Local Chile. Tu tono es ejecutivo, seguro, resolutivo y profesional.\n\nNUESTROS SERVICIOS:\n- Agentes Virtuales de IA (como tú)\n- Automatización B2B para WhatsApp\n- Diseño y Desarrollo Web Avanzado\n- Community Manager Asistido por IA\n\nNUESTROS PRECIOS (con 50% descuento ya aplicado):\n- Plan Básico: $74.500 CLP /mes\n- Plan Pro: $144.500 CLP /mes\n- Plan Élite: $224.500 CLP /mes\n\nTUS REGLAS:\n1. NUNCA uses emojis ni emoticonos.\n2. Sé muy breve y conciso (máximo 2 oraciones por mensaje).\n3. Si el cliente pregunta algo trivial, reconduce amablemente hacia nuestros servicios digitales.\n4. Si notas que el cliente ya interactuó varias veces, aliéntalo a continuar con nuestro Especialista Humano por WhatsApp para hacer efectiva la promoción.\n5. Haz preguntas orientadas a conocer el modelo de negocio del cliente para venderles la solución.";

    const apiMessages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: text }
    ];

    const response = await fetch(CLOUDFLARE_TUNNEL_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true'
      },
      body: JSON.stringify({
        model: "llama3.1",
        messages: apiMessages,
        stream: false
      })
    });
    const data = await response.json();
    const botResponse = data.message ? data.message.content : (data.error || "Respuesta vacía");

    chatHistory.push({ role: 'ai', content: botResponse });
    sessionStorage.setItem('wa_chat_history', JSON.stringify(chatHistory));

    document.getElementById(typingId).remove();
    chatMessages.innerHTML += `
      <div style="align-self: flex-start; background: white; border: 1px solid #eee; padding: 12px; border-radius: 12px; border-bottom-left-radius: 2px; max-width: 85%; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
        ${botResponse.replace(/\n/g, '<br>')}
      </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Comprobar Derivación Anti-Spam después de responder la última pregunta
    if (msgCount >= MAX_MESSAGES) {
      setTimeout(() => {
        chatMessages.innerHTML += `
          <div style="align-self: flex-start; background: white; border: 1px solid #eee; padding: 12px; border-radius: 12px; border-bottom-left-radius: 2px; max-width: 85%; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            Como esto requiere un análisis detallado para activar tu <strong>50% de descuento</strong>, un Especialista en Transformación Digital continuará tu caso. Por favor, haz clic abajo para conectar por WhatsApp.
          </div>
        `;
        chatMessages.scrollTop = chatMessages.scrollHeight;
        document.getElementById('wa-link-btn').style.display = 'block';
        document.getElementById('chat-input').disabled = true;
        document.getElementById('chat-input').placeholder = "Conversación derivada a especialista";
      }, 1500);
    }

  } catch (error) {
    console.error("Fetch Error:", error);
    document.getElementById(typingId).remove();
    chatMessages.innerHTML += `
      <div style="align-self: flex-start; background: #FFEBEE; border: 1px solid #FFCDD2; padding: 12px; border-radius: 12px; border-bottom-left-radius: 2px; max-width: 85%;">
        Hubo un error de conexión con la red local. Por favor háblanos por WhatsApp.
      </div>
    `;
    document.getElementById('wa-link-btn').style.display = 'block';
  }
};
