var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    defaultValue: ""
  }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;