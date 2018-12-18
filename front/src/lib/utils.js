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
