module.exports = {
    extends: [
        'lerna' ,// prefixed with commitlint-config-*,
        '@commitlint/config-conventional' // scoped packages are not prefixed
    ]
}