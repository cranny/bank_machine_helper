// function readLogicNamesForAllDevices() {
//   var wsh = new window.ActiveXObject('WScript.shell');
//   var idc = wsh.RegRead('HKEY_USERS\\.DEFAULT\\XFS\\LOGICAL_SERVICES\\IDC\\Provider');
//   var pin = wsh.RegRead('HKEY_USERS\\.DEFAULT\\XFS\\LOGICAL_SERVICES\\PIN30\\Provider');
//   var prp = wsh.RegRead('HKEY_USERS\\.DEFAULT\\XFS\\LOGICAL_SERVICES\\PRP30\\Provider');

//   return {
//     idc,
//     pin,
//     prp
//   }
// }

// function readVersionInfo() {
// 	var wsh = new window.ActiveXObject("WScript.shell");
// 	var version_sp5  = wsh.RegRead("HKLM\\SOFTWARE\\GrgBanking\\GrgXFSSP\\MibVersion");
// 	var version_sp6  = wsh.RegRead("HKLM\\SOFTWARE\\GrgBanking\\GrgXFSSP\\SPVersion");
// 	var version_sp2  = wsh.RegRead("HKLM\\SOFTWARE\\GrgBanking\\GrgXFSSP\\ReleaseDate");
// 	var device_sp  = wsh.RegRead("HKLM\\SOFTWARE\\GrgBanking\\GrgSpSetting\\ATMMachine\\MachineType");
// 	var version_ocx = wsh.RegRead("HKLM\\SOFTWARE\\BocomItm\\Version");
// 	var device_ocx = wsh.RegRead("HKLM\\SOFTWARE\\BocomItm\\ItmModel");
// 	var version_app = wsh.RegRead("HKLM\\SOFTWARE\\HISUN\\ITMC\\ITMVersion");

// 	return {
//     // SP版本信息(MibVersion)
//     version_sp5,
//     // SP版本信息(SPVersion
//     version_sp6,
//     // SP版本发布日期
//     version_sp2,
//     // SP设备型号
//     device_sp,
//     // OCX版本信息
//     version_ocx,
//     // OCX设备型号
//     device_ocx,
//     // 应用版本信息
//     version_app,
//   }

// }
import EventEmitter from 'eventemitter3'
import {parseAsyncResult, OcxExceptions, handleSyncResult, checkUntilExist} from './utils'
import { mockOcxEnv } from './mock'

const debug = require('debug')('wb:lib:bankApi')

export class Ids extends EventEmitter {
  constructor(ctx) {
    super()
    this.ctx = ctx
    return this
  }

  static EVENTS = {
    // onOpen: {
    //   command: 'idsOpenAsyn',
    //   name: 'OnIdsOpened'
    // },

    // onClose: {
    //   command: 'idsCloseAsyn',
    //   name: 'OnIdsClosed'
    // },

    onInserted: {
      command: 'idsInsertAsyn',
      name: 'OnIdsInserted',
      desc: 'event: 二代证已放入'
    },

    onRead: {
      command: 'idsReadAsyn',
      name: 'OnIdsRead',
      desc: 'event: 二代证已读取'
    },

    onScan: {
      command: 'idsReadAsyn',
      name: 'OnIdsRead',
      desc: 'event: 二代证已扫描'
    }
  }

  isActive() {
    return this.ctx.IdsActive
  }

  open() {
    const actionName = '打开二代读卡器'
    debug(actionName)
    const resCode = this.ctx.idsOpen(0)
    handleSyncResult(actionName, resCode)

    // 查看设备状态
    this.getInfo()
  }

  getInfo(type = 11) {
    const actionName = '获取设备状态'
    debug(actionName)
    const resCode = this.ctx.idsGetInfo(type)
    handleSyncResult(actionName, resCode)
    // 设备未准备好便复位
    if (resCode === 3) {
      this.reset()
    }
  }

  reset() {
    const actionName = '复位二代读卡器'
    debug(actionName)
    const resCode = this.ctx.idsReset()
    handleSyncResult(actionName, resCode)
  }

  close() {
    debug('关闭二代读卡器')
    this.ctx.idsClose()
  }

  async insert(timeout = 30 * 1000) {
    debug('二代读卡器等待放入')
    this.ctx.idsInsertAsyn(timeout)
  }

  cancelInsert() {
    debug('二代读卡器取消等待放入')
    this.ctx.idsCancel()
  }

  async read() {
    debug('二代读卡器开始读取')
    this.ctx.idsReadAsyn(1, 0)
  }

  async scan() {
    debug('二代读卡器开始扫描')
    this.ctx.idsReadAsyn(2, 0)
  }

