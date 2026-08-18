/* --- SOMSI - SISTEMA DE VALES PRO --- */

let idDocumentoActual = ""; // Guarda el ID del vale que se está consultando/editando

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('itemsBody').children.length === 0) {
        window.addRow();
    }
    // Generar primer folio al cargar
    setTimeout(window.generarSiguienteFolio, 1000);
});

// --- AGREGAR FILA CON NAVEGACIÓN Y CREACIÓN FLUIDA POR TECLADO (ENTER) ---
window.addRow = function () {
    const tbody = document.getElementById('itemsBody');
    const tr = document.createElement('tr');
    tr.className = "fila-item-nueva";
    tr.innerHTML = `
        <td><input type="number" class="cant-field" value="1"></td>
        <td><input type="text" class="desc-field" placeholder="Descripción..."></td>
        <td><input type="text" class="code-field" placeholder="Código..."></td>
        <td class="no-print"><button onclick="this.parentElement.parentElement.remove()" class="btn-del" style="background:none;border:none;color:red;cursor:pointer;font-size:1.2rem;">×</button></td>
    `;
    tbody.appendChild(tr);

    // Obtener las celdas de esta fila recién creada
    const cantInput = tr.querySelector('.cant-field');
    const descInput = tr.querySelector('.desc-field');
    const codeInput = tr.querySelector('.code-field');

    // 1. ENTER en Cantidad -> Salta a Descripción
    cantInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            descInput.focus();
            descInput.select();
        }
    });

    // 2. ENTER en Descripción -> Salta a Código
    descInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            codeInput.focus();
            codeInput.select();
        }
    });

    // 3. ENTER en Código -> Crea una fila nueva y salta a su Cantidad
    codeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            window.addRow(); // Crear la nueva fila de inmediato

            // Poner el foco en el campo Cantidad de la fila que se acaba de crear
            const ultimaFila = tbody.lastElementChild;
            if (ultimaFila) {
                const nuevaCant = ultimaFila.querySelector('.cant-field');
                nuevaCant.focus();
                nuevaCant.select();
            }
        }
    });
};

// --- FILTRADO POR ECONÓMICO ---
window.filtrarHistorial = function () {
    const texto = document.getElementById('busquedaEco').value.toUpperCase().trim();
    const filas = document.querySelectorAll('.fila-historial');
    filas.forEach(fila => {
        const eco = fila.getAttribute('data-eco') || "";
        fila.style.display = eco.includes(texto) ? "" : "none";
    });
};

// --- FOLIO INTELIGENTE ---
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

// --- GESTIÓN DE FIREBASE ---
window.procesarVale = async function () {
    const btn = document.querySelector('.btn-pdf');
    if (btn.disabled) return;

    btn.disabled = true;
    btn.innerText = "GUARDANDO...";

    try {
        await window.guardarEnNube();
        await window.exportarPDF();
        btn.innerText = "¡VALE GUARDADO!";
        setTimeout(() => {
            btn.disabled = false;
            btn.innerText = "GENERAR PDF Y GUARDAR";
        }, 3000);
    } catch (e) {
        alert("Error al procesar: " + e.message);
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
                    .filter(item => item.desc !== "") // Ignores filas en blanco
            };

            const valesRef = collection(window.db, "vales");
            const nuevoValeRef = doc(valesRef);
            transaction.set(nuevoValeRef, valeData);
            transaction.set(sfDocRef, { ultimoFolio: folioAsignado }, { merge: true });
        });

        document.getElementById('folioVale').value = folioAsignado;
        console.log("Vale guardado con éxito. Folio asignado:", folioAsignado);

    } catch (e) {
        console.error("Error en la transacción: ", e);
        throw e;
    }
};

