import * as jwt from 'jsonwebtoken'

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common'
import { UserService } from '../../Services/Api/UserService'

@Injectable()
export class UserGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest()

    request.user = await this.userService.findOne(
      jwt.decode(request.header('Authorization').split('Bearer ')[1]).id,
    )

    return true
  }
}
