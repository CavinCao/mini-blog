const formatTime = time => {
  var date = new Date(time);
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const getYear = time => {
  var date = new Date(time);
  var year = date.getFullYear()
  return year
}

const getMonth = time => {
  var date = new Date(time);
  var month = date.getMonth() + 1
  return month
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


module.exports = {
  formatTime: formatTime,
  getYear: getYear,
  getMonth: getMonth
}

