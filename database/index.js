

//== Database Configuration and Export =========================================

//-- Dependencies --------------------------------
import knex from 'knex';
import knexConfig from './knex_configuration.js';

//------------------------------------------------
const knexDB = knex(knexConfig.development);
export default knexDB;
