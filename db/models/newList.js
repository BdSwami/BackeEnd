const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    _userId: {
      type: mongoose.Types.ObjectId,
      required: true
  }
});

const newList = mongoose.model('newList', ListSchema);

module.exports = {newList};