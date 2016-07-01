odoo.define('change_string_field_form_view.change_string_field', function (require) {
"use strict";

    var core = require('web.core');
    var View = require('web.View');
    var QWeb = core.qweb;
    var FormView = require('web.FormView');
    var Model = require('web.Model');

    View.include({
        init: function(parent, dataset, view_id, options) {
            var self = this;
            this._super(parent, dataset, view_id, options);
            if (typeof(this.fields_view) == 'undefined' && typeof(self.ViewManager.action) != 'undefined'){
                new Model('form.fields').call('action', [{'model_name': self.ViewManager.action.res_model, 'user_id': self.session.uid}, 'select']).then(function (result) {
                    self.result_form = result;
                });
            }
        },

    });

    FormView.include({
        view_loading: function(r) {
            var self = this;
            if (typeof(self.result_form) != 'undefined' && self.result_form.data.hasOwnProperty('fields_string')){
                var fields_string = JSON.parse(self.result_form.data.fields_string);
                for (var field in fields_string){
                    r.fields[field].string = fields_string[field]
                }
            }
            return this.load_form(r);
        },
        render_buttons: function($node) {
            this._super($node);
            this.$buttons.on('click', '.toggle_select_field', this.on_show_field);
        },
        on_show_field: function () {
            var self = this;
            var $suggestion = this.$buttons.find('.text_suggestion');
            if ($suggestion.find('ul').length < 1){
                var suggestion = QWeb.render("MySuggestion", {'widget': {'data': {'suggestion': this.fields_view.fields}}})
                $suggestion.find('.suggestion').append(suggestion);
            }
            $suggestion = this.$buttons.find('.text_suggestion');
            $suggestion.toggle();

            $suggestion.find('.suggestion .i_setting_field').click(function () {
                $(this).next().toggle();
                self.setting_fields_show($suggestion);
            });
            this.update($suggestion);
        },
        update: function ($suggestion) {
            var self = this;
            $suggestion.find('a[action="update"]').click(function () {
                var fields_string = {}
                self.$buttons.find('.choose_field_show').find('.suggestion input[action="get_value"]').each(function () {
                    var _str = $(this).attr('string_field') || false;
                    if (_str){
                        fields_string[$(this).attr('id')] = _str;
                    }
                });
                new Model('form.fields').call('action', [{'model_name': self.model, 'user_id': self.session.uid,
                'fields_string': JSON.stringify(fields_string)}, 'update']).then(function (result) {
                    location.reload();
                });
            });
        },
        setting_fields_show: function ($node) {
            var self = this;
            $node.find(".string_field").change(function () {
                $(this).parents('.setting_field').next('input').attr({'string_field': $(this).val()});
            });
            $node.find(".update_setting_field").click(function () {
                var parent = $(this).parents('.setting_field');
                parent.next().attr({string_field: parent.find('.string_field').val()})
                parent.toggle();
            });
        }
    });
});