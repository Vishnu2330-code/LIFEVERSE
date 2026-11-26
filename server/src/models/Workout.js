import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    workoutType: {
      type: String,
      enum: ['strength', 'cardio', 'hiit', 'yoga', 'running', 'cycling', 'stretching', 'other'],
      default: 'strength',
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    exercises: [
      {
        name: { type: String, required: true },
        sets: { type: Number, default: 3 },
        reps: { type: Number, default: 10 },
        weightKg: { type: Number, default: 0 },
      },
    ],
    caloriesBurned: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    xpEarned: {
      type: Number,
      default: 30,
    },
    coinsEarned: {
      type: Number,
      default: 15,
    },
  },
  {
    timestamps: true,
  }
);

export const Workout = mongoose.model('Workout', workoutSchema);
export default Workout;
