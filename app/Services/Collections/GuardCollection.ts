import { ConfigService } from '@nestjs/config'
import { HttpException, HttpService, Inject, Injectable } from '@nestjs/common'

@Injectable()
export class GuardCollection {
  @Inject(HttpService) private httpService: HttpService

  private readonly url: string

  constructor(private configService: ConfigService) {
    this.url = this.configService.get('http.services.guard.url')
  }

  async me(token: string) {
    const url = `${this.url}/auth/me`

    try {
      return (
        await this.httpService
          .get(url, {
            headers: {
              Authorization: token,
            },
          })
          .toPromise()
      ).data.data
    } catch (error) {
      const response = {
        isGuardError: true,
        method: this.me.name,
        statusCode: error.response?.status || 500,
        message:
          error.response?.statusText ||
          error.message ||
          'Internal Server Error',
      }

      throw new HttpException(response, response.statusCode)
    }
  }

  async updateUser(userId: string, body: any) {
    const url = `${this.url}/users/${userId}`

    try {
      return (await this.httpService.put(url, body).toPromise()).data.data
    } catch (error) {
      const response = {
        isGuardError: true,
        method: this.updateUser.name,
        statusCode: error.response?.status || 500,
        message:
          error.response?.statusText ||
          error.message ||
          'Internal Server Error',
      }

      throw new HttpException(response, response.statusCode)
    }
  }
}
