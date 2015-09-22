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
            selected: {
                files: [],
                active: null
            },
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
            uploadFileZone: null,
            hasError: false,
            errors: {
                fields: [],
                values: []
            }
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
            uploadMultiple: true,
            url: "/api/1.0/file/create",
            clickable: "#upload-file-btn",
            previewsContainer: '#upload-file-preview',
            maxFilesize: 20480,
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
            console.log(file);
            if (file.xhr.code == 200) {
                self.uploadFileZone.removeFile(file);
                self.files.push(file.xhr);
                /* Maybe display some more file information on your page */
            }
        });

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
        },
        fileSelect: function (index) {
            //add selected
            if (this.selected.files.indexOf(index) == -1) {
                this.selected.files.push(index);
            }
            //add active
            this.selected.active = index;
        },
        fileDeselect: function (index) {
            //remove active
            if (this.selected.active == index) {
                this.selected.active = null;
            }
            //remove selected
            var index = this.selected.files.indexOf(index);
            if (index > -1) {
                this.selected.files.splice(index, 1);
            }
        },
        saveStory: function () {
            this.validate();
            if (this.hasError === false) {
                var self = this;
                var data = {
                    title: self.story.title,
                    content: self.story.content,
                    category_id: self.story.category_id,
                    excerpt: self.story.excerpt,
                    keywords: JSON.stringify(self.story.keywords),
                    default_image: self.story.default_image,
                    published: self.story.published,
                    featured: self.story.featured
                };
                var url = '/api/1.0/story/create';
                if (self.story.id > 0) {
                    data.id = self.story.id;
                    url = '/api/1.0/story/update';
                }
                $.ajax({
                    url: url,
                    method: 'POST',
                    data: data,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", Cookies.get('AdminAuth'));
                    }
                }).done(function (result) {
                    self.files = result.data;
                });
            }
        },
        validate: function () {
            this.errors.fields = [];
            this.errors.values = [];
            this.hasError = false;
            if (this.story.title.trim().length == 0) {
                this.hasError = true;
                this.errors.fields.push('title');
                this.errors.values.push('Story title is required.');
            }
        }
    }
};
