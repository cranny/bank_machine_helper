export const parseAsyncResult = str => {
  const arrStr = str.split('^');
  return arrStr.reduce((res, item) => {
    const key = item.slice(0, 2)
    key && (res[key] = item.slice(2))
    return res;
  }, {});
};

export class OcxExceptions extends Error {}

export const handleSyncResult = (actionName, res) => {
  console.log(`handleSyncResult: ${actionName} ${res}`)
  let resCode = -1

  if (typeof res === 'number') {
    resCode = res
  }

  if (typeof res === 'string' && res.indexOf('^') > -1) {
    res = parseAsyncResult(res)
    resCode = res.RT
  }

  if (parseInt(resCode, 10) !== 0) {
    // throw new OcxExceptions(`${actionName} failed`);
    console.error(`${actionName} failed`)
  } else {
    console.info(`${actionName} success`)
  }
};


export const checkUntilExist = (timeout, target, attribute) => {
  return new Promise(resolve => {
    let begin = Date.now()
    let interval = setInterval(() => {
      if (Date.now() - begin > timeout) {
        clearInterval(interval)
        resolve(false)
      } else if (target[attribute]) {
        clearInterval(interval)
        resolve(true)
      }
    }, 20)
  })
}