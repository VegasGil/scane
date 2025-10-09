// const input1 = document.getElementById('fileInput');
// const input2 = document.getElementById('fileInput2');
// const tbody = document.querySelector('#dataTable tbody');
// const thead = document.querySelector('#tableHead');
// const depositoFiltro = document.getElementById('depositoFiltro');
// const saveBtn = document.getElementById('saveBtn');
// const totalesP = document.getElementById('totales');

// let rows = [];
// const headersSet = new Set([
//   "Cliente","Fecha","Consulta","Servei","Arxiu","Tipus",
//   "Depósito","Pis","Carrer","Columna","Nivell",
//   "Serie","Contenedor","Código de barras","Origen","Estado","Fecha registro"
// ]);

// const estados = ["✅ Localizada","❌ No localizada","❌ Sin ubicación"];
// const estadoClases = ["estado-localizada","estado-no-localizada","estado-sin-ubicacion"];

// function parseFile(text) {
//   const blocks = text.split(/-{3,}|\n\s*\n/).map(b => b.trim()).filter(Boolean);
//   const parsedRows = [];

//   for (const block of blocks) {
//     const row = {};
//     const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

//     for (const line of lines) {
//       const match = line.match(/^([^:]+):\s*(.*)$/);
//       if (match) {
//         const key = match[1].trim();
//         let value = match[2].trim();
//         if (value.includes('|')) {
//           const parts = value.split('|');
//           parts.forEach(p => {
//             const sub = p.split(':');
//             if(sub.length===2) row[sub[0].trim()] = sub[1].trim();
//             else row[key] = sub[0].trim();
//           });
//         } else row[key] = value;
//       } else if (/\d{2}\/\d{2}\/\d{4}/.test(line)) row["Fecha registro"] = line.trim();
//       else if (line.startsWith('❌') || line.toLowerCase().includes('pendiente') || line.toLowerCase().includes('no localizada')) row["Estado"]="❌ No localizada";
//       else if (line.toLowerCase().includes('encontrado') || line.toLowerCase().includes('localizada')) row["Estado"]="✅ Localizada";
//     }

//     const deposito = (row["Depósito"] || "").trim();
//     row["_depositoEstado"] = deposito? "ok":"fail";
//     if(!row["Estado"]) row["Estado"]="❌ Sin ubicación";
//     parsedRows.push(row);
//   }
//   return parsedRows;
// }

// function renderTable() {
//   thead.innerHTML = '';
//   tbody.innerHTML = '';

//   const trHead = document.createElement('tr');
//   headersSet.forEach(h=>{
//     const th = document.createElement('th'); th.textContent = h; trHead.appendChild(th);
//   });
//   thead.appendChild(trHead);

//   let counts = {"✅ Localizada":0,"❌ No localizada":0,"❌ Sin ubicación":0};

//   rows.filter(r=>{
//     const filtro = depositoFiltro.value.trim();
//     return !filtro || (r["Depósito"]||"").includes(filtro);
//   }).forEach(row=>{
//     const tr = document.createElement('tr');
//     headersSet.forEach(h=>{
//       const td = document.createElement('td');
//       const value = row[h]||"";

//       if(h==="Depósito") {
//         td.textContent = value;
//         td.classList.add(row["_depositoEstado"]==="ok"?"deposito-ok":"deposito-fail");
//       } else if(h==="Estado") {
//         td.textContent = value;
//         const idx = estados.indexOf(value);
//         td.classList.add(estadoClases[idx]);
//         td.addEventListener('click', ()=>{
//           const nuevoIdx = (idx+1)%estados.length;
//           row["Estado"]=estados[nuevoIdx];
//           renderTable();
//         });
//         counts[value]++;
//       } else td.textContent = value;
//       tr.appendChild(td);
//     });
//     tbody.appendChild(tr);
//   });

//   totalesP.textContent = `Totales → Localizada: ${counts["✅ Localizada"]}, No localizada: ${counts["❌ No localizada"]}, Sin ubicación: ${counts["❌ Sin ubicación"]}`;
// }

// input1.addEventListener('change', async e=>{
//   const text = await e.target.files[0].text();
//   rows = parseFile(text);
//   window.rows = rows; // <-- importante: asignar global para el modal
//   renderTable();
// });

