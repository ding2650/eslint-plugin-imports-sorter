
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

function setWeight (path){
  if(isRelativePath(path)){
    /* 绝对路径排序 */
    return  
  }
  if(isAbsoluterPath(path)){
    /* 相对路径层级排序 */
    return
  }

  if(isOfficial(path)){
    /* 第三方库 */
    return
  }
}

module.exports = {
  sortByImportPath: (arr) => {
    const result = [...arr]
    result.sort((a, b) => {
      const itemVal = a.source.value
      const nextVal = b.source.value
      const itemWeight = isOfficial(itemVal) ? 100 : isAbsoluterPath(itemVal) ? 10 : 1
      const nextWeight = isOfficial(nextVal) ? 100 : isAbsoluterPath(nextVal) ? 10 : 1
      return nextWeight - itemWeight
    })
    return result
  },
  isOfficial,
  isRelativePath,
  isAbsoluterPath
}