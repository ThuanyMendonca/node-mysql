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
// client.query(
//     'INSERT INTO ' + tabela + '(cor_codigo, cor_descricao, cor_referencia) values (NULL, "AZUL", "005")'
// );



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

        res.send(results);
    }

    )
}
)



http.createServer(app).listen(app.get('port'), function() {
        console.log('Express escutando na porta ' + app.get('port'));
});                                         


