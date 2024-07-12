const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://badalswami360:jbDfJujK5oo1HUFF@todolist.q5mcocy.mongodb.net/?retryWrites=true&w=majority&appName=TodoList').then(() => {
    console.log("database connected");
}).catch((e) =>{
    console.log('fiald to comnnect',e);
});

module.exports = {
    mongoose
};