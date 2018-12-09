import { mockOcxEnv } from './lib/mock'
import { BankFactory } from './lib/bankApi'
import debug from 'debug'

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};

export function render(oldRender) {
  debug.enable('wb:*')
  mockOcxEnv(BankFactory.getOcx())
  window._bankApi = BankFactory.create()
  oldRender();
}
