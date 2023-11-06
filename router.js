const express = require('express');
const router = express.Router();

const conexion = require('./database/db');

// ruta para mostrar registros
router.get('/tablaU', (req, res)=>{
    conexion.query('SELECT * FROM users', (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('tablaU',{results:results});
        }
    })
})

//ruta para crear registross
router.get('/create',(req,res)=>{
    res.render('create')
})

//ruta para editar los registros
router.get('/edit/:id', (req, res)=>{
    const id = req.params.id;
    conexion.query('SELECT * FROM users WHERE id=?',[id],(error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('edit',{user:results[0]});
        }
    })
})

//Ruta para eliminar el registro
router.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    conexion.query('DELETE FROM users WHERE id = ?',[id], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            res.redirect('/');         
        }
    })
});

const crud = require('./controllers/crud');
router.post('/save', crud.save);
router.post('/update', crud.update);

module.exports = router;