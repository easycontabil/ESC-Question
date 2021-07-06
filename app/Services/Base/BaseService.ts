import { Injectable } from '@nestjs/common'

@Injectable()
export class BaseService {
  private _guard: any

  get guard() {
    if (!this._guard) {
      throw new Error('UNSET_GUARD')
    }

    return this._guard
  }

  setGuard(guard: any) {
    this._guard = guard

    return this
  }
}
