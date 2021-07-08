import { ApiRequestContract } from '@secjs/contracts'
import { PipeTransform, Injectable } from '@nestjs/common'

@Injectable()
export class QueryParamsPipe implements PipeTransform {
  transform(value: any): ApiRequestContract {
    const apiRequest: ApiRequestContract = {
      isInternRequest: true,
      where: {},
      orderBy: {},
      includes: [],
    }

    Object.keys(value).forEach(key => {
      const whereKey = key.split('*')[1]
      const orderByKey = key.split('-')[1]
      const includesKey = key.split('_')[1]

      if (whereKey && value[key]) {
        apiRequest.where[whereKey] = value[key]

        return
      }

      if (orderByKey && value[key]) {
        apiRequest.orderBy[orderByKey] = (value[key] as 'ASC') || 'DESC'

        return
      }

      if (includesKey && value[key]) {
        // if (includesKey.indexOf('.') > 0) {
        //   const relations = key.split('.')
        //   const mainRelation = relations[0].replace('_', '')
        //
        //   relations.splice(
        //     relations.findIndex(r => r === `_${mainRelation}`),
        //     1,
        //   )
        //
        //   apiRequest.includes.push({
        //     relation: mainRelation,
        //     includes: [{ relation: relations[0] }],
        //   })
        //
        //   return
        // }
        const arraySubIncludes = JSON.parse(value[key])

        const include = { relation: includesKey, includes: [] }

        arraySubIncludes.forEach(subRelation => {
          include.includes.push({ relation: subRelation })
        })

        if (!include.includes.length) delete include.includes

        apiRequest.includes.push(include)
      }
    })

    return apiRequest
  }
}
