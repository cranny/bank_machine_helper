import { parseAsyncResult } from '../utils'
import { Ids } from './ids'
import { Pinpad } from './pinpad'
import { CardIssuer } from './cardIssuer'
import { ContactlessCard } from './contactlessCard'

import { mockOcxEnv } from '../mock'

const debug = require('debug')('wb:lib:hardware:index')

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

    // @todo 调试用
    if (navigator.userAgent.indexOf('Chrome') > -1) {
      mockOcxEnv($ocx)
    }

    window.BOCOMDevControl = $ocx

    return $ocx
  },

  create(ctx) {
    // if (!(ctx && ctx.getVersion)) {
    //   throw new OcxExceptions('BOCOMDevControl API not exists!')
    // }

    const apis = {
      Ids: new Ids(ctx),
      CardIssuer: new CardIssuer(ctx),
      Pinpad: new Pinpad(ctx),
      ContactlessCard: new ContactlessCard(ctx)
    }

    window.OnAsynExecuted = (szCmdName, szEventName, execCode, _execValue) => {
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
          // 非接读卡器 建立应用列表
          const isBuildApply = matched && szCmdName === ContactlessCard.EVENTS.onBuildApply.command && szEventName === ContactlessCard.EVENTS.onBuildApply.name && !ContactlessCard.isBuildApplyResult(execValue)

          if (isIdsRead) {
            eventKey = 'onRead'
            eventMap = Ids.EVENTS.onRead
            execValue = Ids.getReadResult(execValue)
          } else if (isIdsScan) {
            eventKey = 'onScan'
            eventMap = Ids.EVENTS.onScan
            execValue = Ids.getScanResult(execValue)
          } else if (isBuildApply) {
            eventKey = 'onBuildApply'
            eventMap = ContactlessCard.EVENTS.onBuildApply
            execValue = ContactlessCard.isBuildApplyResult(execValue)
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

    window.OnContactlessCardIn = (...args) => {
      apis.ContactlessCard.emit('onIn', {
        code: 0,
        value: args
      })
    }

    window.OnContactlessCardTaken = (...args) => {
      apis.ContactlessCard.emit('onOut', {
        code: 0,
        value: args
      })
    }

    window.OnPinPadKeyPressed = (...args) => {
      apis.Pinpad.emit('OnInput', {
        code: 0,
        value: args
      })
    }

    return apis
  }
}

export function getBankAPI() {
  return window._bankApi
}
