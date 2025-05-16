// import { Request, Response } from 'express';

// import { ClassRepository } from '../../infrastructure/database/repositories/ClassRepository.ts';

// // Use Case
// import { createClassUseCase } from '../../application/usecases/Class/createClassUseCase';
// import { getAllClassUseCase } from '../../application/usecases/Class/getAllClassUseCase';
// import { getByTypeClassUseCase } from '../../application/usecases/Class/getByTypeClassUseCase';
// import { getByIdClassUseCase } from '../../application/usecases/Class/getByIdClassUseCase';
// import { updateClassUseCase } from '../../application/usecases/Class/updateClassUseCase';
// import { deleteClassUseCase } from '../../application/usecases/Class/deleteClassUseCase';
// import { UserRepository } from '../../infrastructure/database/repositories/UserRepository'
// import { DailyVerseRepository } from '../../infrastructure/database/repositories/DailyVerseRepository';

// export class DailyVerseController {
//   private repository = new DailyVerseRepository();


//   /**
//    * Registra uma nova leitura diária
//    */
//   async registerRead(req: Request, res: Response) {
//     try {
//       const { userId, verse, chapter, book } = req.body;


//       // Validação básica
//       if (!userId || !verse || !chapter || !book) {
//         return res.status(400).json({ 
//           success: false,
//           error: "Todos os campos são obrigatórios: userId, verse, chapter, book" 
//         });
//       }


//       // Verifica usuário
//       const user = await UserRepository.findUserById(userId);
//       if (!user) {
//         return res.status(404).json({ 
//           success: false,
//           error: "Usuário não encontrado" 
//         });
//       }


//       // Verifica se já leu hoje
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
      
//       const alreadyRead = await this.repository.findByUserAndDate(userId, today);
//       if (alreadyRead) {
//         return res.status(400).json({
//           success: false,
//           error: "Você já registrou a leitura hoje"
//         });
//       }


//       // Calcula pontos
//       const points = ['dbv', 'counselor'].includes(user.role ?? '') ? 5 : 0;


//       // Cria a leitura
//       await this.repository.create({
//         userId,
//         date: today,
//         readAt: new Date(),
//         pointsEarned: points,
//         verse,
//         chapter,
//         book
//       });


//       // Obtém status atualizado
//       const status = await this.getCurrentStatus(userId);


//       // Resposta para o frontend
//       res.status(200).json({
//         success: true,
//         message: "Leitura registrada com sucesso!",
//         fireStatus: {
//           isActive: true,
//           streak: status.streak,
//           intensity: this.calculateFireIntensity(status.streak)
//         },
//         stats: {
//           totalDays: status.totalDays,
//           lastRead: status.lastRead,
//           pointsEarned: points
//         }
//       });


//     } catch (error: any) {
//       console.error("Erro no registerRead:", error);
//       res.status(500).json({ 
//         success: false,
//         error: error.message || "Erro ao registrar leitura" 
//       });
//     }
//   }


//   /**
//    * Obtém o status atual de leitura
//    */
//   async getStatus(req: Request, res: Response) {
//     try {
//       const { userId } = req.params;


//       if (!userId) {
//         return res.status(400).json({ 
//           success: false,
//           error: "userId é obrigatório" 
//         });
//       }


//       const status = await this.getCurrentStatus(userId);


//       res.status(200).json({
//         success: true,
//         fireStatus: {
//           isActive: status.hasReadToday,
//           streak: status.streak,
//           intensity: this.calculateFireIntensity(status.streak)
//         },
//         stats: {
//           totalDays: status.totalDays,
//           lastRead: status.lastRead
//         }
//       });


//     } catch (error: any) {
//       console.error("Erro no getStatus:", error);
//       res.status(500).json({ 
//         success: false,
//         error: error.message || "Erro ao buscar status" 
//       });
//     }
//   }


//   /**
//    * Método auxiliar para calcular o status atual
//    */
//   private async getCurrentStatus(userId: string): Promise<{
//     totalDays: number;
//     streak: number;
//     hasReadToday: boolean;
//     lastRead?: Date;
//   }> {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);


//     const allReadings = await this.repository.findAllByUser(userId);
//     const hasReadToday = allReadings.some(r => 
//       r.date.getTime() === today.getTime()
//     );


//     // Calcula total de dias (incluindo hoje se já leu)
//     const totalDays = allReadings.length;


//     // Calcula streak
//     let streak = 0;
//     let currentDate = new Date(today);


