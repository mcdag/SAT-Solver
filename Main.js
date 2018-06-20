var re = require("./SatSolver.js")
var resultado = re.solve('simple0.cnf')
console.log(/*sat.solve*/(resultado.isSat));
console.log(resultado.satisfyingAssignment);
