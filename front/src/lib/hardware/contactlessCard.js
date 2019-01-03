import { BaseAPI } from './base'
import { Log, LogAsync } from '../decorators'
// import {parseAsyncResult, OcxExceptions, handleSyncResult, parseSpecialFormat} from '../utils'

const debug = require('debug')('wb:lib:hardware:contactlessCard')

export class ContactlessCard extends BaseAPI {
  debug = debug

  static DEVICE_NAME = '非接读卡器'

  static EVENTS = {
    onIn: {
      name: 'OnContactlessCardIn',
      desc: 'event: 银行卡已放置'
    },

    onOut: {
      name: 'OnContactlessCardTaken',
      desc: 'event: 银行卡已取走'
    },

    onPowerOn: {
      command: 'contactlessCardPowerOnAsyn',
      name: 'OnContactlessCardPowerOn',
      desc: 'event: 已上电'
    },

    onBuildApply: {
      command: 'contactlessCardGetPSEAIDAsyn',
      name: 'OnContactlessCardGetPSEAID',
      desc: 'event: 应用列表已建立'
    },

    onChoiceApply: {
      command: 'contactlessCardSelectADFAsyn',
      name: 'OnContactlessCardSelectADF',
      desc: 'event: 已选择应用'
    },

    onReadCardValidity: {
      command: 'contactlessCardCardDateInfoAsyn',
      name: 'OnContactlessCardCardDateInfo',
      desc: 'event: 已读有效日期'
    },

    onReadTrack2: {
      command: 'contactlessCardPBOCGetTrack2DataAsyn',
      name: 'OnContactlessCardPBOCGetTrack2Data',
      desc: 'event: 已读二磁道数据'
    },

    onInitializeCircle: {
      command: 'contactlessCardInitForLoadAsyn',
      name: 'OnContactlessCardInitForLoad',
      desc: 'event: 已读初始化圈存,圈提'
    },

    onReadField55: {
      command: 'contactlessCardReadIcTLVAsyn',
      name: 'OnContactlessCardReadIcTLV',
      desc: 'event: 已读初始化圈存,圈提'
    }
  }

  // 最近一次用户插入的卡号
  get lastCardNum() {
    return this.ctx.ContactlessCardNumber
  }

  // 是否安装了发卡器
  get isActive() {
    return this.ctx.ContactlessCardActive
  }

  // 	0=成功，-2=设备硬件故障，-6=操作超时。
  @Log('打开')
  open() {
    return this.ctx.contactlessCardOpen(0)
  }

  @Log('关闭')
  close() {
    return this.ctx.contactlessCardClose()
  }

  // 0=成功，-1=设备没有打开，-2=硬件故障，-6=操作超时
  @Log('初始化')
  forceInit() {
    return this.ctx.contactlessCardInit()
  }

  // ^RTxx^WPxx^LPxx
  // 0=正常，1=故障
  @Log('设备状态')
  getInfo() {
    return this.ctx.contactlessCardGetInfo(11)
  }

  @Log('等待放置')
  insert(timeout = 60) {
    return this.ctx.contactlessCardInsert(timeout)
  }

  @Log('取消等待放置')
  cancelInsert() {
    return this.ctx.contactlessCardCancel()
  }

  @LogAsync('复位')
  reset(timeout = 6000) {
    return this.ctx.contactlessCardReset(timeout)
  }

  @LogAsync('退卡')
  taken(timeout = 30) {
    return this.ctx.contactlessCardEjectAsyn(timeout)
  }

  start(timeout) {
    this.forceInit()
    this.open()
    const infoData = this.getInfo()
    if (!infoData.isOK) {
      this.reset()
    }
    this.insert(timeout)
  }

  async afterIn() {
    // this.forceInit()
    // this.open()

    // this.powerOn()
    // await this.waitEvent('onPowerOn')

    this.buildApply()
    const buildApplyResult = await this.waitEvent('onBuildApply')

    this.choiceApply(buildApplyResult.AD.split('|')[0])
    const choiceApplyResult = await this.waitEvent('onChoiceApply')

    this.readCardValidity()
    const validityResult = await this.waitEvent('onReadCardValidity')

    this.readTrack2()
    const track2Result = await this.waitEvent('onReadTrack2')

    this.initializeCircle()
    const circleResult = await this.waitEvent('onInitializeCircle')

    const aPAan = circleResult.PA
    const aInAD = circleResult.AD
    const aInAR = circleResult.AR
    console.log("aPAan:" + aPAan + "   aInAD:" + aInAD + "    aInAR:" + aInAR)
    this.readField55(aPAan, aInAD, aInAR)
    const field55Result = await this.waitEvent('onReadField55')
    const read5F34Result = this.read5F34()
    const cardNum = track2Result.CN.split('D')[0]

    return {
      cardNum,
      buildApplyResult,
      choiceApplyResult,
      validityResult,
      track2Result,
      circleResult,
      field55Result,
      read5F34Result
    }
  }

  async afterOut() {
    this.powerOff()
    await this.waitEvent('onPowerOff')
  }

  @LogAsync('上电')
  powerOn() {
    return this.ctx.contactlessCardPowerOnAsyn()
  }

  @LogAsync('下电')
  powerOff() {
    return this.ctx.contactlessCardPowerOffAsyn()
  }

  @LogAsync('建立应用列表')
  buildApply() {
    return this.ctx.contactlessCardGetPSEAIDAsyn('')
  }

  @LogAsync('应用选择')
  choiceApply(aIn = 'A000000333010101') {
    return this.ctx.contactlessCardSelectADFAsyn(aIn)
  }

  /*@Log('应用初始化')
  initializeApply() {
    return this.ctx.contactlessCardGetProOptionAsyn(0,30)
  }

  @Log('读应用数据')
  readApplyData(aAFL) {
    return this.ctx.contactlessCardReadAppDataAsyn(aAFL)
  }*/

  @LogAsync('读有效日期')
  readCardValidity() {
    return this.ctx.contactlessCardCardDateInfoAsyn()
  }

  @LogAsync('读二磁道')
  readTrack2() {
    return this.ctx.contactlessCardPBOCGetTrack2DataAsyn()
  }

  @LogAsync('圈存,圈提初始化')
  initializeCircle() {
    return this.ctx.contactlessCardInitForLoadAsyn()
  }

  @LogAsync('读55域数据')
  readField55(aPAan, aInAD, aInAR) {
    return this.ctx.contactlessCardReadIcTLVAsyn(aPAan, aInAD, aInAR)
  }

  @Log('读卡序列号')
  read5F34(aTag = '5F34') {
    return this.ctx.contactlessCardGetTag(aTag)
  }

  static isBuildApplyResult(eventResult) {
    if (!eventResult) {
      throw new Error('eventResult should not be empty')
    }

    return {
      aIn: eventResult.AD.split('|')[0]
    }
  }
}
