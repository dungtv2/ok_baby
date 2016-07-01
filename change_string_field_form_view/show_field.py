# __author__ = 'truongdung'
from openerp import fields, api, models
import json


class FormFields(models.Model):
    _name = "form.fields"

    user_id = fields.Many2one(comodel_name="res.users", string="User Id")
    name = fields.Char(string="Name")
    model_name = fields.Char(string="Model Name")
    color = fields.Char(string="Color", default="check-base")
    fields_show = fields.Char(string="Fields Show")
    fix_header_list_view = fields.Boolean(string="Fix header List View")
    fields_sequence = fields.Char(string="Sequence")
    color_for_list = fields.Boolean(string="Use Color/bgcolor for listview")
    fields_string = fields.Char(string="Fields String")
    # background_color = fields.Char(string="Background Color of ListView")
    # color_list_view = fields.Char(string="Color of ListView")

    @api.model
    def action(self, vals, action):
        # group_show_fields = self.env.ref('show_sequence_columns_easy.group_show_fields')
        # if group_show_fields.id not in [x.id for x in self.env.user.groups_id]:
        #     self.env.user.write({'in_group_%s' % group_show_fields.id: True})
            # group_show_fields.write({'users': [[6, False,
            #                                     [x.id for x in group_show_fields.users]+[vals['user_id']]]]})
        if 'user_id' in vals and 'model_name' in vals:
            data = self.search([('user_id', '=', vals['user_id']), ('model_name', '=', vals['model_name'])])
            if action == 'update':
                if len(data) > 0:
                    data[0].write({'fields_string': vals['fields_string']})
                else:
                    self.create(vals)
            elif action == 'select':
                if len(data) > 0:
                    data = data[0]
                    return {'data': {'fields_string': data.fields_string, 'user_id': data.user_id.id,
                                     'model_name': data.model_name}}
                else:
                    return {'data': {}}
FormFields()
