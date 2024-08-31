import { carritoCompra } from './clases.js'
  // Crear un nuevo carrito tomando la Clase carritoCompra

//VARIABLES/CONSTANTES-------------------------------------------------------------------------------------------------***
let varFiltro="Crema"
let productosPorCategoria
let productos=[]
let idProductoSeleccionado=""
let productoSeleccionadoDOM=""
let elementoSeleccioanado=[]
//Seccion nav para filtro de prodcutos
const contenedorGaleriaProductos = document.getElementById("galeriaProductos");
const btnMuestraTodosLosProductos = document.getElementById("filtroTodosLosProductos");
const btnMuestraProdcutoQueso = document.getElementById("filtroQuesos");
const btnMuestraProdcutoCrema = document.getElementById("filtroCremaLeche");
const btnMuestraProdcutoManteca = document.getElementById("filtroManteca");
const btnMuestraProdcutoLeche = document.getElementById("filtroLeche");
const carritoDOM = document.getElementById("contendor-carrito__contenedor-articulos");
const mainHTML = document.querySelector("main");

//FUNCIONES------------------------------------------------------------------------------------------------------------***

/*Esta funcion obtiene los datos que estan en el Json productos, luego los guarda en el localStorage (bdProductos)
y luego los trae al Arrray productos, hago esto para poder usar el localstorage como BD e ir guardando el stock
que tiene cada producto y así tener que evitar crear un servidor que modifique el archivo JSON.*/

export async function cargarProductosDesdeJSON() {    
    let productosLocalStorage=[]
    // Obtener los productos del localStorage
    productosLocalStorage = localStorage.getItem('bdProductos')
    // Si no existen el array de objeto bdProductos en el localStorage, lo crea
    if (!productosLocalStorage) {
        // Obtener los productos desde el archivo JSON
        const response = await fetch('../scripts/productos.json')
        const productosJSON = await response.json()
        //Crea bdProductos en localStorage
        localStorage.setItem('bdProductos', JSON.stringify(productosJSON))
    }
    // Obtener los productos del localStorage y lo asigna al array productos.
    productosLocalStorage = localStorage.getItem('bdProductos')
    productos = JSON.parse(productosLocalStorage)
}



//Funcion para dar mensaje de alerta
export function mensajeAlerta(mensaje){
    Swal.fire({
        text: mensaje,
        icon: "error",
        confirmButtonColor:"#135D87"
    })
}


function productoSeleccionado(){
    elementoSeleccioanado = productos.find((el)=>{
        return el.id===parseInt(idProductoSeleccionado)
    })
    const itemIMG = document.getElementById("agregarProducto-Carrito__itemIMG");
    const itemNombreProducto = document.getElementById("agregarProducto-Carrito__item-nombre-producto");
    const itemPrecioProducto = document.getElementById("agregarProducto-Carrito__item-precio-producto");
    const itemDescripcionProducto = document.getElementById("agregarProducto-Carrito__item-descripcion-producto");
    const itemStockProducto = document.getElementById("agregarProducto-Carrito__item-stock-producto");

    itemIMG.src=elementoSeleccioanado.img;
    itemNombreProducto.innerHTML=elementoSeleccioanado.nombre;
    itemPrecioProducto.innerHTML="$ "+elementoSeleccioanado.precio.toFixed(2);
    itemDescripcionProducto.innerHTML=elementoSeleccioanado.descripción;
    itemStockProducto.innerHTML=elementoSeleccioanado.stock;
}

function validaStockDisponible(valor){
    let elementoSeleccionado = productos.find((el)=>{
        return el.id===parseInt(idProductoSeleccionado)
    })
    if(elementoSeleccionado.stock < valor){
        return false
    }
}

