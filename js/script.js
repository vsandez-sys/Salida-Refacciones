/* --- SOMSI - SISTEMA DE VALES PRO (SALIDA) --- */

let idDocumentoActual = "";
window.historialLocal = []; // Almacena en memoria el historial para filtrados e impresiones

const OBTENER_PIN_ALMACEN = () => localStorage.getItem("somsi_pin_almacen") || "1234";
const OBTENER_DICCIONARIO = () => JSON.parse(localStorage.getItem("somsi_diccionario") || "{}");

function normalizarConcepto(descripcion) {
    if (!descripcion) return "";
    const clave = descripcion.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const dict = OBTENER_DICCIONARIO();
    return dict[clave] || descripcion.trim().toUpperCase();
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('itemsBody').children.length === 0) {
        window.addRow();
    }
    setTimeout(window.generarSiguienteFolio, 1000);
});

window.addRow = function () {
    window.vibrar('clic');
    const tbody = document.getElementById('itemsBody');
    const tr = document.createElement('tr');
    tr.className = "fila-item-nueva";
    tr.innerHTML = `
        <td><input type="number" class="cant-field" value="1"></td>
        <td><input type="text" class="desc-field" placeholder="Descripción..."></td>
        <td><input type="text" class="code-field" placeholder="Código..."></td>
        <td class="no-print">
            <button onclick="this.parentElement.parentElement.remove(); window.evaluarEstadoFormulario();" class="btn-del" style="background:none;border:none;color:red;cursor:pointer;font-size:1.2rem;">×</button>
        </td>`;
    tbody.appendChild(tr);

    const cantInput = tr.querySelector('.cant-field');
    const descInput = tr.querySelector('.desc-field');
    const codeInput = tr.querySelector('.code-field');

    cantInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); descInput.focus(); descInput.select(); }
    });
    descInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); codeInput.focus(); codeInput.select(); }
    });
    codeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            window.addRow();
            const ultimaFila = tbody.lastElementChild;
            if (ultimaFila) {
                const nuevaCant = ultimaFila.querySelector('.cant-field');
                nuevaCant.focus();
                nuevaCant.select();
            }
        }
    });
};

window.filtrarHistorial = function () {
    const texto = document.getElementById('busquedaEco').value.toUpperCase().trim();
    const filas = document.querySelectorAll('.fila-historial');
    filas.forEach(fila => {
        const eco = fila.getAttribute('data-eco') || "";
        fila.style.display = eco.includes(texto) ? "" : "none";
    });
};

window.generarSiguienteFolio = async function () {
    const { doc, getDoc } = window.dbFuncs;
    try {
        const docRef = doc(window.db, "config", "folios");
        const docSnap = await getDoc(docRef);
        let siguiente = 1;
        if (docSnap.exists()) {
            siguiente = (docSnap.data().ultimoFolio || 0) + 1;
        }
        document.getElementById('folioVale').value = siguiente;
    } catch (e) {
        console.error("Error al obtener folio maestro:", e);
    }
};

window.procesarVale = async function () {
    const btn = document.querySelector('.btn-pdf');
    if (btn.disabled) return;
    
    window.evaluarEstadoFormulario();
    if (!formularioModificado) {
        window.mostrarToast("⚠️ El vale está completamente vacío. Ingresa al menos un dato antes de guardar.", "advertencia");
        return;
    }

    btn.disabled = true;
    btn.innerText = "GUARDANDO...";

    try {
        await window.guardarEnNube();
        await window.exportarPDF();
        window.marcarFormularioComoLimpio();
        btn.innerText = "¡VALE GUARDADO!";
        setTimeout(() => {
            btn.disabled = false;
            btn.innerText = "GENERAR PDF Y GUARDAR";
        }, 3000);
    } catch (e) {
        window.mostrarToast("Error al procesar: " + e.message, "error");
        btn.disabled = false;
        btn.innerText = "REINTENTAR";
    }
};

