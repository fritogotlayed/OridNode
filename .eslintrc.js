module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": "airbnb-base",
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "max-len": ["error", 100, 2, {
            ignoreUrls: true,
            ignoreComments: true,
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
        }]
     },
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    }
};