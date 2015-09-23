/**
 * Created by lexus on 9/16/15.
 */

Vue.directive('chosen-story', {
    twoWay: true, // note the two-way binding
    bind: function () {
        var self = this;
        $(self.el)
            .chosen({
                inherit_select_classes: true,
                width: '100%',
                disable_search_threshold: 999
            })
            .change(function (ev) {
                // two-way set
                //quick fix because the this.set() doesn't work
                switch (self.arg) {
                    case 'category':
                        self.vm.story.category_id = $(this).val();
                        break;
                    case 'keyword':
                        self.vm.story.keywords = $(this).val();
                        break;
                }
            });
    },
    update: function (nv, ov) {
        // note that we have to notify chosen about update
        $(this.el).trigger("chosen:updated");
    }
});

module.exports = {
    template: require('./story-template.html'),
    data: function () {
        return {
            tinymce_container: 'post-content',
            set_featured_image: false,
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
            uploadMultiple: false,
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
            var response = JSON.parse(file.xhr.response);
            if (response.code == 200) {
                self.uploadFileZone.removeFile(file);
                self.files.push(response.data);
                /* Maybe display some more file information on your page */
            }
        });
        //get files
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
            self.selected.files = [];
            self.selected.active = null;
            $.ajax({
                url: '/api/1.0/files',
                method: 'GET'
            }).done(function (result) {
                self.files = result.data;
            });
        },
        fileSelect: function (index) {
            //add selected
            if (this.set_featured_image) {
                this.story.default_image = this.files[index].filename;
                this.set_featured_image = false;
                $('#modal-media').modal('toggle');
            } else {
                if (this.selected.files.indexOf(index) == -1) {
                    this.selected.files.push(index);
                }
                //add active
                this.selected.active = index;
            }
        },
        fileDeselect: function (index) {
            //remove active
            if (!this.set_featured_image) {
                if (this.selected.active == index) {
                    this.selected.active = null;
                }
                //remove selected
                var index = this.selected.files.indexOf(index);
                if (index > -1) {
                    this.selected.files.splice(index, 1);
                }
            }
        },
        insertFiles: function () {
            if (!this.set_featured_image) {
                var text = '';
                for (var i in this.selected.files) {
                    var index = this.selected.files[i];
                    var file = this.files[index];
                    text += '<p style="display:inline-block; position:relative; overflow: hidden;">';
                    text += '<img src="' + file.filename + '" width="' + file.width + '" height="' + file.height + '" />';
                    text += '<span style="position:absolute; bottom: 5px; padding:10px 5px; display:block; width:100%; color:#ffffff; background: rgba(0,0,0,0.5); z-index:999;">'+file.title+'</span>';
                    text += '</p>';
                }
                var editor = tinyMCE.get(this.tinymce_container);
                editor.execCommand('mceInsertContent', false, text);
                this.selected.files = [];
                this.selected.active = null;
                $('#modal-media').modal('toggle');
                //tinyMCE.activeEditor.execCommand('mceInsertContent', false, "some text");
            }
        },
        saveStory: function () {
            this.validate();
            if (this.hasError === false) {
                var self = this;
                var editor = tinyMCE.get(self.tinymce_container);
                if (editor !== null) {
                    self.story.content = editor.getContent();
                }
                var data = {
                    title: self.story.title,
                    content: self.story.content,
                    category_id: parseInt(self.story.category_id),
                    excerpt: self.story.excerpt,
                    keywords: JSON.stringify(self.story.keywords),
                    default_image: self.story.default_image,
                    published: self.story.published,
                    featured: self.story.featured
                };

                var url = '/api/1.0/story/create';
                if (self.story.id > 0) {
                    data.id = parseInt(self.story.id);
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
            if (this.story.category_id == 0) {
                this.hasError = true;
                this.errors.fields.push('category');
                this.errors.values.push('Category is required.');
            }
        },
        setFeaturedImage: function () {
            this.set_featured_image = true;
        },
        deleteStory: function () {

        }
    }
};
