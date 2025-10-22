<template>
  <div class="container">
    <h1>Administracion de productos</h1>

    <!--formulario para añadir producto-->
    <form @submit.prevent="agregarProducto">
      <input v-model="nuevoProducto.nombre" placeholder="Nombre" required></input>
      <input v-model="nuevoProducto.precio" placeholder="Precio" required></input>
      <button type="submit">Agregar Producto</button>
    </form>

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
        <tr v-for="prod in productos" :key="prod.id">
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
    <div v-if="productoEditando">
      <h3>Editar Producto</h3>
      <form @submit.prevent="actualizarProducto">
        <input v-model="productoEditando.nombre" placeholder="Nombre"></input>
        <input v-model="productoEditando.precio" placeholder="Precio"></input>
        <button type="submit">Guardar Cambios</button>
        <button @click="cancelarEdicion">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
    //importa axios
    import axios from "axios";
    import { ref, onMounted} from "vue";

    //estado de datos reactivos
    const productos = ref ([]);//lista de productos
    const nuevoProducto = ref({nombre: "",precio:""});
    const productoEditando = ref(null);

    //url de la api del backen
    const api_url = "http://localhost:3000/api/productos";

    //funcion para obtener los productros del backend
    const obtenerProductos = async () => {
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