window.guardarEnNube = async function () {
    const { collection, doc, runTransaction } = window.dbFuncs;
    const sfDocRef = doc(window.db, "config", "folios");
    let folioAsignado;

    try {
        await runTransaction(window.db, async (transaction) => {
            const sfDoc = await transaction.get(sfDocRef);

            let nuevoFolio = 1;
            if (sfDoc.exists()) {
                nuevoFolio = (sfDoc.data().ultimoFolio || 0) + 1;
            }

            folioAsignado = nuevoFolio;

            const valeData = {
                folio: folioAsignado,
                tecnico: document.getElementById('tecnicoNombre').value,
                supervisor: document.getElementById('supervisorNombre').value,
                notas: document.getElementById('notesArea').innerText,
                timestamp: Date.now(),
                equipo: {
                    marca: document.getElementById('equipoMarca').value,
                    economico: document.getElementById('equipoEco').value,
                    serie: document.getElementById('equipoSerie').value
                },
                items: Array.from(document.querySelectorAll('#itemsBody tr'))
                    .map(tr => ({
                        cant: tr.querySelector('.cant-field')?.value || '1',
                        desc: tr.querySelector('.desc-field')?.value?.trim() || '',
                        code: tr.querySelector('.code-field')?.value?.trim() || ''
                    }))
                    .filter(item => item.desc !== "")
            };

            const valesRef = collection(window.db, "vales");
            const nuevoValeRef = doc(valesRef);
            transaction.set(nuevoValeRef, valeData);
            transaction.set(sfDocRef, { ultimoFolio: folioAsignado }, { merge: true });
        });

        document.getElementById('folioVale').value = folioAsignado;
    } catch (e) {
        console.error("Error en la transacción: ", e);
        throw e;
    }
};

