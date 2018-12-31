import { parseAsyncResult } from '../utils'

export const handleSyncResult = function (actionName, res) {
  this.debug(`${this.constructor.DEVICE_NAME}: ${actionName} get result ${res}`)
  let resCode = undefined
  let resData = {}

  if (typeof res === 'number') {
    resCode = res
  }

  if (typeof res === 'string' && res.indexOf('^') > -1) {
    resData = parseAsyncResult(res)
    resCode = resData.RT
  }

  const isOK = parseInt(resCode, 10) === 0

  if (!isOK) {
    // throw new OcxExceptions(`${actionName} failed`);
    this.debug(`${actionName} failed`)
  } else {
    this.debug(`${actionName} success`)
  }

  const result = {
    isOK,
    code: resCode,
    ...resData
  }

  this.debug('handleSyncResult: ', result)

  return result
};


export function Log(actionName){
  return function(target, name, descriptor){
    let oldValue = descriptor.value;
    descriptor.value = function(...args) {
      this.debug(`${this.constructor.DEVICE_NAME}: ${actionName}`)
      const resCode = oldValue.apply(this, args);
      return handleSyncResult.call(this, actionName, resCode)
    };
    return descriptor;
  }
}

export function LogAsync(actionName){
  return function(target, name, descriptor){
    let oldValue = descriptor.value;
    descriptor.value = function(...args) {
      this.debug(`${this.constructor.DEVICE_NAME}: ${actionName}`)
      const resCode = oldValue.apply(this, args);
      return resCode
    };
    return descriptor;
  }
}
