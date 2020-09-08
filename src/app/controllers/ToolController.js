import * as Yup from 'yup';

import { Op } from 'sequelize'
import Tool from '../models/Tool'
import Tag from '../models/Tag';
import ToolTags from '../models/ToolTags';

class ToolController {
  async index(req, res) {
    const { tag } = req.query
    const toolsFind = {
      attributes: [
        'id',
        'title',
        'link',
        'description',
      ],

      include: [{
        model: Tag,
        as: 'tags',
        attributes: [
          'name'
        ],
        through: {
          attributes: []
        },
      }]
    }

    if (tag){
      const currentTag = await Tag.findOne({
        where: {
          name: {
            [Op.like]: `%${tag}%`,
          }
        }
      })

      const tool_ids = await ToolTags.findAll({
        where: {tag_id: currentTag.id}
      })
      toolsFind.where = {
        id: tool_ids.map(tool => tool.tool_id)
      }
      let tools = await Tool.findAll(toolsFind);

      tools = tools.map(tool => {
        return {
          id: tool.id,
          title: tool.title,
          link: tool.link,
          description: tool.description,
          tags: tool.tags.map(tag => tag.name)
        }
      })

      return res.json(tools);
    }else {
      let tools = await Tool.findAll(toolsFind);

      tools = tools.map(tool => {
        return {
          id: tool.id,
          title: tool.title,
          link: tool.link,
          description: tool.description,
          tags: tool.tags.map(tag => tag.name)
        }
      })

      return res.json(tools);
    }
  }


  async store(req, res) {
    try {

      const findOrBulkTag = async tags => {
        const findedTags = await Tag.findAll({
          where: { name: tags }
        })
        const mappedFindedTags = findedTags.map(tag => tag.name)
        let tagsToCreate = tags.filter(tag => !mappedFindedTags.includes(tag))
        tagsToCreate = tagsToCreate.map(tag => ({name: tag}))
        const createdTags = await Tag.bulkCreate(tagsToCreate,{
          returning: true
        })
        return [
          ...findedTags.map(tag => tag.id),
          ...createdTags.map(tag => tag.id)
        ]
      }

      const bulkToolTags = async (tagsIds, toolId) => {
        const tooltags = tagsIds.map(tagId => ({
          tag_id: tagId,
          tool_id: toolId
        }))
        const createdToolTags = await ToolTags.bulkCreate(
          tooltags,
          { returning: true }
        )
        return createdToolTags
      }

      const { title, link, description, tags } = req.body;
      let tool = {
        title,
        link,
        description
      };
      const createdTool = await Tool.create(tool);
      const createdTags = await findOrBulkTag(tags)
      await bulkToolTags(createdTags, createdTool.id)
      return res.status(201).json({
        id: createdTool.id,
        ...tool,
        tags,
      });
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        message:error.message
      })
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await ToolTags.destroy({ where: {
        tool_id:id
      }})
      await Tool.destroy({ where: { id: [id] } })

      res.status(204).json()
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        message:error.message
      })
    }
  }




}

export default new ToolController();
