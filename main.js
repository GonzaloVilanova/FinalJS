// Variables

let carrito = [];
let total = 0;
let deudasJSON = [];
let cotizacionDolar;

$(document).ready(function () {
  obtenerValorDolar();
});

const DOMitems = document.querySelector("#items");
const DOMcarrito = document.querySelector("#carrito");
const DOMtotal = document.querySelector("#total");
const DOMbotonVaciar = document.querySelector("#boton-vaciar");
const DOMbotonComprar = document.querySelector("#boton-comprar");
const miLocalStorage = window.localStorage;

// Funciones

// Genera cards de deudas a partir de la base de datos (datos.js).

/*    function renderizarDeudas() {
        BaseDeudas.forEach((info) => {
            // Estructura
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');
            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            // Titulo
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre + " - " + info.anio;
            // Imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);
            // Saldo
            const miNodoDeuda = document.createElement('p');
            miNodoDeuda.classList.add('card-text');
            miNodoDeuda.textContent = '$' + info.Deuda;
            // Boton 
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = '+';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', AddProductoAlCarrito);
            // AGREGAR UN DESPLEGABLE CON OPCIONES ????????
            // Insertamos child en HTML
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoDeuda);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }
 */
// Con JQUERY
function renderizarDeudas() {
  for (const deuda of deudasJSON) {
    $("#items").append(`
        <div class="card col-sm-3 m-2 p-1">
        <img src='${
          deuda.imagen
        }' class="rounded mx-auto d-block m-3" style="height: 70px; width: 150px" alt="...">  
        <h5 class="card-title text-center">${deuda.nombre} - ${deuda.anio}</h5>
        <button class='btn btn-primary' id="btn${deuda.id}" selector="${
      deuda.id
    }">$${deuda.deuda}</button>
        <h6 class="card-title text-center">UDS ${(
          deuda.deuda / cotizacionDolar
        ).toFixed(2)}</h6>
        </div>`);

    //Evento Botones para Agregar al carro
    $(`#btn${deuda.id}`).on("click", function () {
      addProductoAlCarrito(deuda);
    });
  }
}

// Añade Deuda al carro 2
function addProductoAlCarrito(deudaMarcada) {
  let encontrado = carrito.find((p) => p.id == deudaMarcada.id);
  console.log(encontrado);

  if (encontrado) {
    console.log("el elemento ya se encuentra en el carrito");
    //pido al carro la posicion del producto
    let posicion = carrito.findIndex((p) => p.id == deudaMarcada.id);
    console.log(posicion);
    carrito[posicion].cant += 1;
    $(`#${deudaMarcada.id}`).empty();
    $(`#${deudaMarcada.id}`).append("Cantidad: ", carrito[posicion].cant);
  } else {
    // Si el elemento no se encuentra en el carrito
    // se agrega el objeto al mismo
    console.log("entra primer item");
    let deudaACarrito = new DeudasSeleccionadas(deudaMarcada);
    carrito.push(deudaACarrito);
    console.log("carrito en addProducto ", carrito);

    //agregamos una nueva fila a la tabla de carrito
    $("#carrito").append(`
            <li class="list-group-item', 'text-right', 'mx-2" id='fila${deudaACarrito.nombre}'>
             ${deudaACarrito.nombre} x $${deudaACarrito.deuda} Id N:${deudaACarrito.id}   
             <button class="btn btn-danger" id='${deudaACarrito.id}'>Cantidad: 1</button>                   
             </li>`);
  }

  guardarCarritoEnLocalStorage();
  calcularTotal();
}

/* function calcularTotal2() {
  let suma = 0;
  for (const elemento of carrito) {
    suma = suma + elemento.deuda * elemento.cant;
  }
  console.log("suma calcular total 2", suma);
  return suma;
}
 */
/**
 * Genera todos los productos guardados en el carrito
 */
