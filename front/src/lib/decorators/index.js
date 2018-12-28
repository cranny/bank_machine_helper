import { parseAsyncResult } from '../utils'

export const handleSyncResult = function (actionName, res) {
  this.debug(`${this.constructor.DEVICE_NAME}: ${actionName} get result ${res}`)
  let resCode = undefined

  if (typeof res === 'number') {
    resCode = res
  }

  if (typeof res === 'string' && res.indexOf('^') > -1) {
    res = parseAsyncResult(res)
    resCode = res.RT
  }

  if (parseInt(resCode, 10) !== 0) {
    // throw new OcxExceptions(`${actionName} failed`);
    this.debug(`${actionName} failed`)
  } else {
    this.debug(`${actionName} success`)
  }

  return res
};


export function Log(actionName){
  return function(target, name, descriptor){
    let oldValue = descriptor.value;
    descriptor.value = function(...args) {
      this.debug(`${this.constructor.DEVICE_NAME}: ${actionName}`)
      const resCode = oldValue.apply(this, args);
      handleSyncResult.call(this, actionName, resCode)
      return resCode
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