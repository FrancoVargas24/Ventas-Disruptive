let configCategorias = {};

// Cargar configuración al inicio
fetch('json/0categorias-config.json')
    .then(res => res.json())
    .then(config => {
        configCategorias = config;
        console.log('✅ Configuración de categorías cargada');
    })
    .catch(err => console.error('Error cargando configuración:', err));

// Función mejorada que busca tanto por clave como por valor
function obtenerArchivoCategoria(categoria) {
    // 1. Buscar en configuración por clave exacta
    if (configCategorias[categoria]) {
        return configCategorias[categoria];
    }
    
    // 2. Buscar en configuración por valor (nombre de archivo)
    const archivoEncontrado = Object.values(configCategorias).find(archivo => 
        archivo.toLowerCase() === `${categoria.toLowerCase()}.json`
    );
    if (archivoEncontrado) {
        return archivoEncontrado;
    }
    
    // 3. Intentar construcción directa del nombre
    return `${categoria}.json`;
}

// Función para cargar productos por categoría (sin cambios)
function cargarProductosCategoria(categoria, contenedorId) {
    const archivo = obtenerArchivoCategoria(categoria);
    
    fetch(`json/${archivo}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(imagenes => {
            console.log(`✅ Cargados ${imagenes.length} productos de ${archivo}`);
            
            const contenedor = document.getElementById(contenedorId);
            if (!contenedor) return;
            
            // Limpiar contenedor
            contenedor.innerHTML = '';
            
            imagenes.forEach(nombre => {
                const div = document.createElement('div');
                div.className = 'product-card';
                const img = document.createElement('img');
                img.src = 'stickers/' + nombre;
                img.alt = 'Producto';
                const btnContainer = document.createElement('div');
                btnContainer.className = 'btn-container';
                btnContainer.dataset.codigo = nombre;
                div.appendChild(img);
                div.appendChild(btnContainer);
                contenedor.appendChild(div);
                
                if (typeof actualizarBoton === 'function') {
                    actualizarBoton(nombre);
                }
            });
            
            if (typeof calcularTotales === 'function') {
                calcularTotales();
            }
        })
        .catch(err => {
            console.error(`Error cargando ${archivo}:`, err);
            const contenedor = document.getElementById(contenedorId);
            if (contenedor) {
                contenedor.innerHTML = '<p>Error cargando productos.</p>';
            }
        });
}