function renderizarCarrito() {
  // Vaciamos todo el html
  DOMcarrito.textContent = ""; // inicia vacio

  // Saca duplicados
  const carritoSinDuplicados = [...new Set(carrito)]; // Spread Op "une" -- Set genera un nuevo Objeto con el contenido de Carrito... visto en video y funciono (?)

  // Generamos los "Nodos" a partir de carrito
  carritoSinDuplicados.forEach((item) => {
    // Obtenemos el item que necesitamos de la variable base de datos
    const miItem = deudasJSON.filter((itemBaseDatos) => {
      // ¿Coincide las id? 1 caso posible
      return itemBaseDatos.id === parseInt(item);
    });
    // Cuenta el número de veces que se repite la deuda
    const numeroUnidadesItem = carrito.reduce((total, itemId) => {
      // Agupa por ID => Suma 1, caso contrario agrega
      return itemId === item ? (total += 1) : total;
    }, 0);

    // nodo item del carrito
    const miNodo = document.createElement("li");
    miNodo.classList.add("list-group-item", "text-right", "mx-2");
    miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].Deuda}$`;

    // Boton de borrar
    const miBoton = document.createElement("button");
    miBoton.classList.add("btn", "btn-danger", "mx-5");
    miBoton.textContent = "X";
    miBoton.style.marginLeft = "1rem";
    miBoton.dataset.item = item;
    miBoton.addEventListener("click", borrarItemCarrito);
    // Mezclamos nodos
    miNodo.appendChild(miBoton);
    DOMcarrito.appendChild(miNodo);
  });
}

/// ARMAR PARA RENDERIZAR EL CARRO DE NUEVO!!! DESDE ACA
function RenderCarroLS() {
  let ContenidoLS = JSON.parse(localStorage.getItem("carrito"));
  console.log("Contenido LS".ContenidoLS);
  if (ContenidoLS) {
    let array = [];
    for (let i = 0; i < ContenidoLS.lenght; i++) {
      console.log("items totales", ContenidoLS[i].deuda);
      array.push(new DeudasSeleccionadas(ContenidoLS[i]));
    }
  }
}

/**
 * Evento para borrar un elemento del carrito
 */
function borrarItemCarrito(evento) {
  // Obtenemos el producto ID que hay en el boton pulsado
  const id = evento.target.dataset.item;
  // Borramos todos los productos
  carrito = carrito.filter((carritoId) => {
    return carritoId !== id;
  });
  // volvemos a renderizar
  renderizarCarrito();
  // Calculamos de nuevo el costo
  calcularTotal();
  // Actualizamos el LocalStorage
  guardarCarritoEnLocalStorage();
}

/**
 * Calcula deuda total teniendo en cuenta los pagos que se hacen varias veces
 */
function calcularTotal() {
  let total = carrito.reduce(
    (total, elemento) =>
      total + parseInt(elemento.deuda) * parseInt(elemento.cant),
    0
  );

  // Renderizamos el precio en el HTML
  DOMtotal.textContent = "";
  DOMtotal.textContent = `$${total}`;
}

/**
 * Varia el carrito y vuelve a dibujarlo
 */
function vaciarCarrito() {
  // Limpiamos los productos guardados
  carrito = [];
  // Renderizamos los cambios
  renderizarCarrito();
  calcularTotal();
  // Borra LocalStorage
  localStorage.clear();
}

function FinalizaCompra() {
  // Limpiamos los productos guardados
  carrito = [];
  // Renderizamos los cambios
  renderizarCarrito();
  // Borra LocalStorage
  localStorage.clear();
  // Borra Total
  calcularTotal(0);

  alert(
    "Gracias!! Los SweetAlers fueron desactivados temporalmente... procedemos a completar la info de pago"
  );
}

function guardarCarritoEnLocalStorage() {
  miLocalStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage() {
  // ¿Existe un carrito previo guardado en LocalStorage?
  if (miLocalStorage.getItem("carrito")) {
    // Carga la información
    carrito = JSON.parse(miLocalStorage.getItem("carrito"));
    console.log("Si hay algo es".carrito);
  }
}

// Eventos
DOMbotonVaciar.addEventListener("click", vaciarCarrito);
DOMbotonComprar.addEventListener("click", FinalizaCompra);

// Inicio
cargarCarritoDeLocalStorage();
renderizarDeudas();
calcularTotal();
renderizarCarrito();

//GETJSON de deudas.json
function baseJson() {
  $.getJSON("./deudas.json", function (respuesta, estado) {
    if (estado == "success") {
      deudasJSON = respuesta;
      console.log(deudasJSON);
      renderizarDeudas();
    }
  });
}

//Dolar Compra Cotiz Real - Usamos promedio
function obtenerValorDolar() {
  const URLDOLAR = "https://api-dolar-argentina.herokuapp.com/api/dolarblue";
  $.ajax({
    method: "GET",
    url: URLDOLAR,
    success: function (data) {
      CotizDolarCompra = data.compra;
      CotizDolarVenta = data.venta;
      cotizacionDolar = (parseFloat(data.compra) + parseFloat(data.venta)) / 2;
      console.log(cotizacionDolar);

      baseJson();
    },
  });
}
