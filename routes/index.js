/* jshint devel:true */
var module;
var exports = module.exports = {};

exports.index = function (req, res) {
    var body = '<html><body>';
    var username;
    if (req.user) {
        username = req.user.username;
        body += '<p>Jesteś zalogowany jako „' + username + '”</p>';
        body += '<a href="/logout">Wyloguj</a>';
    } else {
        body += '<a href="/login">Zaloguj</a>';
    }
    body += '</body></html>';

    res.redirect('/widz.html');
};

exports.login = function (req, res) {
    var body = '<html><body><center><table style="padding:2%; border:1px solid; margin-top:10%">';
    body += '<form action="/login" method="post">';
    body += '<tr><td>Próbujesz zalogować się do serwisu. Wpisz swoję dane poniżej: <br><br></td></tr><tr><td><div><label>Użytkownik:</td><td></label>';
    body += '<input type="text" name="username"/></td></tr></div>';
    body += '<tr><td><div><label>Hasło:</td><td></label>';
    body += '<input type="password" name="password"/></td></tr></div>';
    body += '<tr><td><div><center><input type="submit" value="Zaloguj"/></center></div></td><td></td></tr></form>';
    body += '</table></center></body></html>';
    res.send(body);
};

exports.logout = function (req, res) {
    console.log('Wylogowanie...');
    req.logout();
    res.redirect('/login');
};


