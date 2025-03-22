const pool = require('../config/db');

async function evaluateSolution(challengeName, userSolution) {
    try {
      console.log("Evaluating Solution:", { challengeName, userSolution });

      // Validate input
      if (!userSolution || typeof userSolution !== "string") {
        console.error("Invalid solution received:", userSolution);
        return { error: "Solution is missing or invalid" };
      }
        
      const { rows } = await pool.query(
        "SELECT par, tests FROM algorithms WHERE name = $1",
        [challengeName]
      );
      if (rows.length === 0) {
        return { error: "Challenge not Found" };
      }

       const { par, tests } = rows[0];

       if (!tests || Object.keys(tests).length === 0) {
         return { error: "No tests available for this challenge" };
       }

       let testCases = tests; 
       let results = [];
       let successCount = 0;

       // Override console.log to logs
       let logs = "";
       const originalConsoleLog = console.log;
       console.log = function (...args) {
         logs += args.join(" ") + "\n";
         originalConsoleLog.apply(console, args);
       };
         try {
           // Create a function from the users solution
           const userFunctionCode = userSolution + "\n";

           for (const [expectedOutput, testCall] of Object.entries(testCases)) {
             try {
               // Run the user's function with each test case
               let actualOutput = eval(userFunctionCode + testCall);
               let passed = actualOutput.toString() === expectedOutput;

               results.push({
                 test: testCall,
                 expected: expectedOutput,
                 actual: actualOutput,
                 passed,
               });

               if (passed) successCount++;
             } catch (err) {
               results.push({
                 test: testCall,
                 expected: expectedOutput,
                 actual: `Error: ${err.message}`,
                 passed: false,
               });
             }
           }
         } catch (err) {
           console.error("Error executing user function:", err);
           return { error: "Error executing function" };
         } finally {
           console.log = originalConsoleLog; // Restore console.log
         }
      
      
      // const optimalPar = Number(rows[0].par);;
      let userLines = userSolution.trim().split("\n").length;
      let scoreMessage =
        userLines <= par
          ? "Par Achieved!"
          : `Over par by ${userLines - par} lines`;

      return {
        userLines,
        // parScore: optimalPar,
        // result:
        //   userLines <= optimalPar
        //     ? "Par Achieved!"
        //     : `Over par by ${userLines - optimalPar} lines`,
        parScore: par,
        result: scoreMessage,
        testResults: results,
        passedTests: successCount,
        totalTests: Object.keys(testCases).length,
      };
    } catch (error) {
        console.error('error fetching par score:', error);
        return {error: 'Database error'}
    }
}

module.exports = { evaluateSolution };
