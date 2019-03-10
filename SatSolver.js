var fs = require('fs')
exports.solve = function(fileName) {
    var formula = readFormula(fileName)
    var result = doSolve(formula.clauses, formula.variables)
    return result // two fields: isSat and satisfyingAssignment
  }
  
  function nextAssignment(currentAssignment) { //FUNCAO REVISADA -- OK
    var mudou = false
    for(var i = currentAssignment.length ; i > 0 && !mudou ; i--) {
        currentAssignment[i-1] = currentAssignment[i-1] + 1 //faco soma binaria para ver se pega todos os valores possiveis de variaveis
        if(currentAssignment[i-1] == 1) {
            mudou = true
            newAssignment = currentAssignment
        }else {
            currentAssignment[i-1] = 0
        }
    }
    return newAssignment
}
  
function doSolve(clauses, assignment) { //FUNÇÃO OK ***
    if(clauses.length == 0 && assignment.length == 0){ //verifico se os tamanhos dos arrays sao zero e retorno nao satisfativel
        console.log('ja to puta')
        return {'isSat': false, satisfyingAssignment: null}
    }
    console.log('caguei')
    var isSat = false
    var ultimo = false
    var valorClause = []
    var qntddClauses = 0
    while ((!isSat) && !ultimo) {
        valorClause = [] //reseto os valores da clausula e sua qntdd
        qntddClauses = 0
        ultimo = true
        for(var i = 0 ; i < assignment.length && ultimo ; i++) {
            if(assignment[i] == 0) { //vou verifcar se nao aparece zeros, se sim, e a ultima configuracao possivel
                ultimo = false
            }
        }
        for(var m = 0 ; m < clauses.length ; m++) {
           for(var n = 0 ; n < clauses[m].length && (n == 0 || !valorClause[n-1]) ; n++) { //verifico se e o primeiro ou se o valor da variavel anterior da clausula e verdadeiro
                if(clauses[m][n] > 0 ) {
                    if(assignment[clauses[m][n] - 1] == 1) {
                        valorClause[m] = true
                    }else {
                        valorClause[m] = false
                    }
                }else {
                    if(assignment[Math.abs(clauses[m][n]) - 1] == 1) {
                        valorClause[m] = false
                    }else {
                        valorClause[m] = true
                    }
                }    
           }
        }
        for(var i = 0 ; i < valorClause.length; i++){ //verifico se todas as clausulas sao verdadeiras, se sim, e satisfativel
            if(valorClause[i]){
                qntddClauses++
            }
        }
        if(qntddClauses == clauses.length ) {
            isSat = true
        }else{
            isSat = false
            assignment = nextAssignment(assignment)
        }
    }
    var result = {'isSat': isSat, satisfyingAssignment: null}
    if (isSat) {
        result.satisfyingAssignment = assignment
    }
    return result
}
    
function readFormula(fileName) { //FUNÇÃO OK -- IMPLEMENTADA PELO PROFESSOR
    var text =  fs.readFileSync(fileName,'utf8')
    var clauses = readClauses(text)
    var variables = readVariables(clauses)
    var specOk = checkProblemSpecification(text, clauses, variables)
    var result = { 'clauses': [] , 'variables': [] }
    if (specOk) {
        result.clauses = clauses
        result.variables = variables
    }
    return result
}

function readClauses(text) { //FUNÇÃO REVISADA -- OK
    var auxiliar = text.split("\n") //cria um array, cada indice uma linha
    var clauses = [] //inicializo o array de clausulas
    var posicao = 0
    var ajudante = [] //variavel para ajudar qnd a clausula nao terminar em zero
    for(var i = 0 ; i < auxiliar.length ; i++) { //irei olhar linha por linha
        if(auxiliar[i].charAt(0)!='c' && auxiliar[i].charAt(0)!='p') { //verifico se nao tem comentario ou especificacao
            ajudante = auxiliar[i].split(" ") 
            console.log('a' , ajudante)
            if(ajudante.length > 0 && ajudante[0] != "") {
                if(clauses[posicao] == null){ //clauses[posicao] nao e um array, mas sim uma posicao, logo se for nulo, eu inicializo como array vazio
                    clauses[posicao] = []
                }
                clauses[posicao] = clauses[posicao].concat(ajudante) //junto os arrays ate o ultimmo caracter ser zero
                if(auxiliar[i].charAt(auxiliar[i].length - 1) == '0'){
                    clauses[posicao].pop() //se for zero, eu dou o pop, que tira o ultimom elemento do array
                    posicao++ //se terminar em zero, mudo de clausula
                }
            }
        }
    }
    for(var i = 0 ; i < clauses.length ; i++){
        console.log(clauses[i])
    }
    return clauses
}

// function readVariables(clauses) { //FUNÇÃO OK
//     var ordem = [] //crio um novo array, a fim de juntar todas as clausulas
//     var variables = [] //crio um array de variaveis
//     var cont1, cont2, aux
//     for(var i = 0 ; i < clauses.length ; i++){
//         ordem = ordem.concat(clauses[i]) // concateno todas as clausulas
//     }
//     for(var i = 0 ; i < ordem.length ; i++){
//         ordem[i] = Math.abs(ordem[i]) //tiro o modulo de todas as variaveis
//     }
//     for(cont1 = 0 ; cont1 < ordem.length ; cont1++) { //bubble sort para por em ordem crescente
//         for(cont2 = 0 ; cont2 < ordem.length - 1 ; cont2++ ){  
//             if(ordem[cont2] > ordem[cont2+1]) {  
//                 aux = ordem[cont2]
//                 ordem[cont2] = ordem[cont2+1] 
//                 ordem[cont2+1] = aux 
//             }  
//         }                       
//     }
//     for(var i = 0 ; i < ordem[ordem.length - 1] ; i++){ //pego o maior do bubble sort, que vai ser a quantidade de variaveis
//         variables[i] = 0 //inicializo o array com todas as posicoes como zero
//     }
//     return variables
// }

function readVariables(clauses){ //FUNCAO REVISADA -- OK
    var maior = 0 //determino o maior valor
    var variables = []
    for(var i = 0 ; i < clauses.length ; i++){ //comparo o maior valor com as variaveis(com modulo)
        for(var j  = 0 ; j < clauses[i].length ; j++){
            maior = Math.max(maior , Math.abs(clauses[i][j]))
        }
    }
    for(var i = 0 ; i < maior ; i++){ //inicializo todas as variaveis como falsas
        variables[i] = 0
    }
    return variables
}

function checkProblemSpecification(text, clauses, variables) { //FUNÇÃO REVISADA -- OK
    var auxiliar3 = text.split("\n") //divido o texto em linhas
    var achou = false
    for(var i = 0 ; i < auxiliar3.length && !achou ; i++) {
        if(auxiliar3[i].indexOf("p cnf") != -1) { //procuro a linha que tem o "p cnf"
            var cnf = auxiliar3[i].split(" ") //se achar, dou split e o achou fica verdadeiro
            achou = true
        }
    }
    console.log(variables.length, cnf[2])
    console.log(clauses.length, cnf[3])
    if(variables.length == cnf[2] && clauses.length == cnf[3]) { //verifico se a especificacao bate com as qntdds de variaveis e clausulas achadas
        return true
    }else {
        return false
    }
}
//simple0.cnf(true) -- simple2.cnf(false) -- hole4.cnf(false)
//simple1.cnf(false)[true]  hole1.cnf(true) [false]
//hole5.cnf(demorou) -- hole6.cnf(demorou)
