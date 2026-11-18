"use strict";

const STORAGE_KEY = "parcial2_tareas_v1";
const formulario = document.querySelector("#formulario-tarea");
const campoNombre = document.querySelector("#nombre-tarea");
const campoPrioridad = document.querySelector("#prioridad-tarea");
const listado = document.querySelector("#lista-tareas");
const mensajeVacio = document.querySelector("#mensaje-vacio");
const contador = document.querySelector("#cantidad-tareas");
const pendientes = document.querySelector("#pendientes");
const botonesFiltro = [...document.querySelectorAll("[data-filter]")];

const ejemplos = [
  { id: 1, titulo: "Repasar conceptos de CI/CD", prioridad: "alta", completada: false },
  { id: 2, titulo: "Preparar el proyecto con Docker", prioridad: "media", completada: false },
  { id: 3, titulo: "Crear el repositorio en Git", prioridad: "baja", completada: true },
];

function cargarTareas() {
  try {
    const guardadas = localStorage.getItem(STORAGE_KEY);
    if (guardadas === null) return ejemplos;
    const valor = JSON.parse(guardadas);
    return Array.isArray(valor) ? valor : ejemplos;
  } catch {
    return ejemplos;
  }
}

let tareas = cargarTareas();
let filtroActual = "todas";

function guardarTareas() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas)); }
  catch {}
}

function crearElementoTarea(tarea) {
  const item = document.createElement("li");
  item.className = `task-row${tarea.completada ? " completed" : ""}`;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = tarea.completada;
  checkbox.setAttribute("aria-label", `Completar ${tarea.titulo}`);
  checkbox.addEventListener("change", () => {
    tareas = tareas.map(t => t.id === tarea.id ? { ...t, completada: checkbox.checked } : t);
    actualizar();
  });

  const cuerpo = document.createElement("div");
  cuerpo.className = "task-body";
  const titulo = document.createElement("p");
  titulo.className = "task-title";
  titulo.textContent = tarea.titulo;
  const meta = document.createElement("div");
  meta.className = "task-meta";
  const prioridad = document.createElement("span");
  const nivel = ["alta", "media", "baja"].includes(tarea.prioridad) ? tarea.prioridad : "media";
  prioridad.className = `priority-pill priority-${nivel}`;
  prioridad.textContent = `Prioridad ${nivel}`;
  meta.append(prioridad);
  cuerpo.append(titulo, meta);

  const eliminar = document.createElement("button");
  eliminar.type = "button";
  eliminar.className = "delete-button";
  eliminar.textContent = "Eliminar";
  eliminar.setAttribute("aria-label", `Eliminar ${tarea.titulo}`);
  eliminar.addEventListener("click", () => {
    tareas = tareas.filter(t => t.id !== tarea.id);
    actualizar();
  });

  item.append(checkbox, cuerpo, eliminar);
  return item;
}

function renderizar() {
  const visibles = tareas.filter(t => filtroActual === "todas" ||
    (filtroActual === "pendientes" && !t.completada) ||
    (filtroActual === "completadas" && t.completada));

  listado.replaceChildren(...visibles.map(crearElementoTarea));
  mensajeVacio.hidden = visibles.length !== 0;
  contador.textContent = String(tareas.length);
  const sinCompletar = tareas.filter(t => !t.completada).length;
  pendientes.textContent = `${sinCompletar} pendiente${sinCompletar === 1 ? "" : "s"}`;

  document.dispatchEvent(new CustomEvent("tareas:actualizadas", { detail: { tareas } }));
}

function actualizar() { guardarTareas(); renderizar(); }

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const titulo = campoNombre.value.trim();
  if (!titulo) return;
  tareas.unshift({ id: Date.now() + Math.random(), titulo, prioridad: campoPrioridad.value, completada: false });
  formulario.reset();
  campoNombre.focus();
  actualizar();
});

for (const boton of botonesFiltro) {
  boton.addEventListener("click", () => {
    filtroActual = boton.dataset.filter;
    for (const b of botonesFiltro) {
      b.classList.toggle("active", b === boton);
      b.setAttribute("aria-pressed", String(b === boton));
    }
    renderizar();
  });
}

document.addEventListener("tareas:limpiar-completadas", () => {
  tareas = tareas.filter(t => !t.completada);
  actualizar();
});

renderizar();
