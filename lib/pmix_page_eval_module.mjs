// Puppeteer Page class mix-in
//
// mix_into adds to target Page:
// page.$evalModule(selector, moduleSpecifier[, ...args])
// page.evaluateModule(moduleSpecifier[, ...args])
//
// Both work as base functions, except instead of function you pass in module specifier
// and its default export function is used as pageFunction.

import path from 'path'
import url from 'url'

// Functional-style base implementation
const evaluate_module_default = (page, module_specifier, ...args) => {
    return import(module_specifier).then(module => {
        page.evaluate(module.default, ...args)
    })
}

const $eval_module_default = (page, selector, module_specifier) => {
    return import(module_specifier).then(module => {
        page.$eval(selector, module.default)
    })
}

// Functional-style bare module specifier resolver
const uniq = Symbol('import_map_data')

const get_full_module_specifier = (page, bare_module_specifier) => {
    let uniq_data = page[uniq]

    let rule = uniq_data.import_map_base_dir
    if (rule) {
        return url.pathToFileURL(
            path.format({ dir: rule, name: bare_module_specifier, ext: '.mjs' })
        )
    }
}

// Method-style wrappers that will be mixed to instances of Page
function evaluateModule(bare_module_specifier, ...args) {
    let full_specifier = get_full_module_specifier(this, bare_module_specifier)
    return evaluate_module_default(this, full_specifier, ...args)
}

function $evalModule(selector, bare_module_specifier) {
    let full_specifier = get_full_module_specifier(this, bare_module_specifier)
    return $eval_module_default => (this, selector, full_specifier)
}

// Mixer
const mix_into = (args) => {
    let { page } = args

    let uniq_data = page[uniq]
    if (!uniq_data) { uniq_data = {}; page[uniq] = uniq_data }

    page.$evalModule = $evalModule
    page.evaluateModule = evaluateModule

    uniq_data.import_map_base_dir = args.import_map_base_dir
}

export {
    mix_into,

    evaluate_module_default,
    $eval_module_default,
}