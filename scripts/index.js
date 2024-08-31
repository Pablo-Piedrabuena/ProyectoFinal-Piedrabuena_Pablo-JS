//CLASES: Importar Clases CarritoCompra
import { carritoCompra } from './clases.js';
import { cargarProductosDesdeJSON, mensajeAlerta, filtraProductos, agregaEventosAElNavDeFiltroProductos } from './funciones.js';


//LLAMADA A FUNCIONES
// Llamar a la función que crear array productos.
cargarProductosDesdeJSON().then(productos => {
    //Cargo los prodcutos una vez que se se cumplio la promesa
    filtraProductos("Todos")
}).catch(error => {
    //Ejecuto mensaje de error si algo sale mal
    mensajeAlerta("Se produjo un error al intentar cargar los productos." + error)

})
// Llamar a la función que le asigna evento click al nav que uso para filtro.
agregaEventosAElNavDeFiltroProductos()



  // Crear un nuevo carrito tomando la Clase carritoCompra
const miCarrito = new carritoCompra();






