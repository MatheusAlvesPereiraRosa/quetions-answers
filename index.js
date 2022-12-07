const bodyParser = require("body-parser")
const express = require("express")
const app = express()
const connection = require("./database/database")
const Pergunta = require('./database/Pergunta')
const Resposta = require("./database/Resposta")
//Database

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o bd")
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })

//Estou dizendo para o express usar o ejs como view engine
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.get("/", (req, res) => {
    Pergunta.findAll({ raw: true, order: [
        ['id', 'DESC']
    ] })
    .then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        })
    })
})

app.get("/perguntar", (req, res) => {
    res.render("perguntar")
})

app.post("/salvarPergunta", (req, res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    })
    .then(() => {
        res.redirect("/")
    })
})

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id
    Pergunta.findOne({
        where: {id: id}
    })
    .then(pergunta => {
        if (pergunta != undefined) {

            Resposta.findAll({
                where: {perguntaId: pergunta.id}
            })
            .then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
        } else {
            res.redirect("/")
        }
    })
})

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    })
    .then(() => {
        res.redirect("/pergunta/" + perguntaId)
    })
})

app.listen(8080, () => {
    console.log("App rodando!")
})