import 'reflect-metadata';
import {variableDecoratorGenerator} from './variable-decorator-generator'

export function Query(parameterName: string | null | undefined = undefined, castToType: boolean = true, ...args: any[]) {
  return variableDecoratorGenerator('Query', parameterName, castToType, ...args)
}

export function Param(parameterName: string | null | undefined = undefined, castToType: boolean = true, ...args: any[]) {
  return variableDecoratorGenerator('Param', parameterName, castToType, ...args)
}

export function Body(parameterName: string | null | undefined = undefined, castToType: boolean = true, ...args: any[]) {
  return variableDecoratorGenerator('Body', parameterName, castToType, ...args)
}

export function Res(...args: any[]) {
  return variableDecoratorGenerator('Res',undefined, false, ...args)
}

export function Req(...args: any[]) {
  return variableDecoratorGenerator('Req', undefined, false, ...args)
}

export function Next(...args: any[]) {
  return variableDecoratorGenerator('Next', undefined, false, ...args)
}