// input2.addEventListener('change', async e=>{
//   const text = await e.target.files[0].text();
//   rows = rows.concat(parseFile(text));
//   window.rows = rows; // <-- importante: asignar global para el modal
//   renderTable();
// });

// depositoFiltro.addEventListener('input', renderTable);

// saveBtn.addEventListener('click', ()=>{
//   let content = "";
//   rows.forEach(r=>{
//     let block = "";
//     headersSet.forEach(h=>{
//       if(r[h]) block += `${h}: ${r[h]} | `;
//     });
//     block = block.slice(0,-3) + "\n"; // quitar último " | "
//     content += block + "\n---\n";
//   });
//   const blob = new Blob([content], {type:"text/plain"});
//   const a = document.createElement('a');
//   a.href = URL.createObjectURL(blob);
//   a.download = "archivo_modificado.dat";
//   a.click();
// });


// // MODAL LOGIC
// (function(){
//   const modal = document.getElementById("pickerModal");
//   const openBtn = document.getElementById("openPickerBtn");
//   const closeBtn = modal.querySelector(".closeBtn");
//   const tbody = document.querySelector("#modalTable tbody");
//   const depositoInput = document.getElementById("modalDepositoFiltro");
//   const carrerOrder = document.getElementById("carrerOrder");
//   const modalTotales = document.getElementById("modalTotales");

//   let lastDeposito = "";
//   let lastOrder = "desc";

//   const estados = ["✅ Localizada","❌ No localizada","❌ Sin ubicación"];
//   const estadoClases = ["estado-localizada","estado-no-localizada","estado-sin-ubicacion"];

//   openBtn.addEventListener("click", ()=>{
//     if(!window.rows || window.rows.length===0) return alert("Primero carga un archivo");
//     modal.style.display = "block";
//     depositoInput.value = lastDeposito;
//     carrerOrder.value = lastOrder;
//     renderModalTable();
//   });

//   closeBtn.addEventListener("click", ()=> modal.style.display = "none");
//   window.addEventListener("click", e=> { if(e.target==modal) modal.style.display="none"; });

//   depositoInput.addEventListener("input", renderModalTable);
//   carrerOrder.addEventListener("change", renderModalTable);

//   function renderModalTable(){
//     const filter = depositoInput.value.trim().toLowerCase();
//     const order = carrerOrder.value;
//     lastDeposito = filter;
//     lastOrder = order;

//     // Filtrado
//     let filtered = window.rows.filter(r => !filter || (r["Depósito"]||"").toLowerCase().includes(filter));

//     // Ordenar Carrer
//     filtered.sort((a,b)=>{
//       const ca = parseInt((a["Carrer"]||"0").trim()) || 0;
//       const cb = parseInt((b["Carrer"]||"0").trim()) || 0;
//       return order==="desc"? cb - ca : ca - cb;
//     });

//     // Calcular cantidad por depósito
//     const depositoCount = {};
//     filtered.forEach(r=>{
//       const d = r["Depósito"]||"Sin Depósito";
//       depositoCount[d] = (depositoCount[d]||0)+1;
//     });

//     // Renderizar tabla
//    tbody.innerHTML = "";

// filtered.forEach(r => {
//   // Crear fila
//   const tr = document.createElement("tr");

//   // Columnas que quieres mostrar
//   const columnasModal = ["Depósito", "Carrer", "Columna", "Nivell", "Arxiu", "Contenedor"];
//   columnasModal.forEach(key => {
//     const td = document.createElement("td");
//     td.textContent = r[key] || "";
//     tr.appendChild(td);
//   });

//   // Columna Estado clicable
//   const tdEstado = document.createElement("td");
//   tdEstado.textContent = r["Estado"] || "❌ Sin ubicación";
//   const idx = estados.indexOf(r["Estado"]) >= 0 ? estados.indexOf(r["Estado"]) : 2;
//   tdEstado.classList.add(estadoClases[idx]);
//   tdEstado.addEventListener("click", () => {
//     const nuevoIdx = (idx + 1) % estados.length;
//     r["Estado"] = estados[nuevoIdx];       // actualizar modal
//     // sincronizar con tabla principal
//     rows.forEach(rowMain => { if(rowMain === r) rowMain["Estado"] = estados[nuevoIdx]; });
//     renderTable();      // refresca tabla principal
//     renderModalTable(); // refresca modal
//   });
//   tr.appendChild(tdEstado);

