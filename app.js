/**
*     modulo principal
*/

//
// cria instancias dos módulos do express
//

var express = require('express');
var http = require('http');
var path = require('path');
var body = require('body-parser');

// express body-Parser permite a construção de objetos JSON 
// a partir da submissão de dados de um formulário HTML

app = express();

app.use(body.urlencoded({extended:true}));
app.use(body.json());

app.set('port', 3000);

var mysql = require('mysql');
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

// inserir um registro na tabela
/*
client.query(
    'INSERT INTO ' + tabela + '(cor_codigo, cor_descricao, cor_referencia) values (NULL, "VERMELHA", "006")'
);
*/


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
// enviar o resultado (retorno query) para o tamplete
//        res.send(results);
        res.render('../views/lista_cores.ejs', {cores: results, title:'Lista'  })
    }

    )
}
)


// mostrar o resultado da pesquisa (JSON) no navegador
app.get('/cores/views/:codigo', function(req, res)
{
console.log(req.params.codigo)
    client.query
    (
    'SELECT * FROM ' + tabela + ' WHERE cor_codigo = ' + parseInt(req.params.codigo), 

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


// adicionar novo registro na tabela 
app.get('/cores/add', function(req, res)
{
    res.render('form_cores', {title:'Cadastro de Cores'});
})

app.post('/cores/add', function(req, res)
{
    var dados = req.body;
    console.log("Descrição..:" + req.body.cor_descricao);
    console.log("Referencia.:" + req.body.cor_referencia);

    var msql = 'INSERT INTO ' + tabela + ' SET ? ';
    client.query( msql, dados);

    res.redirect('/cores');    
}
)


http.createServer(app).listen(app.get('port'), function() {
        console.log('Express escutando na porta ' + app.get('port'));
});                                         


