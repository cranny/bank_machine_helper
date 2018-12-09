export function mockOcxEnv(ctx) {
  // 测试代码
  const functions = [
    'idsOpen',
    'idsClose',
    'idsInsertAsyn',
    'idsCancel',
    'idsReadAsyn',
    'idsReadAsyn',
    'pinpadOpen',
    'pinpadClose',
    'pinpadGetDatav',
    'pinpadMainKey',
    'pinpadWorkKey',
    'pinpadBeginRead',
    'pinpadEndRead',
    'cardissuerOpen',
    'cardissuerClose',
    'SetWorkMode',
    'cardissuerGetCUCount',
    'cardissuerInsertEx',
    'cardissuerCancel',
    'cardissuerReadAsyn',
    'cardissuerRetainAsyn',
    'cardissuerEjectAsyn',
    'cardissuerResetAsyn',
    'cardissuerICPowerOnAsyn',
    'cardissuerICPowerOffAsyn'
  ]

  const attrributes = [
    'getVersion'
  ]

  attrributes.map(key => {
    ctx[key] = true
  })

  functions.map(name => {
    ctx[name] = () => {}
  })
}
