/* --- SOMSI - SISTEMA DE VALES INTEGRADO --- */

document.addEventListener('DOMContentLoaded', () => {
    // Si la tabla está vacía al iniciar, ponemos una fila
    if (document.getElementById('itemsBody').children.length === 0) {
        addRow();
        
    }
});
window.addEventListener('load', () => {
    // Verificamos si Firebase cargó correctamente
    if (typeof firebase === 'undefined' && !window.db) {
        alert("⚠️ ATENCIÓN: Un bloqueador de publicidad está impidiendo el funcionamiento del sistema. Por favor, desactiva AdBlock para esta página para poder guardar vales.");
    }
});

// --- 1. GESTIÓN DE LA TABLA ---
function addRow() {
    const tbody = document.getElementById('itemsBody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" class="code-field" placeholder="Código..."></td>
        <td><input type="text" class="desc-field" placeholder="Descripción..."></td>
        <td><input type="number" class="cant-field" value="1"></td>
        <td class="no-print"><button onclick="this.parentElement.parentElement.remove()" class="btn-del">×</button></td>
    `;
    tbody.appendChild(tr);
}

// --- 2. GESTIÓN DEL MODAL (POPUP) ---
function toggleHistorial() {
    const modal = document.getElementById('modalHistorial');
    if (!modal) return;
    
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
        modal.style.display = "none";
    } else {
        modal.classList.add('active');
        modal.style.display = "flex"; // Para el centrado flex
        cargarHistorialDesdeNube();
    }
}

// Cerrar al hacer clic fuera de la caja blanca
window.onclick = function(event) {
    const modal = document.getElementById('modalHistorial');
    if (event.target == modal) {
        modal.classList.remove('active');
        modal.style.display = "none";
    }
};

// --- 3. MODO LECTURA (BLOQUEO) ---
function setModoLectura(bloquear) {
    // Bloquear/Desbloquear todos los campos de texto
    const inputs = document.querySelectorAll('input, .textarea-mock');
    const btnProcesar = document.querySelector('.btn-pdf');
    
    inputs.forEach(input => {
        if (bloquear) {
            input.setAttribute('readonly', true);
            input.style.backgroundColor = "#f5f5f5";
            input.style.cursor = "not-allowed";
        } else {
            input.removeAttribute('readonly');
            input.style.backgroundColor = "";
            input.style.cursor = "text";
        }
    });

    // Ocultar botones de edición (Agregar fila y eliminar fila)
    const btnAdd = document.querySelector('button[onclick="addRow()"]');
    const btnsDel = document.querySelectorAll('.btn-del');
    
    if (btnAdd) btnAdd.style.display = bloquear ? "none" : "block";
    btnsDel.forEach(btn => btn.style.display = bloquear ? "none" : "inline-block");

    // Si está bloqueado, el botón de procesar solo genera PDF (sin guardar doble en la nube)
    if (btnProcesar) {
        btnProcesar.onclick = bloquear ? exportarPDF : procesarVale;
        btnProcesar.innerText = bloquear ? "RE-GENERAR PDF" : "GENERAR PDF Y GUARDAR";
    }
}

// --- 4. NUEVO VALE (LIMPIAR) ---
function nuevoVale() {
    if (!confirm("¿Deseas limpiar todo para crear un nuevo vale?")) return;

    // Limpiar cabecera
    document.getElementById('folioVale').value = "";
    document.getElementById('tecnicoNombre').value = "";
    document.getElementById('supervisorNombre').value = "";
    document.getElementById('equipoMarca').value = "";
    document.getElementById('equipoEco').value = "";
    document.getElementById('equipoSerie').value = "";
    document.getElementById('notesArea').innerText = "";

    // Limpiar tabla
    document.getElementById('itemsBody').innerHTML = "";
    addRow();

    // Desbloquear edición
    setModoLectura(false);
}

// --- 5. LÓGICA DE FIREBASE ---
async function procesarVale() {
    const btn = document.querySelector('.btn-pdf');
    btn.disabled = true;
    btn.innerText = "PROCESANDO...";

    try {
        if (!window.db) throw new Error("Firebase no conectado.");
        
        await guardarEnNube();
        await exportarPDF();
        
        btn.innerText = "¡ÉXITO!";
        setTimeout(() => {
            btn.disabled = false;
            btn.innerText = "GENERAR PDF Y GUARDAR";
        }, 3000);

    } catch (e) {
        alert("Error: " + e.message);
        btn.disabled = false;
        btn.innerText = "REINTENTAR";
    }
}

async function guardarEnNube() {
    const { collection, addDoc } = window.dbFuncs;
    const valeData = {
        folio: document.getElementById('folioVale').value,
        tecnico: document.getElementById('tecnicoNombre').value,
        supervisor: document.getElementById('supervisorNombre').value,
        fecha: new Date().toLocaleDateString(),
        timestamp: Date.now(),
        equipo: {
            marca: document.getElementById('equipoMarca').value,
            economico: document.getElementById('equipoEco').value,
            serie: document.getElementById('equipoSerie').value
        },
        items: Array.from(document.querySelectorAll('#itemsBody tr')).map(tr => ({
            code: tr.querySelector('.code-field').value,
            desc: tr.querySelector('.desc-field').value,
            cant: tr.querySelector('.cant-field').value
        })),
        notas: document.getElementById('notesArea').innerText
    };
    await addDoc(collection(window.db, "vales"), valeData);
}

async function cargarHistorialDesdeNube() {
    const { collection, getDocs, query, orderBy, limit } = window.dbFuncs;
    const container = document.getElementById('historialBody');
    
    try {
        const q = query(collection(window.db, "vales"), orderBy("timestamp", "desc"), limit(15));
        const snapshot = await getDocs(q);
        container.innerHTML = "";

        snapshot.forEach(docSnap => {
            const v = docSnap.data();
            const id = docSnap.id;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${v.fecha}</td>
                <td>${v.folio}</td>
                <td>
                    <button class="btn-cargar" onclick='cargarValeEnPantalla(${JSON.stringify(v)})'>VER</button>
                    <button class="btn-del" style="margin-left:8px" onclick="eliminarVale('${id}')">🗑️</button>
                </td>
            `;
            container.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

async function eliminarVale(id) {
    if (!confirm("¿Eliminar este vale permanentemente?")) return;
    const { doc, deleteDoc } = window.dbFuncs;
    try {
        await deleteDoc(doc(window.db, "vales", id));
        cargarHistorialDesdeNube();
    } catch (e) { alert("Error al borrar"); }
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
            <td class="no-print"><button onclick="this.parentElement.parentElement.remove()" class="btn-del">×</button></td>
        `;
        tbody.appendChild(tr);
    });

    setModoLectura(true);
    toggleHistorial();
};

// --- 6. EXPORTACIÓN PDF ---
async function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // --- ENCABEZADO ESTILO SOMSI ---
    doc.setFillColor(51, 51, 51); 
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(164, 198, 57); 
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("SOMSI - VALE DE SALIDA", 15, 20);

    // --- INFORMACIÓN DEL VALE (COLUMNA IZQUIERDA) ---
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    // Fila 1 (Y=45)
    doc.text(`TÉCNICO: ${document.getElementById('tecnicoNombre').value.toUpperCase()}`, 15, 45);

    // Fila 2 (Y=52) - AQUÍ ESTABA EL PROBLEMA
    const supervisor = document.getElementById('supervisorNombre').value.toUpperCase();
    doc.text(`SUPERVISOR: ${supervisor}`, 15, 52); 

    // Fila 3 (Y=59) - Bajamos la Marca y Económico
    const marca = document.getElementById('equipoMarca').value.toUpperCase();
    const eco = document.getElementById('equipoEco').value.toUpperCase();
    doc.text(`MARCA: ${marca}`, 15, 59); 
    doc.text(`ECONÓMICO: ${eco}`, 70, 59); // Mantenemos la separación X=70

    // Fila 4 (Y=66) - Bajamos el Número de Serie
    doc.text(`NÚMERO DE SERIE: ${document.getElementById('equipoSerie').value.toUpperCase()}`, 15, 66);
    
    // --- COLUMNA DERECHA (Mismas coordenadas Y para que alineen) ---
    doc.text(`FOLIO: ${document.getElementById('folioVale').value}`, 160, 45); // Alinea con Técnico
    doc.text(`FECHA: ${new Date().toLocaleDateString()}`, 160, 52); // Alinea con Supervisor



    // --- TABLA DE REFACCIONES ---
    const tableRows = Array.from(document.querySelectorAll('#itemsBody tr')).map(tr => [
        tr.querySelector('.cant-field').value,
        tr.querySelector('.desc-field').value.toUpperCase(),
        tr.querySelector('.code-field').value.toUpperCase()
    ]);

       doc.autoTable({
        startY: 75, // Cambiamos de 65 a 75 para dar un colchón de aire
        head: [['CANT', 'DESCRIPCIÓN DE REFACCIÓN / HERRAMIENTA', 'CÓDIGO/PARTE']],
        // ... resto de tu configuración ...
        body: tableRows,
        headStyles: { fillColor: [51, 51, 51], textColor: [164, 198, 57], fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 40 }
        }
    });

    // --- PIE DE PÁGINA (FIRMAS) ---
    // Calculamos la posición después de la tabla
    const finalY = doc.lastAutoTable.finalY + 35;
    doc.setFontSize(8);
    
    // Líneas de firma
    const lineWidth = 50;
    const margin = 15;
    const spacing = 15;

    // 1. Firma Almacén (Izquierda)
    doc.line(margin, finalY, margin + lineWidth, finalY);
    doc.text("ENTREGA (ALMACÉN)", margin + (lineWidth / 2), finalY + 5, { align: "center" });

    // 2. Firma Técnico (Centro)
    const centroX = 105 - (lineWidth / 2);
    doc.line(105 - (lineWidth / 2), finalY, 105 + (lineWidth / 2), finalY);
    doc.text("RECIBE (TÉCNICO)", 105, finalY + 5, { align: "center" });
    
    // Si capturaste firma digital, la ponemos aquí
    if (typeof signaturePad !== 'undefined' && !signaturePad.isEmpty()) {
        const firmaData = signaturePad.toDataURL();
        doc.addImage(firmaData, 'PNG', 105 - 20, finalY - 20, 40, 18);
    }

    // 3. Firma Autoriza (Derecha)
    const derechaX = 210 - margin - lineWidth;
    doc.line(derechaX, finalY, 210 - margin, finalY);
    doc.text("AUTORIZA (SUPERVISOR)", derechaX + (lineWidth / 2), finalY + 5, { align: "center" });

    // Notas finales si existen
    const notas = document.getElementById('notesArea').innerText;
    if (notas) {
doc.setFont("helvetica", "italic"); // Esta es la forma correcta ahora        doc.text(`NOTAS: ${notas}`, 15, finalY + 15);
    }

    // Abrir PDF
    window.open(doc.output('bloburl'), '_blank');
}