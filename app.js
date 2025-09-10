document.addEventListener("DOMContentLoaded", () => {
  // ==== Configuración ====
  let fondoActivo = true;
  const fondos = [
    { img: "https://images.unsplash.com/photo-1503264116251-35a269479413", color: "hsla(133, 88%, 50%, 0.22)" },
    { img: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e", color: "rgba(0, 170, 255, 0.77)" },
    { img: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d", color: "rgba(157, 14, 214, 0.22)" },
    { img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", color: "rgba(80,0,180,0.22)" }
  ];
  const ciudadesEuropa = [
    { nombre: "Londres", zona: "Europe/London" },
    { nombre: "Madrid", zona: "Europe/Madrid" },
    { nombre: "París", zona: "Europe/Paris" },
    { nombre: "Berlín", zona: "Europe/Berlin" },
    { nombre: "Roma", zona: "Europe/Rome" }
  ];

  // ==== DOM ====
  const horaLocalEl = document.getElementById("hora-local");
  const listaEuropaEl = document.getElementById("lista-europa");
  const selectorCiudadesEl = document.getElementById("select-ciudades");
  const toggleFondoEl = document.getElementById("toggle-fondo");

  // ==== Fondo dinámico ====
  function aplicarFondoPorHora() {
    if (!fondoActivo) return;
    const h = new Date().getHours();
    const idx = h % fondos.length;
    const f = fondos[idx];
    document.body.style.backgroundImage =
      `linear-gradient(${f.color}, ${f.color}), url('${f.img}&auto=format&fit=crop&w=1600&q=60')`;
  }

  // ==== Reloj local ====
  function actualizarRelojLocal() {
    horaLocalEl.textContent = new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    }).format(new Date());
  }

  // ==== Europa ====
  function llenarSelectorCiudades() {
    selectorCiudadesEl.innerHTML = "";
    ciudadesEuropa.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.zona;
      opt.textContent = c.nombre;
      opt.selected = true;
      selectorCiudadesEl.appendChild(opt);
    });
  }

  let mapaEuropa = new Map();
  function construirListaEuropa() {
    mapaEuropa.clear();
    listaEuropaEl.innerHTML = "";
    const seleccionadas = Array.from(selectorCiudadesEl.selectedOptions).map(o => o.value);
    ciudadesEuropa
      .filter(c => seleccionadas.includes(c.zona))
      .forEach(c => {
        const item = document.createElement("div");
        item.className = "item-europa";
        const nombre = document.createElement("div");
        nombre.className = "ciudad";
        nombre.textContent = c.nombre;
        const hora = document.createElement("div");
        hora.className = "hora-ciudad";
        item.append(nombre, hora);
        listaEuropaEl.appendChild(item);
        mapaEuropa.set(c.zona, hora);
      });
  }
  function actualizarHorasEuropa() {
    const ahora = new Date();
    mapaEuropa.forEach((el, zona) => {
      el.textContent = new Intl.DateTimeFormat("es-ES", {
        timeZone: zona, hour: "2-digit", minute: "2-digit", second: "2-digit"
      }).format(ahora);
    });
  }

  // ==== Controles ====
  toggleFondoEl.addEventListener("change", e => {
    fondoActivo = e.target.checked;
    if (fondoActivo) aplicarFondoPorHora();
    else document.body.style.backgroundImage = "";
  });
  selectorCiudadesEl.addEventListener("change", () => {
    construirListaEuropa();
    actualizarHorasEuropa();
  });

  // ==== Cronómetro ====
  let cronoInterval = null;
  let cronoInicio = 0;
  let cronoAcumulado = 0;
  const cronoDisplayEl = document.getElementById("cronometro-display");
  const btnStart = document.getElementById("btn-start");
  const btnLap = document.getElementById("btn-lap");
  const btnReset = document.getElementById("btn-reset");
  const lapsEl = document.getElementById("laps");

  function actualizarCronometro() {
    const t = Date.now() - cronoInicio + cronoAcumulado;
    const ms = Math.floor((t % 1000) / 10).toString().padStart(2, "0");
    const s = Math.floor((t / 1000) % 60).toString().padStart(2, "0");
    const m = Math.floor((t / 60000) % 60).toString().padStart(2, "0");
    const h = Math.floor(t / 3600000).toString().padStart(2, "0");
    cronoDisplayEl.textContent = `${h}:${m}:${s}.${ms}`;
  }

  btnStart.addEventListener("click", () => {
    if (cronoInterval) {
      clearInterval(cronoInterval);
      cronoAcumulado += Date.now() - cronoInicio;
      cronoInterval = null;
      btnStart.textContent = "Reanudar";
      btnLap.disabled = true;
      btnReset.disabled = false;
    } else {
      cronoInicio = Date.now();
      cronoInterval = setInterval(actualizarCronometro, 10);
      btnStart.textContent = "Pausar";
      btnLap.disabled = false;
      btnReset.disabled = true;
    }
  });
  btnLap.addEventListener("click", () => {
    if (!cronoInterval) return;
    const li = document.createElement("li");
    li.textContent = cronoDisplayEl.textContent;
    lapsEl.prepend(li);
  });
  btnReset.addEventListener("click", () => {
    clearInterval(cronoInterval);
    cronoInterval = null;
    cronoInicio = 0;
    cronoAcumulado = 0;
    cronoDisplayEl.textContent = "00:00:00.00";
    btnStart.textContent = "Iniciar";
    btnLap.disabled = true;
    btnReset.disabled = true;
    lapsEl.innerHTML = "";
  });

  // ==== Inicialización ====
  aplicarFondoPorHora();
  actualizarRelojLocal();
  llenarSelectorCiudades();
  construirListaEuropa();
  actualizarHorasEuropa();

  // ==== Intervalos ====
  setInterval(actualizarRelojLocal, 1000);
  setInterval(actualizarHorasEuropa, 1000);
  setInterval(aplicarFondoPorHora, 60 * 1000);
});
