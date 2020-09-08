import { DataTypes, Model } from 'sequelize';

class Tag extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
    }, {
      sequelize,
      tableName: 'tags',
    })
  }

  static associate(models) {
    this.belongsToMany(models.Tool, {
      foreignKey: 'tag_id',
      through: 'tool_tags',
      as: 'tools'
    });
  }
}

export default Tag;
