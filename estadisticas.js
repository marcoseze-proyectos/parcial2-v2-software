
"use strict";

const totalEst = document.querySelector("#total-estadisticas");
const pendientesEst = document.querySelector("#pendientes-estadisticas");
const completadasEst = document.querySelector("#completadas-estadisticas");
const porcentajeEst = document.querySelector("#porcentaje-estadisticas");
const barraEst = document.querySelector("#barra-progreso");
const progresoEst = document.querySelector("#progreso-tareas");

function actualizarEstadisticas(tareas) {
  const total = tareas.length;
  const completadas = tareas.filter(t => t.completada).length;
  const pendientes = total - completadas;

  const porcentaje = total > 0
    ? Math.round((completadas / total) * 100)
    : 0;

  totalEst.textContent = total;
  pendientesEst.textContent = pendientes;
  completadasEst.textContent = completadas;
  porcentajeEst.textContent = porcentaje + "%";

  barraEst.style.width = porcentaje + "%";
  progresoEst.setAttribute("aria-valuenow", porcentaje);
}

document.addEventListener("tareas:actualizadas", evento => {
  actualizarEstadisticas(evento.detail.tareas);
});

document.querySelector("#limpiar-completadas").addEventListener(
  "click",
  () => {
    document.dispatchEvent(
      new Event("tareas:limpiar-completadas")
    );
  }
);

actualizarEstadisticas(tareas);
