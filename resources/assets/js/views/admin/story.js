/**
 * Created by lexus on 9/16/15.
 */


module.exports = {
    template: require('./story-template.html'),
    data: function () {
        return {
            tinymce_container: 'post-content',
            categories: [],
            story: {
                id: 0,
                title: '',
                content: '',
                published: 0,
                excerpt: '',
                keywords: '',
                default_image: '',
                featured: 0,
                deleted_at: null,
                author: localStorage.getItem('AdminName'),
                created: 'Now'
            },
            status: 'New',
            category: ''
        }
    },
    ready: function () {
        tinyMCE.settings = tinymceConfig.default;
        tinyMCE.execCommand('mceAddEditor', true, this.tinymce_container);
        this.getCategories();
    },
    compiled: function () {
        tinyMCE.execCommand('mceRemoveEditor', true, this.tinymce_container);
    },
    methods: {
        getCategories: function () {
            var self = this;
            $.ajax({
                url: '/api/1.0/category/all',
                method: 'GET'
            }).done(function (result) {
                self.categories = result.data;
                for (var i in self.categories) {
                    if (self.categories[i].id == self.story.category_id) {
                        self.category = self.categories[i].name;
                    }
                }
            });
        }
    }
};
