//This is a methods file for multi-purpose re-use

export function scrollToBottom(id) {
    let elem = document.getElementById(id)
    elem.scrollTop = elem.scrollHeight
}