export class carritoCompra {
    constructor() {
        this.carrito=[];
    }
    
    agregarProducto(producto) {
        //agrego un identificador.
        producto.totalCompra = producto.precio * producto.cantidad
        //agrego el objeto al array carrito
        this.carrito.push(producto);
        /* console.log('Producto agregado al carrito' + producto.nombre); */
    }

    eliminarProducto(id) {
        this.carrito = this.carrito.filter(producto => producto.id !== id);
        /* console.log('Producto eliminado del carrito'); */
    }
    
    modificarProducto(id, nuevoProducto) {
        const indice = this.carrito.findIndex(producto => producto.id === id);
        if (indice !== -1) {
            //agrego un identificador.
            nuevoProducto.totalCompra = nuevoProducto.precio * nuevoProducto.cantidad
            //Modifico el objeto en el  array carrito
            this.carrito[indice] = nuevoProducto;
            /* console.log('Producto modificado'); */
        } else {
            /* console.log('Producto no encontrado'); */
        }
    }
}