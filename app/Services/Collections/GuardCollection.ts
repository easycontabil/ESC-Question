import { ConfigService } from '@nestjs/config'
import { HttpService, Inject, Injectable } from '@nestjs/common'

@Injectable()
export class GuardCollection {
  @Inject(HttpService) private httpService: HttpService

  private readonly url: string

  constructor(private configService: ConfigService) {
    this.url = this.configService.get('http.services.guard.url')
  }

  async example() {
    // mount request
    // const url = `${this.url}`

    try {
      // make request
      // return (await this.httpService.put(url).toPromise()).data
    } catch (error) {
      // on error in request
      // const response = {
      //   isGuardError: true,
      //   method: this.updateAccount.name,
      //   statusCode: error.response?.status || 500,
      //   message: error.response?.statusText || 'Internal Server Error',
      // }
      //
      // throw new HttpException(response, response.statusCode)
    }
  }
}
