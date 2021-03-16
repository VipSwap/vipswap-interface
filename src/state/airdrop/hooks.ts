import axios from 'axios'

//获取用户的空投数据
export function getAirdropUserInfoByPost(url: string, params = {}) {
  return axios
    .post(url, params)
    .then(response => {
      // 返回后端返回数据
      // console.log(response)
      return response.data
    })
    .catch(error => {
      // 异常处理
      console.log(error)
      console.debug(error)
    })
}

//获取用户的空投数据
export function getAirdropRewardByPost(url: string, params = {}) {
  return axios
    .post(url, params)
    .then(response => {
      // 返回后端返回数据
      // console.log(response)
      return response.data
    })
    .catch(error => {
      // 异常处理
      console.log(error)
      console.debug(error)
    })
}
//获取用户的空投数据
export function getAirdropRewardByGet(url: string, params = {}) {
  return axios
    .get(url, params)
    .then(response => {
      // 返回后端返回数据
      // console.log(response)
      return response.data
    })
    .catch(error => {
      // 异常处理
      console.log(error)
      console.debug(error)
    })
}
