const mongoose = require('mongoose');

mongoose.connect('mongodb://badalswami360:jbDfJujK5oo1HUFF@ac-wdeqzic-shard-00-00.q5mcocy.mongodb.net:27017,ac-wdeqzic-shard-00-01.q5mcocy.mongodb.net:27017,ac-wdeqzic-shard-00-02.q5mcocy.mongodb.net:27017/?ssl=true&replicaSet=atlas-ebzsj5-shard-0&authSource=admin&retryWrites=true&w=majority&appName=TodoList').then(() => {
    console.log("database connected");
}).catch((e) =>{
    console.log('fiald to comnnect',e);
});

module.exports = {
    mongoose
};