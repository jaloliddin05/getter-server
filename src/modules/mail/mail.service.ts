import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async register(body: { code: string; email: string }) {
    await this.mailerService
      .sendMail({
        to: body.email,
        subject: 'Getter uz Registration',
        text: `Getter uz Registration`,
        template: path.join(path.resolve(), 'src/templates/register.pug'),
        context: {
          // id: body.id,
          // name: body.name,
          // password: body.password,
          code: body.code,
          email: body.email,
        },
      })
      .catch((error) => {
        throw new HttpException(
          error.message || 'Error with SMTP',
          error.code || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    return body;
  }
}
