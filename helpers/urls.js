//NO NEED TO USE, THIS IS AN EXAMPLE OF HOW TO ACCESS VARIABLES FROM OTHER FILE
const TESTURL = process.env.BASE_URL
const THE_USER = process.env.USERNAME
const THE_PASS = process.env.PASSWORD

export function PMXenv(){
    return process.env.BASE_URL
}

export function PMXCred(){
    return [THE_USER,THE_PASS]
     
}