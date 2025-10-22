<template>
  <div class="container">
    <h1>Administracion de productos</h1>

    <!--formulario para añadir producto-->
                          <!--@submit = escucha el evento submit del formulario.--->
                          <!--función que se ejecutará cuando se envíe el form.--->
                          <!--función que se ejecutará cuando se envíe el form.--->
    <form @submit.prevent="agregarProducto">
      <!--v-model crea vinculación bidireccional con la variable nuevoProducto.nombre-->
      <input v-model="nuevoProducto.nombre" placeholder="Nombre" required></input>
      <input v-model="nuevoProducto.precio" placeholder="Precio" required></input>
      <button type="submit">Agregar Producto</button>
    </form>
    <!--Linea separado horisontal-->
    <hr></hr>

    <!--tabla productos-->
    <table border="1">
      <thead>
        <tr>
          <th>Id</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
          <!--v-for recorre la lista reactiva productos y por cada elemento crea una fila.-->
          <!--:key="prod.id" ayuda a Vue a identificar cada fila (mejora rendimiento y evita errores)-->
        <tr v-for="prod in productos" :key="prod.id">
          <!--interpolación: se muestran los valores del objeto prod.-->
          <td>{{ prod.id }}</td>
          <td>{{ prod.nombre }}</td>
          <td>{{ prod.precio }}</td>
          <td>
            <button @click="editar(prod)">Editar</button>
            <button @click="eliminarProducto(prod.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!--formulario para editar productos-->
    <!--muestra el formulario de edición solo si productoEditando no es null (modo edición activado).-->
    <div v-if="productoEditando">
      <h3>Editar Producto</h3>
        <!--@submit.prevent="actualizarProducto" evita recarga y llama a actualizarProducto..-->
      <form @submit.prevent="actualizarProducto">
        <!--Los inputs usan v-model sobre productoEditando (se editan los valores en memoria).-->
        <input v-model="productoEditando.nombre" placeholder="Nombre"></input>
        <input v-model="productoEditando.precio" placeholder="Precio"></input>
        <button type="submit">Guardar Cambios</button>
        <!--@click="cancelarEdicion" cancela el modo edición (no envía el form)..-->
        <button @click="cancelarEdicion">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<!--sintaxis moderna de Vue 3 (Composition API). Todo lo que declares aquí está disponible en el template sin necesidad de return-->
<script setup>
    //importa axios
    import axios from "axios";
    //ref() crea variables reactivas.
    //onMounted() ejecuta una función cuando el componente se monta en la página.
    import { ref, onMounted} from "vue";

    //estado de datos reactivos
    const productos = ref ([]);//lista de productos
    //objeto reactivo para almacenar los datos del formulario de nuevo producto.
    const nuevoProducto = ref({nombre: "",precio:""});
    //variable que contiene el producto que se está editando; null significa que no hay edición activa.
    const productoEditando = ref(null);

    //url de la api del backen
    const api_url = "http://localhost:3000/api/productos";

    //funcion para obtener los productros del backend
    const obtenerProductos = async () => {
        //hace una petición GET al backend.
        const res = await axios.get(api_url);
        productos.value = res.data;//se guarda los productos recibidos
    };

    //funcion para agregar productos
    const agregarProducto = async () => {
        await axios.post(api_url, nuevoProducto.value);
        nuevoProducto.value = {nombre:"",precio:""};//limpia el formulario
        obtenerProductos();//actualiza la tabla
    };

    //funcion para eliminar el producto
    const eliminarProducto = async (id) => {
        await axios.delete(`${api_url}/${id}`);
        obtenerProductos();
    };

    //funcion para editar producto
    const editar = (prod) => {
        productoEditando.value = { ...prod}; //clona el producto a editar
    };

    //funcion para guardar cambios
    const actualizarProducto = async () =>{
        await axios.put(`${api_url}/${productoEditando.value.id}`, productoEditando.value);
        productoEditando.value = null //salimos del modo edicion
        obtenerProductos(); //actualiza la tabla
    };

    //funcion para cancelar la edicion
    const cancelarEdicion = () => {
        productoEditando.value = null;
    };

    //cargar productos cuandfo se abra la pagina
    onMounted(obtenerProductos);
</script>

<style scoped>

.container {
  width: 70%;
  margin: auto;
  text-align: center;
  font-family: sans-serif;
}

input {
  margin: 5px;
  padding: 6px;
}

button {
  margin: 5px;
  padding: 6px 10px;
  cursor: pointer;
}

table {
  width: 100%;
  margin-top: 20px;
}
</style>
