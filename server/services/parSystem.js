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
        "SELECT par FROM algorithms WHERE name = $1",
        [challengeName]
      );
      if (rows.length === 0) {
        return { error: "Challenge not Found" };
      }
      const optimalPar = Number(rows[0].par);;
      const userLines = userSolution.trim().split("\n").length;

      return {
        userLines,
        parScore: optimalPar,
        result:
          userLines <= optimalPar
            ? "Par Achieved!"
            : `Over par by ${userLines - optimalPar} lines`,
      };
    } catch (error) {
        console.error('error fetching par score:', error);
        return {error: 'Database error'}
    }
}

module.exports = { evaluateSolution };