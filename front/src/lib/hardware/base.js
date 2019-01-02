import EventEmitter from 'eventemitter3'
import pEvent from 'p-event'

export class BaseAPI extends EventEmitter {
  constructor(ctx) {
    super()
    this.ctx = ctx
  }

  EVENT_TIMEOUT = 5000

  async waitEvent(eventName) {
    const { value } = await pEvent(this, eventName, {
      timeout: this.constructor.EVENT_TIMEOUT
    })

    return value
  }
}
