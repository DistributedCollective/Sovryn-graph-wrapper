import getTimestamp from '../utils/getTimeStamp'

export const helloSovrynHandler = async (req: object) => {
  const response = {
    reqStatus: 'SUCCESS',
    data: {
      message: 'Hello Sovryn!',
      timestamp: getTimestamp(),
      req
    }
  }
  return response
}
