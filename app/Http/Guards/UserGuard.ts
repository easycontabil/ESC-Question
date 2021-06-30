import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpService,
  Inject,
} from '@nestjs/common'

@Injectable()
export class UserGuard implements CanActivate {
  @Inject(HttpService)
  private httpService: HttpService

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest()

    const token = request.header('Authorization')

    const { data } = await this.httpService
      .get(`http://localhost:3000/grd/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .toPromise()

    request.user = data.data

    return true
  }
}
