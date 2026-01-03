import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

export function validate(req: Request, schema: AnyZodObject) {
    try {
      schema.parse(req.body);
      return req.body
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        return errorMessages
        // res.status(400).json({ messages: errorMessages });
      } else {
        const knowError = error as Error;
        throw new Error(knowError.message);
      }
    }
}