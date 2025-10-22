//framework principal para crear servidores en node
const express = require('express');
//significa Cross-Origin Resource Sharing.
//Sirve para permitir que tu frontend (Vue) pueda comunicarse con tu backend.
const cors = require('cors');

//app es el servidor web, creado a partir de Express.
const app = express();
//PORT es el número de puerto donde va a correr el backend
const PORT = 3000;

app.use(cors());
app.use(express.json());

//base de datos 
let productos = [
    {id : 1, nombre: "Anillo de oro", precio: 340},
    {id : 2, nombre: "Collar de plata", precio: 140},
    {id : 3, nombre: "Pulsera de bronse", precio: 550}
];
//get
app.get('/api/productos',(req,res) => {
    res.json(productos);
});

//get por id
app.get('/api/productos/:id',(req,res) =>{
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id === id);

    if (!producto){
        //404 no existe
        return res.status(404).json({error:"PRODUCTO NO ENCONTRADO"});
    }
    res.json(producto);//200 ok si existe
});

//post
app.post('/api/productos',(req,res) => {
    const { nombre, precio } = req.body;

    //validacion
    if (!nombre || precio == null){
        return res.status(400).json({ error: 'Falta nombre o precio'});
    }

    //crear nuevo id (tomar el mayor id actual +1)
    const nuevoId = productos.length ? Math.max(...productos.map(p => p.id)) + 1 :1;
    const nuevoProducto = {id: nuevoId,nombre,precio};

    productos.push(nuevoProducto);

    //201 created
    res.status(201).json(nuevoProducto);

});

//put
app.put('/api/productos/:id',(req,res) => {
    const id = parseInt(req.params.id);
    const {nombre,precio} = req.body;

    //validacion 
    if (!nombre || precio == null){
        return res.status(400).json({ error: 'Debes enviar nombre y/o precio'});
    }

    //buscar el indice del producto
    const idx = productos.findIndex(p => p.id === id);
    if (idx  === -1){
        return res.status(404).json({ error: 'Producto no encontrado'});
    }

    //actualizar los campos enviados
    if(nombre) productos[idx].nombre = nombre;
    if(precio !=null) productos[idx].precio = precio;

    res.json(productos[idx]);//200 ok con el producto actualizado
});

//delete
app.delete('/api/productos/:id',(req,res) => {
    const id = parseInt(req.params.id);
    const idx = productos.findIndex(p => p.id === id);

    if(idx === -1) {
        return res.status(404).json({error : 'Producto no encontrado'});
    }

    //se guarda el id eliminado por si se quiere devolver
    const eliminado = productos.splice(idx,1)[0];

    res.json({mensaje:'Producto eliminado',producto: eliminado});
});

//iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ API corriendo en http://localhost:${PORT}`);
})