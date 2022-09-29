import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  // external(): any{
  //   var res = this.httpService.get('https://virtserver.swaggerhub.com/fall2022-csye6225/cloud-native-webapp/assignment-01/healthz').pipe(
  //     (response) => {
  //       return response;
  //     }
  //   );
  //   console.log('res: ', res);
  //   return "help";
  // }
}
