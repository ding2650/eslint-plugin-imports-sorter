const { setNodeWeight } = require('../utils/setImprtWeight')
const { isReactType } = require('../utils/isReactType')
const { itemWeightMap, ErrorCodeMap } = require('../const')

/* 当前节点和上一个节点权重比对，来判断是否引入顺序错误 */
function isImportError(currentNode, previousNode, ctx) {
    if (!previousNode) return false
    const { zIndex: itemWeight, deepth: itemDeep } = setNodeWeight(currentNode)
    const { zIndex: preWeight, deepth: preDeep } = setNodeWeight(previousNode)
    const startLine = previousNode.loc.start.line
    const endLine = currentNode.loc.end.line
    const isError = itemWeight > preWeight || (itemWeight === preWeight && itemDeep < preDeep)
    const [isCheckEmpthLine] = ctx.options
    if (!isCheckEmpthLine) {
        return {
            isError,
            message: itemWeightMap.get(itemWeight),
            errorCode: itemWeight
        }
    }
    if (isError) {
        return {
            isError: true,
            message: itemWeightMap.get(itemWeight),
            errorCode: itemWeight
        }
    }
    // /* 权重不等，校验中间是否含有换行 */
    if (itemWeight !== preWeight && startLine === endLine - 1) {
        return {
            isError: true,
            message: itemWeightMap.get(1000),
            errorCode: 1000
        }
    }
    // /* 权重相等，校验中间是否含有换行 */
    if (itemWeight === preWeight && startLine !== endLine - 1) {
        return {
            isError: true,
            message: itemWeightMap.get(1001),
            errorCode: 1001
        }
    }
    return {
        isError: false,
        message: itemWeightMap.get(itemWeight),
        errorCode: itemWeight
    }

}
/* 根据当前节点权重，已经排序的节点的权重，找到当前节点正确的位置 */
function getTargetNode(node, allNodes) {
    const { zIndex: currentWeight, deepth: currentDeep } = setNodeWeight(node)
    return allNodes.find(item => {
        const { zIndex: itemWeight, deepth: itemDeep } = setNodeWeight(item)
        return currentWeight > itemWeight || (currentWeight === itemWeight && !(currentDeep > itemDeep))
    }) || allNodes[allNodes.length - 1]
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
            {
                "type": "boolean"
            }
        ]
    },

    create: function (ctx) {
        const allImportNodes = []
        return {
            'ImportDeclaration'(node) {
                const sourceCode = ctx.getSourceCode()
                const previousNode = allImportNodes[allImportNodes.length - 1]
                const isFirst = allImportNodes.length === 0
                const isReact = isReactType(ctx.getFilename())
                const isReactOrderError = isReact && node.source.value === 'react' && !isFirst
                if (isReactOrderError) {
                    const startToken = sourceCode.getTokenBefore(node)
                    const endToken = sourceCode.getLastToken(node)
                    const range = [startToken.range[1], endToken.range[1]]
                    ctx.report({
                        node,
                        message: itemWeightMap.get(1002),
                        fix(fixer) {
                            return [
                                fixer.insertTextBefore(allImportNodes[0], sourceCode.getText(node) + '\n'),
                                fixer.replaceTextRange(range, ''),
                            ]
                        },
                    })
                    return
                }

                const { isError, message, errorCode } = isImportError(node, previousNode, ctx)
                if (isError) {
                    /* options 为自定义配置的属性数组 */
                    console.log(ctx.options)

                    const targetNode = getTargetNode(node, allImportNodes)
                    const startToken = sourceCode.getTokenBefore(node)
                    const endToken = sourceCode.getLastToken(node)
                    const range = [startToken.range[1], endToken.range[1]]
                    ctx.report({
                        node,
                        message,
                        fix(fixer) {
                            switch (errorCode) {
                                case ErrorCodeMap.AddLine:
                                    return [
                                        fixer.insertTextBefore(node, '\n'),
                                    ]
                                case ErrorCodeMap.DeleteLine:
                                    return [
                                        fixer.replaceTextRange(range, ''),
                                        fixer.insertTextAfter(node, '\n' + sourceCode.getText(node))
                                    ]
                                default:
                                    return [
                                        fixer.replaceTextRange(range, ''),
                                        fixer.insertTextBefore(targetNode, sourceCode.getText(node) + '\n'),
                                    ]
                            }

                        }
                    })
                }
                allImportNodes.push(node)
            },

        }
    }
};
