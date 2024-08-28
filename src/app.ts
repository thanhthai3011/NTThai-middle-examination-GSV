// SET ENVIRONMENT
global.NODE_ENV = "development";
// global.NODE_ENV = "production";

// Infra
import "./infra/express/app";
import "./infra/sequelize";

import "./modules/useCases/cronJob/index";