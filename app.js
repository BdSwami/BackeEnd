const express = require('express');
const app = express();

const {mongoose} = require('./db/mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');

const { List } = require('./db/models/list.model');
const { Task } = require('./db/models/task.model');
const {User} = require('./db/models/users.model');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    // Register endpoint
    app.post('/register', async (req, res) => {
        const { username, password } = req.body;
    
        try {
        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create new user
        user = new User({
            username,
            password: hashedPassword,
        });
    
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
        }
    });


// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Create a JWT token
      const token = jwt.sign({ userId: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
  
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
app.listen(3000,() =>{
    console.log("Server started at port 3000");
})