//   // Agregar fila a tbody
//   tbody.appendChild(tr);
// });

//     // Totales modal
//     const totalCajas = filtered.length;
//     modalTotales.textContent = `Total cajas mostradas: ${totalCajas}`;
//   }
// })();

// // Añade al final de tu script, después de renderizar las tablas
// // DRAG SCROLL
// document.querySelectorAll('.table-container').forEach(container => {
//   let isDown = false;
//   let startX;
//   let scrollLeft;

//   container.addEventListener('mousedown', e => {
//     isDown = true;
//     startX = e.pageX - container.offsetLeft;
//     scrollLeft = container.scrollLeft;
//   });
//   container.addEventListener('mouseleave', () => isDown = false);
//   container.addEventListener('mouseup', () => isDown = false);
//   container.addEventListener('mousemove', e => {
//     if (!isDown) return;
//     e.preventDefault();
//     const x = e.pageX - container.offsetLeft;
//     const walk = (x - startX) * 2; // velocidad scroll
//     container.scrollLeft = scrollLeft - walk;
//   });
// });

// // MODAL LOGIC
// (function(){
//   const modal = document.getElementById("pickerModal");
//   const openBtn = document.getElementById("openPickerBtn");
//   const closeBtn = modal.querySelector(".closeBtn");
//   const tbodyModal = document.querySelector("#modalTable tbody");
//   const depositoInput = document.getElementById("modalDepositoFiltro");
//   const carrerOrder = document.getElementById("carrerOrder");

//   let lastDeposito = "";
//   let lastOrder = "desc";

//   openBtn.addEventListener("click", ()=> {
//     modal.style.display = "block";
//     depositoInput.value = lastDeposito;
//     carrerOrder.value = lastOrder;
//     renderModalTable();
//   });

//   closeBtn.addEventListener("click", ()=> modal.style.display="none");
//   window.addEventListener("click", e=> { if(e.target==modal) modal.style.display="none"; });

//   depositoInput.addEventListener("input", renderModalTable);
//   carrerOrder.addEventListener("change", renderModalTable);

//   function renderModalTable() {
//     if(!window.rows) return;

//     const filter = depositoInput.value.trim();
//     const order = carrerOrder.value;
//     lastDeposito = filter;
//     lastOrder = order;

//     let filtered = window.rows.filter(r => !filter || (r["Depósito"]||"").includes(filter));
//     filtered.sort((a,b) => {
//       const ca = parseInt(a["Carrer"]||0);
//       const cb = parseInt(b["Carrer"]||0);
//       return order==="desc"? cb-ca : ca-cb;
//     });

//     tbodyModal.innerHTML = "";
//     filtered.forEach(r => {
//       const tr = document.createElement("tr");
//       ["Depósito","Carrer","Columna","Nivell","Contenedor","Arxiu"].forEach(key=>{
//         const td = document.createElement("td");
//         td.textContent = r[key] || "";
//         tr.appendChild(td);
//       });
//       const tdEstado = document.createElement("td");
//       tdEstado.textContent = r["Estado"];
//       tdEstado.className = r["Estado"]==="✅ Localizada" ? "estado-localizada" :
//                          r["Estado"]==="❌ No localizada" ? "estado-no-localizada" : "estado-sin-ubicacion";
//       tdEstado.addEventListener('click', () => {
//         const estados = ["✅ Localizada","❌ No localizada","❌ Sin ubicación"];
//         let idx = estados.indexOf(r["Estado"]);
//         idx = (idx+1)%estados.length;
//         r["Estado"] = estados[idx];
//         renderTable(); // sincroniza tabla principal
//         renderModalTable(); // actualiza modal
//       });
//       tr.appendChild(tdEstado);
//       tbodyModal.appendChild(tr);
//     });

