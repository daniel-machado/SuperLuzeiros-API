import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export const validate = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body); // const { error } = schema.validate(req.body,  { abortEarly: false }); Essa flag é para mostrar todos os erros de vez
        
        if (error) {
          res.status(400).json({ 
            success: false,
            errors: error.details.map((err) => err.message)
          });
        } else {
          next();
        }
        
    };
};
