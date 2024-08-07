const mongoose = require('mongoose')

const uesrNotes = new mongoose.Schema({
  notes : {
    require : true,
    note : String
  },
  _userId: {
    type: mongoose.Types.ObjectId,
    required: true
}
});

const Note = mongoose.model("Note" , uesrNotes);

module.exports = {Note};