//Agrega evento Click a Botones de compra que hay en cada producto
function agregaEventosALosBotonesComprar(){
    const arrayBotones =Array.from(document.getElementsByClassName("comprar"))
    const seccionmodalAgregarProductoCarrito=document.getElementById("modal-agregarProducto-Carrito")
    arrayBotones.forEach(e =>{
        e.addEventListener('click', (e) => {
            productoSeleccionadoDOM = document.getElementById(e.target.parentElement.parentElement.id)
            idProductoSeleccionado=(e.target.parentElement.children[3].innerText)
            seccionmodalAgregarProductoCarrito.classList.remove('ocultar')
            seccionmodalAgregarProductoCarrito.classList.add('flex')
            seccionmodalAgregarProductoCarrito.innerHTML +=`
                    <div class="agregarProducto-Carrito__ConetenedorImagen ">
                        <img src="../imagenes/productos/crema-leche-balde.png" alt="" class="agregarProducto-Carrito__item" id="agregarProducto-Carrito__itemIMG">
                    </div>
                    <form class="agregarProducto-Carrito__Conetenedorform">
                        <button id="Conetenedorform__boton-salir" class="Conetenedorform__boton-salir">X</button>
                        <h3 class="agregarProducto-Carrito__item" id="agregarProducto-Carrito__item-nombre-producto">Crema de leche en Balde</h3>
                        <p class="agregarProducto-Carrito__item precio" id="agregarProducto-Carrito__item-precio-producto">$5.245.28</p>
                        <p class="agregarProducto-Carrito__item" id="agregarProducto-Carrito__item-descripcion-producto">Precio por Balde de 5 Lts.</p>
                        <div class="cantidad-disponible">
                            <p class="agregarProducto-Carrito__item cantidad-disponible">Cantidad Disponible:</p>
                            <p class="agregarProducto-Carrito__item" id="agregarProducto-Carrito__item-stock-producto">100.</p>
                        </div>
                        <div class="cantidad-comprar">
                            <label for="cantidad" class="agregarProducto-Carrito__item">Cantidad:</label>
                            <input type="number" id="cantidad" class="agregarProducto-Carrito__item" min="1" value="1">
                        </div>
                        <button id="Conetenedorform__agregar-carrito" class="Conetenedorform__agregar-carrito">Agregar al carrito</button>
                    </form>`
            //Agrega los Datos al HTML de la ventana de Compra
            productoSeleccionado(idProductoSeleccionado)
            const btnConetenedorformBotonSalir = document.getElementById("Conetenedorform__boton-salir")
            btnConetenedorformBotonSalir.addEventListener("click", (e)=>{
                e.preventDefault()
                const seccionmodalAgregarProductoCarrito=document.getElementById("modal-agregarProducto-Carrito")
                seccionmodalAgregarProductoCarrito.classList.remove('flex')
                seccionmodalAgregarProductoCarrito.classList.add('ocultar')
                seccionmodalAgregarProductoCarrito.innerHTML=""
                idProductoSeleccionado=""
            })
            agregaEventoAlBotonAgregarAlCarrito()
            })   
    })
}

//Agrega evento Click a Agregar al Carrito.
function agregaEventoAlBotonAgregarAlCarrito(){
    const btnConetenedorFormAgregarCarrito = document.getElementById("Conetenedorform__agregar-carrito")
    const cantidadProductoAComprar = document.getElementById("cantidad")
    let miCarrito = new carritoCompra()
    btnConetenedorFormAgregarCarrito.addEventListener("click", (e)=>{
        let elementoSeleccionado = productos.find((el)=>{
            return el.id===parseInt(idProductoSeleccionado)
        })
            let resultadoStock = validaStockDisponible(parseInt(cantidadProductoAComprar.value))
            if (resultadoStock != false) {
                miCarrito.agregarProducto({
                    id: parseInt(elementoSeleccionado.id),
                    nombre: elementoSeleccionado.nombre,
                    descripción:elementoSeleccionado.descripción,
                    categoria:elementoSeleccionado.categoria,
                    precio: parseInt(elementoSeleccionado.precio),
                    img:elementoSeleccionado.img,
                    cantidad: parseInt(cantidadProductoAComprar.value)
                })
                const carrito = JSON.parse(localStorage.getItem("carrito")) || []
                const productoExistente = carrito.find(producto => producto.id === elementoSeleccionado.id)
                const productoADescontarStock = productos.find(producto => producto.id === elementoSeleccionado.id)
                if (productoExistente) {
                    // Si existe, incrementamos la cantidad
                    productoExistente.cantidad += parseInt(cantidadProductoAComprar.value)
                    productoExistente.totalCompra += parseInt(cantidadProductoAComprar.value) * parseInt(elementoSeleccionado.precio)
                    localStorage.setItem("carrito", JSON.stringify(carrito))
                } else {
                    // Si no existe, lo agregamos al carrito
                    carrito.push(miCarrito.carrito[0])
                    localStorage.setItem("carrito", JSON.stringify(carrito))
                }
                productoADescontarStock.stock-=parseInt(cantidadProductoAComprar.value)
                localStorage.setItem("bdProductos", JSON.stringify(productos))
                productoSeleccionadoDOM.children[1].children[1].innerHTML="Cantidad Disponible: " + elementoSeleccionado.stock
                productoSeleccionadoDOM.children[1].children[5].value=50

                const idDivSinStock ="sinStock-"+elementoSeleccionado.id
                const productoSinStockDOM=document.getElementById(idDivSinStock)
                if(elementoSeleccionado.stock===0){
                    productoSinStockDOM.classList.add('flex')
                }else{
                    productoSinStockDOM.classList.add('ocultar')
                }               
                miCarrito.carrito=""
                const seccionmodalAgregarProductoCarrito=document.getElementById("modal-agregarProducto-Carrito")
                seccionmodalAgregarProductoCarrito.classList.remove('flex')
                seccionmodalAgregarProductoCarrito.classList.add('ocultar')
                seccionmodalAgregarProductoCarrito.innerHTML=""
                e.preventDefault()
                idProductoSeleccionado=""
            } else {
                mensajeAlerta("No tenemos la cantidad solocitada.\n Actualmente en stock: " + elementoSeleccionado.stock)
                e.preventDefault()
            }
        muestraCarrito()
        creaResumenDeCompra()  
    })
}


