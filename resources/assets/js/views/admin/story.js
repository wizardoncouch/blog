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
            files: [],
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
                created: 'Now',
                status: ''
            },
            uploadFileZone: null
        }
    },
    compiled: function () {
        tinyMCE.execCommand('mceRemoveEditor', true, this.tinymce_container);
    },
    ready: function () {
        var token = $('meta[name="csrf-token"]').attr('content');
        var self = this;
        tinyMCE.settings = tinymceConfig.default;
        tinyMCE.execCommand('mceAddEditor', true, self.tinymce_container);
        if (self.$route.params.id > 0) {
            self.getStory(self.$route.params.id);
        } else {
            self.story.status = 'new';
            self.getCategories();
            self.getKeywords();
        }
        self.uploadFileZone = new Dropzone('div#upload-file-zone', {
            paramName: "file",
            method: 'POST',
            acceptedFiles: 'image/*',
            autoProcessQueue: true,
            uploadMultiple: false,
            url: "/api/1.0/file/create",
            clickable: "#upload-file-btn",
            previewsContainer: '#upload-file-preview',
            maxFilesize: 1024,
            headers: {
                Authorization: Cookies.get('AdminAuth')
            },
            params: {
                _token: token,
                id: 0,
                type: 'story'
            }
        });
        self.uploadFileZone.on("complete", function (file) {
            console.log(file.xhr);
            //self.uploadFileZone.removeFile(file);
            /* Maybe display some more file information on your page */
        });

        self.getFiles();
    },
    methods: {
        ucword: function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        getStory: function (id) {
            var self = this;
            $.ajax({
                url: '/api/1.0/story/' + id,
                method: 'GET'
            }).done(function (result) {
                self.story = result.data;
                self.story.keywords = JSON.parse(self.story.keywords);
                var editor = tinyMCE.get(self.tinymce_container);
                if (editor !== null) {
                    editor.setContent(self.story.content);
                }
                self.getCategories();
                self.getKeywords();
            });
        },
        getCategories: function () {
            var self = this;
            $.ajax({
                url: '/api/1.0/categories',
                method: 'GET',
                data: {
                    filter: 'show'
                }
            }).done(function (result) {
                for (var i in result.data) {
                    self.categories.push({
                        value: result.data[i].id,
                        text: result.data[i].name
                    });
                }
            });
        },
        getKeywords: function () {
            var self = this;
            $.ajax({
                url: '/api/1.0/keywords',
                method: 'GET'
            }).done(function (result) {
                for (var i in result.data) {
                    self.keywords.push(result.data[i].keyword);
                }
            });
        },
        getFiles: function () {
            var self = this;
            $.ajax({
                url: '/api/1.0/files',
                method: 'GET'
            }).done(function (result) {
                self.files = result.data;
            });
        }
    }
};