//     // totales modal
//     const totalesModal = document.getElementById("modalTotales");
//     const counts = {"✅ Localizada":0,"❌ No localizada":0,"❌ Sin ubicación":0};
//     filtered.forEach(r=> counts[r["Estado"]]++);
//     totalesModal.textContent = `Totales → Localizada: ${counts["✅ Localizada"]}, No localizada: ${counts["❌ No localizada"]}, Sin ubicación: ${counts["❌ Sin ubicación"]}`;
//   }
// })();





const input1 = document.getElementById('fileInput');
const input2 = document.getElementById('fileInput2');
const tbody = document.querySelector('#dataTable tbody');
const thead = document.querySelector('#tableHead');
const depositoFiltro = document.getElementById('depositoFiltro');
const contenedorFiltro = document.getElementById('contenedorFiltro'); // 🔹 Nuevo filtro
const saveBtn = document.getElementById('saveBtn');
const totalesP = document.getElementById('totales');

let rows = [];
const headersSet = new Set([
  "Cliente","Fecha","Consulta","Servei","Arxiu","Tipus",
  "Depósito","Pis","Carrer","Columna","Nivell",
  "Serie","Contenedor","Estado","Fecha registro"
]);

const estados = ["✅ Localizada","❌ No localizada","❌ Sin ubicación"];
const estadoClases = ["estado-localizada","estado-no-localizada","estado-sin-ubicacion"];

function parseFile(text) {
  const blocks = text.split(/-{3,}|\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const parsedRows = [];

  for (const block of blocks) {
    const row = {};
    const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    for (const line of lines) {
      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        if (value.includes('|')) {
          const parts = value.split('|');
          parts.forEach(p => {
            const sub = p.split(':');
            if(sub.length===2) row[sub[0].trim()] = sub[1].trim();
            else row[key] = sub[0].trim();
          });
        } else row[key] = value;
      } else if (/\d{2}\/\d{2}\/\d{4}/.test(line)) row["Fecha registro"] = line.trim();
      else if (line.startsWith('❌') || line.toLowerCase().includes('pendiente') || line.toLowerCase().includes('no localizada')) row["Estado"]="❌ No localizada";
      else if (line.toLowerCase().includes('encontrado') || line.toLowerCase().includes('localizada')) row["Estado"]="✅ Localizada";
    }

    const deposito = (row["Depósito"] || "").trim();
    row["_depositoEstado"] = deposito? "ok":"fail";
    if(!row["Estado"]) row["Estado"]="❌ Sin ubicación";
    parsedRows.push(row);
  }
  return parsedRows;
}

