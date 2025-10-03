// Variables globales para almacenar las materias que voy a cursar
let materiasACursar = [];

// Inicializar la interfaz de selección de materias
function inicializarInterfazMaterias() {
    const materiasContainer = document.getElementById('materiasContainer');
    
    MATERIAS_CONFIG.forEach(materia => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'materia-checkbox';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `materia-${materia.id}`;
        checkbox.value = materia.id;
        
        const label = document.createElement('label');
        label.htmlFor = `materia-${materia.id}`;
        label.textContent = materia.nombre;
        
        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(label);
        materiasContainer.appendChild(checkboxDiv);
        
        // Agregar evento para cambiar estilo al seleccionar
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                checkboxDiv.classList.add('selected');
            } else {
                checkboxDiv.classList.remove('selected');
            }
        });
    });
}

// Actualizar las materias que voy a cursar
function actualizarMateriasSeleccionadas() {
    const checkboxes = document.querySelectorAll('#materiasContainer input[type="checkbox"]:checked');
    const materiasSeleccionadas = Array.from(checkboxes).map(checkbox => checkbox.value);
    
    // Limpiar la lista actual
    materiasACursar = [];
    
    if (materiasSeleccionadas.length === 0) {
        actualizarMateriasCursando();
        return;
    }
    
    // Verificar cada materia seleccionada usando una función recursiva
    verificarMateria(0, materiasSeleccionadas);
}

// Función recursiva para verificar materias una por una
function verificarMateria(index, materiasSeleccionadas) {
    if (index >= materiasSeleccionadas.length) {
        // Todas las materias verificadas, actualizar la interfaz
        actualizarMateriasCursando();
        return;
    }
    
    const materia = materiasSeleccionadas[index];
    const goal = `puede_tomar(fredier, ${materia}).`;
    
    session.query(goal);
    session.answer({
        success: function(answer) {
            // La materia está disponible, agregarla a la lista
            materiasACursar.push(materia);
            console.log(`✅ ${materia} agregada correctamente`);
            
            // Verificar la siguiente materia
            verificarMateria(index + 1, materiasSeleccionadas);
        },
        fail: function() {
            // La materia no está disponible
            alert(`❌ No puedes tomar ${NOMBRES_CURSOS[materia] || materia}. Verifica los requisitos.`);
            console.log(`❌ ${materia} no disponible`);
            
            // Verificar la siguiente materia
            verificarMateria(index + 1, materiasSeleccionadas);
        },
        error: function(err) {
            console.error(`Error verificando ${materia}:`, err);
            // Continuar con la siguiente materia incluso si hay error
            verificarMateria(index + 1, materiasSeleccionadas);
        }
    });
}

// Actualizar la lista de materias que voy a cursar
function actualizarMateriasCursando() {
    const listaMateriasCursando = document.getElementById('listaMateriasCursando');
    listaMateriasCursando.innerHTML = '';
    
    if (materiasACursar.length === 0) {
        listaMateriasCursando.innerHTML = `
            <li class="empty-state">
                <i class="fas fa-inbox"></i>
                <div>No has seleccionado materias para cursar</div>
            </li>`;
    } else {
        materiasACursar.forEach(materia => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-book"></i> ${NOMBRES_CURSOS[materia] || materia}`;
            listaMateriasCursando.appendChild(li);
        });
        
        console.log('Lista actualizada:', materiasACursar);
    }
}

// Función para consultar cursos disponibles
function consultarCursosDisponibles() {
    const goal = "cursos_disponibles(fredier, Cursos).";
    session.query(goal);
    session.answer({
        success: function(answer) {
            const cursos = session.format_answer(answer);
            const cursosArray = cursos.match(/\[(.*?)\]/);
            if (cursosArray && cursosArray[1]) {
                const listaCursos = cursosArray[1].split(',').map(curso => curso.trim());
                
                mostrarResultado('cursosDisponibles', 
                    listaCursos.length > 0 ? 
                    `<ul class="course-list">${
                        listaCursos.map(curso => {
                            const nombre = NOMBRES_CURSOS[curso] || curso;
                            return `<li><i class="fas fa-check-circle"></i> ${nombre} <span class="status-badge status-available">Disponible</span></li>`;
                        }).join('')
                    }</ul>` :
                    '<div class="empty-state"><i class="fas fa-info-circle"></i><div>No hay cursos disponibles para tomar en este momento.</div></div>');
            } else {
                mostrarResultado('cursosDisponibles', '<div class="empty-state"><i class="fas fa-info-circle"></i><div>No hay cursos disponibles para tomar en este momento.</div></div>');
            }
        },
        error: function() {
            mostrarResultado('cursosDisponibles', '<div class="error">Error en la consulta.</div>');
        },
        fail: function() {
            mostrarResultado('cursosDisponibles', '<div class="empty-state"><i class="fas fa-info-circle"></i><div>No hay cursos disponibles para tomar.</div></div>');
        }
    });
}

