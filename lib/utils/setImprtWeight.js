
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

function setDeepath (path){
  return path.split('/').length
}
function setNodeWeight(node) {
  const path = node.source.value
  const deepth = setDeepath(path)
  if (isRelativePath(path)) {
    /* 绝对路径排序 */
    return {
      zIndex: 1,
      deepth,
    }
  }
  if (isAbsoluterPath(path)) {
    /* 相对路径层级排序 */
    return {
      zIndex: 10,
      deepth,
    }
  }

  if (isOfficial(path)) {
    /* 第三方库 */
    return {
      zIndex: 100,
      deepth,
    }
  }
}

module.exports = {
  setNodeWeight
}