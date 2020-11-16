const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.signup = (req, res, next) => { // Permet la création d'un compte
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const newUser = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      sexe: req.body.genre,
      derniere_connexion: null,
      password: hash,
      date_inscription: new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
      droits: 1,
    }
    console.log(newUser);
    config.connection.query ('INSERT INTO users SET?', newUser, function(err, results){
      if(err){
        if(err.errno=1062){
          res.send({ statut: 'error', message: 'Cet email est déjà utilisé !'});
        }else{
          res.json({ statut: 'error', message: 'Erreur SQL'});
        }

      }else{
        res.json({ statut: 'OK', message: 'Inscription réussie !'});
      }
    })
  })
  .catch(error => res.status(500).json({error}));

};

exports.login = (req, res, next) => { // Permet la connexion a un compte
  config.connection.query ('SELECT * FROM users WHERE email=?', req.body.email, function(err, results){
    if(results.length == 0){
      res.json({ statut: 'inconnu', message: `Désolé, cet utilisateur n'existe pas.`});
    }else{
      bcrypt.compare(req.body.password, results[0].password)
      .then(valid => {
        if (!valid) {
          return res.json({ statut: 'pwdInvalide', message: 'Mot de passe incorrect !' });
        }
        res.status(200).json({
          statut: 'profilValide',
          userId: results[0].id,
          token: jwt.sign(
            {userId: results[0].id},
            'RANDOM_TOKEN_SECRET',
            {expiresIn: '24h'}
          ),
          nom: results[0].nom,
          prenom: results[0].prenom,
          urlPhotoProfil: results[0].url_photo_profil
        });
        var sql = `UPDATE users SET derniere_connexion = ` + `'` + new Date().getFullYear() + `-` + (new Date().getMonth()+1) + `-` + new Date().getDate() + ` ` + new Date().getHours() + `:` + new Date().getMinutes() + `:` + new Date().getSeconds() + `'` + ` WHERE id= ` + results[0].id;
        config.connection.query (sql, results[0].id, function(err, results){
          if(err) throw err;
        })
      })
      .catch(error => res.status(500).json({ error }));
    }
    if(err){
      res.status(500).json({ error });
    }
  })
};

exports.adminLogin = (req, res, next) => { // Permet la connexion a un compte modérateur
  var sql = `SELECT * FROM users WHERE email= '` + req.body.email + `' AND droits= 0`;
  config.connection.query (sql, function(err, results){
    if(results.length == 0){
      res.json({ statut: 'inconnu', message: `Désolé, cet utilisateur n'existe pas.`});
    }else{
      bcrypt.compare(req.body.password, results[0].password)
      .then(valid => {
        if (!valid) {
          return res.json({ statut: 'pwdInvalide', message: 'Mot de passe incorrect !' });
        }
        res.status(200).json({
          statut: 'profilValide',
          userId: results[0].id,
          token: jwt.sign(
            {userId: results[0].id},
            'RANDOM_TOKEN_SECRET',
            {expiresIn: '24h'}
          ),
          nom: results[0].nom,
          prenom: results[0].prenom,
          urlPhotoProfil: results[0].url_photo_profil
        });
        var sql = `UPDATE users SET derniere_connexion = ` + `'` + new Date().getFullYear() + `-` + (new Date().getMonth()+1) + `-` + new Date().getDate() + ` ` + new Date().getHours() + `:` + new Date().getMinutes() + `:` + new Date().getSeconds() + `'` + ` WHERE id= ` + results[0].id;
        config.connection.query (sql, results[0].id, function(err, results){
          if(err) throw err;
        })
      })
      .catch(error => res.status(500).json({ error }));
    }
    if(err){
      res.status(500).json({ error });
    }
  })
};