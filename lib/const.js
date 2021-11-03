const itemWeightMap = new Map()

const ErrorCode = {
  '1': '相对路径资源引入顺序错误',
  '10': '绝对路径资源引入顺序错误',
  '100': '第三方库引入顺序错误',
  '1000': '不同引入方式间请添加换行',
  '1001': '相同引入方式间请删除换行',
  '1002': 'React文件中，React的引入应置于首行'
}

const ErrorCodeMap = {
  AddLine: 1000,
  DeleteLine: 1001,
  ReactFirst: 1002
}

Object.keys(ErrorCode).forEach(key => {
  itemWeightMap.set(Number(key), ErrorCode[key])
})
const DefaultAlias = ['@','src']
module.exports = {
  itemWeightMap,
  ErrorCodeMap,
  DefaultAlias
}

