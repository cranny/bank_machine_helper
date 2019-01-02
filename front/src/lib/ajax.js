import axios from 'axios'

const BASE_POST_PATH = 'http://172.16.5.154:8080/'

const POST_URL_MAP = {
  SET_FILED_62: '/balanceQuery/setFiled62AndMac',
  QUERY_BALANCE: '/balanceQuery/query'
}

async function baseFetch(url, data, method = 'post') {
  try {
    console.log(data)
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
  async queryBalance(password) {
    const params = {
      bankcardType: '', //卡类型:磁条卡 IC卡 NFC卡
      serial: '', //卡片序列号
      cardNo: '', //卡号
      expiryDate: '', //卡有效期
      track2: '', //2磁道数据
      originalTrack2: '', //二磁道原始数据
      track3: '', //3磁道数据
      iccData: '',//IccData 55域
      password, //个人标识码  密码
      amount: '',//金额
        field62:'',//62域
        field64:''//64域
    }

    return baseFetch(POST_URL_MAP.QUERY_BALANCE, params)
  }
}
