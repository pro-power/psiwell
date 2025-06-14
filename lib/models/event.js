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
  isReturningClient: {
    type: Boolean,
    required: true,
    default: false
  },
  consultationType: {
    type: String,
    required: true,
    enum: ['in-person', 'telehealth'],
    default: 'telehealth'
  },
});

// Drop the existing model if it exists to ensure schema updates take effect
if (mongoose.models.Event) {
  delete mongoose.models.Event;
}

const Event = mongoose.model("Event", eventSchema);
export default Event;
