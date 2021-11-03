
function isOfficial(path, alias) {
  return !path.includes('./') && !isAbsoluterPath(path, alias)
}

function isRelativePath(path) {
  return path.startsWith('./') || path.startsWith('../')
}
/* 约定：绝对路径以@或者src开头 */
function isAbsoluterPath(path, alias) {
  return alias.some(item => {
    return path.startsWith(item + '/')
  })
}

function setDeepath(path) {
  const isCurrent = path.startsWith('./')
  return path.split('/').length + (isCurrent ? 0 : 1)
}
function setNodeWeight(node, alias) {
  const path = node.source.value
  const deepth = setDeepath(path)
  if (isRelativePath(path)) {
    /* 绝对路径排序 */
    return {
      zIndex: 1,
      deepth,
    }
  }
  if (isAbsoluterPath(path, alias)) {
    /* 相对路径层级排序 */
    return {
      zIndex: 10,
      deepth,
    }
  }

  if (isOfficial(path, alias)) {
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