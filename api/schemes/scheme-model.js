const db = require('../../data/db-config');

function find() { // EXERCISE A
  return db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .groupBy('sc.scheme_id')
    .select('sc.scheme_id as scheme_id', 'sc.scheme_name as scheme_name')
    .orderBy('sc.scheme_id', 'asc')
    .count('st.step_id as number_of_steps');
}

async function findById(scheme_id) { // EXERCISE B
  const rows = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .orderBy('st.step_number', 'asc')
    .select('sc.scheme_name', 'st.*', 'sc.scheme_id')
    .where('sc.scheme_id', scheme_id);

  
  const result = {
    scheme_id: rows[0].scheme_id,
    scheme_name: rows[0].scheme_name,
    steps: []
  };

  rows.forEach(row => {
    if (row.step_id) {
      result.steps.push({
        step_id: row.step_id,
        step_number: row.step_number,
        instructions: row.instructions
      });
    }
  });
  return result;
}

function findSteps(scheme_id) { // EXERCISE C
  return db('steps as st')
    .join('schemes as sc', 'sc.scheme_id', 'st.scheme_id')
    .select('st.step_id as step_id', 'st.step_number as step_number', 'st.instructions as instructions',  'sc.scheme_name as scheme_name')
    .orderBy('st.step_number', 'asc')
    .where({ 'sc.scheme_id': scheme_id});
}

function add(scheme) { // EXERCISE D
  return db('schemes')
    .insert(scheme)
    .then(([scheme_id]) => {
      return findById(scheme_id);
    })
}

function addStep(scheme_id, step) { // EXERCISE E
  return db('steps')
    .insert({
      ...step,
      scheme_id
    })
    .then(() => {
      return db('steps as st')
        .join('schemes as sc', 'sc.scheme_id', 'st.scheme_id')
        .select('step_id', 'step_number', 'instructions', 'scheme_name')
        .orderBy('step_number')
        .where('sc.scheme_id', scheme_id);
    })
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
