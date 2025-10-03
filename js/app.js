// Variable global para la sesión de Prolog
let session;

// Inicializar la aplicación
function inicializarAplicacion() {
    // Crear sesión de Prolog
    session = pl.create();
    
    // Cargar base de conocimiento
    session.consult(PROLOG_RULES, {
        success: function() {
            console.log("Base de conocimiento cargada correctamente");
            inicializarInterfazMaterias();
        },
        error: function(err) {
            console.error("Error cargando la base de conocimiento:", err);
            mostrarErrorGlobal("Error al cargar la base de conocimiento");
        }
    });
}

// Mostrar error global en la aplicación
function mostrarErrorGlobal(mensaje) {
    const container = document.querySelector('.container');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-global';
    errorDiv.innerHTML = `
        <div class="card" style="background-color: #f8d7da; border-color: #f5c6cb;">
            <div class="card-header">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error</h3>
            </div>
            <p>${mensaje}</p>
        </div>
    `;
    container.insertBefore(errorDiv, container.firstChild);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarAplicacion();
});

// Estilos adicionales para errores globales
const estiloErrorGlobal = document.createElement('style');
estiloErrorGlobal.textContent = `
    .error-global {
        margin-bottom: 20px;
    }
    .error-global .card {
        animation: shake 0.5s ease-in-out;
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(estiloErrorGlobal);