const db = require('../../data/db-config');

async function checkSchemeId(req, res, next) {
  try {
    const scheme = await db('schemes')
      .where('scheme_id', req.params.scheme_id)
      .first();
    if (!scheme) {
      next({
        status: 404,
        message: `scheme with scheme_id ${req.params.scheme_id} not found`
      });
    } else {
      next();
    } 
  } 
  catch (err){
    next(err);
  }
}

const validateScheme = (req, res, next) => {
  const error = { status: 400 };
  const { scheme_name } = req.body;
  if (scheme_name === undefined || typeof scheme_name !== 'string' || !scheme_name.trim()) {
    error.message = "invalid scheme_name";
    next(error);
  } else {
    next();
  }
}

const validateStep = (req, res, next) => {
  const error = { status: 400 };
  const { instructions, step_number } = req.body;
  if ( !instructions || typeof(instructions) !== "string" || step_number < 1 || isNaN(step_number)) {
    error.message = "invalid step";
    next(error);
  } else {
    next();
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
