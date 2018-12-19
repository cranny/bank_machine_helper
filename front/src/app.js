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

export async function render(oldRender) {
  debug.enable('wb:*')
  window._bankApi = BankFactory.create(await BankFactory.getOcx())
  oldRender();
}