function agregaEventoAlBotonEliminarDelCarrito(){
    const arrayBotones =Array.from(document.getElementsByClassName("articulo__boton-eliminar"))
    arrayBotones.forEach(e =>{
        e.addEventListener('click', (e) => {
            Swal.fire({
                text: "¿Estas seguro de querer eliminar el producto seleccionado?",
                icon: "warning",
                showCancelButton: true,
                cancelButtonText:"Cancelar",
                confirmButtonColor: "#135D87",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si"
            }).then((result) => {
                if (result.isConfirmed) {
                    const contendorItemCarrito=document.getElementById("contendor-carrito")
                    const itemAEliminar=document.getElementById(e.target.parentElement.parentElement.id)
                    const cantidadASumarStock=Array.from(itemAEliminar)
                    const btnContinuarCompraDOM = document.getElementById("resumen-compra__continuar-compra")
                    const btnVaciarCarritoDOM = document.getElementById("resumen-compra__vaciar-carrito")
                    const indiceProducto=productos.findIndex(producto => producto.id === parseInt(itemAEliminar.id))
                    let carrito = JSON.parse(localStorage.getItem("carrito")) || []
                    carrito=carrito.filter(producto => producto.id !== parseInt(itemAEliminar.id))
                    
                    productos[indiceProducto].stock+=parseInt(e.target.parentElement.parentElement.children[3].value)
                    localStorage.setItem("carrito", JSON.stringify(carrito))
                    localStorage.setItem("bdProductos", JSON.stringify(productos))

                    carrito = JSON.parse(localStorage.getItem("carrito")) || []

                    if (carrito.length === 0){
                        btnContinuarCompraDOM.disabled = true
                        btnVaciarCarritoDOM.disabled = true
                    }else{
                        btnContinuarCompraDOM.disabled = false
                        btnVaciarCarritoDOM.disabled = false
                    }
                    muestraCarrito()
                    creaResumenDeCompra()
                    filtraProductos("Todos")
                    Swal.fire({
                    text: "Se ha el producto correctamente",
                    icon: "success"
                })
                }
            })
        })
    })
}

