import mongoose from 'mongoose';

export async function cleanupDatabase(models: mongoose.Model<any>[]) {
  if (process.env.IS_CLEANUP === 'true') {
    for (let model of models) {
      model.deleteMany({});
    }
  }
}
