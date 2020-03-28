const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "Es necesario la id del usuario del video"]
    }
  },
  { collection: "videos" }
);

videoSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Video", videoSchema);