//Funcion para Filtrar productos
export function filtraProductos(categoria){
    contenedorGaleriaProductos.innerHTML=""
    varFiltro=categoria
    productosPorCategoria=productos.filter((el)=>{
        return el.categoria===varFiltro
    })
    if(categoria==="Todos"){
        //Muestra Todos los Productos
        contenedorGaleriaProductos.innerHTML=""
        productos.forEach((el)=> {
            const idDivSinStock ="sinStock-"+el.id
            contenedorGaleriaProductos.innerHTML +=`<article class="productos__item" id="${el.id}">
                <figure>
                    <img src="${el.img}">
                    <figcaption><strong>${el.nombre}</strong></figcaption>
                </figure>
                <div class="item-infoProducto">
                    <p class="infoProducto-descripcion">${el.descripción}</p>
                    <p class="infoProducto-stock">Stock disponible: ${el.stock}</p>
                    <p class="infoProducto-precio">$ ${el.precio.toFixed(2)}</p>
                    <p class="infoProducto-id">${el.id}</p>
                    <button type="boton" class="comprar">Comprar</button>
                    <input type="hidden" id="stockInput" value="${el.stock}">
                </div>
                <div class="sin-stock" id="${idDivSinStock}">
                    <p>Sin stock</p>
                </div>
            </article>`
            const productoSinStockDOM=document.getElementById(idDivSinStock)
            if(el.stock===0){
                productoSinStockDOM.classList.add('flex')
            }else{
                productoSinStockDOM.classList.add('ocultar')
            }
        })
        agregaEventosALosBotonesComprar()
    }else{
        //Muestra los Productos de acuerdo a la categoria seleccionada en el nav.
        productosPorCategoria.forEach((el)=> {
            const idDivSinStock ="sinStock-"+el.id
            contenedorGaleriaProductos.innerHTML +=`<article class="productos__item" id="${el.id}">
                <figure>
                    <img src="${el.img}">
                    <figcaption><strong>${el.nombre}</strong></figcaption>
                </figure>
                <div class="item-infoProducto">
                    <p class="infoProducto-descripcion">${el.descripción}</p>
                    <p class="infoProducto-stock">Stock disponible: ${el.stock}</p>
                    <p class="infoProducto-precio">$ ${el.precio.toFixed(2)}</p>
                    <p class="infoProducto-id">${el.id}</p>
                    <button type="boton" class="comprar">Comprar</button>
                    <input type="hidden" id="stockInput" value="${el.stock}">
                </div>
                <div class="sin-stock" id="${idDivSinStock}">
                    <p>Sin stock</p>
                </div>
            </article>`
            const productoSinStockDOM=document.getElementById(idDivSinStock)
            if(el.stock===0){
                productoSinStockDOM.classList.add('flex')
            }else{
                productoSinStockDOM.classList.add('ocultar')
            }
        })
        agregaEventosALosBotonesComprar()
    }
    
}

//Funcion para Agregar Evento Click a los Nav de Filtro por Producto
export function agregaEventosAElNavDeFiltroProductos(){
    const enlacesFiltroPorProdcutos = document.querySelectorAll('.navproductos .navproductos__item a')
    enlacesFiltroPorProdcutos.forEach(enlace => {
        enlace.addEventListener('click', () => {
            switch(enlace.id) {
                case "filtroTodosLosProductos":
                    return filtraProductos("Todos")
                case"filtroQuesos":
                    return filtraProductos("Queso")
                case "filtroCremaLeche":
                    return filtraProductos("Crema")
                case "filtroManteca":
                    return filtraProductos("Manteca")
                case "filtroLeche":
                    return filtraProductos("Leche")
            }
        })
    })
}
//Agrega evento Click al boton Flotante que muestra el  Carrito.
function agregaEventoAlBotonMostrarCarrito(){
    const btnCarritoDOM = document.getElementById("carrito-btn")
    const seccionCarritoDOM = document.getElementById("seccion-carrito")
    const btnContinuarCompraDOM = document.getElementById("resumen-compra__continuar-compra")
    const btnVaciarCarritoDOM = document.getElementById("resumen-compra__vaciar-carrito")

        btnCarritoDOM.addEventListener("click", (e)=>{
        seccionCarritoDOM.classList.remove('ocultar')
        seccionCarritoDOM.classList.add('flex')
        let carrito = JSON.parse(localStorage.getItem("carrito")) || []
        if (carrito.length === 0){
            btnContinuarCompraDOM.disabled = true
            btnVaciarCarritoDOM.disabled = true
        }else{
            btnContinuarCompraDOM.disabled = false
            btnVaciarCarritoDOM.disabled = false
        }
    })
}

agregaEventoAlBotonMostrarCarrito()

