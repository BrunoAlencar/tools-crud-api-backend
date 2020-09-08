import { DataTypes, Model } from 'sequelize';

class ToolTags extends Model {
  static init(sequelize) {
    super.init({
      tool_id: DataTypes.INTEGER,
      tag_id: DataTypes.INTEGER,
    }, {
      sequelize,
      tableName: 'tool_tags',
    })
  }
}

export default ToolTags;
