import { model, Schema } from 'mongoose';

const HabitSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: [Date],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const habitModel = model('Habit', HabitSchema);
