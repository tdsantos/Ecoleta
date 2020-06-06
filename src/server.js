const express = require("express")
const server = express()

//get database
const db = require("./database/db")

//public folder configuration
server.use(express.static("public"))

//enable use of req.body
server.use(express.urlencoded({ extended: true }))

//using template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//path configuration
//start page
server.get("/", (req,res) => {
    return res.render("index.html", {title: "Um título"})
})

server.get("/create-point", (req,res) => {
    
    //console.log(req.query)

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    
    //console.log(req.body)

    //insert data at database
    const query = `
            INSERT INTO places (
                image,
                name,
                address,
                address2,
                state,
                city,
               items
            ) VALUES (?,?,?,?,?,?,?);
        `
        
        const values = [
            req.body.image,
            req.body.name,
            req.body.address,
            req.body.address2,
            req.body.state,
            req.body.city,
            req.body.items
        ]
    
        function afterInsertData(err){
            if(err){
                return console.log(err)
           }
            console.log("Cadastrado com Sucesso")
            console.log(this)

            return res.render("create-point.html", { saved: true})
        }
    
        db.run(query, values, afterInsertData)    
})

server.get("/search", (req,res) => {

    const search = req.query.search
    if(search == ""){
        //view data from database
        return res.render("search-results.html", { total: 0})
    }

    //get data from database
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err){
            return console.log(err)
        }

        //count elements from search page
        const total = rows.length

        //view page with data
        return res.render("search-results.html", { places: rows, total})
    })
   
})

//turn on server
server.listen(3000)