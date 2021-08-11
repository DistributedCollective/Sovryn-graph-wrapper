import moment from 'moment'

const getTimestamp = () => {
  const currentTime = moment().toISOString()
  return currentTime
}

export default getTimestamp
