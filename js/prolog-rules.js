// Base de conocimiento Prolog
const PROLOG_RULES = `
    % Base de conocimiento – 
    % Alumno: fredier

    % Cursos disponibles
    curso(programacion1).
    curso(programacion2).
    curso(basedatos1).
    curso(basedatos2).
    curso(ensamblador1).
    curso(ensamblador2).

    % Requisitos de aprobación
    requiere(programacion2, [programacion1]).
    requiere(programacion1, []).
    requiere(basedatos2, [basedatos1]).
    requiere(basedatos1, []).
    requiere(ensamblador2, [ensamblador1]).
    requiere(ensamblador1, []).

    % Cursos aprobados por Fredier
    aprobado(fredier, programacion1).

    % Orden de serialización (de menor a mayor)
    orden(programacion1, 1).
    orden(programacion2, 2).
    orden(basedatos1, 1).
    orden(basedatos2, 2).
    orden(ensamblador1, 1).
    orden(ensamblador2, 2).

    % Reglas
    puede_tomar(Alumno, Curso) :-
        curso(Curso),
        requiere(Curso, Requisitos),
        todos_aprobados(Alumno, Requisitos),
        \\+ aprobado(Alumno, Curso),
        respetar_orden(Alumno, Curso).

    % Verifica que no se salte la serialización
    respetar_orden(Alumno, Curso) :-
        orden(Curso, N),
        N1 is N - 1,
        ( N1 =< 0 -> true ; orden(CursoAnterior, N1), aprobado(Alumno, CursoAnterior) ).

    % Verifica si alumno aprobó todos los requisitos de una lista
    todos_aprobados(_, []). 
    todos_aprobados(Alumno, [Curso|Resto]) :-
        aprobado(Alumno, Curso),
        todos_aprobados(Alumno, Resto).

    % Devuelve todos los cursos que Fredier puede tomar
    cursos_disponibles(Alumno, Cursos) :-
        findall(Curso, puede_tomar(Alumno, Curso), Cursos).

    % Nueva regla: cursos que aún no ha aprobado
    faltan_aprobar(Alumno, CursosPendientes) :-
        findall(Curso, (curso(Curso), \\+ aprobado(Alumno, Curso)), CursosPendientes).
`;

// Configuración de materias
const MATERIAS_CONFIG = [
    { id: 'programacion1', nombre: 'Programación 1' },
    { id: 'programacion2', nombre: 'Programación 2' },
    { id: 'basedatos1', nombre: 'Base de Datos 1' },
    { id: 'basedatos2', nombre: 'Base de Datos 2' },
    { id: 'ensamblador1', nombre: 'Ensamblador 1' },
    { id: 'ensamblador2', nombre: 'Ensamblador 2' }
];

// Mapeo de nombres de cursos
const NOMBRES_CURSOS = {
    'programacion1': 'Programación 1',
    'programacion2': 'Programación 2', 
    'basedatos1': 'Base de Datos 1',
    'basedatos2': 'Base de Datos 2',
    'ensamblador1': 'Ensamblador 1',
    'ensamblador2': 'Ensamblador 2'
};