//Agrega evento Click al boton salir del carrito.
function agregaEventoAlBotonSalirDelCarrito(){
    const btnSalirCarritoDOM = document.getElementById("seccion-carrito__boton-salir")
    const seccionCarritoDOM = document.getElementById("seccion-carrito")
    btnSalirCarritoDOM.addEventListener("click", (e)=>{
        seccionCarritoDOM.classList.remove('flex')
        seccionCarritoDOM.classList.add('ocultar')
    })
}

//Agrega evento Click al boton salir del la seccion carrito-finalizacion.
function agregaEventoAlBotonSalirDelCarritoFinalizacion(){
    const btnSalirCarritoFinaliozacionDOM = document.getElementById("seccion-carrito-finalizacion__boton-salir")
    const seccionCarritoFinalizacionDOM = document.getElementById("seccion-carrito-finalizacion")
    btnSalirCarritoFinaliozacionDOM.addEventListener("click", (e)=>{
        seccionCarritoFinalizacionDOM.classList.remove('flex')
        seccionCarritoFinalizacionDOM.classList.add('ocultar')
    })
}

//Agrega evento Click al boton continuar que esta en el  Carrito.
function agregaEventoAlBotonContinuarCompra(){
    const btnContinuarCompraDOM = document.getElementById("resumen-compra__continuar-compra")
    const seccionCarritoDOM=document.getElementById("seccion-carrito")
    const seccionCarritoFinalizacionDOM = document.getElementById("seccion-carrito-finalizacion")
    const resumentotalproductosDOM=document.getElementById("resumen__total-productos")
    const resumenTotalValorProductosDOM=document.getElementById("resumen-compra__valor-importe-total")
    const resumenEnvioDOM=document.getElementById("resumen__envio")
    const resumenTotalComporaDOM=document.getElementById("resumen__total-compra")
    btnContinuarCompraDOM.addEventListener("click", (e)=>{
        resumentotalproductosDOM.innerText= "$ " + parseInt(resumenTotalValorProductosDOM.innerText).toFixed(2)
        resumenEnvioDOM.innerText= "$ 00.00"
        resumenTotalComporaDOM.innerText="$ " + parseInt(resumenTotalValorProductosDOM.innerText).toFixed(2)
        seccionCarritoFinalizacionDOM.classList.remove('ocultar')
        seccionCarritoFinalizacionDOM.classList.add('flex')
    })
    agregaEventoAlBotonSalirDelCarritoFinalizacion()
    deshabilitarProvinciaLocalidadesDomicilio()
    habilitarProvinciaLocalidadesDomicilio()
}

//Agrega evento Click al boton Terminar queCompra Carrito Finalizacion.
function agregaEventoAlBotonTerminarCompra(){
    const btnTerminarCompraDOM = document.getElementById("terminar-compra")
    const seccionCarritoDOM=document.getElementById("seccion-carrito")
    const seccionCarritoFinalizacionDOM = document.getElementById("seccion-carrito-finalizacion")
    const resumentotalproductosDOM=document.getElementById("resumen__total-productos")
    const resumenTotalProductosDOM=document.getElementById("resumen-compra__valor-importe-total")
    const resumenEnvioDOM=document.getElementById("resumen__envio")
    const resumenTotalComporaDOM=document.getElementById("resumen__total-compra")
    btnTerminarCompraDOM.addEventListener("click", (e)=>{
        resumentotalproductosDOM.innerText= "0" + parseInt(resumenTotalProductosDOM.innerText).toFixed(2)
        resumenEnvioDOM.innerText= "$ 00.00"
        resumenTotalComporaDOM.innerText="$ 00.00"
        seccionCarritoFinalizacionDOM.classList.remove('flex')
        seccionCarritoFinalizacionDOM.classList.add('ocultar')
        seccionCarritoDOM.classList.remove('flex')
        seccionCarritoDOM.classList.add('ocultar')
        limpiaCarrito()
        muestraCarrito()
        creaResumenDeCompra()
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Gracias por su Compra!",
            showConfirmButton: false,
            timer: 2000
          });
    })
}
agregaEventoAlBotonTerminarCompra()
function agregaEventoAlBotonVaciarCarrito(){
    const btnVaciarCarritoDOM = document.getElementById("resumen-compra__vaciar-carrito")
    const seccionCarritoDOM=document.getElementById("seccion-carrito")
    btnVaciarCarritoDOM.addEventListener("click", ()=>{
        Swal.fire({
            text: "¿Estas seguro de querer vaciar el carrito?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText:"Cancelar",
            confirmButtonColor: "#135D87",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si"
        }).then((result) => {
            if (result.isConfirmed) {
                limpiaCarrito() 
                muestraCarrito()
                creaResumenDeCompra()
                seccionCarritoDOM.classList.remove('flex')
                seccionCarritoDOM.classList.add('ocultar')
                Swal.fire({
                text: "Se ha vaciado el carrito",
                icon: "success"
            })
            }
        })
        
    })
}


