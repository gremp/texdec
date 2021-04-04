export class CastHelper {
  Number = (value: any): any => { return parseFloat(value) }

  Date = (value: any): any => { return new Date(value) }

  Boolean = (value: any): any => {
    if (typeof value === 'number') return Boolean(value)
    if (typeof value === 'string' && !!value.match(/^.+\d$/g)) return Boolean(parseFloat(value))
    if (value.toLowerCase() === 'true' || value.toLowerCase() === 't') return true
    if (value.toLowerCase() === 'false' || value.toLowerCase() === 'f') return false
    throw new Error(`Value ${value} cannot be cast to Boolean`)
  }
}
