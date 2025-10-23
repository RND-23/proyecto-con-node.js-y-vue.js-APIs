const express = require('express');
const cors = require('cors')

const Alumno = express();
const PORT = 3000;

Alumno.use(cors());
Alumno.use(express.json());

let alumnos = [
    {id:1,nombre:"Ana",edad:18,nota1:15,nota2:14,nota3:10},
    {id:2,nombre:"Daniel",edad:14,nota1:11,nota2:13,nota3:11},
    {id:3,nombre:"Sofia",edad:20,nota1:12,nota2:18,nota3:16}
]

Alumno.get('/api/alumnos',(req , res) => {
    res.json(alumnos);
});
Alumno.get('/api/alumnos/mejor',(req,res) => {
    if (alumnos.length === 0) {
        return res.status(404).json({error:"No hay alumnos registrados"});
    }
    //calcula el prmedio de cada alumnos
    const alumnoConMejorPromedio = alumnos.reduce((mejor,actual) => {
        const promMejor = (mejor.nota1 +mejor.nota2+mejor.nota3) /3;
        const promActual = (actual.nota1+actual.nota2+actual.nota3)/3;
        return promActual > promMejor ? actual : mejor;
    });
    res.json(alumnoConMejorPromedio);

});

Alumno.post('/api/alumnos',(req,res) => {
    const {nombre,edad,nota1,nota2,nota3} = req.body;

    if(!nombre || !edad || nota1 == null || nota2 == null || nota3 ==null) {
        return res.status(400).json({ error: 'Falta nombre o precio'});
    }

    const nuevoId = alumnos.length ? Math.max(...alumnos.map(p => p.id)) +1:1;
    const nuevoAlumno = {id:nuevoId,nombre,edad,nota1,nota2,nota3};
    alumnos.push(nuevoAlumno);
    res.status(201).json(nuevoAlumno);

});

Alumno.delete('/api/alumnos/:id',(req,res) => {
    const id = parseInt(req.params.id);
    const idx = alumnos.findIndex(p => p.id === id);
    if(idx === -1) {
        return res.status(404).json({error : 'Alumno no encontrado'});
    }
    const eliminado = alumnos.splice(idx,1)[0];
    res.json({mensaje:'Alumno eliminado',alumno: eliminado});
});

Alumno.listen(PORT, () => {
    console.log(`Api corriendo en http://localhost:${PORT}`);
})