function muestraCarrito(){
    carritoDOM.innerHTML =""
    const carrito = JSON.parse(localStorage.getItem("carrito")) || []
    carrito.forEach((el)=>{
        carritoDOM.innerHTML +=`
        <div id="${el.id}" class="carrito-articulo">
            <div id="articulo__contenedor-imagen">
                <img id="contenedor-imagen__imagen" src="${el.img}" alt="">
            </div>
            <div id="articulo__contenedor-descripcion">
                <h3 id="contenedor-descripcion__nombre-producto">${el.nombre}</h3>
                <p id="contenedor-descripcion__descripcion-producto">${el.descripción}</p>
            </div>
            <p id="articulo__boton-cantidad">Cantidad: ${el.cantidad}</p>
            <input type="number" id="articulo__input-cantidad min="1" value="${el.cantidad}" hidden>
            <button id="articulo__boton-eliminar" class="articulo__boton-eliminar"><img src="../imagenes/iconos/eliminar.svg" alt=""></a></button>
            <p id="articulo__precio">$ ${(parseInt(el.precio)*(parseInt(el.cantidad))).toFixed(2)}</p>
        </div>`
    })
    agregaEventoAlBotonEliminarDelCarrito()
}
//
function limpiaCarrito(){
    carritoDOM.innerHTML =""
    let carrito = JSON.parse(localStorage.getItem("carrito")) || []
    carrito=[]
    localStorage.setItem("carrito", JSON.stringify(carrito))
    /* localStorage.removeItem('bdProductos') */

    cargarProductosDesdeJSON().then(productos => {
        filtraProductos("Todos")
    }).catch(error => {
        mensajeAlerta("Se produjo un error al intentar cargar los productos." + error)
    
    })
}


function creaResumenDeCompra(){
    let totalProductosEnCarrito=0
    let importeTotalCompra=0
    const totalProdcutosEnCarrito = document.getElementById("resumen-compra__total-prodcutos")
    const importeTotalCarrito = document.getElementById("resumen-compra__importe-total")
    const valorImporteTotalCarrito = document.getElementById("resumen-compra__valor-importe-total")
    const carrito = JSON.parse(localStorage.getItem("carrito")) || []
    carrito.forEach((el)=>{
        totalProductosEnCarrito+=el.cantidad
        importeTotalCompra+= parseInt(el.cantidad)*parseInt(el.precio)
        })
        totalProdcutosEnCarrito.innerText="Total Productos: " + totalProductosEnCarrito
        importeTotalCarrito.innerText="Importe Total: $" + importeTotalCompra.toFixed(2)
        valorImporteTotalCarrito.innerText= importeTotalCompra
        agregaEventoAlBotonContinuarCompra()
        agregaEventoAlBotonVaciarCarrito()
        agregaEventoAlBotonSalirDelCarrito()

}

muestraCarrito()   
creaResumenDeCompra()