// --- CARGAR HISTORIAL DESDE LA NUBE ---
window.cargarHistorialDesdeNube = async function () {
    const { collection, getDocs, query, orderBy } = window.dbFuncs;
    const container = document.getElementById('historialBody');
    try {
        const q = query(collection(window.db, "vales"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        container.innerHTML = "";

        snapshot.forEach(docSnap => {
            const v = docSnap.data();
            const id = docSnap.id;
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
    idDocumentoActual = docId; // Guardamos el ID del documento en Firebase

    document.getElementById('folioVale').value = v.folio;
    document.getElementById('tecnicoNombre').value = v.tecnico || "";
    document.getElementById('supervisorNombre').value = v.supervisor || "";
    document.getElementById('equipoMarca').value = v.equipo ? v.equipo.marca : "";
    document.getElementById('equipoEco').value = v.equipo ? v.equipo.economico : "";
    document.getElementById('equipoSerie').value = v.equipo ? v.equipo.serie : "";
    document.getElementById('notesArea').innerText = v.notas || "";

    const tbody = document.getElementById('itemsBody');
    tbody.innerHTML = "";

    // Renderizamos las refacciones existentes cargadas desde la base de datos
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
    window.toggleHistorial();
};

window.eliminarVale = async function (id) {
    if (!confirm("¿Seguro que deseas eliminar este registro del historial?")) return;
    const { doc, deleteDoc } = window.dbFuncs;
    try {
        await deleteDoc(doc(window.db, "vales", id));
        window.cargarHistorialDesdeNube();
    } catch (e) { alert("Error al eliminar: " + e.message); }
};

// --- AGREGAR NUEVAS REFACCIONES A UN FOLIO EXISTENTE ---
window.guardarNuevosArticulosEnFolio = async function () {
    if (!idDocumentoActual) {
        alert("No hay ningún vale cargado para modificar.");
        return;
    }

    // Leemos updateDoc y arrayUnion desde tu inicializador window.dbFuncs
    const { doc, updateDoc, arrayUnion, getDoc } = window.dbFuncs;

    const filasNuevas = document.querySelectorAll('#itemsBody tr.fila-item-nueva');
    const nuevosItems = [];

    filasNuevas.forEach(tr => {
        const cant = tr.querySelector('.cant-field').value;
        const desc = tr.querySelector('.desc-field').value;
        const code = tr.querySelector('.code-field').value;

        if (desc.trim() !== "") {
            nuevosItems.push({ cant, desc, code });
        }
    });

    if (nuevosItems.length === 0) {
        alert("Agrega al menos una nueva refacción en la tabla para guardar.");
        return;
    }

    try {
        const docRef = doc(window.db, "vales", idDocumentoActual);

        // Se agregan los nuevos elementos sin sobreescribir los anteriores
        await updateDoc(docRef, {
            items: arrayUnion(...nuevosItems)
        });

        alert("¡Refacciones agregadas exitosamente al folio!");

        // Recargar el documento para actualizar la pantalla
        const actualizado = await getDoc(docRef);
        if (actualizado.exists()) {
            window.cargarValeEnPantalla(idDocumentoActual, actualizado.data());
        }

    } catch (e) {
        console.error("Error al actualizar el vale:", e);
        alert("Error al actualizar el vale: " + e.message);
    }
};

/// --- PDF OPTIMIZADO CON REDUCCIÓN DINÁMICA Y MANEJO DE PÁGINAS ---
window.exportarPDF = async function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF(); // Hoja A4 por defecto (210mm x 297mm)

    // 1. Encabezado principal
    doc.setFillColor(30, 30, 30);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(164, 198, 57);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("SOMSI - VALE DE SALIDA", 15, 18);

    // 2. Datos del Vale
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

    // Extraer filas de la tabla
    const rows = Array.from(document.querySelectorAll('#itemsBody tr')).map(tr => [
        tr.querySelector('.cant-field').value,
        tr.querySelector('.desc-field').value.toUpperCase(),
        tr.querySelector('.code-field').value.toUpperCase()
    ]);

    // --- REDUCCIÓN DINÁMICA SEGÚN CANTIDAD DE ARTÍCULOS ---
    let tamanoFuente = 10;
    let rellenoCelda = 4;

    if (rows.length > 20) {
        tamanoFuente = 8;
        rellenoCelda = 1.5;
    } else if (rows.length > 12) {
        tamanoFuente = 9;
        rellenoCelda = 3;
    }

    // Renderizar la tabla con las propiedades calculadas
    doc.autoTable({
        startY: 63,
        head: [['CANT', 'DESCRIPCIÓN', 'CÓDIGO']],
        body: rows,
        headStyles: { fillColor: [20, 20, 20], textColor: [164, 198, 57] },
        styles: { fontSize: tamanoFuente, cellPadding: rellenoCelda },
        margin: { top: 15, bottom: 40, left: 15, right: 15 } // Margen para evitar colisiones
    });

    // Punto donde termina la tabla en la página actual
    let fY = doc.lastAutoTable.finalY + 6;

    // --- NOTAS INTELIGENTES ---
    const notas = document.getElementById('notesArea').innerText;
    if (notas) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        const splitNotas = doc.splitTextToSize(`NOTAS: ${notas.toUpperCase()}`, 180);

        // Si las notas exceden el límite seguro de la página (245 mm)
        if (fY + (splitNotas.length * 4) > 245) {
            doc.addPage();
            fY = 25;
        }
        doc.text(splitNotas, 15, fY);
        fY += (splitNotas.length * 4) + 6;
    }

    // --- POSICIONAMIENTO Y FIRMAS SEGURAS ---
    // Si la tabla/notas terminan más abajo de 245 mm, las firmas pasan a la siguiente página
    if (fY > 245) {
        doc.addPage();
        fY = 50; // Posición limpia en la parte superior de la nueva página
    } else {
        // Si caben en la primera página, se anclan al fondo (mínimo Y = 250 mm)
        fY = Math.max(fY + 8, 250);
    }

    // Dibujo de las líneas y rótulos de firma
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

    // Abrir PDF listo para imprimir/guardar
    window.open(doc.output('bloburl'), '_blank');
};

// --- UTILIDADES ---
window.nuevoVale = function () {
    if (!confirm("¿Deseas limpiar todo para un nuevo vale?")) return;
    idDocumentoActual = "";
    document.querySelectorAll('input').forEach(i => i.value = "");
    document.getElementById('notesArea').innerText = "";
    document.getElementById('itemsBody').innerHTML = "";
    window.addRow();
    window.setModoLectura(false);
    window.generarSiguienteFolio();
};

window.setModoLectura = function (b) {
    document.querySelectorAll('input, .textarea-mock').forEach(i => {
        if (i.id !== "folioVale") {
            i.readOnly = b;
            i.style.backgroundColor = b ? "#f9f9f9" : "";
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

// --- EXPORTACIÓN A EXCEL (CSV) ---
window.descargarExcel = async function () {
    const { collection, getDocs, query, orderBy } = window.dbFuncs;
    const btn = document.querySelector('.btn-excel');

    try {
        btn.innerText = "⏳ GENERANDO...";
        btn.disabled = true;

        const q = query(collection(window.db, "vales"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);

        let csvContent = "\uFEFF";
        csvContent += "Folio,Fecha,Técnico,Supervisor,Marca,Económico,Serie,Cantidad,Descripción_Refacción,Código_Refacción,Notas\n";

        const cleanText = (txt) => `"${(txt || '').toString().replace(/"/g, '""').replace(/\n/g, ' ')}"`;

        snapshot.forEach(docSnap => {
            const v = docSnap.data();
            const fechaHora = new Date(v.timestamp).toLocaleString('es-MX');

            if (!v.items || v.items.length === 0) {
                csvContent += `${v.folio},${cleanText(fechaHora)},${cleanText(v.tecnico)},${cleanText(v.supervisor)},${cleanText(v.equipo?.marca)},${cleanText(v.equipo?.economico)},${cleanText(v.equipo?.serie)},,,,${cleanText(v.notas)}\n`;
            } else {
                v.items.forEach(item => {
                    csvContent += `${v.folio},${cleanText(fechaHora)},${cleanText(v.tecnico)},${cleanText(v.supervisor)},${cleanText(v.equipo?.marca)},${cleanText(v.equipo?.economico)},${cleanText(v.equipo?.serie)},${cleanText(item.cant)},${cleanText(item.desc)},${cleanText(item.code)},${cleanText(v.notas)}\n`;
                });
            }
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);

        const hoy = new Date().toISOString().split('T')[0];
        link.setAttribute("download", `Reporte_Vales_SOMSI_${hoy}.csv`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        btn.innerText = "⬇️ Descargar Excel";
        btn.disabled = false;

    } catch (e) {
        console.error("Error al exportar:", e);
        alert("Hubo un problema al generar el archivo Excel.");
        btn.innerText = "⬇️ Descargar Excel";
        btn.disabled = false;
    }
};



// --- MODAL DE RESUMEN Y REPORTES MULTI-FILTRO ---

window.toggleModalResumen = function () {
    const modal = document.getElementById('modalResumenTecnico');
    const displayActual = modal.style.display;
    modal.style.display = (displayActual === 'none' || displayActual === '') ? 'flex' : 'none';
};

// --- FUNCIÓN DE REPORTES Y RESUMEN (FECHAS CORREGIDAS) ---
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

    // 1. CONVERSIÓN SEGURA DE FECHA DE INICIO (00:00:00 del día)
    let tInicio = 0;
    if (fechaInicioVal) {
        const [y, m, d] = fechaInicioVal.split('-').map(Number);
        tInicio = new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
    }

    // 2. CONVERSIÓN SEGURA DE FECHA DE FIN (23:59:59 del día)
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

            // 3. EXTRACCIÓN SEGURA DEL TIMESTAMP DE FIREBASE
            let ts = 0;
            if (typeof v.timestamp === 'number') {
                ts = v.timestamp;
            } else if (v.timestamp && typeof v.timestamp.toMillis === 'function') {
                ts = v.timestamp.toMillis(); // Si es objeto Timestamp de Firestore
            } else if (v.timestamp && v.timestamp.seconds) {
                ts = v.timestamp.seconds * 1000;
            } else if (typeof v.timestamp === 'string') {
                ts = new Date(v.timestamp).getTime();
            }

            // EVALUACIÓN DE FILTROS DINÁMICOS
            const cumpleTecnico = !tecnicoBuscado || tec.includes(tecnicoBuscado);
            const cumpleUnidad = !unidadBuscada || eco.includes(unidadBuscada);

            // Si no se puso fecha inicio, cumpleFechaInicio es true
            const cumpleFechaInicio = !fechaInicioVal || ts >= tInicio;
            // Si no se puso fecha fin, cumpleFechaFin es true
            const cumpleFechaFin = !fechaFinVal || ts <= tFin;

            // Si pasa TODOS los criterios activos:
            if (cumpleTecnico && cumpleUnidad && cumpleFechaInicio && cumpleFechaFin) {
                totalVales++;
                if (eco) equiposAtendidos.add(eco);
                if (tec) tecnicosInvolucrados.add(tec);

                if (v.items && Array.isArray(v.items)) {
                    v.items.forEach(item => {
                        const cant = parseFloat(item.cant) || 0;
                        const desc = (item.desc || "SIN DESCRIPCIÓN").toUpperCase().trim();
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

        // Actualizar interfaz
        document.getElementById('statTotalVales').innerText = totalVales;
        document.getElementById('statTotalPiezas').innerText = totalPiezasCount;
        document.getElementById('statTecnicos').innerText = Array.from(tecnicosInvolucrados).join(', ') || 'Sin especificar';
        document.getElementById('statEquipos').innerText = Array.from(equiposAtendidos).join(', ') || 'Sin especificar';

        const tbody = document.getElementById('tablaResumenBody');
        tbody.innerHTML = "";

        const listaOrdenada = Object.values(resumenItems).sort((a, b) => b.totalCant - a.totalCant);

        if (listaOrdenada.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:15px; color:#888;">No se encontraron registros que coincidan con el rango de fechas seleccionado.</td></tr>`;
        } else {
            listaOrdenada.forEach(item => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = "1px solid #eee";
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
        alert("Error al procesar la información: " + e.message);
        btnBuscar.innerText = "🔍 GENERAR REPORTE";
        btnBuscar.disabled = false;
    }
};