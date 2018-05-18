/**
*     modulo principal
*/

//
// cria instancias dos módulos do express
//

var express = require('express');
var http = require('http');
var path = require('path');
var mysql = require('mysql');

var body = require('body-parser');

// express body-Parser permite a construção de objetos JSON 
// a partir da submissão de dados de um formulário HTML

app = express();

app.use(body.urlencoded({extended:true}));
app.use(body.json());

app.set('port', 3000);

app.set("view engine", "ejs");

http.createServer(app);

//
// definir variáveis do banco de dados e da tabela a serem usados
//

var database = 'dados';
var tabela = 'cores';

// criar instancia do banco de dados
var client = mysql.createConnection({
   user: 'root',
   password: '123456',
   host: 'localhost',
   port: 3306
});

// colocar o banco de dados em uso - ativo
client.query('USE ' + database);


// mostrar o resultado da pesquisa (JSON) no navegador
app.get('/cores', function(req, res)
{
    client.query
    (
    'SELECT * FROM ' + tabela, 
    function(err, results, fields)
    {
        if(err)
        {
            throw err;
        }
          res.render('../views/lista_cores.ejs', {cores: results, title:'Lista'  })       
    }

    )

}
)

// GET - Mostrar registro unico no formulario - localiza pelo codigo
app.get('/cores/views/:codigo', function(req, res)

{
    console.log(req.params.codigo)    
    client.query
    (
//    'SELECT * FROM ' + tabela + ' WHERE cor_codigo = ' + parseInt(req.params.codigo), 
    'SELECT * FROM ' + tabela + ' WHERE cor_codigo = ' + req.params.codigo, 

    function(err, result, fields)
    {
        if(err)
        {
            throw err;
        }
// enviar o resultado (retorno query) para o tamplete
        res.render('../views/lista_cores_unica.ejs', {cor: result, title:result[0].cor_descricao})
    }

    )
}
)


// GET - Mostrar registro no formulário de alteração - localiza pelo codigo
app.get('/cores_editar/views/:codigo', function(req, res)

{
    console.log(req.params.codigo)    
    client.query
    (
    'SELECT * FROM ' + tabela + ' WHERE cor_codigo = ' + req.params.codigo, 

    function(err, result, fields)
    {
        if(err)
        {
            throw err;
        }
// enviar o resultado (retorno query) para o tamplete
        res.render('../views/form_cores_alterar.ejs', {cor: result, title:result[0].cor_descricao})
    }

    )
}
)


// GET - Adicionar novo registro de cores
app.get('/cores/add', function(req, res)
{
    client.query
    (
    'SELECT * FROM ' + tabela, 
    function(err, results, fields)
    {
        if(err)
        {
            throw err;
        }
        res.render('form_cores', {cores: results, title: 'Cadastrar Cores'});
    }

    )
})

// POST - gravar o novo registro no banco de dados
app.post('/cores/add', function(req, res)
{

    console.log("Body....: ", req.body);
    var dados = req.body;

    var descricao  = req.body.cor_descricao;
    var referencia = req.body.cor_referencia;

    console.log("Dados.: ", referencia, " Desc: ",descricao);
    

    var msql = 'INSERT INTO ' + tabela + ' SET ? ';

    client.query(msql, dados);

    console.log("SQL: ", msql + dados);

    res.redirect('/cores')

}
)


// POST - gravar a alteração do registro
app.post('/cores/alterar', function(req, res)
{

    console.log("Body....: ", req.body);
    var dados = req.body;

    var codigo = req.body.cor_codigo;
    var descricao  = req.body.cor_descricao;
    var referencia = req.body.cor_referencia;

    console.log("Dados.: ", referencia, " Desc: ",descricao);
    

    var msql = "UPDATE " + tabela + " SET cor_descricao = '" + descricao + "' , cor_referencia = " + referencia + " WHERE cor_codigo = " + codigo;

    client.query(msql, dados);

    console.log("SQL: ", msql + dados);

    res.redirect('/cores/add')

}
)


// DELETE - Deletar registro - localiza pelo codigo
app.get('/cores/excluir/:codigo', function(req, res)

{
    var codigo = req.params.codigo 
    console.log(req.params.codigo)    

    var msql = 'DELETE FROM ' + tabela + ' WHERE cor_codigo = ' + codigo;

    client.query(msql);

    console.log("SQL: ", msql);

    res.redirect('/cores/add')
}
)

http.createServer(app).listen(app.get('port'), function() {
        console.log('Express escutando na porta ' + app.get('port'));
});                                         


