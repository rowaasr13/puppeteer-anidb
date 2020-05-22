function RemoveExceptBranch(leaf_element) {
    while (1) {
        if (leaf_element.tagName == 'BODY') { return }

        let parent = leaf_element.parentElement
        if (!parent) { return }

        let child; while (child = parent.firstChild) {
            parent.removeChild(child)
        }
        parent.appendChild(leaf_element)

        leaf_element = parent
    }
}

export { RemoveExceptBranch, RemoveExceptBranch as default }