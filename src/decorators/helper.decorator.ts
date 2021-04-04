import {IParamExtraInfo} from '../interfaces'
import _ from 'lodash'
import {RouteParamTypeHelper} from '../utils/route-param-type.helper'
import {TExDecSettings} from '../utils/texdec-settings.singleton'

const texDecSettings = TExDecSettings.getInstance()
export function getFuncParams(
  target: any,
  key: string,
  originalMethod: any,
  req: any,
  res: any,
  next: any,
) {
  const routeVariables = {req, res, next}
  const RouteParamTypeHelperClass = texDecSettings.get('routeParamHelper')
  const metadataKeyTypes: (typeof RouteParamTypeHelperClass)[] = target['__metadata_key_types']
  const routeParamTypeHelper = new RouteParamTypeHelperClass()
  const funcParams: {value: any, meta: IParamExtraInfo, key: string}[] = []
  for (const keyType of metadataKeyTypes) {
    const targetKey = `__${keyType}Param_${key}_parameters`
    const targetMeta = `__${keyType}Param_${key}_meta`
    const indices = target[targetKey]
    const funcParamNames = getParamNames(originalMethod, target[targetMeta])
    const params = getParamNamesInPosition(funcParamNames, indices)
    const paramsExtraInfo = getParamExtraInfo(target[targetMeta], indices)
    if (!paramsExtraInfo || !paramsExtraInfo.length) throw new Error('Cannot find parameter extra information')
    if (!routeParamTypeHelper[keyType]) throw new Error('Cannot find definitions for route parameter. You must add on your RouteParamTypeHelper the same key as the first parameter of variableDecorator on your custom param decorator')
    insertToFuncParams(funcParams, indices, params, _.get(routeVariables, routeParamTypeHelper[keyType].path), routeParamTypeHelper[keyType].useFullObject, target[targetMeta])
  }
  return funcParams
}

function getParamNames(func: any, paramsMeta: IParamExtraInfo[]) {
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm
  const fnStr = func.toString().replace(STRIP_COMMENTS, '')
  return fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
    .split(',')
    .map((param: string) => param.trim().replace(/([a-zA-Z0-9]+).*/, '$1'))
    .map((param: string, index: number) => paramsMeta[index] && paramsMeta[index].parameterName || param) || []

}

function getParamNamesInPosition(funcNames: string[], positions: number[]): string[] {
  if (!positions || !positions.length) return []
  positions = positions.sort()
  const response = []
  for (const index of positions) {
    if (funcNames[index]) {
      response[index] = funcNames[index]
    }
  }
  return response
}

function insertToFuncParams(
  funcParams: {value: any, meta: IParamExtraInfo, key: string}[],
  indices: number[],
  paramNames: string[],
  paramsData: any,
  useFullVariable: boolean = false,
  paramsExtraInfo: IParamExtraInfo[]
) {

  paramNames.forEach((value, index) => {
    if (value) {
      if (paramsData && !useFullVariable) {
        funcParams[index] = {value: _.get(paramsData, value), meta: paramsExtraInfo[index], key: paramNames[index]}
      } else if (useFullVariable) {
        funcParams[index] = {value: paramsData, meta: paramsExtraInfo[index], key: paramNames[index]}
      }
    }
  })
}


function getParamExtraInfo(extraInfo: IParamExtraInfo[], positions: number[]): IParamExtraInfo[] {
  if (!positions || !positions.length) return []
  return positions.map(position => extraInfo[position])
}
