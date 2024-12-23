function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('load', setVH);
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', setVH);

// Función para manejar la copia al portapapeles
function setupCopyHandlers() {
    const valueContainers = document.querySelectorAll('.value-container');
    
    valueContainers.forEach(container => {
        // Manejar tanto click como touch
        ['click', 'touchend'].forEach(eventType => {
            container.addEventListener(eventType, async function(e) {
                e.preventDefault(); // Prevenir comportamiento por defecto
                const textToCopy = this.getAttribute('data-copy');
                
                try {
                    // Intentar usar el API de clipboard
                    await navigator.clipboard.writeText(textToCopy);
                    showCopyFeedback(this);
                } catch (err) {
                    // Fallback para iOS
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    document.body.appendChild(textArea);
                    textArea.select();
                    
                    try {
                        document.execCommand('copy');
                        showCopyFeedback(this);
                    } catch (err) {
                        console.error('Error al copiar:', err);
                    } finally {
                        document.body.removeChild(textArea);
                    }
                }
            });
        });
    });
}

function showCopyFeedback(element) {
    element.classList.add('copied');
    const value = element.querySelector('.value');
    const originalText = value.textContent;
    value.textContent = 'Copied!';
    
    setTimeout(() => {
        element.classList.remove('copied');
        value.textContent = originalText;
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
    setVH();
    setupCopyHandlers();
    
    // Función para verificar el estado del servidor
    async function checkServerStatus() {
        const statusElement = document.getElementById('server-status');
        const statusText = document.getElementById('status-text');
        const playerCount = document.getElementById('player-count');

        try {
            // Usando la API de mcsrvstat.us que es más confiable
            const response = await fetch('https://api.mcsrvstat.us/2/slaydernetwork.ddns.net:25502');
            const data = await response.json();

            if (data.online) {
                statusElement.className = 'online';
                statusText.textContent = 'Online';
                playerCount.textContent = `${data.players.online}/${data.players.max}`;
            } else {
                statusElement.className = 'offline';
                statusText.textContent = 'Offline';
                playerCount.textContent = '0/0';
            }
        } catch (error) {
            statusElement.className = 'offline';
            statusText.textContent = 'Error checking status';
            playerCount.textContent = '-/-';
            console.error('Error checking server status:', error);
        }
    }

    // Verificar el estado cada 30 segundos
    checkServerStatus();
    setInterval(checkServerStatus, 30000);
}); 