function renderTable() {
  thead.innerHTML = '';
  tbody.innerHTML = '';

  const trHead = document.createElement('tr');
  headersSet.forEach(h=>{
    const th = document.createElement('th'); th.textContent = h; trHead.appendChild(th);
  });
  thead.appendChild(trHead);

  let counts = {"✅ Localizada":0,"❌ No localizada":0,"❌ Sin ubicación":0};

  rows.filter(r=>{
    const filtroDeposito = depositoFiltro.value.trim().toLowerCase();
    const filtroContenedor = contenedorFiltro.value.trim().toLowerCase();
    const d = (r["Depósito"]||"").toLowerCase();
    const c = (r["Contenedor"]||"").toLowerCase();
    return (!filtroDeposito || d.includes(filtroDeposito)) &&
           (!filtroContenedor || c.includes(filtroContenedor));
  }).forEach(row=>{
    const tr = document.createElement('tr');
    headersSet.forEach(h=>{
      const td = document.createElement('td');
      const value = row[h]||"";

      if(h==="Depósito") {
        td.textContent = value;
        td.classList.add(row["_depositoEstado"]==="ok"?"deposito-ok":"deposito-fail");
      } else if(h==="Estado") {
        td.textContent = value;
        const idx = estados.indexOf(value);
        td.classList.add(estadoClases[idx]);
        td.addEventListener('click', ()=>{
          const nuevoIdx = (idx+1)%estados.length;
          row["Estado"]=estados[nuevoIdx];
          renderTable();
        });
        counts[value]++;
      } else td.textContent = value;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  totalesP.textContent = `Totales → Localizada: ${counts["✅ Localizada"]}, No localizada: ${counts["❌ No localizada"]}, Sin ubicación: ${counts["❌ Sin ubicación"]}`;
}

// === CARGA DE ARCHIVOS ===
input1.addEventListener('change', async e=>{
  const text = await e.target.files[0].text();
  rows = parseFile(text);
  window.rows = rows;
  renderTable();
});

input2.addEventListener('change', async e=>{
  const text = await e.target.files[0].text();
  rows = rows.concat(parseFile(text));
  window.rows = rows;
  renderTable();
});

depositoFiltro.addEventListener('input', renderTable);
contenedorFiltro.addEventListener('input', renderTable);

// === GUARDAR ARCHIVO ===
saveBtn.addEventListener('click', ()=>{
  let content = "";
  rows.forEach(r=>{
    let block = "";
    headersSet.forEach(h=>{
      if(r[h]) block += `${h}: ${r[h]} | `;
    });
    block = block.slice(0,-3) + "\n"; 
    content += block + "\n---\n";
  });
  const blob = new Blob([content], {type:"text/plain"});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = "archivo_modificado.dat";
  a.click();
});


(function(){
  const modal = document.getElementById("pickerModal");
  const openBtn = document.getElementById("openPickerBtn");
  const closeBtn = modal.querySelector(".closeBtn");
  const tbody = document.querySelector("#modalTable tbody");
  const filtroContenedor = document.getElementById("modalContenedorFiltro");
  const carrerOrder = document.getElementById("carrerOrder");
  const modalTotales = document.getElementById("modalTotales");

  let lastFiltro = "";
  let lastOrder = "desc";

  const estados = ["✅ Localizada","❌ No localizada","❌ Sin ubicación"];
  const estadoClases = ["estado-localizada","estado-no-localizada","estado-sin-ubicacion"];

  openBtn.addEventListener("click", ()=>{
    if(!window.rows || window.rows.length===0) return alert("Primero carga un archivo");
    modal.style.display = "block";
    filtroContenedor.value = lastFiltro;
    carrerOrder.value = lastOrder;
    renderModalTable();
  });

  closeBtn.addEventListener("click", ()=> modal.style.display = "none");
  window.addEventListener("click", e=> { if(e.target==modal) modal.style.display="none"; });

  filtroContenedor.addEventListener("input", renderModalTable);
  carrerOrder.addEventListener("change", renderModalTable);

  function renderModalTable(){
    const filter = filtroContenedor.value.trim().toLowerCase();
    const order = carrerOrder.value;
    lastFiltro = filter;
    lastOrder = order;

    // Filtrado por Contenedor
    let filtered = window.rows.filter(r =>
      !filter ||
      (r["Contenedor"] || "").toLowerCase().includes(filter) ||
      (r["Depósito"] || "").toLowerCase().includes(filter)
    );

    // Ordenar Carrer
    filtered.sort((a,b)=>{
      const ca = parseInt((a["Carrer"]||"0").trim()) || 0;
      const cb = parseInt((b["Carrer"]||"0").trim()) || 0;
      return order==="desc"? cb - ca : ca - cb;
    });

    // Renderizar tabla
    tbody.innerHTML = "";

    filtered.forEach(r => {
      const tr = document.createElement("tr");

      const columnasModal = ["Depósito", "Carrer", "Columna", "Nivell", "Arxiu", "Contenedor"];
      columnasModal.forEach(key => {
        const td = document.createElement("td");
        td.textContent = r[key] || "";
        tr.appendChild(td);
      });

      // Columna Estado clicable
      const tdEstado = document.createElement("td");
      tdEstado.textContent = r["Estado"] || "❌ Sin ubicación";
      const idx = estados.indexOf(r["Estado"]) >= 0 ? estados.indexOf(r["Estado"]) : 2;
      tdEstado.classList.add(estadoClases[idx]);
      tdEstado.addEventListener("click", () => {
        const nuevoIdx = (idx + 1) % estados.length;
        r["Estado"] = estados[nuevoIdx];
        renderTable();      // refresca tabla principal
        renderModalTable(); // refresca modal
      });
      tr.appendChild(tdEstado);
      tbody.appendChild(tr);
    });

    // Totales modal
    const totalCajas = filtered.length;
    modalTotales.textContent = `Total cajas mostradas: ${totalCajas}`;
  }
})();

