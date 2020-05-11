const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();


let localArr = [];

const makeId = ()=>{
    const id = [];
    
    for(let i = 0; i<6; i++){
        id.push((Math.random() * 9).toFixed(0))
    }
    return id.join('')
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use(express.json())

// app.use(express.static(path.resolve(__dirname, 'json')))

const jsonBase = path.join(__dirname,'json', 'index.json');

const writeToJson = () => {
    fs.writeFile(jsonBase, JSON.stringify(localArr), (err)=>{
        if(err) {
            throw err
        }
    })
}

const readFromJson = () => {
    fs.readFile(jsonBase, (err,cont)=>{
        const content = Buffer.from(cont)
        localArr = JSON.parse(content.toString());
    })
}

readFromJson()

app.get('/base', (req,res)=>{
    res.sendFile(path.resolve(jsonBase))
})

app.post('/base', (req,res)=>{
        const newTodo = {...req.body,
           id: makeId(),
         "isDone":false
        };
        localArr.push(newTodo);
        writeToJson();
        res.status(201).json(newTodo)
})

app.delete('/base/:id', (req,res)=>{
    localArr = localArr.filter((todo)=>todo.id !==req.params.id);
    writeToJson();
    res.status(200).json({message: req.params.id})
    
})

app.put('/base/:id', (req,res)=>{
    
    localArr = localArr.map((todo)=>{
        if(todo.id===req.params.id) {
            todo = req.body
        }
        return todo
    })
    console.log(localArr)
    writeToJson();
    res.status(200).json({message: req.params.id})
})

app.listen(3030, () => {console.log("Server has been started on port 3030...")});
