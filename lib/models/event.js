import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true
  },
  client: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
export default Event;
