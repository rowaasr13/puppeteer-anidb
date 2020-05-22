module.exports = async (module_paths) => {
    let loading = []
    let combined_exports = {};

    module_paths.forEach((path) => {
        loading.push(
            import(path).then((module) => { Object.assign(combined_exports, module) })
        )
    })

    return Promise.all(loading).then(() => combined_exports)
}