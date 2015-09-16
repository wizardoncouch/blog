/**
 * Created by lexus on 9/16/15.
 */


module.exports = {
    template: require('./story-template.html'),
    data: function () {
        return {
            tinymce_container: 'post-content',
            categories: [],
            keywords: [],
            story: {
                id: 0,
                category_id: 0,
                title: '',
                content: '',
                published: 0,
                excerpt: '',
                keywords: [],
                default_image: '',
                featured: 0,
                deleted_at: null,
                author: localStorage.getItem('AdminName'),
                created: 'Now'
            },
            status: 'New'
        }
    },
    ready: function () {
        tinyMCE.settings = tinymceConfig.default;
        tinyMCE.execCommand('mceAddEditor', true, this.tinymce_container);
    },
    compiled: function () {
        tinyMCE.execCommand('mceRemoveEditor', true, this.tinymce_container);
        var self = this;
        $.ajax({
            url: '/api/1.0/category/all',
            method: 'GET'
        }).done(function (result) {
            for (var i in result.data) {
                self.categories.push({
                    value: result.data[i].id,
                    text: result.data[i].name
                });
            }
        });
        $.ajax({
            url: '/api/1.0/keyword/all',
            method: 'GET'
        }).done(function (result) {
            for (var i in result.data) {

                self.keywords.push({
                    value: result.data[i].id,
                    text: result.data[i].keyword
                });
            }
        });
    }
};
