var re = require("./SatSolver.js")
var resultado = re.solve('simple2.cnf')
console.log(/*sat.solve*/(resultado.isSat));
console.log(resultado.satisfyingAssignment);
