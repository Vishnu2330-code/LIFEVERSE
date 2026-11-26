import mongoose from 'mongoose';

const habitCheckInSchema = new mongoose.Schema(
  {
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    checkInDate: {
      type: Date,
      default: Date.now,
    },
    checkInDateStr: {
      type: String, // YYYY-MM-DD in user's timezone
      required: true,
      index: true,
    },
    xpAwarded: {
      type: Number,
      default: 10,
    },
    coinsAwarded: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index prevents duplicate check-in on the same date for the same habit
habitCheckInSchema.index({ habitId: 1, checkInDateStr: 1 }, { unique: true });

export const HabitCheckIn = mongoose.model('HabitCheckIn', habitCheckInSchema);
export default HabitCheckIn;
