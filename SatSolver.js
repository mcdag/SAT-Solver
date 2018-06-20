var fs = require('fs')
exports.solve = function(fileName) {
    let formula = readFormula(fileName)
    let result = doSolve(formula.clauses, formula.variables)
    return result // two fields: isSat and satisfyingAssignment
  }
  
  function nextAssignment(currentAssignment) {
    var mudou = false
    for(var i = currentAssignment.length ; i > 0 && !mudou ; i--) {
        currentAssignment[i-1] = currentAssignment[i-1] + 1 
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
    var isSat = false
    var ultimo = false
    var valorClause = []
    var valorAuxiliar = []
    var qntddClauses = 0
    while ((!isSat) && !ultimo) {
        ultimo = true
        for(var i = 0 ; i < assignment.length && ultimo ; i++) {
            if(assignment[i] == 0) {
                ultimo = false
            }
        }
        for(var m = 0 ; m < clauses.length ; m++) {
           for(var n = 0 ; n < clauses[m].length && (n == 0 || !valorClause[n-1]) ; n++) {
                if(clauses[m][n] > 0 ) {
                    if(assignment[clauses[m][n] - 1] == 1) {
                        valorAuxiliar[n] = true
                        valorClause[m] = true
                    }else {
                        valorAuxiliar[n] = false
                        valorClause[m] = false
                    }
                }else {
                    if(assignment[Math.abs(clauses[m][n]) - 1] == 1) {
                        valorClause[m] = false
                        valorAuxiliar[n] = false
                    }else {
                        valorClause[m] = true
                        valorAuxiliar[n] = true
                    }
                }    
           }
        }
        for(var i = 0 ; i < valorClause.length; i++){
            if(valorClause[i]){
                qntddClauses++
            }
        }
        if(qntddClauses == clauses.length) {
            isSat = true
        }else{
            isSat = false
            assignment = nextAssignment(assignment)
        }
    }
    let result = {'isSat': isSat, satisfyingAssignment: null}
    if (isSat) {
        result.satisfyingAssignment = assignment
    }
    return result
}
    
function readFormula(fileName) { //FUNÇÃO OK
    let text =  fs.readFileSync(fileName,'utf8')
    let clauses = readClauses(text)
    let variables = readVariables(clauses)
    let specOk = checkProblemSpecification(text, clauses, variables)
    let result = { 'clauses': [] , 'variables': [] }
    if (specOk) {
        result.clauses = clauses
        result.variables = variables
    }
    return result
}

function readClauses(text) { //FUNÇÃO OK
    var auxiliar = text.split("\n")
    var clauses = []
    var posicao = 0
    for(var i = 0 ; i < auxiliar.length ; i++) {
        if(auxiliar[i].charAt(0)!='c' && auxiliar[i].charAt(0)!='p') {
            if(auxiliar[i].charAt(auxiliar[i].length - 1) == '0'){
                clauses[posicao] = auxiliar[i].split(" ")
                clauses[posicao].pop()
                posicao++
            }
        }
    }
    return clauses
}

function readVariables(clauses) { //FUNÇÃO OK
    var ordem = []
    var variables = []
    var cont1, cont2, aux
    for(var i = 0 ; i < clauses.length ; i++){
        ordem = ordem.concat(clauses[i])
    }
    for(var i = 0 ; i < ordem.length ; i++){
        ordem[i] = Math.abs(ordem[i])
    }
    for(cont1 = 0 ; cont1 < ordem.length ; cont1++) {  
        for(cont2 = 0 ; cont2 < ordem.length - 1 ; cont2++ ){  
            if(ordem[cont2] > ordem[cont2+1]) {  
                aux = ordem[cont2]
                ordem[cont2] = ordem[cont2+1] 
                ordem[cont2+1] = aux 
            }  
        }                       
    }
    for(var i = 0 ; i < ordem[ordem.length - 1] ; i++){
        variables[i] = 0
    }
    return variables
}

function checkProblemSpecification(text, clauses, variables) { //FUNÇÃO OK
    var auxiliar3 = text.split("\n")
    var achou = false
    for(var i = 0 ; i < auxiliar3.length && !achou ; i++) {
        if(auxiliar3[i].indexOf("cnf") != -1) {
            var cnf = auxiliar3[i].split(" ")
            achou = true
        }
    }
    if(variables.length == cnf[2] && clauses.length == cnf[3]) {
        return true
    }else {
        return false
    }
}
//simple0.cnf(true) -- simple2.cnf(false) -- hole4.cnf(false)
//simple1.cnf(false)[true]  hole1.cnf(true) [false]
//hole5.cnf(demorou) -- hole6.cnf(demorou)
