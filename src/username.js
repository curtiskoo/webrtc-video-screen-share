import {capitalize} from "./methods";

let animals = Array.from(require('./resources/animals.json'))
let adjectives = Array.from(require('./resources/adjectives.json'))

export function getRandomUsername() {
    let a = Math.floor(Math.random()* adjectives.length);
    let b = Math.floor(Math.random()* animals.length);
    let name = capitalize(adjectives[a]) + capitalize(animals[b]);
    return name
}
