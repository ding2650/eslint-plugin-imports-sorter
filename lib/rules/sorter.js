
/**
 * @fileoverview 校验并修复引入顺序的ESlint插件
 * @author D
 */
const itemWeightMap = new Map()
itemWeightMap.set(1, '相对路径文件')
itemWeightMap.set(10, '绝对路径文件')
itemWeightMap.set(100, '第三方库')


const { isOfficial, isAbsoluterPath, isRelativePath, sortByImportPath } = require('../utils/setImprtWeight')
function isImportError(currentNode, previousNode) {
    if (!previousNode) return false
    const preVal = previousNode.source.value
    const itemVal = currentNode.source.value
    const itemWeight = isOfficial(itemVal) ? 100 : isRelativePath(itemVal) ? 1 : 10
    const preWeight = isOfficial(preVal) ? 100 : isRelativePath(preVal) ? 1 : 10
    return {
        isError: itemWeight > preWeight,
        msg: itemWeightMap.get(itemWeight)
    }
}
function getTargetNode(node, allNodes) {

}
module.exports = {
    meta: {
        docs: {
            description: "规范引入顺序",
            category: "Fill me in",
            recommended: false
        },
        fixable: 'code',
        schema: [
            // fill in your schema
        ]
    },

    create: function (ctx) {

        const allImportNodes = []
        return {
            'ImportDeclaration'(node) {
                const previousNode = allImportNodes[allImportNodes.length - 1]
                const { isError, msg } = isImportError(node, previousNode)
                if (isError) {
                    /* 根据当前的权重，找到已经遍历过的节点，在节点后插入当前节点的值 */
                    // const targetNode = getTargetNode(node, allImportNodes)
                    const targetNode = allImportNodes[0]
                    ctx.report({
                        node,
                        message: `「${msg}」引入顺序不规范`,
                        fix(fixer) {
                            return [
                                fixer.remove(node),
                                fixer.insertTextAfter(targetNode, '\n' + ctx.getSourceCode().getText(node))
                            ]
                        }
                    })
                }
                allImportNodes.push(node)

            },

        }
    }
};
