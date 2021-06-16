import * as glob from 'glob'
import * as path from 'path'

import { Debugger } from '@secjs/logger'

interface IConfig {
  isGlobal: boolean
  load: [any]
  [key: string]: any | any[]
}

export class ApplicationProvider {
  private debug = new Debugger('api:provider')

  static pipes: any[] = []
  static models: any[] = []
  static configs: any = {}
  static services: any[] = []
  static httpGuards: any[] = []
  static repositories: any[] = []
  static httpMiddlewares: any[] = []
  static httpControllers: any[] = []

  get models() {
    return ApplicationProvider.models
  }

  get typeOrmConnection() {
    return {
      entities: this.models,
      ...ApplicationProvider.configs.database.postgres,
      migrations: ['database/migrations/*.js'],
    }
  }

  get repositories() {
    return ApplicationProvider.repositories
  }

  get configs(): IConfig {
    return {
      isGlobal: true,
      load: [() => ApplicationProvider.configs],
      ...ApplicationProvider.configs,
    }
  }

  get controllers() {
    return ApplicationProvider.httpControllers
  }

  get middlewares() {
    return ApplicationProvider.httpMiddlewares
  }

  get providers() {
    let providers = [
      ...ApplicationProvider.pipes,
      ...ApplicationProvider.services,
      ...ApplicationProvider.httpGuards,
      ...ApplicationProvider.repositories,
    ]

    providers = providers.filter(provider => {
      if (!provider.prototype.onlyFromImports) return provider
    })

    return providers
  }

  clearMemory() {
    delete ApplicationProvider.configs

    delete ApplicationProvider.pipes
    delete ApplicationProvider.models
    delete ApplicationProvider.services
    delete ApplicationProvider.httpGuards
    delete ApplicationProvider.repositories
    delete ApplicationProvider.httpMiddlewares
    delete ApplicationProvider.httpControllers

    this.debug.debug('🧹 Memory successfully cleared')
  }

  constructor() {
    this.bootPipes()
    this.bootModels()
    this.bootServices()
    this.bootHttpGuards()
    this.bootRepositories()
    this.bootHttpMiddlewares()
    this.bootHttpControllers()
    this.bootConfigs()
  }

  bootPipes() {
    const debug = this.debug

    const fileExt = '.ts'
    const filePath = 'app/Pipes'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function(file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`🔩 Ignoring ${fileName}`)

        return
      }

      debug.debug(`🔩 Boot ${fileName}`)
      ApplicationProvider.pipes.push(Class)
    })
  }

  bootModels() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'app/Models'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function(file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`🎲 Ignoring ${fileName}`)

        return
      }

      debug.debug(`🎲 Boot ${fileName}`)
      ApplicationProvider.models.push(Class)
    })
  }

  bootConfigs() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'config'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function(file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      debug.debug(`🔗 Boot ${fileName}`)
      ApplicationProvider.configs[
        fileName
      ] = require(`../${replacedPath}`).default
    })
  }

  bootServices() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'app/Services'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function(file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`🔧 Ignoring ${fileName}`)

        return
      }

      debug.debug(`🔧 Boot ${fileName}`)
      ApplicationProvider.services.push(Class)
    })
  }

  bootHttpGuards() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'app/Http/Guards'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function(file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`🛡️  Ignoring ${fileName}`)

        return
      }

      debug.debug(`🛡️  Boot ${fileName}`)
      ApplicationProvider.httpGuards.push(Class)
    })
  }

  bootRepositories() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'app/Repositories'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function(file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`🧱 Ignoring ${fileName}`)

        return
      }

      debug.debug(`🧱 Boot ${fileName}`)
      ApplicationProvider.repositories.push(Class)
    })
  }

  bootHttpMiddlewares() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'app/Http/Middlewares'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function(file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`📎 Ignoring ${fileName}`)

        return
      }

      debug.debug(`📎 Boot ${fileName}`)
      ApplicationProvider.httpMiddlewares.push({
        middleware: Class,
        routes: Class.routes,
      })
    })
  }

  bootHttpControllers() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'app/Http/Controllers'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function(file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`🚪 Ignoring ${fileName}`)

        return
      }

      debug.debug(`🚪 Boot ${fileName}`)
      ApplicationProvider.httpControllers.push(Class)
    })
  }
}

export default new ApplicationProvider()
