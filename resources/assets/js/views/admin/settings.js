/**
 * Created by lex on 9/22/15.
 */

module.exports = {
    template: require('./settings-template.html'),
    data: function () {
        return {
            user: {}
        }
    },
    compiled: function () {
        var token = Cookies.get('AdminAuth').split(' ')[1];
        var user = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            user = JSON.parse(this.urlBase64Decode(encoded));
        }
        var self = this;
        $.ajax({
            url: '/api/1.0/user/' + user.sub,
            method: 'GET'
        }).done(function (result) {
            self.user = result.data;
        });
    },
    methods: {
        urlBase64Decode: function (str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }
    }
};
