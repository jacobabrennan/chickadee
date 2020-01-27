

//==============================================================================

//-- Dependencies --------------------------------
import knex from 'knex';
import knexConfig from './knex_configuration.js';

//-- Project Constants ---------------------------

//------------------------------------------------
const knexDB = knex(knexConfig.development);
export default knexDB;
