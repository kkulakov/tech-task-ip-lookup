import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    this.logger.log(`Request: [${method}] ${originalUrl}`);

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(`Response: [${method}] ${originalUrl} (${statusCode})`);
    });

    next();
  }
}
