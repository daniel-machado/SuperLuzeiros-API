import Joi, { ObjectSchema } from 'joi';

// (?=.*[a-z]): A senha deve conter pelo menos uma letra minúscula (a-z).
// (?=.*[A-Z]): A senha deve conter pelo menos uma letra maiúscula (A-Z).
// (?=.*d): A senha deve conter pelo menos um número (d representa qualquer dígito de 0 a 9).
// .{8,}: A senha deve ter pelo menos 8 caracteres no total (não há limite máximo).

export const signupSchema: ObjectSchema = Joi.object({
    name: Joi.string()
          .min(3)
          .max(30)
          .required(),
    birthDate: Joi.string()
          .required(),
    email: Joi.string()
          .min(6)
          .max(60)
          .required()
          .email({
            tlds: { allow: ['com', 'net'] },
          }),
    password: Joi.string()
          .min(6)
          .required()
          .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,}$')),
    confirmPassword: Joi.ref('password'),
    photoUrl: Joi.string().uri().optional()
});

export const signinSchema: ObjectSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ['com', 'net'] },
    }),
  password: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,}$')),
});

export const acceptCodeSchema: ObjectSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ['com', 'net'] },
    }),
  providedCode: Joi.number().required(),
});

export const changePasswordSchema: ObjectSchema = Joi.object({
  newPassword: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,}$')),
  oldPassword: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,}$')),
});

export const forgotPasswordSchema: ObjectSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ['com', 'net'] },
    }),
});

export const acceptFPCodeSchema: ObjectSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ['com', 'net'] },
    }),
  providedCode: Joi.number().required(),
  newPassword: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,}$')),
});

