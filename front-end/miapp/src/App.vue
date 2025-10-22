<!----template: es donde va el HTML que se mostrará en pantalla.-->
<template>
  <!--<Productos />: es tu componente (el que creaste en src/components/Productos.vue).-->
  <Productos />
</template>

<!--script setup: indica que estás usando la sintaxis moderna de Vue 3, donde puedes importar y usar directamente sin hacer export default-->
<script setup>
//aquí estás importando tu componente Productos.vue para poder usarlo dentro del <template>.
//./components/Productos.vue indica la ruta donde está guardado tu componente (en la carpeta components)
import Productos from './components/Productos.vue';
</script>