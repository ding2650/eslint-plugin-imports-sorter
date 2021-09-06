
var requireIndex = require("requireindex")

module.exports = {
  rules: requireIndex(__dirname + "/rules"),
  configs: {
    recommed: {
      plugins: ['imports-sorter'],
      rules: {
        'imports-sorter/sorter': 2
      }
    }
  },
}
