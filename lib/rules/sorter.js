const { setNodeWeight } = require('../utils/setImprtWeight')
const { isReactType } = require('../utils/isReactType')
const { itemWeightMap, ErrorCodeMap, DefaultAlias } = require('../const')

/* 当前节点和上一个节点权重比对，来判断是否引入顺序错误 */
function isImportError(currentNode, previousNode, ctx) {
    const { isCheckEmptyLine, isCheckDeepth, alias } = getOption(ctx)
    if (!previousNode) return false
    const { zIndex: itemWeight, deepth: itemDeep } = setNodeWeight(currentNode, alias)
    const { zIndex: preWeight, deepth: preDeep } = setNodeWeight(previousNode, alias)
    const startLine = previousNode.loc.end.line
    const endLine = currentNode.loc.start.line
    // const [isCheckEmptyLine, isCheckDeepth] = ctx.options

    console.log(itemDeep, preDeep)
    const isError = isCheckDeepth && itemWeight !== 100 ? itemWeight > preWeight || (itemWeight === preWeight && itemDeep < preDeep) : itemWeight > preWeight
    if (!isCheckEmptyLine) {
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
    const comments = ctx.getCommentsBefore(currentNode)
    const commentCount = Array.isArray(comments) ? comments.length : 0
    // /* 权重不等，校验中间是否含有换行 */
    if (itemWeight !== preWeight && startLine === endLine - 1 - commentCount) {
        return {
            isError: true,
            message: itemWeightMap.get(1000),
            errorCode: 1000
        }
    }
    // /* 权重相等，校验中间是否含有换行 */
    if (itemWeight === preWeight && startLine !== endLine - 1 - commentCount) {
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
function getTargetNode(node, allNodes, alias) {
    const { zIndex: currentWeight, deepth: currentDeep } = setNodeWeight(node, alias)
    return allNodes.find(item => {
        const { zIndex: itemWeight, deepth: itemDeep } = setNodeWeight(item, alias)
        return currentWeight > itemWeight || (currentWeight === itemWeight && !(currentDeep > itemDeep))
    }) || allNodes[allNodes.length - 1]
}

function getTargetNodeByWeight(node, allNodes, alias) {
    const { zIndex: currentWeight, deepth: currentDeep } = setNodeWeight(node, alias)
    return allNodes.find(item => {
        const { zIndex: itemWeight, deepth: itemDeep } = setNodeWeight(item, alias)
        return currentWeight > itemWeight
    }) || allNodes[allNodes.length - 1]
}

function getOption(ctx) {
    const options = ctx.options
    const isParams = options.length && Object.prototype.toString.call(options[0]) === '[object Object]'
    const isCheckEmptyLine = isParams ? options[0].isCheckEmptyLine : options[0]
    const isCheckDeepth = isParams ? options[0].isCheckDeepth : options[1]
    const alias = isParams ? options[0].alias : DefaultAlias
    return {
        alias: alias || DefaultAlias,
        isCheckDeepth,
        isCheckEmptyLine,
    }
}
module.exports = {
    meta: {
        docs: {
            description: "规范引入顺序",
            recommended: true,
            url: 'https://www.npmjs.com/package/eslint-plugin-imports-sorter'
        },
        fixable: 'layout',
        schema: [
            {
                "type": ["object", 'boolean'],
                "properties": {
                    "isNeedEmptyLine": "boolean",
                    "isCheckDeepth": "boolean",
                    "alias": "array"
                }
            },
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
                    const { isCheckDeepth, alias } = getOption(ctx)
                    const targetNode = isCheckDeepth ? getTargetNode(node, allImportNodes, alias) : getTargetNodeByWeight(node, allImportNodes, alias)
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
                                    /* 删除空行节点 */
                                    const comments = ctx.getCommentsBefore(node)
                                    const fixEmptyLineArr = []
                                    comments.forEach((item, index) => {
                                        if (index === comments.length - 1) return
                                        const _start = item.range[1]
                                        const _end = comments[index + 1].range[0]
                                        fixEmptyLineArr.push(fixer.replaceTextRange([_start, _end], '\n'))
                                    })
                                    const fixerList = fixEmptyLineArr.length ? [
                                        ...fixEmptyLineArr,
                                    ] : [
                                        fixer.replaceTextRange(range, ''),
                                        fixer.insertTextAfter(node, '\n' + sourceCode.getText(node))
                                    ]
                                    return fixerList
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
