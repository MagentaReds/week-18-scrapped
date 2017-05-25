var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SavedArticleSchema = new Schema({
  article: {
    type: Schema.Types.ObjectId,
    ref: "Article",
    required: true,
    unique: true
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

SavedArticleSchema.pre('remove', function(next) {
    // Remove all the note documents that are attached to this savedarticle before removing this savedarticle
    this.model('Note').remove({ _id: {$in: this.notes }}, next);
});

var SavedArticle = mongoose.model("SavedArticle", SavedArticleSchema);

module.exports = SavedArticle;