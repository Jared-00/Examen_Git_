//1.- invocamos express
const express = require('express');
const app = express();

// 2.- incorporamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//4.- incorparar el directorio public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

// 5.- establecemos el motor de plantillas ejs
app.set('view engine', 'ejs');

//6.- invocamos el bcryptjs
const bcryptjs = require('bcryptjs');

//7.-  variables de sesion
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));    

// 8.- invocamos al modulo de conexion de la BD
const connection = require('./database/db');

//9.- estableciendo las rutass
    app.get('/login', (req, res) =>{ 
        res.render('login');
    });
    app.get('/register', (req, res) =>{ 
        res.render('register');
    });

    
//10.- Registracion del usuario
app.post('/register', async (req, res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO users set ?',{user:user, name:name, rol:rol, pass:passwordHaash}, async(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('register',{
                alert: true,
                alertTitle: "Registracion",
                alertMessage: "Registro exitoso",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 1500,
                ruta:''
            })
        }
    })

});

//11.- Autenticacion 
app.post('/auth', async(req, res)=>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if(user && pass){
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render('login',{
                    alert: true,
                    alertTitle:'Error',
                    alertMessage:'Usuario y/o contrasena incorrecta',
                    alertIcon:'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta:'login'
                })
            }else{
                req.session.loggedin = true;
                req.session.name = results[0].name
                res.render('login',{
                    alert: true,
                    alertTitle:'Conexion exitosa',
                    alertMessage:'LOGIN CORRECTO!',
                    alertIcon:'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta:''
                })
            }
        })
    }else{
        res.render('login',{
            alert: true,
            alertTitle:'Advertencia',
            alertMessage:'Por favor ingrese un usuario y/o contrasena',
            alertIcon:'warning',
            showConfirmButton: true,
            timer: false,
            ruta:'login'
        })
    }

}); 

//12.- Autenticacion para el resto de paginas
app.get('/', (req,res)=>{
    if(req.session.loggedin){
        res.render('index',{
            login: true,
            name: req.session.name,

        });
    }else{
        res.render('index',{
            login: false,
            name: 'Debe iniciar sesion'
        })
    }
});

//13.- Logout
app.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
         res.redirect('/')
    })
})

/// parte del login

/// parte del crud del usuario

app.use('/', require('./router'));


app.listen(3001, (req, res) =>{
    console.log('SERVIDOR CORRIENDO EN http://localhost:3001')
});