  static getReadResult(eventResult) {
    if (!eventResult) {
      throw new Error('eventResult should not be empty')
    }

    return {
      province: eventResult.SF,
      name: eventResult.NM,
      sex: eventResult.SX,
      nation: eventResult.MZ,
      birthday: eventResult.BD,
      address: eventResult.AD,
      issueAgency: eventResult.QF,
      issueDate: eventResult.SD,
      expiredDate: eventResult.ED,
      avatar: this.ctx.IdsPhoto
    }
  }

  static isReadResult(eventResult) {
    return eventResult && eventResult.QF
  }

  static getScanResult(eventResult) {
    if (!eventResult) {
      throw new Error('getScanResult: eventResult should not be empty')
    }

    const rsCode = parseInt(eventResult.RT, 10)

    if (rsCode === 9) {
      throw new Error('getScanResult: not supported')
    }

    if (rsCode === 1) {
      throw new Error('getScanResult: failed')
    }

    if (rsCode !== 0) {
      throw new Error('getScanResult: unknown error')
    }

    if (!(this.ctx.IdsImage1 && this.ctx.IdsImage2)) {
      throw new Error('getScanResult: no data found')
    }

    return {
      IdsImage1: this.ctx.IdsImage1,
      IdsImage2: this.ctx.IdsImage2
    }
  }
}

export class Pinpad extends EventEmitter {
  constructor(ctx) {
    super()
    this.ctx = ctx
    return this
  }

  static EVENTS = {
    OnInput: {
      name: 'OnPinPadKeyPressed',
      desc: 'event: 密码键已按下'
    }
  }

  isActive() {
    return this.ctx.PinPadActive
  }

  open() {
    debug('打开密码盘')
    this.ctx.pinpadOpen(0)
  }

  close() {
    debug('关闭密码盘')
    this.ctx.pinpadClose()
  }

  getData(cardNum) {
    debug('密码盘获取输入', cardNum)
    return this.ctx.pinpadGetData(cardNum)
  }

  pinpadMainKey(key) {
    debug('密码盘加载主密钥', key)
    return this.ctx.pinpadMainKey(key)
  }

  pinpadWorkKey(key) {
    debug('密码盘加载工作密钥', key)
    return this.ctx.pinpadWorkKey(key)
  }

  pinpadBeginRead(timeout, mode, maxLength = 6) {
    debug('密码盘等待输入')
    this.ctx.pinpadBeginRead(timeout, mode, maxLength)
  }

  pinpadEndRead() {
    debug('密码盘结束等待输入')
    this.ctx.pinpadEndRead()
  }
}

export class BankCard extends EventEmitter {
  constructor(ctx) {
    super()
    this.ctx = ctx
    return this
  }

  static EVENTS = {
    // onOpen: {
    //   command: 'cardissuerOpenAsyn',
    //   name: 'OnCardissuerOpened'
    // },

    // onClose: {
    //   command: 'cardissuerCloseAsyn',
    //   name: 'OnCardissuerClosed'
    // },

    onSwallow: {
      command: 'cardissuerRetainAsyn',
      name: 'OnCardissuerRetained',
      desc: 'event: 发卡器已吞卡'
    },

    onIssue: {
      command: 'cardissuerInsertEx',
      name: 'OnCardissuerInserted',
      desc: 'event: 发卡器已发卡'
    },

    onSplit: {
      command: 'cardissuerEjectAsyn',
      name: 'OnCardissuerCardTaken',
      desc: 'event: 发卡器已吐卡'
    }
  }

  // 最近一次用户插入的卡号
  get lastCardNum() {
    return this.ctx.CardissuerCardNumber
  }

  // 是否安装了发卡器
  get isActive() {
    return this.ctx.CardissuerActive
  }

  // 	0=成功，-2=设备硬件故障，-6=操作超时。
  open() {
    debug('打开发卡器')
    return this.ctx.cardissuerOpen(1, 1)
  }

  close() {
    debug('关闭发卡器')
    this.ctx.cardissuerClose()
  }

  toReadMode() {
    this.ctx.SetWorkMode(0)
  }

  // type 1 是否允许插卡,  0 不允许 1 允许
  // type 2 初始化时对卡的处理 0 吞卡 1 退卡 2 无动作
  setParam(type, param1) {
    debug('发卡器设置参数')
    this.ctx.cardissuerSetParam(type, param1)
  }

  // 0=成功，-1=设备没有打开，-2=硬件故障，-6=操作超时
  forceInit() {
    debug('发卡器强制初始化')
    return this.ctx.cardissuerInit()
  }

  // RT 0=成功，-1=设备没有打开，-2=硬件故障，-6=操作超时
  getInfo(type) {
    const result = this.ctx.cardissuerGetInfo(type)
    return {

    }
  }

  getBoxCount() {
    debug('获取发卡器卡箱数量')
    return this.ctx.cardissuerGetCUCount()
  }

