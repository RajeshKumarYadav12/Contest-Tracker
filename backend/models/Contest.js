import mongoose from 'mongoose'

const ContestSchema = new mongoose.Schema({
  name: String,
  platform: String,
  startTime: Date,
  endTime: Date,
  link: String,
  bookmarked: { type: Boolean, default: false },
  solutionLink: String
});

const Contest = mongoose.model("Contest", ContestSchema);

export default Contest;