//Habilita seleccion de provincias y localidades cuando se selleciona envio a domicilio
function deshabilitarProvinciaLocalidadesDomicilio(){
    const inputEnvioDomicilioDOM = document.getElementById('form-entrega__entrega-domicilio')
    const selectProvinciaDOM = document.getElementById('form-entrega__provincia')
    const selectLocalidadesDOM = document.getElementById('form-entrega__localidades')
    const selectDomicilioDOM = document.getElementById('domicilio')
    const resumenEnvioDOM = document.getElementById('resumen__envio')
    const resumenTotalValorProductosDOM=document.getElementById("resumen-compra__valor-importe-total")
    const resumentotalproductosDOM=document.getElementById("resumen__total-compra")
    inputEnvioDomicilioDOM.addEventListener('change', () => {
        resumentotalproductosDOM.innerText="$" +(parseInt(resumenTotalValorProductosDOM.innerText)+250000).toFixed(2)
        selectProvinciaDOM.disabled = false
        selectLocalidadesDOM.disabled = false
        selectDomicilioDOM.disabled = false
        resumenEnvioDOM.innerText="$ 250000.00"
    })
}
//Deshabilita seleccion de provincias y localidades cuando se selleciona Retiro de Planta
function habilitarProvinciaLocalidadesDomicilio(){
    const inputEnvioDomicilioDOM = document.getElementById('form-entrega__retiro-planta')
    const selectProvinciaDOM = document.getElementById('form-entrega__provincia')
    const selectLocalidadesDOM = document.getElementById('form-entrega__localidades')
    const selectDomicilioDOM = document.getElementById('domicilio')
    const resumenEnvioDOM = document.getElementById('resumen__envio')
    const resumenTotalValorProductosDOM=document.getElementById("resumen-compra__valor-importe-total")
    const resumentotalproductosDOM=document.getElementById("resumen__total-compra")
    inputEnvioDomicilioDOM.addEventListener('change', () => {
        resumentotalproductosDOM.innerText="$ " + resumenTotalValorProductosDOM.innerText
        selectProvinciaDOM.disabled = true
        selectLocalidadesDOM.disabled = true
        selectDomicilioDOM.disabled = true
        resumenEnvioDOM.innerText="$ 00.00"
    })
}

function agregaEventoClickASelectProvincia(){
    const selectProvinciasDOM = document.getElementById('form-entrega__provincia')
    const selectLocalidadesDOM = document.getElementById('form-entrega__localidades')
    let localidadesPorProvincia=[]
    selectProvinciasDOM.addEventListener('change', () => {
        const provinciaSeleccionada = selectProvinciasDOM.value
        const ciudades = localidadesPorProvincia[provinciaSeleccionada] || []
        selectLocalidadesDOM.innerHTML = ''
        consultaApiLocalidadesPorProvincia(provinciaSeleccionada)
    })
}
agregaEventoClickASelectProvincia()

let provinciaSeleccionada=""
function cargaProvincias(arrayPprovincias){
    const selectProvinciasDOM = document.getElementById('form-entrega__provincia')
    arrayPprovincias.forEach(provincia=>{
        const option = document.createElement('option')
        option.value = provincia.id
        option.text = provincia.nombre
        selectProvinciasDOM.appendChild(option)
        selectProvinciasDOM.value=30
        provinciaSeleccionada=selectProvinciasDOM.value
    })
}
function cargaLocalidades(arrayLocalidades){
    const selectLocalidadesDOM = document.getElementById('form-entrega__localidades')
    arrayLocalidades.forEach(localidad=>{
        const option = document.createElement('option')
        option.value = localidad.id
        option.text = localidad.nombre
        selectLocalidadesDOM.appendChild(option)
    })
}







const consultaApiProvincia = async ()=>{
    const urlProv ="https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre"
    let provincias=[]
    try {
        let result=await fetch(urlProv)
        let data= await result.json()
        provincias=data.provincias
        cargaProvincias(provincias)
    }catch (error) {
        mensajeAlerta("Error al obtener datos de provincias")
    }
}

const consultaApiLocalidadesPorProvincia= async (provincia)=>{
    const urlLoc ="https://apis.datos.gob.ar/georef/api/municipios?provincia="+provincia+"&campos=id,nombre&max=1000"
    let localidades=[]
    try {
        let result=await fetch(urlLoc)
        let data= await result.json()
        
        localidades=data.municipios
        cargaLocalidades(localidades)
    }catch (error) {
        mensajeAlerta("Error al obtener datos de localidades" + error)
    }
}

consultaApiProvincia().then(provincias => {
    //Cargo los prodcutos una vez que se se cumplio la promesa
    consultaApiLocalidadesPorProvincia(provinciaSeleccionada)
}).catch(error => {
    //Ejecuto mensaje de error si algo sale mal
    mensajeAlerta("Se produjo un error al intentar cargar las Localidades." + error)

})
consultaApiLocalidadesPorProvincia()




