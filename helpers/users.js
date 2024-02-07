//NO NEED TO USE, THIS IS AN EXAMPLE OF HOW TO ACCESS VARIABLES FROM OTHER FILE

//const qaUser = "kevinperezqa"
//const qaPass = "test1234"

const qaUser = "QAAutomation"
const qaPass = "1234test"

const uatUser = "kevinperezuat"
const uatPass = "Month1122"
   
export function Credentials(SelectOne)
{
    if(SelectOne > 0)
    {
        return [qaUser,qaPass]
    }
    else
    {
        return [uatUser,uatPass]
    }
}

//export { Credentials };

