import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(
    `Functional Logger Middleware: Request : ${req.method} : ${req.ip} : ${req.path}`,
  );
  next();
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Class Logger Middleware: Request : ${req.method} : ${req.ip} : ${req.path}`);
    next();
  }
}
