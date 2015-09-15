/**
 * Created by lex on 9/15/15.
 */
module.exports = {
    template: require('./stories-template.html'),
    data: function () {
        return {
            stories: []
        }
    },
    created: function () {
        this.getStories();
    },
    methods: {
        getStories: function () {
            var self = this;
            $.ajax({
                url: '/api/1.0/stories',
                method: 'GET'
            }).done(function (result) {
                self.stories = result.data.items;
            });
        }
    }
};

