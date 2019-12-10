dbPassword = 'mongodb+srv://identifiant:'+ encodeURIComponent('motdepasse') + '@cluster0-yttg4.mongodb.net/test?retryWrites=true';

module.exports = {
    mongoURI: dbPassword
};
