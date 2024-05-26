import { Request, Response, NextFunction } from "express";
import { getUsersByEmail, storeLastVisit } from "../services/userService";
import { error } from "../utils/error";

export async function getUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = await getUsersByEmail(request.params.email);

    if (!user) throw error("User not found", 404);
    response.json(user);
  } catch (error) {
    next(error);
  }
}

export async function patchUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = await storeLastVisit(request.params.email);

    if (!user) throw error("User not found", 404);
    response.status(201);
  } catch (error) {
    next(error);
  }
}

export async function postUsersController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    
  } catch (error) {
    next(error)
  }
}
