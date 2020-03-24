const mongoose = require("mongoose");

let Schema = mongoose.Schema;
let videoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "El titulo es necesario"]
    },
    description: {
      type: String,
      required: [true, "La descripción es necesaria"]
    },
    thumbnail: {
      type: String,
      required: [true, "El thumbnail es necesario"],
      default: "defualtThumbnail.png"
    },
    idUser: {
      type: String,
      required: [true, "Es necesario la id del usuario del video"]
    }
  },
  { collection: "videos" }
);

module.exports = mongoose.model("Video", videoSchema);
