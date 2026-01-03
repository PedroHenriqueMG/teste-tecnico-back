import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

export function validateBody(req: Request, schema: AnyZodObject) {
    try {
        const parsedBody = schema.parse(req.body);
      return parsedBody
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        return errorMessages
      } else {
        const knowError = error as Error;
        throw new Error(knowError.message);
      }
    }
}

export function validateQuery(req: Request, schema: AnyZodObject) {
    try {
      const parsedQuery = schema.parse(req.query);
      return parsedQuery
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        return errorMessages
      } else {
        const knowError = error as Error;
        throw new Error(knowError.message);
      }
    }
}