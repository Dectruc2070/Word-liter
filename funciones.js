// =========================================
// 1. GESTIÓN DE PESTAÑAS Y MENÚS
// =========================================
function cambiarTab(idTab, btn) {
  // Ocultar todos los contenidos
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  // Quitar la clase active de todos los botones
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  
  // Activar la pestaña seleccionada
  document.getElementById(idTab).classList.add('active');
  btn.classList.add('active');
}

function toggleMenu(id) {
  const menu = document.getElementById(id);
  menu.classList.toggle('show');
}

function toggleAcordeon(id) {
  const panel = document.getElementById(id);
  // Alternar entre ocultar y mostrar
  if (panel.style.display === "block") {
    panel.style.display = "none";
  } else {
    panel.style.display = "block";
  }
}

// Cierra los menús desplegables si se hace clic fuera de ellos
window.onclick = function(event) {
  if (!event.target.matches('.grupo-ribbon button')) {
    let dropdowns = document.getElementsByClassName("dropdown-menu");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// =========================================
// 2. COMANDOS DE FORMATO (TEXTO)
// =========================================
// Incluye Deshacer ('undo') y Rehacer ('redo')
function ejecutar(comando, valor = null) { 
  document.execCommand(comando, false, valor); 
  document.querySelector('.hoja').focus(); 
}

function cambiarFuente(fuente) { 
  document.execCommand('fontName', false, fuente); 
  document.querySelector('.hoja').focus(); 
}

function cambiarTamanoManual(tamano) {
  const sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) return;
  
  const range = sel.getRangeAt(0);
  const span = document.createElement('span');
  span.style.fontSize = tamano + 'pt';
  range.surroundContents(span);
}

function cambiarColorLetra(colorHex) {
  document.execCommand('foreColor', false, colorHex);
  document.querySelector('.hoja').focus();
}

// =========================================
// 3. MÁRGENES, ORIENTACIÓN Y CONTADOR
// =========================================
function aplicarMargen(sup, inf, izq, der) {
  const hoja = document.querySelector('.hoja');
  hoja.style.paddingTop = sup + 'cm';
  hoja.style.paddingBottom = inf + 'cm';
  hoja.style.paddingLeft = izq + 'cm';
  hoja.style.paddingRight = der + 'cm';
  
  const menu = document.getElementById('menuMargenes');
  if(menu) menu.classList.remove('show');
}

function aplicarMargenesPersonalizados() {
  const sup = document.getElementById('mSup').value;
  const inf = document.getElementById('mInf').value;
  const izq = document.getElementById('mIzq').value;
  const der = document.getElementById('mDer').value;
  
  aplicarMargen(sup, inf, izq, der);
}

function cambiarOrientacion(tipo) {
  const hoja = document.querySelector('.hoja');
  if (tipo === 'horizontal') {
    hoja.style.width = '29.7cm';
    hoja.style.minHeight = '21cm';
  } else {
    // vertical
    hoja.style.width = '21cm';
    hoja.style.minHeight = '29.7cm';
  }
}

function actualizarContador() {
  let texto = document.querySelector('.hoja').innerText.trim();
  // Divide por espacios para contar palabras
  const palabras = texto === "" ? 0 : texto.split(/\s+/).length;
  document.getElementById('contadorPalabras').innerText = `Palabras: ${palabras}`;
}

// =========================================
// 4. GESTIÓN DE MODALES (Ventanas)
// =========================================
function abrirModal(id) { 
  document.getElementById(id).style.display = 'flex'; 
}

function cerrarModal(id) { 
  document.getElementById(id).style.display = 'none'; 
}

function abrirModalOpcionesAbrir() { 
  abrirModal('modalAbrirOpciones'); 
}

// =========================================
// 5. EXPORTAR Y GUARDAR
// =========================================
function ejecutarExportacion() {
  const nombre = document.getElementById('nombreExportar').value.trim() || 'DocumentoSinNombre';
  const formato = document.getElementById('formatoExportar').value;
  const hoja = document.querySelector('.hoja');
  
  let contenidoFinal = '';
  let mimeType = '';

  if (formato === 'txt') {
    contenidoFinal = hoja.innerText;
    mimeType = 'text/plain';
  } else if (formato === 'html') {
    contenidoFinal = hoja.innerHTML;
    mimeType = 'text/html';
  } else if (formato === 'doc') {
    contenidoFinal = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>${hoja.innerHTML}</body></html>`;
    mimeType = 'application/msword';
  }

  const blob = new Blob([contenidoFinal], { type: mimeType });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${nombre}.${formato}`;
  a.click();
  cerrarModal('modalExportar');
}

function ejecutarGuardadoInterno() {
  const nombre = document.getElementById('nombreGuardar').value.trim() || 'Documento Sin Título';
  const desc = document.getElementById('descGuardar').value.trim() || 'Sin descripción.';
  const contenidoHTML = document.querySelector('.hoja').innerHTML;
  
  const archivo = { 
    id: Date.now(), 
    nombre: nombre, 
    descripcion: desc, 
    fecha: new Date().toLocaleString(), 
    contenido: contenidoHTML 
  };
  
  let archivosGuardados = JSON.parse(localStorage.getItem('MisDocumentosWordJS') || '[]');
  archivosGuardados.push(archivo);
  localStorage.setItem('MisDocumentosWordJS', JSON.stringify(archivosGuardados));
  
  document.getElementById('tituloDocPrin').innerText = `${nombre} - Microsoft Word`;
  cerrarModal('modalGuardarInterno');
  alert('¡Documento guardado con éxito!');
}

// =========================================
// 6. ABRIR ARCHIVOS (LOCALES E INTERNOS)
// =========================================
function leerArchivoLocal(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const nombreExt = archivo.name.toLowerCase();
  const hoja = document.querySelector('.hoja');

  // Si es TXT o HTML
  if (nombreExt.endsWith('.txt') || nombreExt.endsWith('.html') || nombreExt.endsWith('.htm')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      if (nombreExt.endsWith('.txt')) {
         hoja.innerHTML = e.target.result.replace(/\n/g, '<br>');
      } else {
         hoja.innerHTML = e.target.result;
      }
      actualizarContador();
      document.getElementById('tituloDocPrin').innerText = `${archivo.name} - Microsoft Word`;
    };
    reader.readAsText(archivo);
  } 
  // Si es DOCX (Word)
  else if (nombreExt.endsWith('.docx')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const arrayBuffer = e.target.result;
      // Usamos la librería Mammoth.js
      mammoth.convertToHtml({arrayBuffer: arrayBuffer})
        .then(function(result) {
          hoja.innerHTML = result.value;
          actualizarContador();
          document.getElementById('tituloDocPrin').innerText = `${archivo.name} - Microsoft Word`;
        })
        .catch(function(err) {
          alert("Hubo un error al intentar leer el archivo DOCX: " + err.message);
        });
    };
    reader.readAsArrayBuffer(archivo);
  } 
  // Si es PDF
  else if (nombreExt.endsWith('.pdf')) {
    alert("¡Atención!\n\nLos archivos PDF son como 'imágenes'. Te recomendamos extraer el texto de tu PDF y pegarlo aquí, o abrir un archivo .txt o .docx directamente.");
  } 
  else {
    alert("Formato no soportado para edición directa.");
  }

  // Limpiar el input para que permita abrir el mismo archivo de nuevo si se desea
  event.target.value = ''; 
}

