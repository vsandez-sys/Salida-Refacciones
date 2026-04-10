/* --- SOMSI - SISTEMA DE VALES PRO --- */

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('itemsBody').children.length === 0) {
        addRow();
    }
    // Generar primer folio al cargar
    setTimeout(generarSiguienteFolio, 1000); 
});

function addRow() {
    const tbody = document.getElementById('itemsBody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="number" class="cant-field" value="1"></td>
        <td><input type="text" class="desc-field" placeholder="Descripción..."></td>
        <td><input type="text" class="code-field" placeholder="Código..."></td>
        <td class="no-print"><button onclick="this.parentElement.parentElement.remove()" class="btn-del" style="background:none;border:none;color:red;cursor:pointer;font-size:1.2rem;">×</button></td>
    `;
    tbody.appendChild(tr);
}

// --- FILTRADO POR ECONÓMICO ---
function filtrarHistorial() {
    const texto = document.getElementById('busquedaEco').value.toUpperCase();
    const filas = document.querySelectorAll('.fila-historial');
    filas.forEach(fila => {
        const eco = fila.getAttribute('data-eco');
        fila.style.display = eco.includes(texto) ? "" : "none";
    });
}

// --- FOLIO INTELIGENTE ---
async function generarSiguienteFolio() {
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
}

// --- GESTIÓN DE FIREBASE ---
async function procesarVale() {
    const btn = document.querySelector('.btn-pdf');
    if(btn.disabled) return;

    btn.disabled = true;
    btn.innerText = "GUARDANDO...";
    
    try {
        await guardarEnNube();
        await exportarPDF();
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
}

async function guardarEnNube() {
    const { collection, addDoc, doc, setDoc } = window.dbFuncs;
    const folioNum = Number(document.getElementById('folioVale').value);
    const valeData = {
        folio: folioNum,
        tecnico: document.getElementById('tecnicoNombre').value,
        supervisor: document.getElementById('supervisorNombre').value,
        timestamp: Date.now(), // Usamos timestamp para hora exacta
        equipo: {
            marca: document.getElementById('equipoMarca').value,
            economico: document.getElementById('equipoEco').value,
            serie: document.getElementById('equipoSerie').value
        },
        items: Array.from(document.querySelectorAll('#itemsBody tr')).map(tr => ({
            cant: tr.querySelector('.cant-field').value,
            desc: tr.querySelector('.desc-field').value,
            code: tr.querySelector('.code-field').value
        })),
        notas: document.getElementById('notesArea').innerText
    };

    await addDoc(collection(window.db, "vales"), valeData);
    
    const contadorRef = doc(window.db, "config", "folios");
    await setDoc(contadorRef, { ultimoFolio: folioNum }, { merge: true });
}

async function cargarHistorialDesdeNube() {
    const { collection, getDocs, query, orderBy, limit } = window.dbFuncs;
    const container = document.getElementById('historialBody');
    try {
        const q = query(collection(window.db, "vales"), orderBy("timestamp", "desc"), limit(30));
        const snapshot = await getDocs(q);
        container.innerHTML = "";
        
        snapshot.forEach(docSnap => {
            const v = docSnap.data();
            const id = docSnap.id;
            // Mostramos Fecha y Hora
            const fechaHora = new Date(v.timestamp).toLocaleString('es-MX', { 
                day: '2-digit', month: '2-digit', year: 'numeric', 
                hour: '2-digit', minute: '2-digit' 
            });

            const tr = document.createElement('tr');
            tr.classList.add('fila-historial');
            tr.setAttribute('data-eco', (v.equipo.economico || "").toUpperCase());

            tr.innerHTML = `
                <td style="font-size: 0.8rem;">${fechaHora}</td>
                <td>${v.folio}</td>
                <td><strong>${v.equipo.economico}</strong></td>
                <td>
                    <button class="btn-cargar" onclick='cargarValeEnPantalla(${JSON.stringify(v)})'>VER</button>
                    <button class="btn-del-mini" onclick="eliminarVale('${id}')">🗑️</button>
                </td>
            `;
            container.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

window.cargarValeEnPantalla = function(v) {
    document.getElementById('folioVale').value = v.folio;
    document.getElementById('tecnicoNombre').value = v.tecnico;
    document.getElementById('supervisorNombre').value = v.supervisor;
    document.getElementById('equipoMarca').value = v.equipo.marca;
    document.getElementById('equipoEco').value = v.equipo.economico;
    document.getElementById('equipoSerie').value = v.equipo.serie;
    document.getElementById('notesArea').innerText = v.notas;

    const tbody = document.getElementById('itemsBody');
    tbody.innerHTML = "";
    v.items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="number" class="cant-field" value="${item.cant}"></td>
            <td><input type="text" class="desc-field" value="${item.desc}"></td>
            <td><input type="text" class="code-field" value="${item.code}"></td>
            <td class="no-print"><button class="btn-del" style="background:none;border:none;color:red;font-size:1.2rem;">×</button></td>
        `;
        tbody.appendChild(tr);
    });
    setModoLectura(true);
    toggleHistorial();
};

