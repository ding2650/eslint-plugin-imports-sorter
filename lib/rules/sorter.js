const { setNodeWeight } = require('../utils/setImprtWeight')

const { itemWeightMap } = require('../utils/const')

/* 当前节点和上一个节点权重比对，来判断是否引入顺序错误 */
function isImportError(currentNode, previousNode) {
    if (!previousNode) return false
    const itemWeight = setNodeWeight(currentNode)
    const preWeight = setNodeWeight(previousNode)
    return {
        isError: itemWeight > preWeight,
        msg: itemWeightMap.get(itemWeight)
    }
}
/* 根据当前节点权重，已经排序的节点的权重，找到当前节点正确的位置 */
function getTargetNode(node, allNodes) {
    const currentWeight = setNodeWeight(node)
    return allNodes.find(item => {
        const itemWeight = setNodeWeight(item)
        return itemWeight < currentWeight  || itemWeight === currentWeight
    }) || allNodes[0]
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
                const sourceCode = ctx.getSourceCode()
                const previousNode = allImportNodes[allImportNodes.length - 1]
                const { isError, msg } = isImportError(node, previousNode)
                if (isError) {
                    const targetNode = getTargetNode(node, allImportNodes)
                    const startToken = sourceCode.getTokenBefore(node)
                    const endToken = sourceCode.getLastToken(node)
                    const range = [startToken.range[1], endToken.range[1]]
                    ctx.report({
                        node,
                        message: `「${msg}」引入顺序不规范-${targetNode.source.value}`,
                        fix(fixer) {
                            return [
                                fixer.replaceTextRange(range,''),
                                fixer.insertTextBefore(targetNode, sourceCode.getText(node) + '\n'),
                            ]
                        }
                    })
                }
                allImportNodes.push(node)

            },

        }
    }
};
