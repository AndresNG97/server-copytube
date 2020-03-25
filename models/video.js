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
    videoname: {
      type: String,
      required: [true, "El nombre del video es necesario"]
    },
    thumbnail: {
      type: String,
      required: [true, "El thumbnail del video es necesario"]
    },
    idUser: {
      type: String,
      required: [true, "Es necesario la id del usuario del video"]
    }
  },
  { collection: "videos" }
);

module.exports = mongoose.model("Video", videoSchema);
