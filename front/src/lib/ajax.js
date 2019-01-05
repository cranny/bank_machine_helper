import axios from 'axios'

const BASE_POST_PATH = 'http://172.16.5.154:8080/'

const POST_URL_MAP = {
  SET_FILED_62: '/balanceQuery/setFiled62AndMac',
  QUERY_BALANCE: '/balanceQuery/query'
}

async function baseFetch(url, data, method = 'post') {
  try {
    console.log("data:" + data)
    return await axios({
      method,
      url,
      baseURL: BASE_POST_PATH,
      data,
      // withCredentials: true
    })
  } catch(e) {
    console.error(e)
  }
}

export const postman = {
  async queryBalance(password, card, field62, field64) {
    const params = {
      "bankcardType":1, //卡类型:磁条卡 IC卡 NFC卡
      "serial":card.read5F34Result.DT, //卡片序列号
      "cardNo":card.cardNum, //卡号
      "expiryDate":card.validityResult.ED, //卡有效期
      "track2":card.track2Result.CN, //2磁道数据
      "originalTrack2":card.track2Result.CN, //二磁道原始数据
      "track3":card.track2Result.CN, //3磁道数据
      "iccData":card.field55Result.DT,//IccData 55域
      "password":password, //个人标识码  密码
      "amount":"",//金额
      "field62":field62,//62域
      "field64":field64//64域
    }

    return baseFetch(POST_URL_MAP.QUERY_BALANCE, params)
  },

  async setFiled62AndMac(password, card) {
    const params = {
      "bankcardType":1, //卡类型:磁条卡 IC卡 NFC卡
      "serial":card.read5F34Result.DT, //卡片序列号
      "cardNo":card.cardNum, //卡号
      "expiryDate":card.validityResult.ED, //卡有效期
      "track2":card.track2Result.CN, //2磁道数据
      "originalTrack2":card.track2Result.CN, //二磁道原始数据
      "track3":card.track2Result.CN, //3磁道数据
      "iccData":card.field55Result.DT,//IccData 55域
      "password":password, //个人标识码  密码
      "amount":""//金额
    }

    return baseFetch(POST_URL_MAP.SET_FILED_62, params)
  }
}