function abrirModalListaInternos() {
  cerrarModal('modalAbrirOpciones');
  const contenedor = document.getElementById('contenedorListaArchivos');
  const archivos = JSON.parse(localStorage.getItem('MisDocumentosWordJS') || '[]');
  
  if (archivos.length === 0) {
    contenedor.innerHTML = '<p style="text-align:center; color:#555;">No tienes archivos guardados aún.</p>';
  } else {
    let html = '';
    // Mostrar los más recientes primero
    archivos.reverse().forEach(arch => {
      html += `<div class="archivo-item">
        <div>
          <h4>${arch.nombre}</h4>
          <p>${arch.fecha}</p>
        </div>
        <div>
          <button class="btn-abrir" onclick="cargarDocumentoInterno(${arch.id})">Abrir</button>
          <button class="btn-borrar" onclick="eliminarDocumentoInterno(${arch.id})">Borrar</button>
        </div>
      </div>`;
    });
    contenedor.innerHTML = html;
  }
  abrirModal('modalListaInternos');
}

function cargarDocumentoInterno(id) {
  const archivos = JSON.parse(localStorage.getItem('MisDocumentosWordJS') || '[]');
  const archivo = archivos.find(a => a.id === id);
  if (archivo) {
    document.querySelector('.hoja').innerHTML = archivo.contenido;
    document.getElementById('tituloDocPrin').innerText = `${archivo.nombre} - Microsoft Word`;
    actualizarContador();
    cerrarModal('modalListaInternos');
  }
}

function eliminarDocumentoInterno(id) {
  let archivos = JSON.parse(localStorage.getItem('MisDocumentosWordJS') || '[]');
  archivos = archivos.filter(a => a.id !== id);
  localStorage.setItem('MisDocumentosWordJS', JSON.stringify(archivos));
  abrirModalListaInternos(); // Recargar la lista
}

// =========================================
// 7. DICCIONARIO
// =========================================
function buscarPalabra() {
  const palabra = document.getElementById('palabraBuscar').value.trim();
  const resultados = document.getElementById('resultadosDiccionario');
  
  if (palabra === "") {
    resultados.innerHTML = "<em>Por favor, escribe una palabra primero.</em>";
    return;
  }

  // Aquí en el futuro podríamos conectar una API real (como RAE). 
  // Por ahora mostramos una búsqueda simulada.
  resultados.innerHTML = `<em>Buscando significado de <strong>"${palabra}"</strong> en la web... (Función en desarrollo)</em>`;
}
