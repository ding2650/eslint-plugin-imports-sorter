
function isOfficial(path) {
  return !path.includes('./') && !isAbsoluterPath(path)
}

function isRelativePath(path) {
  return path.startsWith('./') || path.startsWith('../')
}
/* 约定：绝对路径以@或者src开头 */
function isAbsoluterPath(path) {
  return path.startsWith('@/') || path.startsWith('src/')
}

function setNodeWeight (node){
  const path = node.source.value
  if(isRelativePath(path)){
    /* 绝对路径排序 */
    return  1
  }
  if(isAbsoluterPath(path)){
    /* 相对路径层级排序 */
    return 10
  }

  if(isOfficial(path)){
    /* 第三方库 */
    return 100
  }
}

module.exports = {
  setNodeWeight
}