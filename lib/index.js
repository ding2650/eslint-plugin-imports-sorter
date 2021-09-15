
var requireIndex = require("requireindex")

module.exports = {
  rules: requireIndex(__dirname + "/rules"),
  configs: {
    recommended: {
      plugins: ['imports-sorter'],
      rules: {
        'imports-sorter/sorter': [2, true,true]
      }
    }
  },
}
