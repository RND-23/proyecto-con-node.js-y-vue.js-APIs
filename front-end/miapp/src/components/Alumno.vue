<template>
<div class="container">
    <h1>Mantenimiento Alumnos</h1>
    <!-- formulario para agregar nuevo alumno -->
    <form @submit.prevent="agregarAlumno">
      <input v-model="nuevoAlumno.nombre" placeholder="Nombre" required></input>
      <input v-model.number="nuevoAlumno.edad" placeholder="Edad" required></input>
      <input v-model.number="nuevoAlumno.nota1" placeholder="Nota 1" required></input>
      <input v-model.number="nuevoAlumno.nota2" placeholder="Nota 2" required></input>
      <input v-model.number="nuevoAlumno.nota3" placeholder="Nota 3" required></input>
      <button type="submit">Agregar Alumno</button>
    </form>
    <hr></hr>
      <!-- tabla de alumnos -->
    <table border="1">
        <thead>
          <th>ID</th>
          <th>Nombre</th>
          <th>Edad</th>
          <th>Nota 1</th>
          <th>Nota 2</th>
          <th>Nota 3</th>
          <th>Promedio</th>
          <th>Acciones</th>
        </thead>
        <tbody>
            <tr v-for="alum in alumnos" :key="alum.id">
                <td>{{ alum.id }}</td>
                <td>{{ alum.nombre }}</td>
                <td>{{ alum.edad }}</td>
                <td>{{ alum.nota1 }}</td>
                <td>{{ alum.nota2 }}</td>
                <td>{{ alum.nota3 }}</td>
                <td>{{ promedio(alum) }}</td>
                <td>
                    <button @click="eliminarAlumno(alum.id)">Eliminar Alumno</button>
                </td>
            </tr>
        </tbody>
    </table>
    <hr></hr>
     <!-- mostrar alumno con mejor promedio -->
    <div v-if="mejorAlumno">
        <h3>Mejor Alumno</h3>
        <p>
            {{ mejorAlumno.nombre }} con promedio;
            {{ promedio(mejorAlumno).toFixed(2) }}
        </p>
    </div>
</div>
</template>

<script setup>
    import axios from "axios";
    import { ref, onMounted} from "vue";
    // URL base del backend
    const api_url = "http://localhost:3000/api/alumnos";

    const alumnos = ref([]);
    const nuevoAlumno = ref({
        nombre:"",
        edad:"",
        nota1:"",
        nota2:"",
        nota3:"",
    })
    const mejorAlumno = ref(null);

    // Función para calcular promedio
    const promedio = (alum) => (alum.nota1 + alum.nota2 + alum.nota3) / 3;
    // Función obtenr alumnos del backend
    const obtenerAlumnos = async () => {
        const res = await axios.get(api_url);
        alumnos.value = res.data;
        obtenerMejorAlumno() //actualiza el promedio de los alumnos
    };
    // Función obtener mejor alumno
    const obtenerMejorAlumno = async () => {
        const res = await axios.get(`${api_url}/mejor`);
        mejorAlumno.value = res.data;
    };
    // Función agregar alumno
    const agregarAlumno = async () => {
        await axios.post(api_url, nuevoAlumno.value);
        nuevoAlumno.value = {nombre:"",edad:"",nota1:"",nota2:"",nota3:""};
        obtenerAlumnos() //actualiza la tabla
    };

    //funcion para eliminar alumno
    const eliminarAlumno = async (id) => {
        await axios.delete(`${api_url}/${id}`);
        obtenerAlumnos();
    };
    // Cargar datos al iniciar
    onMounted(obtenerAlumnos);
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