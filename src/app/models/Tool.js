import { DataTypes, Model } from 'sequelize';

class Tool extends Model {
  static init(sequelize) {
    super.init({
      title: DataTypes.STRING,
      link: DataTypes.STRING,
      description: DataTypes.TEXT,
    }, {
      sequelize,
      tableName: 'tools',
    })
  }

  static associate(models) {
    this.belongsToMany(models.Tag, {
      foreignKey: 'tool_id',
      through: 'tool_tags',
      as: 'tags'
    });
  }
}

export default Tool;