  async issue(boxId) {
    debug('发卡器发卡')
    this.ctx.cardissuerInsertEx(0, boxId)
  }

  cancelIssue() {
    debug('发卡器取消发卡')
    this.ctx.cardissuerCancel()
  }

  async read() {
    debug('发卡器读卡')
    this.ctx.cardissuerReadAsyn(7)
  }

  async swallow() {
    debug('发卡器吞卡')
    this.ctx.cardissuerRetainAsyn('6222688888888888888888')
  }

  async split() {
    debug('发卡器吐卡')
    this.ctx.cardissuerEjectAsyn(0, '')
  }

  // 1 无动作 2 退出卡片 3 回收卡片
  async reset(actionKey, timeout) {
    debug('发卡器复位', actionKey)
    this.ctx.cardissuerResetAsyn(actionKey, timeout)
  }

  async powerOn() {
    debug('发卡器上电')
    this.ctx.cardissuerICPowerOnAsyn()
  }

  async powerOff() {
    debug('发卡器下电')
    this.ctx.cardissuerICPowerOffAsyn()
  }
}

// class BankAPI {
//   constructor() {}

//   static wrap(ocxNode) {
//     for (key in ocxNode) {
//       if (ocxNode.hasOwnProperty(key) && typeof ocxNode[key] === 'function') {
//         ocxNode[key] = function (...args) {
//           debug(`call ${key}: begin`)
//           ocxNode[key](...args)
//           debug(`call ${key}: end`)
//         }.bind(ocxNode)
//       }
//     }
//   }
// }

export const BankFactory = {
  async getOcx() {
    let $ocx = window.BOCOMDevControl || document.getElementById('BOCOMDevControl')

    if (!$ocx) {
      let $div = document.createElement('div')
      $div.innerHTML = `<object style="display:none" title="devControl"
      classid="clsid:487B21FA-0862-4544-A20C-E927C8F99DA9"
      hspace="0" vspace="0" id="BOCOMDevControl"></object>`

      document.body.appendChild($div.firstChild)
      $div = null
      $ocx = document.getElementById('BOCOMDevControl')
    }

    // const isHasAPI = await checkUntilExist(3000, $ocx, 'getVersion')

    // if (!isHasAPI) {
    //   mockOcxEnv($ocx)
    // }

    window.BOCOMDevControl = $ocx

    return $ocx
  },

  create(ctx) {
    // if (!(ctx && ctx.getVersion)) {
    //   throw new OcxExceptions('BOCOMDevControl API not exists!')
    // }

    const apis = {
      Ids: new Ids(ctx),
      BankCard: new BankCard(ctx),
      Pinpad: new Pinpad(ctx)
    }

    const OnAsynExecuted = (szCmdName, szEventName, execCode, _execValue) => {
      debug('OnAsynExecuted fired begin:', szCmdName, szEventName, execCode, _execValue)
      _execValue = parseAsyncResult(_execValue)
      debug('OnAsynExecuted fired:', szCmdName, szEventName, execCode, _execValue)
      Object.values(apis).map(api => {
        const eventsMap = api.constructor.EVENTS
        Object.keys(eventsMap).map(_eventKey => {
          let eventKey = _eventKey
          let eventMap = eventsMap[_eventKey]
          let execValue = _execValue
          const matched = szCmdName === eventMap.command && szEventName === eventMap.name

          // 二代证已读取
          const isIdsRead = matched && szCmdName === Ids.EVENTS.onRead.command && szEventName === Ids.EVENTS.onRead.name && Ids.isReadResult(execValue)
          // 二代证已扫描
          const isIdsScan = matched && szCmdName === Ids.EVENTS.onScan.command && szEventName === Ids.EVENTS.onScan.name && !Ids.isReadResult(execValue)

          if (isIdsRead) {
            eventKey = 'onRead'
            eventMap = Ids.EVENTS.onRead
            execValue = Ids.getReadResult(execValue)
          } else if (isIdsScan) {
            eventKey = 'onScan'
            eventMap = Ids.EVENTS.onScan
            execValue = Ids.getScanResult(execValue)
          }

          if (matched) {
            eventMap.desc && debug(eventMap.desc)
            api.emit(eventKey, {
              code: execCode,
              value: execValue
            })
          }
        })
      })
    }

    window.OnAsynExecuted = OnAsynExecuted

    // ctx.addEventListener('OnAsynExecuted', () => {

    // })

    // 兼容其它全局事件
    ctx.addEventListener('OnPinPadKeyPressed', key => {
      debug('OnPinPadKeyPressed fired:', key)
      ctx.Pinpad.emit('OnInput', {
        code: 0,
        value: key
      })
    })

    return apis
  }
}

export function getBankAPI() {
  return window._bankApi
}
