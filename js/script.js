document.addEventListener('DOMContentLoaded', () => {
    addRow(); // Iniciar con una fila vacía
    cargarHistorialUI();
});

function addRow() {
    const tbody = document.getElementById('itemsBody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td><input type="text" class="code-field" placeholder="Código"></td>
        
        <td><input type="text" class="desc-field" placeholder="Nombre de refacción">
        <td><input type="number" class="cant-field" value="1"></td></td>
        
        <td class="no-print"><button onclick="this.parentElement.parentElement.remove()" style="color:red; border:none; background:none; cursor:pointer; font-size:1.2rem;">×</button></td>
    `;
    tbody.appendChild(tr);
}

// --- GENERACIÓN DE PDF VECTORIAL ---
async function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // 1. Obtener Datos
    const folio = document.getElementById('folioVale').value || "S/F";
    const tecnico = document.getElementById('tecnicoNombre').value || "N/A";
    const supervisor = document.getElementById('supervisorNombre').value || "N/A";
    
    const marca = document.getElementById('equipoMarca').value || "---";
    const economico = document.getElementById('equipoEco').value || "---";
    const serie = document.getElementById('equipoSerie').value || "---";
    const notas = document.getElementById('notesArea').innerText || "Sin observaciones.";

    // 2. Encabezado Estilizado
    doc.setFillColor(51, 51, 51); // Gris Oscuro
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(164, 198, 57); // Verde Limón
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("VALE DE SALIDA", 15, 23);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("SISTEMA DE GESTIÓN DE ALMACÉN", 15, 30);

    // 3. Información General
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(10);
    doc.text(`FOLIO: ${folio}`, 160, 45);
    doc.text(`FECHA: ${new Date().toLocaleDateString()}`, 160, 50);
    
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL SOLICITANTE:", 15, 45);
    doc.setFont("helvetica", "normal");
    doc.text(`Técnico: ${tecnico}`, 15, 51);
    doc.text(`Autoriza: ${supervisor}`, 15, 57);

    // 4. SECCIÓN EQUIPO (DIBUJO MANUAL)
    doc.setDrawColor(164, 198, 57);
    doc.line(15, 63, 195, 63);
    doc.setFont("helvetica", "bold");
    doc.text("ESPECIFICACIONES DEL EQUIPO:", 15, 70);
    doc.setFont("helvetica", "normal");
    doc.text(`Marca: ${marca}`, 15, 77);
    doc.text(`Económico: ${economico}`, 75, 77);
    doc.text(`Serie: ${serie}`, 135, 77);

    // 5. TABLA DE REFACCIONES
    const tableRows = Array.from(document.querySelectorAll('#itemsBody tr')).map(tr => [
        tr.querySelector('.cant-field').value,
        tr.querySelector('.desc-field').value,
        tr.querySelector('.code-field').value
    ]);

    doc.autoTable({
        startY: 85,
        head: [['CANT', 'DESCRIPCIÓN DE LA REFACCIÓN', 'CÓDIGO / PARTE']],
        body: tableRows,
        headStyles: { fillColor: [51, 51, 51], textColor: [164, 198, 57], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        styles: { fontSize: 9, cellPadding: 3 }
    });

    // 6. NOTAS
    let finalY = doc.lastAutoTable.finalY + 15;
    if (finalY > 240) { doc.addPage(); finalY = 20; } // Salto de página si no cabe
    
    doc.setFont("helvetica", "bold");
    doc.text("OBSERVACIONES:", 15, finalY);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(notas, 180), 15, finalY + 7);

    // 7. FIRMAS (Posición Fija abajo)
    const fY = 270;
    doc.setFontSize(8);
    doc.line(15, fY, 65, fY); doc.text("ENTREGA (ALMACÉN)", 23, fY + 5);
    doc.line(80, fY, 130, fY); doc.text("RECIBE (TÉCNICO)", 92, fY + 5);
    doc.line(145, fY, 195, fY); doc.text("AUTORIZA (SUPERVISOR)", 155, fY + 5);

    // 8. Output
    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
    
    guardarEnHistorial(folio, tecnico);
}

// --- HISTORIAL EN LOCALSTORAGE ---
function guardarEnHistorial(folio, tecnico) {
    const data = { id: Date.now(), fecha: new Date().toLocaleDateString(), folio, tecnico };
    let list = JSON.parse(localStorage.getItem('almacen_vales')) || [];
    list.unshift(data);
    localStorage.setItem('almacen_vales', JSON.stringify(list.slice(0, 15)));
    cargarHistorialUI();
}

function cargarHistorialUI() {
    const list = JSON.parse(localStorage.getItem('almacen_vales')) || [];
    const container = document.getElementById('historialBody');
    container.innerHTML = list.map(v => `
        <tr>
            <td>${v.fecha}</td>
            <td>${v.folio}</td>
            <td>${v.tecnico}</td>
            <td><button onclick="eliminarH(${v.id})" style="color:red; border:none; background:none; cursor:pointer;">Eliminar</button></td>
        </tr>
    `).join('');
}

function eliminarH(id) {
    let list = JSON.parse(localStorage.getItem('almacen_vales')) || [];
    localStorage.setItem('almacen_vales', JSON.stringify(list.filter(v => v.id !== id)));
    cargarHistorialUI();
}

function toggleHistorial() {
    const m = document.getElementById('modalHistorial');
    m.style.display = m.style.display === 'block' ? 'none' : 'block';
}