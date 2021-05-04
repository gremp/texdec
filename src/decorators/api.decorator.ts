import {plainToClass} from 'class-transformer'
import {validate} from 'class-validator'
import {Request, Response, NextFunction} from 'express'
import {getFuncParams} from './helper.decorator'
import {RouterDecorator} from './router.decorator'
import {ValidationError} from '../errors/validation.error'
import {ClassType} from 'class-transformer/ClassTransformer'
import {IParamExtraInfo} from '../interfaces'
import {CastHelper} from '../utils/cast.helper'
import {TExDecSettings} from '../utils/texdec-settings.singleton'

const texDecSettings = TExDecSettings.getInstance()
let routeParamTypeHelper: any

function ApiCall(route: string, method: IMethod, validationObj: IValidationObj | undefined, customResponse: boolean) {
  const RouteParamTypeHelperClass = texDecSettings.get('routeParamHelper')
  if (!routeParamTypeHelper) routeParamTypeHelper = new RouteParamTypeHelperClass()

  return function (target: any, key: any, descriptor: any) {
    const routerDecorator = new RouterDecorator()
    // save a reference to the original method this way we keep the values currently in the
    // descriptor and don't overwrite what another decorator might have done to the descriptor.
    if (descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(target, key)
    }

    const originalMethod = descriptor.value
    const endpointMethodName = descriptor.value.name
    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      let response: any

      try {
        const funcParams = getFuncParams(target, key, originalMethod, req, res, next)
        const {funcValues, objForValidation} = await postParameterProcessing(funcParams, req)
        if (validationObj) await validateRoute(validationObj, objForValidation)


        const methodResult: any = originalMethod.apply(target.constructor._instance, funcValues)

        // I use await so I skip checking if methodResult is a promise or not(e.x await 5 => return 5)
        response = await methodResult

        await Promise.all(funcParams.map(async (funcParam, index) => {
            const typeName = funcParam.meta.typeName
            if (routeParamTypeHelper[typeName] && routeParamTypeHelper[typeName].after) {
              await routeParamTypeHelper[typeName].after(req, response, funcValues[index], funcParam.meta.args)
            }
          })
        )


        if (!customResponse) res.json(response)

      } catch (e) {
        if (e instanceof Error) next(e)
        else next(new Error(e))
      }
    }

    routerDecorator.addEndpoint(target.constructor, endpointMethodName, route, descriptor.value, method)
  }
}

async function validateRoute(validationObj: IValidationObj, objForValidation: any) {
  const errors = []
  const object = plainToClass(validationObj, objForValidation)
  errors.push(await validate(object))

  if (errors.length) {
    throw new ValidationError(formatErrors(errors))
  }
}

export function Get(route: string, validationObj?: IValidationObj) {
  return ApiCall(route, 'get', validationObj, false)
}

export function Post(route: string, routeValidationObj?: IValidationObj) {
  return ApiCall(route, 'post', routeValidationObj, false)
}

export function Put(route: string, routeValidationObj?: IValidationObj) {
  return ApiCall(route, 'put', routeValidationObj, false)
}

export function Delete(route: string, routeValidationObj?: IValidationObj) {
  return ApiCall(route, 'delete', routeValidationObj, false)
}

export function Patch(route: string, routeValidationObj?: IValidationObj) {
  return ApiCall(route, 'patch', routeValidationObj, false)
}

export function GetCustomRes(route: string, routeValidationObj?: IValidationObj) {
  return ApiCall(route, 'get', routeValidationObj, true)
}

export function PostCustomRes(route: string, routeValidationObj?: IValidationObj) {
  return ApiCall(route, 'post', routeValidationObj, true)
}

export function PutCustomRes(route: string, routeValidationObj?: IValidationObj) {
  return ApiCall(route, 'put', routeValidationObj, true)
}

export function DeleteCustomRes(route: string, routeValidationObj?: IValidationObj) {
  return ApiCall(route, 'delete', routeValidationObj, true)
}

export function PatchCustomRes(route: string, routeValidationObj?: IValidationObj) {
  return ApiCall(route, 'patch', routeValidationObj, true)
}

function formatErrors(errors: any[]) {
  return errors
    .map((err) => {
      // tslint:disable-next-line:forin
      for (const property in err.constraints) {
        return err.constraints[property]
      }
    })
    .join(', ')
}

async function postParameterProcessing(funcParams: { value: any, meta: IParamExtraInfo, key: string }[], req: Request) {
  const objForValidation: any = {}
  const funcValues: any = Array(funcParams.length)
  await Promise.all(funcParams.map(async (funcParam, index) => {
    objForValidation[funcParam.key] = funcParam.meta.castToType
      ? castParamToType(funcParam.value, funcParam.meta.type)
      : funcParam.value
    const typeName = funcParam.meta.typeName
    if (routeParamTypeHelper[typeName] && routeParamTypeHelper[typeName].before) {
      funcValues[index] = (await routeParamTypeHelper[typeName].before(req, funcParam.meta.args))
    } else {
      funcValues[index] = (objForValidation[funcParam.key])
    }
  }))
  return {objForValidation, funcValues}

}

function castParamToType(value: any, type: Function): any {
  const texDecSettings = TExDecSettings.getInstance()
  const CastHelperClass = texDecSettings.get('castHelper')
  const castHelper = new CastHelperClass()
  const typeName = type.name as keyof CastHelper
  if (castHelper[typeName]) return castHelper[typeName](value)
  return value
}

type IMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type IValidationObj = ClassType<any>

