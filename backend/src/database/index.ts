import mongoose from 'mongoose';

export async function setupMongo() {
  try {
    // guard que você já tinha: se já está conectado, não reconecta
    if (mongoose.connection.readyState === 1) {
      return;
    }

    console.log('🎲 Connecting to database...');

    // A URI agora vem do ambiente, não mais cravada no código.
    // O "as string" é uma promessa que fazemos ao TypeScript de que
    // a variável existe — é frágil, e a gente troca isso por validação
    // de verdade (Zod) no próximo passo.
    await mongoose.connect(process.env.MONGO_URL as string, {
      serverSelectionTimeoutMS: 3000, // 3s
    });

    console.log('✅ Database connected!');
  } catch {
    throw new Error('❌ Database not connected.');
  }
}
