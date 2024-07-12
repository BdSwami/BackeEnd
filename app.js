const express = require('express');
const app = express();

const {mongoose} = require('./db/mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');

const { List } = require('./db/models/list.model');
const { Task } = require('./db/models/task.model');


const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:4200', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

// var TODOS_FILE = './db/models/json file/todos.json';

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// Get all todos
app.get('/lists', (req, res) => {
    // for josn file
    // fs.readFile(TODOS_FILE, (err, data) => {
    //     if (err) throw err;
    //     const todos = JSON.parse(data);
    //     res.json(todos);
    // });

    // for mongodb
    List.find({}).then((lists) =>{
        res.send(lists);
    })
});

// Add a new todo
app.post('/lists', (req, res) => {
    // const newTodo = req.body;
    // fs.readFile(TODOS_FILE, (err, data) => {
    //     if (err) throw err;
    //     const todos = JSON.parse(data);
    //     todos.push(newTodo);
    //     fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), err => {
    //         if (err) throw err;
    //         res.json(todos);
    //     });
    // });

    let title = req.body.title;

    let newList = new List({
        title
    });

    newList.save().then((listDoc) =>{
        res.send(listDoc);
    });
});


app.patch('/lists/:id', (req,res)=>{
    List.findOneAndUpdate({ _id : req.params.id }, {
        $set : req.body
    }).then(() =>{
        res.sendStatus(200);
    })
})

app.delete('/lists/:id', (req,res)=>{
    List.findOneAndDelete({ 
        _id : req.params.id 
    }).then((removeListDoc) => {
        res.send(removeListDoc);
    })
})

app.get('/lists/:listId/tasks', (req, res) => {
    Task.find({
        _listId : req.params.listId
    }).then((Task) =>{
        res.send(Task);
    })
});

app.post('/lists/:listId/tasks', (req, res) => {
    console.log("badll post");
    let newTask = new Task({
        title : req.body.title,
        _listId : req.params.listId
    });
    
    newTask.save().then((newTaskList) =>{
        res.send(newTaskList);
    })
});

app.patch('/lists/:lid/tasks/:tid', (req,res)=>{
    console.log('patch');
    Task.findOneAndUpdate({ 
        _id : req.params.tid,
        _listId : req.params.lid
        }, {
        $set : req.body
    }).then(() =>{
        res.sendStatus(200);
    })
})

app.delete('/lists/:lid/tasks/:tid', (req,res)=>{
    console.log('delete');
    Task.findOneAndDelete({ 
        _id : req.params.tid,
        _listId : req.params.lid 
    }).then((removeTaskDoc) => {
        res.send(removeTaskDoc);
    })
})

app.listen(3000,() =>{
    console.log("Server started at port 3000");
})