window.cargarHistorialDesdeNube = async function () {
    const { collection, getDocs, query, orderBy } = window.dbFuncs;
    const container = document.getElementById('historialBody');
    try {
        const q = query(collection(window.db, "vales"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        container.innerHTML = "";
        window.historialLocal = [];

        snapshot.forEach(docSnap => {
            const v = docSnap.data();
            const id = docSnap.id;
            window.historialLocal.push({ ...v, idDocumento: id });

            const fechaHora = new Date(v.timestamp).toLocaleString('es-MX', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            const tr = document.createElement('tr');
            tr.classList.add('fila-historial');
            const ecoTexto = v.equipo && v.equipo.economico ? v.equipo.economico.toUpperCase() : "";
            tr.setAttribute('data-eco', ecoTexto);

            tr.innerHTML = `
                <td style="font-size: 0.8rem;">${fechaHora}</td>
                <td>${v.folio}</td>
                <td><strong>${ecoTexto}</strong></td>
                <td>
                    <button class="btn-cargar" onclick='cargarValeEnPantalla("${id}", ${JSON.stringify(v)})'>VER / EDITAR</button>
                    <button class="btn-del-mini" onclick="eliminarVale('${id}')">🗑️</button>
                </td>
            `;
            container.appendChild(tr);
        });
    } catch (e) {
        console.error("Error al cargar historial:", e);
    }
};

window.cargarValeEnPantalla = function (docId, v) {
    idDocumentoActual = docId;

    document.getElementById('folioVale').value = v.folio;
    document.getElementById('tecnicoNombre').value = v.tecnico || "";
    document.getElementById('supervisorNombre').value = v.supervisor || "";
    document.getElementById('equipoMarca').value = v.equipo ? v.equipo.marca : "";
    document.getElementById('equipoEco').value = v.equipo ? v.equipo.economico : "";
    document.getElementById('equipoSerie').value = v.equipo ? v.equipo.serie : "";
    document.getElementById('notesArea').innerText = v.notas || "";

    const tbody = document.getElementById('itemsBody');
    tbody.innerHTML = "";

    if (v.items && v.items.length > 0) {
        v.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = "fila-item-existente";
            tr.innerHTML = `
                <td><input type="number" class="cant-field item-bloqueado" value="${item.cant}" readonly></td>
                <td><input type="text" class="desc-field item-bloqueado" value="${item.desc}" readonly></td>
                <td><input type="text" class="code-field item-bloqueado" value="${item.code}" readonly></td>
                <td class="no-print"><span style="color:gray;">🔒</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.setModoLectura(true);
    window.marcarFormularioComoLimpio();
    window.toggleHistorial();
};

window.eliminarVale = async function (id) {
    if (!confirm("¿Seguro que deseas eliminar este registro del historial?")) return;
    const { doc, deleteDoc } = window.dbFuncs;
    try {
        await deleteDoc(doc(window.db, "vales", id));
        window.cargarHistorialDesdeNube();
    } catch (e) { window.mostrarToast("Error al eliminar: " + e.message, "error"); }
};

window.exportarPDF = async function () {
    window.evaluarEstadoFormulario();
    if (!formularioModificado) {
        window.mostrarToast("⚠️ No puedes generar un PDF de un vale completamente vacío.", "advertencia");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFillColor(30, 30, 30);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(164, 198, 57);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("SOMSI - VALE DE SALIDA", 15, 18);

    doc.setTextColor(51, 51, 51);
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");

    doc.text(`TÉCNICO: ${document.getElementById('tecnicoNombre').value.toUpperCase()}`, 15, 37);
    doc.text(`SUPERVISOR: ${document.getElementById('supervisorNombre').value.toUpperCase()}`, 15, 44);
    doc.text(`MARCA: ${document.getElementById('equipoMarca').value.toUpperCase()}`, 15, 51);
    doc.text(`ECONÓMICO: ${document.getElementById('equipoEco').value.toUpperCase()}`, 80, 51);
    doc.text(`SERIE: ${document.getElementById('equipoSerie').value.toUpperCase()}`, 15, 58);
    doc.text(`FOLIO: ${document.getElementById('folioVale').value}`, 160, 37);
    doc.text(`FECHA/HORA: ${new Date().toLocaleString()}`, 145, 44);

    const rows = Array.from(document.querySelectorAll('#itemsBody tr')).map(tr => [
        tr.querySelector('.cant-field').value,
        tr.querySelector('.desc-field').value.toUpperCase(),
        tr.querySelector('.code-field').value.toUpperCase()
    ]);

    let tamanoFuente = 10;
    let rellenoCelda = 4;

    if (rows.length > 20) {
        tamanoFuente = 8;
        rellenoCelda = 1.5;
    } else if (rows.length > 12) {
        tamanoFuente = 9;
        rellenoCelda = 3;
    }

    doc.autoTable({
        startY: 63,
        head: [['CANT', 'DESCRIPCIÓN', 'CÓDIGO']],
        body: rows,
        headStyles: { fillColor: [20, 20, 20], textColor: [164, 198, 57] },
        styles: { fontSize: tamanoFuente, cellPadding: rellenoCelda },
        margin: { top: 15, bottom: 40, left: 15, right: 15 }
    });

    let fY = doc.lastAutoTable.finalY + 6;

    const notas = document.getElementById('notesArea').innerText;
    if (notas) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        const splitNotas = doc.splitTextToSize(`NOTAS: ${notas.toUpperCase()}`, 180);

        if (fY + (splitNotas.length * 4) > 245) {
            doc.addPage();
            fY = 25;
        }
        doc.text(splitNotas, 15, fY);
        fY += (splitNotas.length * 4) + 6;
    }

    if (fY > 245) {
        doc.addPage();
        fY = 50;
    } else {
        fY = Math.max(fY + 8, 250);
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.line(15, fY, 65, fY);
    doc.text("ALMACÉN", 40, fY + 5, { align: "center" });

    doc.line(80, fY, 130, fY);
    doc.text("TÉCNICO", 105, fY + 5, { align: "center" });

    doc.line(145, fY, 195, fY);
    doc.text("AUTORIZA", 170, fY + 5, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.text(document.getElementById('supervisorNombre').value.toUpperCase(), 170, fY + 10, { align: "center" });

    window.open(doc.output('bloburl'), '_blank');
};

window.nuevoVale = function () {
    if (!confirm("¿Deseas limpiar todo para un nuevo vale?")) return;
    idDocumentoActual = "";
    document.querySelectorAll('input').forEach(i => i.value = "");
    document.getElementById('notesArea').innerText = "";
    document.getElementById('itemsBody').innerHTML = "";
    window.addRow();
    window.setModoLectura(false);
    window.generarSiguienteFolio();
    window.marcarFormularioComoLimpio();
};

window.setModoLectura = function (b) {
    document.querySelectorAll('input, .textarea-mock').forEach(i => {
        if (i.id !== "folioVale") {
            i.readOnly = b;
            i.style.backgroundColor = b ? "var(--input-bg)" : "";
        }
    });
    const btn = document.querySelector('.btn-pdf');
    btn.onclick = b ? window.exportarPDF : window.procesarVale;
    btn.innerText = b ? "RE-GENERAR PDF" : "GENERAR PDF Y GUARDAR";
};

window.toggleHistorial = function () {
    const modal = document.getElementById('modalHistorial');
    modal.classList.toggle('active');
    if (modal.classList.contains('active')) window.cargarHistorialDesdeNube();
};

window.toggleModalResumen = function () {
    const modal = document.getElementById('modalResumenTecnico');
    const displayActual = modal.style.display;
    modal.style.display = (displayActual === 'none' || displayActual === '') ? 'flex' : 'none';
};

window.generarResumen = async function () {
    const tecnicoBuscado = document.getElementById('filtroTecnicoNombre').value.trim().toUpperCase();
    const unidadBuscada = document.getElementById('filtroUnidadEco').value.trim().toUpperCase();
    const fechaInicioVal = document.getElementById('filtroFechaInicio').value;
    const fechaFinVal = document.getElementById('filtroFechaFin').value;

    if (!tecnicoBuscado && !unidadBuscada && !fechaInicioVal && !fechaFinVal) {
        if (!confirm("No has escrito ningún filtro. ¿Deseas consultar el acumulado TOTAL de todo el historial?")) {
            return;
        }
    }

    let tInicio = 0;
    if (fechaInicioVal) {
        const [y, m, d] = fechaInicioVal.split('-').map(Number);
        tInicio = new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
    }

    let tFin = Date.now();
    if (fechaFinVal) {
        const [y, m, d] = fechaFinVal.split('-').map(Number);
        tFin = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
    }

    const { collection, getDocs, query, orderBy } = window.dbFuncs;
    const btnBuscar = document.getElementById('btnGenerarReporte');

    try {
        btnBuscar.innerText = "⏳ CONSULTANDO...";
        btnBuscar.disabled = true;

        const q = query(collection(window.db, "vales"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);

        let totalVales = 0;
        let totalPiezasCount = 0;
        let resumenItems = {};
        let equiposAtendidos = new Set();
        let tecnicosInvolucrados = new Set();

        snapshot.forEach(docSnap => {
            const v = docSnap.data();
            const tec = (v.tecnico || "").toUpperCase();
            const eco = (v.equipo && v.equipo.economico) ? v.equipo.economico.toUpperCase() : "";

            let ts = 0;
            if (typeof v.timestamp === 'number') {
                ts = v.timestamp;
            } else if (v.timestamp && typeof v.timestamp.toMillis === 'function') {
                ts = v.timestamp.toMillis();
            } else if (v.timestamp && v.timestamp.seconds) {
                ts = v.timestamp.seconds * 1000;
            } else if (typeof v.timestamp === 'string') {
                ts = new Date(v.timestamp).getTime();
            }

            const cumpleTecnico = !tecnicoBuscado || tec.includes(tecnicoBuscado);
            const cumpleUnidad = !unidadBuscada || eco.includes(unidadBuscada);
            const cumpleFechaInicio = !fechaInicioVal || ts >= tInicio;
            const cumpleFechaFin = !fechaFinVal || ts <= tFin;

            if (cumpleTecnico && cumpleUnidad && cumpleFechaInicio && cumpleFechaFin) {
                totalVales++;
                if (eco) equiposAtendidos.add(eco);
                if (tec) tecnicosInvolucrados.add(tec);

                if (v.items && Array.isArray(v.items)) {
                    v.items.forEach(item => {
                        const cant = parseFloat(item.cant) || 0;
                        const desc = normalizarConcepto(item.desc || "SIN DESCRIPCIÓN");
                        const code = (item.code || "S/C").toUpperCase().trim();
                        const key = `${code}___${desc}`;

                        totalPiezasCount += cant;

                        if (!resumenItems[key]) {
                            resumenItems[key] = { code, desc, totalCant: 0 };
                        }
                        resumenItems[key].totalCant += cant;
                    });
                }
            }
        });

        document.getElementById('statTotalVales').innerText = totalVales;
        document.getElementById('statTotalPiezas').innerText = totalPiezasCount;
        document.getElementById('statTecnicos').innerText = Array.from(tecnicosInvolucrados).join(', ') || 'Sin especificar';
        document.getElementById('statEquipos').innerText = Array.from(equiposAtendidos).join(', ') || 'Sin especificar';

        const tbody = document.getElementById('tablaResumenBody');
        tbody.innerHTML = "";

        const listaOrdenada = Object.values(resumenItems).sort((a, b) => b.totalCant - a.totalCant);

        if (listaOrdenada.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:15px; color:#888;">No se encontraron registros que coincidan con los filtros.</td></tr>`;
        } else {
            listaOrdenada.forEach(item => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = "1px solid var(--border-color)";
                tr.innerHTML = `
                    <td style="padding:8px; font-weight:bold;">${item.code}</td>
                    <td style="padding:8px;">${item.desc}</td>
                    <td style="padding:8px; text-align:center; font-weight:bold; color:#a4c639;">${item.totalCant}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        document.getElementById('resultadoResumen').style.display = 'block';
        btnBuscar.innerText = "🔍 GENERAR REPORTE";
        btnBuscar.disabled = false;

    } catch (e) {
        console.error("Error al generar resumen:", e);
        window.mostrarToast("Error al procesar la información: " + e.message, "error");
        btnBuscar.innerText = "🔍 GENERAR REPORTE";
        btnBuscar.disabled = false;
    }
};

let formularioModificado = false;

window.evaluarEstadoFormulario = function () {
    const camposPrincipales = ['tecnicoNombre', 'supervisorNombre', 'equipoMarca', 'equipoEco', 'equipoSerie'];
    const tieneCamposLlenos = camposPrincipales.some(id => {
        const el = document.getElementById(id);
        return el && el.value.trim() !== "";
    });

    const notesArea = document.getElementById('notesArea');
    const tieneNotas = notesArea && notesArea.innerText.trim() !== "";

    const filas = document.querySelectorAll('#itemsBody tr');
    let tieneRefacciones = false;

    filas.forEach(tr => {
        const desc = tr.querySelector('.desc-field')?.value?.trim() || "";
        const code = tr.querySelector('.code-field')?.value?.trim() || "";
        const cant = tr.querySelector('.cant-field')?.value?.trim() || "1";

        if (desc !== "" || code !== "" || (cant !== "1" && cant !== "")) {
            tieneRefacciones = true;
        }
    });

    formularioModificado = tieneCamposLlenos || tieneNotas || tieneRefacciones;
    actualizarEstadoNavegacion(formularioModificado);
};

window.marcarFormularioComoLimpio = function () {
    formularioModificado = false;
    actualizarEstadoNavegacion(false);
};

function actualizarEstadoNavegacion(bloqueado) {
    const enlacesNav = document.querySelectorAll('.tarjeta-nav');
    enlacesNav.forEach(link => {
        if (bloqueado) {
            link.classList.add('nav-bloqueada');
        } else {
            link.classList.remove('nav-bloqueada');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        ['input', 'keyup', 'change'].forEach(evento => {
            appContainer.addEventListener(evento, (e) => {
                if (e.target.id === 'busquedaEco' || e.target.id.startsWith('filtro') || e.target.id.startsWith('input')) return;
                window.evaluarEstadoFormulario();
            });
        });
    }

    document.querySelectorAll('.tarjeta-nav').forEach(link => {
        link.addEventListener('click', (e) => {
            if (formularioModificado) {
                e.preventDefault();
                window.mostrarToast("⚠️ Tienes datos ingresados sin guardar. Guarda o limpia primero.", "advertencia");
            }
        });
    });

    window.addEventListener('beforeunload', (e) => {
        if (formularioModificado) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
});

window.mostrarToast = function (mensaje, tipo = 'exito') {
    if (typeof window.vibrar === 'function') window.vibrar(tipo);

    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'no-print';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `<span>${mensaje}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};

window.toggleTema = function () {
    const temaActual = document.documentElement.getAttribute('data-theme') || 'light';
    const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', nuevoTema);
    localStorage.setItem('somsi_tema', nuevoTema);
    actualizarTextoBotonTema(nuevoTema);
};

function actualizarTextoBotonTema(tema) {
    const btns = document.querySelectorAll('.btn-theme-toggle');
    btns.forEach(btn => {
        if (btn.innerText.includes('Modo')) {
            btn.innerText = tema === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const temaGuardado = localStorage.getItem('somsi_tema') || 'light';
    document.documentElement.setAttribute('data-theme', temaGuardado);
    actualizarTextoBotonTema(temaGuardado);
});

window.vibrar = function (tipo = 'clic') {
    if (!('navigator' in window) || !('vibrate' in navigator)) return;

    switch (tipo) {
        case 'exito': navigator.vibrate([80, 40, 80]); break;
        case 'error': navigator.vibrate([150, 50, 150, 50, 200]); break;
        case 'advertencia': navigator.vibrate([120, 60, 120]); break;
        case 'clic': default: navigator.vibrate(40); break;
    }
};

/* --- MÓDULO DE HOMOLOGACIÓN Y NIP --- */
window.abrirGestorHomologacion = function () {
    const pinIngresado = prompt("🔒 Ingresa la clave de administración para gestionar conceptos:");
    if (pinIngresado === null) return;
    if (pinIngresado !== OBTENER_PIN_ALMACEN()) {
        window.mostrarToast("❌ Clave incorrecta. Acceso denegado.", "error");
        return;
    }
    
    const modal = document.getElementById("modalHomologacion");
    if (modal) {
        modal.classList.add("active");
        window.renderizarListaSinonimos();
    }
};

window.cerrarGestorHomologacion = function () {
    const modal = document.getElementById("modalHomologacion");
    if (modal) modal.classList.remove("active");
};

window.guardarSinonimo = function () {
    const inputSin = document.getElementById("inputSinonimo");
    const inputOfi = document.getElementById("inputOficial");
    if (!inputSin || !inputOfi) return;

    const original = inputSin.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const oficial = inputOfi.value.trim().toUpperCase();

    if (!original || !oficial) {
        window.mostrarToast("⚠️ Llene ambos campos para guardar la equivalencia.", "advertencia");
        return;
    }

    const dict = OBTENER_DICCIONARIO();
    dict[original] = oficial;
    localStorage.setItem("somsi_diccionario", JSON.stringify(dict));

    inputSin.value = "";
    inputOfi.value = "";
    
    window.mostrarToast("✅ Equivalencia guardada correctamente.", "exito");
    window.renderizarListaSinonimos();
};

window.eliminarSinonimo = function (clave) {
    const dict = OBTENER_DICCIONARIO();
    delete dict[clave];
    localStorage.setItem("somsi_diccionario", JSON.stringify(dict));
    window.renderizarListaSinonimos();
};

window.renderizarListaSinonimos = function () {
    const dict = OBTENER_DICCIONARIO();
    const contenedor = document.getElementById("listaSinonimosBody");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    const claves = Object.keys(dict);
    if (claves.length === 0) {
        contenedor.innerHTML = "<tr><td colspan='3' style='text-align:center; padding:10px; color:#888;'>No hay sinónimos registrados.</td></tr>";
        return;
    }

    claves.forEach(clave => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="padding:6px 10px;"><b>${clave}</b></td>
            <td style="padding:6px 10px;">➡️ ${dict[clave]}</td>
            <td style="padding:6px 10px; text-align:center;">
                <button class="btn-del-mini" onclick="eliminarSinonimo('${clave}')">🗑️</button>
            </td>
        `;
        contenedor.appendChild(tr);
    });
};

window.cambiarPinAlmacen = function () {
    const nuevoPin = prompt("🔑 Ingresa el nuevo NIP de administración (mínimo 4 dígitos):");
    if (nuevoPin && nuevoPin.trim().length >= 4) {
        localStorage.setItem("somsi_pin_almacen", nuevoPin.trim());
        window.mostrarToast("🔐 Clave actualizada con éxito.", "exito");
    } else if (nuevoPin !== null) {
        window.mostrarToast("⚠️ El NIP debe tener al menos 4 dígitos.", "advertencia");
    }
};

/* --- EXPORTACIÓN FILTRADA A EXCEL CON HOMOLOGACIÓN --- */
window.exportarExcelHistorial = function () {
    if (!window.historialLocal || window.historialLocal.length === 0) {
        window.mostrarToast("⚠️ No hay datos cargados en el historial.", "advertencia");
        return;
    }

    const filtroInput = document.getElementById("busquedaEco");
    const filtro = filtroInput ? filtroInput.value.trim().toLowerCase() : "";
    
    const registrosFiltrados = window.historialLocal.filter(vale => {
        if (!filtro) return true;
        const eco = (vale.equipo?.economico || "").toLowerCase();
        const folio = (vale.folio || "").toString().toLowerCase();
        const tec = (vale.tecnico || "").toLowerCase();
        return eco.includes(filtro) || folio.includes(filtro) || tec.includes(filtro);
    });

    if (registrosFiltrados.length === 0) {
        window.mostrarToast("⚠️ No hay registros que coincidan con la búsqueda.", "advertencia");
        return;
    }

    const filasExcel = [];

    registrosFiltrados.forEach(vale => {
        const fechaHora = vale.timestamp ? new Date(vale.timestamp).toLocaleString('es-MX') : "";
        
        if (vale.items && vale.items.length > 0) {
            vale.items.forEach(item => {
                filasExcel.push({
                    "Folio": vale.folio || "S/N",
                    "Fecha": fechaHora,
                    "Económico / Equipo": vale.equipo?.economico || "",
                    "Marca": vale.equipo?.marca || "",
                    "Serie": vale.equipo?.serie || "",
                    "Técnico": vale.tecnico || "",
                    "Supervisor / Autoriza": vale.supervisor || "",
                    "Cantidad": item.cant || 1,
                    "Concepto Homologado": normalizarConcepto(item.desc),
                    "Concepto Original": item.desc || "",
                    "Código / Parte": item.code || "",
                    "Notas": vale.notas || ""
                });
            });
        } else {
            filasExcel.push({
                "Folio": vale.folio || "S/N",
                "Fecha": fechaHora,
                "Económico / Equipo": vale.equipo?.economico || "",
                "Marca": vale.equipo?.marca || "",
                "Serie": vale.equipo?.serie || "",
                "Técnico": vale.tecnico || "",
                "Supervisor / Autoriza": vale.supervisor || "",
                "Cantidad": 0,
                "Concepto Homologado": "SIN ITEMS",
                "Concepto Original": "",
                "Código / Parte": "",
                "Notas": vale.notas || ""
            });
        }
    });

    const hoja = XLSX.utils.json_to_sheet(filasExcel);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Historial_Filtrado");

    const fechaHoy = new Date().toISOString().split('T')[0];
    XLSX.writeFile(libro, `Reporte_Vales_SOMSI_${fechaHoy}.xlsx`);

    window.mostrarToast("📊 Reporte Excel generado exitosamente.", "exito");
};