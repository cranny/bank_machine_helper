export const parseAsyncResult = str => {
  const arrStr = str.split('^');
  return arrStr.reduce((res, item) => {
    res[item.slice(0, 2)] = item.slice(2);
    return res;
  }, {});
};

export class OcxExceptions extends Error {}

export const handleSyncResult = (actionName, resCode) => {
  if (!resCode) {
    // throw new OcxExceptions(`${actionName} failed`);
    console.error(`${actionName} failed`)
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