//     if (hasReadToday) {
//       streak = 1;
//       currentDate.setDate(currentDate.getDate() - 1);
//     }


//     for (const reading of allReadings) {
//       const readingDate = new Date(reading.date);
//       readingDate.setHours(0, 0, 0, 0);


//       if (readingDate.getTime() === currentDate.getTime()) {
//         streak++;
//         currentDate.setDate(currentDate.getDate() - 1);
//       } else if (readingDate < currentDate) {
//         break;
//       }
//     }


//     return {
//       totalDays,
//       streak,
//       hasReadToday,
//       lastRead: allReadings[0]?.date
//     };
//   }


//   /**
//    * Calcula a intensidade do fogo baseado no streak
//    */
//   private calculateFireIntensity(streak: number): number {
//     if (streak <= 0) return 0;
//     if (streak <= 3) return 1;
//     if (streak <= 7) return 2;
//     if (streak <= 14) return 3;
//     return 4;
//   }
// }


// // export class DailyVerseController {
// //   private repository: DailyVerseRepository;

// //   constructor() {
// //     this.repository = new DailyVerseRepository();
// //   }


// //   private getToday(): Date {
// //     const today = new Date();
// //     return new Date(Date.UTC(
// //       today.getFullYear(),
// //       today.getMonth(),
// //       today.getDate()
// //     ));
// //   }


// //   async registerRead(req: Request, res: Response): Promise<void> {
// //     try {
// //       const { userId, verse, chapter, book } = req.body;
      
// //       if (!userId || !verse || !chapter || !book) {
// //         res.status(400).json({ error: 'Dados incompletos' });
// //         return;
// //       }


// //       const today = this.getToday();
// //       const user = await UserRepository.findUserById(userId);
      
// //       if (!user) {
// //         res.status(404).json({ error: 'Usuário não encontrado' });
// //         return;
// //       }


// //       const alreadyRead = await this.repository.findByUserAndDate(userId, today);
// //       if (alreadyRead) {
// //         res.status(400).json({ error: 'Leitura já registrada hoje' });
// //         return;
// //       }


// //       const isDbvOrCounselor = ['dbv', 'counselor'].includes(user.role ?? '');
// //       const points = isDbvOrCounselor ? 5 : 0;


// //       await this.repository.create({
// //         userId,
// //         date: today,
// //         readAt: new Date(),
// //         pointsEarned: points,
// //         verse,
// //         book,
// //         chapter
// //       });


// //       res.status(200).json({ 
// //         message: 'Leitura registrada com sucesso', 
// //         points,
// //         date: today
// //       });
// //     } catch (error: any) {
// //       console.error('Error in registerRead:', error);
// //       res.status(500).json({ error: 'Erro interno no servidor' });
// //     }
// //   }


// //   async verifyStatusRead(req: Request, res: Response): Promise<void> {
// //     try {
// //       const { userId } = req.params;
      
// //       if (!userId) {
// //         res.status(400).json({ error: 'ID do usuário não fornecido' });
// //         return;
// //       }


// //       const today = this.getToday();
// //       const status = await this.repository.getReadingStatus(userId, today);
      
// //       res.status(200).json(status);
// //     } catch (error: any) {
// //       console.error('Error in verifyStatusRead:', error);
// //       res.status(500).json({ error: 'Erro interno no servidor' });
// //     }
// //   }


// //   async versesAllUser(req: Request, res: Response): Promise<void> {
// //     try {
// //       const { userId } = req.params;
      
// //       if (!userId) {
// //         res.status(400).json({ error: 'ID do usuário não fornecido' });
// //         return;
// //       }


// //       const readings = await this.repository.findAllByUser(userId);
      
// //       res.status(200).json(readings);
// //     } catch (error: any) {
// //       console.error('Error in versesAllUser:', error);
// //       res.status(500).json({ error: 'Erro interno no servidor' });
// //     }
// //   }


// //   async versesCount(req: Request, res: Response): Promise<void> {
// //     try {
// //       const { userId } = req.params;
      
// //       if (!userId) {
// //         res.status(400).json({ error: 'ID do usuário não fornecido' });
// //         return;
// //       }


// //       const result = await this.repository.getConsecutiveReadDays(userId);
      
// //       res.status(200).json(result);
// //     } catch (error: any) {
// //       console.error('Error in versesCount:', error);
// //       res.status(500).json({ error: 'Erro interno no servidor' });
// //     }
// //   }
// // }


