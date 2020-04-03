const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

let Schema = mongoose.Schema;

let commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: [true, "El comentario es necesario"]
    },
    date: {
      type: String,
      required: [true, "Es obligatorio la fecha del comentario"]
    },
    idUser: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "Es necesario la id del usuario del comentario"]
    },
    idVideo: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: [true, "Es necesario la id del video del comentario"]
    }
  },
  { collection: "comments" }
);

commentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Comments", commentSchema);
