/**
 * Created by lex on 9/14/15.
 */
module.exports = {
    template: require('./login-template.html'),
    data: function () {
        return {
            login: {
                user: 'footless.hero',
                password: 'password',
                remember: false
            },
            hasError: false,
            errors: {
                fields: [],
                values: []
            }
        }
    },
    methods: {
        doLogin: function () {
            this.validate();
            if (this.hasError === false) {
                var self = this;
                $.ajax({
                    url: '/api/1.0/auth/signin',
                    method: 'POST',
                    data: self.login
                }).done(function (response) {
                    if (response.code == 200) {
                        var token = 'Bearer ' + response.token;
                        if (self.login.remember == true) {
                            Cookies.set('AdminAuth', token, {expires: Infinity});
                        } else {
                            Cookies.set('AdminAuth', token);
                        }
                        var remember = self.login.remember == true ? 1 : 0;
                        localStorage.setItem('AdminRemember', remember);
                        localStorage.setItem('AdminName', response.data.first_name + ' ' + response.data.last_name);
                        localStorage.setItem('AdminAvatar', response.data.avatar);
                        self.$route.router.go({name: 'dashboard'});
                    } else {
                        self.hasError = true;
                        self.login.password = '';
                        if ('data' in response) {
                            for (var i in response.data) {
                                self.errors.fields.push(i);
                                self.errors.values.push(response.data[i]);
                            }
                        }
                        if ('text' in response) {
                            self.errors.values.push(response.text);
                        }
                    }
                });
            }
        },
        validate: function () {
            this.errors.fields = [];
            this.errors.values = [];
            this.hasError = false;
            if (this.login.user.trim().length == 0) {
                this.hasError = true;
                this.errors.fields.push('user');
                this.errors.values.push('email or username field is required.');
            }
            if (this.login.password.trim().length == 0) {
                this.hasError = true;
                this.errors.fields.push('password');
                this.errors.values.push('password field is required.');
            }
            if (this.hasError) {
                this.login.password = '';
            }
        }

    }

};
