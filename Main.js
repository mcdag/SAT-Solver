var re = require("./SatSolver.js")
var resultado = re.solve('simple1.cnf')
console.log(/*sat.solve*/(resultado.isSat));
console.log(resultado.satisfyingAssignment);
