// Manejo del viewport para móviles
function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Ejecutar al cargar
setVH();

// Ejecutar al cambiar el tamaño o la orientación
window.addEventListener('resize', () => {
    setVH();
});

window.addEventListener('orientationchange', () => {
    setVH();
});

// Retraso adicional para dispositivos iOS
setTimeout(setVH, 100); 