import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Tool from '../app/models/Tool';
import Tag from '../app/models/Tag';
import ToolTags from '../app/models/ToolTags';

const models = [ Tool, Tag, ToolTags];

class Database {
  constructor() {
    this.init();
  }
  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(
      model =>
        model && model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
