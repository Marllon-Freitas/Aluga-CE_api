import { validation } from "../../shared/middlewares";
import { Request, Response } from "express";
import { UsersProvider } from "../../providers/users";
import StatusCodes from "http-status-codes";
import { User } from "../../models";

import * as yup from "yup";

interface IBodyProps extends Omit<User, "id"> {}

export const createUserValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      name: yup.string().required(),
      phone_number: yup.string().required(),
      email: yup.string().email().required().min(6),
      password: yup.string().required().min(6),
    })
  ),
}));

export const create = async (req: Request<{}, {}, User>, res: Response) => {
  try {
    const result = await UsersProvider.create(req.body);

    if (!result)
      return res.status(StatusCodes.NOT_FOUND).json({
        errors: {
          default: "Erro ao criar usuário.",
        },
      });

    return res.status(StatusCodes.CREATED).json({
      message: "Usuário criado com sucesso.",
      data: result.user,
    });
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        message: error.message || "Erro ao criar usuário.",
        default: "Erro ao criar usuário.",
      },
    });
  }
};
