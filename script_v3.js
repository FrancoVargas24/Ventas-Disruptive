
// --- NAVBAR Y TIMELINE ---
let lastScrollTop = 0;
let lastScrollEnd = 100;
const navbar = document.querySelector('.navbar');
const timeLine = document.querySelector('.cart-timeline');

window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    // Navbar
    if (navbar) {
        navbar.style.top = (scrollTop > lastScrollTop) ? '-100px' : '0';
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    // Timeline
    if (timeLine) {
        timeLine.style.bottom = (scrollTop > lastScrollEnd) ? '0px' : '-150px';
    }
    lastScrollEnd = scrollTop <= 0 ? 0 : scrollTop;
});

// --- CARRUSEL ---
const carrusel = document.getElementById('carrusel');
if (carrusel) {
    let carruselIndex = 0;
    const totalImgs = carrusel.children.length;
    setInterval(() => {
        carruselIndex = (carruselIndex + 1) % totalImgs;
        carrusel.style.transform = `translateX(-${carruselIndex * 100}%)`;
    }, 5000);
}

// --- CARRITO ---
let carrito = {};
const maxTotal = 8000;
const precioBase = 400;
const precioDescuento = 300;

function cargarCarritoGuardado() {
    const guardado = localStorage.getItem('carrito');
    if (guardado) carrito = JSON.parse(guardado);
}
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}
function calcularTotales() {
    const cantidadTotal = Object.values(carrito).reduce((a, b) => a + b, 0);
    let precioUnitario;
    let mensaje;

    if (cantidadTotal >= 500) {
        precioUnitario = 250;
        mensaje = "PRECIO POR MAYOR";
    } else if (cantidadTotal >= 20) {
        precioUnitario = precioDescuento;
        mensaje = "¡Precio mejorado!";
    } else {
        precioUnitario = precioBase;
        mensaje = `Te faltan ${20 - cantidadTotal} para mejorar el precio!`;
    }

    const total = cantidadTotal * precioUnitario;
    if (document.getElementById('cart-total')) document.getElementById('cart-total').textContent = total;
    if (document.getElementById('cart-unitario')) document.getElementById('cart-unitario').textContent = precioUnitario;
    if (document.getElementById('cart-cantidad')) document.getElementById('cart-cantidad').textContent = cantidadTotal;
    if (document.getElementById('cart-message')) document.getElementById('cart-message').textContent = mensaje;
    if (document.getElementById('cart-bar')) {
        document.getElementById('cart-bar').style.width = Math.min((total / maxTotal) * 100, 100) + '%';
    }
}
function agregarProducto(codigo) {
    carrito[codigo] = (carrito[codigo] || 0) + 1;
    guardarCarrito();
    actualizarBoton(codigo);
    calcularTotales();
}
function quitarProducto(codigo) {
    if (carrito[codigo]) {
        carrito[codigo]--;
        if (carrito[codigo] <= 0) delete carrito[codigo];
    }
    guardarCarrito();
    actualizarBoton(codigo);
    calcularTotales();
}


 function actualizarBoton(codigo) {
    const btnContenedor = document.querySelector(`.btn-container[data-codigo="${codigo}"]`);
    const cantidad = carrito[codigo] || 0;

    if (!btnContenedor) return;

    // Si hay cantidad, mostrar input y sumar/restar
    if (cantidad > 0) {
        btnContenedor.innerHTML = `
            <button class="btn-restar" title="Quitar uno">−</button>
            <input type="number" min="1" max="999" value="${cantidad}" class="input-cantidad">
            <button class="btn-sumar" title="Agregar uno">+</button>
        `;
        const input = btnContenedor.querySelector('.input-cantidad');
        btnContenedor.querySelector('.btn-sumar').onclick = () => {
            carrito[codigo]++;
            guardarCarrito();
            actualizarBoton(codigo);
            calcularTotales();
        };
        btnContenedor.querySelector('.btn-restar').onclick = () => {
            carrito[codigo]--;
            if (carrito[codigo] <= 0) delete carrito[codigo];
            guardarCarrito();
            actualizarBoton(codigo);
            calcularTotales();
        };
        input.onchange = () => {
            let valor = parseInt(input.value, 10);
            if (isNaN(valor) || valor < 1) valor = 1;
            carrito[codigo] = valor;
            guardarCarrito();
            actualizarBoton(codigo);
            calcularTotales();
        };
    } else {
        // Si no hay cantidad, solo mostrar el botón Agregar
        btnContenedor.innerHTML = `<button style="height: 36px;" class="btn-agregar">Agregar</button>`;
        btnContenedor.querySelector('.btn-agregar').onclick = () => {
            carrito[codigo] = 1;
            guardarCarrito();
            actualizarBoton(codigo);
            calcularTotales();
        };
    }
}

function enviarPorWhatsApp() {
    const cantidadTotal = Object.values(carrito).reduce((a, b) => a + b, 0);
    if (cantidadTotal === 0) {
        alert('El carrito está vacío. Agregá stickers antes de enviar el pedido.');
        return;
    }
    const numero = '5491123935400';
const precioUnitario = cantidadTotal >= 500 ? 250 : (cantidadTotal >= 20 ? precioDescuento : precioBase);    const total = cantidadTotal * precioUnitario;

    // Generar número de pedido único
    const ahora = new Date();
    const pedidoId = [
        ahora.getFullYear(),
        String(ahora.getMonth() + 1).padStart(2, '0'),
        String(ahora.getDate()).padStart(2, '0'),
        String(ahora.getHours()).padStart(2, '0'),
        String(ahora.getMinutes()).padStart(2, '0'),
        String(ahora.getSeconds()).padStart(2, '0')
    ].join('');

    const lista = Object.entries(carrito)
        .map(([codigo, cant]) => {
            const nombre = codigo.split('/').pop().replace(/\.[^/.]+$/, '');
            return `${nombre} x${cant}`;
        })
        .join('\n');
    const mensaje = `Hola! Quiero pedir:\n\nNúmero de pedido: ${pedidoId}\n\n${lista}\n\nCantidad total: ${cantidadTotal}\nPrecio unitario: $${precioUnitario}\nTotal: $${total}`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}


// --- NAVBAR MOBILE: Cerrar menú al hacer click en un link ---
document.querySelectorAll('#navbar-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navbar-links').classList.remove('active');
    });
});
document.getElementById('navbar-toggle').onclick = function () {
    document.getElementById('navbar-links').classList.toggle('active');
};

// --- FOOTER Y SCROLL SUAVE ---
fetch('footer.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    })
    .catch(err => console.error('Error al cargar footer:', err));

const contactoLink = document.querySelector('a[href="#contacto"]');
if (contactoLink) {
    contactoLink.addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
    });
}