async function eliminarVale(id) {
    if(!confirm("¿Seguro que deseas eliminar este registro del historial?")) return;
    const { doc, deleteDoc } = window.dbFuncs;
    try {
        await deleteDoc(doc(window.db, "vales", id));
        cargarHistorialDesdeNube();
    } catch(e) { alert("Error al eliminar: " + e.message); }
}

// --- PDF ---
async function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFillColor(51, 51, 51);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(164, 198, 57);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("SOMSI - VALE DE SALIDA", 15, 20);

    doc.setTextColor(51, 51, 51);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    doc.text(`TÉCNICO: ${document.getElementById('tecnicoNombre').value.toUpperCase()}`, 15, 45);
    doc.text(`SUPERVISOR: ${document.getElementById('supervisorNombre').value.toUpperCase()}`, 15, 52);
    doc.text(`MARCA: ${document.getElementById('equipoMarca').value.toUpperCase()}`, 15, 59);
    doc.text(`ECONÓMICO: ${document.getElementById('equipoEco').value.toUpperCase()}`, 80, 59);
    doc.text(`SERIE: ${document.getElementById('equipoSerie').value.toUpperCase()}`, 15, 66);
    doc.text(`FOLIO: ${document.getElementById('folioVale').value}`, 160, 45);
    doc.text(`FECHA/HORA: ${new Date().toLocaleString()}`, 145, 52);

    const rows = Array.from(document.querySelectorAll('#itemsBody tr')).map(tr => [
        tr.querySelector('.cant-field').value,
        tr.querySelector('.desc-field').value.toUpperCase(),
        tr.querySelector('.code-field').value.toUpperCase()
    ]);

    doc.autoTable({
        startY: 75,
        head: [['CANT', 'DESCRIPCIÓN', 'CÓDIGO']],
        body: rows,
        headStyles: { fillColor: [51, 51, 51], textColor: [164, 198, 57] }
    });

    const fY = doc.lastAutoTable.finalY + 30;
    doc.line(15, fY, 65, fY);
    doc.text("ALMACÉN", 40, fY + 5, {align: "center"});
    doc.line(80, fY, 130, fY);
    doc.text("TÉCNICO", 105, fY + 5, {align: "center"});
    doc.line(145, fY, 195, fY);
    doc.text("AUTORIZA", 170, fY + 5, {align: "center"});
    doc.setFont("helvetica", "bold");
    doc.text(document.getElementById('supervisorNombre').value.toUpperCase(), 170, fY + 10, {align: "center"});

    const notas = document.getElementById('notesArea').innerText;
    if (notas) {
        doc.setFont("helvetica", "italic");
        doc.text(`NOTAS: ${notas}`, 15, fY + 25);
    }

    window.open(doc.output('bloburl'), '_blank');
}

// --- UTILIDADES ---
function nuevoVale() {
    if (!confirm("¿Deseas limpiar todo para un nuevo vale?")) return;
    document.querySelectorAll('input').forEach(i => i.value = "");
    document.getElementById('notesArea').innerText = "";
    document.getElementById('itemsBody').innerHTML = "";
    addRow();
    setModoLectura(false);
    generarSiguienteFolio();
}

function setModoLectura(b) {
    document.querySelectorAll('input, .textarea-mock').forEach(i => {
        if(i.id !== "folioVale") { // Folio siempre es readonly
            i.readOnly = b;
            i.style.backgroundColor = b ? "#f9f9f9" : "";
        }
    });
    const btn = document.querySelector('.btn-pdf');
    btn.onclick = b ? exportarPDF : procesarVale;
    btn.innerText = b ? "RE-GENERAR PDF" : "GENERAR PDF Y GUARDAR";
}

function toggleHistorial() {
    const modal = document.getElementById('modalHistorial');
    modal.classList.toggle('active');
    if (modal.classList.contains('active')) cargarHistorialDesdeNube();
}