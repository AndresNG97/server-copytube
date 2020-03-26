const mongoose = require("mongoose");

let Schema = mongoose.Schema;
let videoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "El titulo es necesario"]
    },
    description: {
      type: String
    },
    video: {
      type: String,
      required: [true, "La url del video es necesaria"]
    },
    thumbnail: {
      type: String,
      required: [true, "La url del thumbnail del video es necesaria"]
    },
    idUser: {
      type: String,
      required: [true, "Es necesario la id del usuario del video"]
    }
  },
  { collection: "videos" }
);

module.exports = mongoose.model("Video", videoSchema);