// Función para consultar cursos pendientes
function consultarCursosPendientes() {
    const goal = "faltan_aprobar(fredier, Cursos).";
    session.query(goal);
    session.answer({
        success: function(answer) {
            const cursos = session.format_answer(answer);
            const cursosArray = cursos.match(/\[(.*?)\]/);
            if (cursosArray && cursosArray[1]) {
                const listaCursos = cursosArray[1].split(',').map(curso => curso.trim());
                
                mostrarResultado('cursosPendientes', 
                    `<ul class="course-list">${
                        listaCursos.map(curso => {
                            const nombre = NOMBRES_CURSOS[curso] || curso;
                            return `<li><i class="fas fa-clock"></i> ${nombre} <span class="status-badge status-pending">Pendiente</span></li>`;
                        }).join('')
                    }</ul>`);
            }
        },
        error: function() {
            mostrarResultado('cursosPendientes', '<div class="error">Error en la consulta.</div>');
        },
        fail: function() {
            mostrarResultado('cursosPendientes', '<div class="empty-state"><i class="fas fa-info-circle"></i><div>No se pudieron obtener los cursos pendientes.</div></div>');
        }
    });
}

// Función para verificar un curso específico
function verificarCurso() {
    const curso = document.getElementById('cursoSelect').value;
    const nombreCurso = NOMBRES_CURSOS[curso] || curso;
    
    const goal = `puede_tomar(fredier, ${curso}).`;
    
    session.query(goal);
    session.answer({
        success: function(answer) {
            mostrarResultado('verificacionCurso', 
                `<div class="success"><i class="fas fa-check-circle"></i> <strong>${nombreCurso}</strong>: ✅ SÍ puede tomar este curso</div>`);
        },
        fail: function() {
            session.query(`aprobado(fredier, ${curso}).`);
            session.answer({
                success: function() {
                    mostrarResultado('verificacionCurso', 
                        `<div class="error"><i class="fas fa-times-circle"></i> <strong>${nombreCurso}</strong>: ❌ NO puede tomar este curso (ya está aprobado)</div>`);
                },
                fail: function() {
                    mostrarResultado('verificacionCurso', 
                        `<div class="error"><i class="fas fa-times-circle"></i> <strong>${nombreCurso}</strong>: ❌ NO puede tomar este curso (no cumple requisitos)</div>`);
                }
            });
        },
        error: function() {
            mostrarResultado('verificacionCurso', '<div class="error">Error en la consulta.</div>');
        }
    });
}

// Función para mostrar cursos aprobados
function mostrarCursosAprobados() {
    const goal = "aprobado(fredier, Curso).";
    let cursosAprobados = [];
    
    session.query(goal);
    session.answer({
        success: function(answer) {
            const curso = answer.links.Curso;
            if (curso) {
                cursosAprobados.push(curso.id);
            }
            // Buscar más respuestas
            session.answer({
                success: arguments.callee,
                fail: function() {
                    mostrarResultado('cursosAprobados', 
                        cursosAprobados.length > 0 ? 
                        `<ul class="course-list">${
                            cursosAprobados.map(curso => {
                                const nombre = NOMBRES_CURSOS[curso] || curso;
                                return `<li><i class="fas fa-star"></i> ${nombre} <span class="status-badge status-completed">Aprobado</span></li>`;
                            }).join('')
                        }</ul>` :
                        '<div class="empty-state"><i class="fas fa-info-circle"></i><div>No hay cursos aprobados.</div></div>');
                }
            });
        },
        fail: function() {
            mostrarResultado('cursosAprobados', 
                cursosAprobados.length > 0 ? 
                `<ul class="course-list">${
                    cursosAprobados.map(curso => {
                        const nombre = NOMBRES_CURSOS[curso] || curso;
                        return `<li><i class="fas fa-star"></i> ${nombre} <span class="status-badge status-completed">Aprobado</span></li>`;
                    }).join('')
                }</ul>` :
                '<div class="empty-state"><i class="fas fa-info-circle"></i><div>No hay cursos aprobados.</div></div>');
        }
    });
}

// Función auxiliar para mostrar resultados
function mostrarResultado(elementId, contenido) {
    document.getElementById(elementId).innerHTML = contenido;
}