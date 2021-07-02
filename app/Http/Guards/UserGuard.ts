import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common'
import { GuardCollection } from '../../Services/Collections/GuardCollection'

@Injectable()
export class UserGuard implements CanActivate {
  @Inject(GuardCollection)
  private guardCollection: GuardCollection

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest()

    request.user = await this.guardCollection.me(
      request.header('Authorization'),
    )

    return true
  }
}
