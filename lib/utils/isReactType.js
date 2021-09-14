function getSuffix(fileName) {
  const arr = fileName.split('.')
  return arr[arr.length - 1]
}

function isReactType(fileName) {
  const typeArr = ['js', 'ts', 'jsx', 'tsx']
  return typeArr.includes(getSuffix(fileName))
}

module.exports = {
  isReactType
}