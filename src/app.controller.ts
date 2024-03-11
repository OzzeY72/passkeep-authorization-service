import { Controller, Get,Header, Options } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Header("Access-Control-Allow-Methods","GET")
  @Header("Access-Control-Allow-Headers","Authorization")
  @Header("Access-Control-Allow-Origin","*")
  @Options()
  hello_cors(){}

  @Header("Access-Control-Allow-Origin","*")
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
