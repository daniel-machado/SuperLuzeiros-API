import { Sequelize } from 'sequelize';
import * as models from './models';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Object.values(models).forEach((model: any) => {
//   if(model.init){
//     model.init(sequelize);
//   }
// });

export default sequelize;


// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config();

// const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
//   dialect: 'postgres',
//   logging: false,
//   dialectOptions: process.env.NODE_ENV === 'production' ? {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   } : {},
// });

// export default sequelize;
