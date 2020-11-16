const fs = require('fs'); // Le paquet fs permet de manipuler les fichiers
const { send } = require('process');
const config = require('../config');
const bcrypt = require('bcrypt');

exports.createPost = (req, res, next) => { // Création d'un post
  let urlsImg = req.files.map(file => `${req.protocol}://${req.get('host')}/images/${file.filename}`);
  const newPost = {
    idUser: req.body.userId,
    date_ecriture:new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
    statut_moderation: 0,
    contenu: req.body.contenu,
    tableau_users_like: null,
    urls_images: JSON.stringify(urlsImg),
  }
  console.log(newPost);
  config.connection.query ('INSERT INTO posts SET?', newPost, function(err, results){
    if(err){
      res.status(500).json({err});
      console.log(err)
    }else{
      res.status(200);
    }
  })
}

exports.getAllPosts = (req, res, next) => { // Récupérer tout les posts validés par un modérateur
  let sql1 =`SELECT users.nom, users.prenom, posts.id, posts.contenu, posts.urls_images, posts.date_ecriture, posts.tableau_users_like FROM posts INNER JOIN users ON posts.idUser = users.id WHERE posts.statut_moderation = 1 ORDER BY posts.date_ecriture DESC`;
  let sql2 =`SELECT * FROM comments WHERE statut_moderation = 1`;

  let sendObject;
  config.connection.query (sql1, function(err, results){
    if(err){
      res.status(500).json({err});
      console.log(err)
    }else{
      sendObject = results;

      config.connection.query (sql2, function(err, results){
        if(err){
          res.status(500).json({err});
          console.log(err)
        }else{
          for (let i = 0; i < sendObject.length; i++) {
            sendObject[i].comments = [];
            for (let j = 0; j < results.length; j++) {
              if (sendObject[i].id == results[j].idPost) {
                sendObject[i].comments.push(results[j]);
              }
            }
          }
          res.status(200).json(sendObject)
        }
      }) 

    }
  })  
}

exports.getOneUser = (req, res, next) => { // Récupérer des infos sur un utilisateurs, tout ses posts, et ses commentaires validés.
  let sendObject = {};
  let sql1 = `SELECT id, nom, prenom, sexe, derniere_connexion, date_inscription, url_photo_profil, url_photo_mur FROM users WHERE id=`+ req.params.id;
  let sql2 = `SELECT posts.id, posts.statut_moderation, posts.contenu, posts.urls_images, posts.date_ecriture, posts.tableau_users_like FROM posts INNER JOIN users ON posts.idUser = users.id WHERE users.id =`+ req.params.id +` ORDER BY posts.date_ecriture DESC`;
  let sql3 =`SELECT * FROM comments WHERE statut_moderation = 1`;
  config.connection.query (sql1, function(err, results){
    if(err){
      console.log(err);
      res.status(500).json({err});
    }else{
      sendObject = {
        id : results[0].id,
        nom : results[0].nom,
        prenom: results[0].prenom,
        sexe: results[0].sexe,
        derniere_connexion: results[0].derniere_connexion,
        date_inscription: results[0].date_inscription,
        url_photo_profil: results[0].url_photo_profil,
        url_photo_mur: results[0].url_photo_mur,
        publications: null,
      };

      config.connection.query (sql2, function(err, results){
        if(err){
          res.status(500).json({err});
          console.log(err);
        }else{
          sendObject.publications = [...results];

          config.connection.query (sql3, function(err, results){
            if(err){
              res.status(500).json({err});
              console.log(err)
            }else{
              for (let i = 0; i < sendObject.publications.length; i++) {
                sendObject.publications[i].comments = [];
                for (let j = 0; j < results.length; j++) {
                  if (sendObject.publications[i].id == results[j].idPost) {
                    sendObject.publications[i].comments.push(results[j]);
                  }
                }
              }
              res.status(200).json(sendObject);
            }
          })
        }
      })
    }
  })
}

exports.modifyUser = (req, res, next) => { // Modifier les données d'un utilisateurs selon le critère souhaité
  if (req.body.modif == 0) { // req.body.modif == 0 => Modification des informations générales
    let sql = `UPDATE users SET nom= ` + `'`+ req.body.nom +  `',` + ` prenom= ` + `'`+ req.body.prenom +  `',` + ` sexe= ` + req.body.genre + ` WHERE id= ` + req.params.id;
    console.log(sql);
    config.connection.query (sql, function(err, results){
      if(err){
        res.status(500).json({err});
        console.log(err)
      }else{
        res.status(200);
      }
    })
  }else if (req.body.modif == 1) { // req.body.modif == 1 => Modification de la photo de profil
    let imageUrl = req.files.map(file => `${req.protocol}://${req.get('host')}/images/${file.filename}`);
    let sql = `UPDATE users SET url_photo_profil=` + `'`+ imageUrl[0] +  `'` + ` WHERE id= ` + req.params.id;
    config.connection.query (sql, function(err, results){
      if(err){
        res.status(500).json({err});
        console.log(err)
      }else{
        res.status(200);
      }
    })
  }else if (req.body.modif == 2) { // req.body.modif == 2 => Modification de la photo de couverture
    let imageUrl = req.files.map(file => `${req.protocol}://${req.get('host')}/images/${file.filename}`);
    let sql = `UPDATE users SET url_photo_mur=` + `'`+ imageUrl[0] +  `'` + ` WHERE id= ` + req.params.id;
    config.connection.query (sql, function(err, results){
      if(err){
        res.status(500).json({err});
        console.log(err)
      }else{
        res.status(200);
      }
    })
  }else if (req.body.modif == 3) { // req.body.modif == 3 => Modification du mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      let sql = `UPDATE users SET password=` + `'`+ hash +  `'` + ` WHERE id= ` + req.params.id;
      config.connection.query (sql, function(err, results){
        if(err){
          res.status(500).json({err});
          console.log(err)
        }else{
          res.status(200);
        }
      })
    })
    .catch(error => res.status(500).json({error}));
  }
}

exports.like = (req, res, next) => { // Ajouter/Retirer un like a une publication en ajoutant/supprimant l'id de l'utilisateur au tableau "tableau_users_like"
  if (req.body.statutLike == 1){
    let sql = `UPDATE posts SET tableau_users_like = CASE WHEN tableau_users_like IS NULL THEN '["` + req.body.idUser + `"]' ELSE JSON_ARRAY_APPEND(tableau_users_like, '$', "` + req.body.idUser + `") END WHERE id= ` + req.params.id;
    config.connection.query (sql, function(err, results){
      if(err){
        res.status(500).json({err});
        console.log(err)
      }else{
        res.status(200);
      }
    })
  }else if(req.body.statutLike == -1){
    let sql = `UPDATE posts SET tableau_users_like = JSON_REMOVE(tableau_users_like, replace(json_search(tableau_users_like, 'one', ` + req.body.idUser + `), '"', '')) WHERE id= ` + req.params.id;
    config.connection.query (sql, function(err, results){
      if(err){
        res.status(500).json({err});
        console.log(err)
      }else{
        res.status(200);
      }
    })
  }
}

exports.createComments = (req, res, next) => { // Ajouter un commentaire a une publication
  console.log(req.params.id)
  console.log(req.body)
  let newComment = {
    idUser: req.body.idUser,
    idPost: req.params.id,
    nom: req.body.nom,
    prenom: req.body.prenom,
    date_ecriture: new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
    statut_moderation: 0,
    contenu: req.body.contenu
  }
  config.connection.query ('INSERT INTO comments SET?', newComment, function(err, results){
    if(err){
      res.status(500).json({err});
    }else{
      res.status(200);
    }
  })
}

exports.deletePost = (req, res, next) => { // Supprimer une publication et tout les commentaires liés à celle-ci
  let sql1 = `DELETE FROM comments WHERE idPost= `+req.params.id;
  let sql2 = `DELETE FROM posts WHERE id= `+req.params.id;
  config.connection.query (sql1, function(err, results){
    if(err){
      res.status(500).json({err});
      console.log(err)
    }else{
      config.connection.query (sql2, function(err, results){
        if(err){
          res.status(500).json({err});
          console.log(err)
        }else{
          res.status(200);
        }
      })
    }
  })
}

exports.searchUser = (req, res, next) => { // Rechercher un utilisateur dans la table users grâce à son nom
  let sql = `SELECT id, nom, prenom, url_photo_profil FROM users WHERE MATCH(nom) AGAINST ('`+ req.params.id +`')`;
  config.connection.query (sql, function(err, results){
    if(err){
      res.status(500).json({err});
      console.log(err)
    }else{
      res.status(200).json(results);
    }
  })
}

exports.deleteUser = (req, res, next) => { // Supprimer un utilisateur, tout ses posts, tout ses commentaires, tout ses messages
  let sql1 = `DELETE FROM comments WHERE idUser= `+req.params.id;
  let sql2 = `DELETE FROM posts WHERE idUser= `+req.params.id;
  let sql3 = `DELETE FROM messages WHERE idEnvoyeur= `+req.params.id+` OR idDestinataire=` +req.params.id;
  let sql4 = `DELETE FROM users WHERE id= `+req.params.id;
  config.connection.query (sql1, function(err, results){
    if(err){
      res.status(500).json({err});
      console.log(err)
    }else{
      config.connection.query (sql2, function(err, results){
        if(err){
          res.status(500).json({err});
          console.log(err)
        }else{
          config.connection.query (sql3, function(err, results){
            if(err){
              res.status(500).json({err});
              console.log(err)
            }else{
              config.connection.query (sql4, function(err, results){
                if(err){
                  res.status(500).json({err});
                  console.log(err)
                }else{
                  res.status(200);
                }
              })
            }
          })
        }
      })
    }
  })
}

exports.sendMessage = (req, res, next) => { // Envoyer un message en prenant en compte l'id du destinataire et celui de l'emetteur
  const newMessage = {
    idEnvoyeur: req.body.idExpediteur,
    idDestinataire: req.body.idDestinataire,
    date_ecriture: new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
    contenu: req.body.contenu,
  }
  config.connection.query ('INSERT INTO messages SET?', newMessage, function(err, results){
    if(err){
      res.status(500).json({err});
    }else{
      res.status(200);
    }
  })
}

exports.recupMessage = (req, res, next) => { // Récupérer tout les messages d'une conversation
  let sql = `SELECT * FROM messages WHERE (idEnvoyeur= ` + req.body.idExpediteur + ` AND idDestinataire= ` + req.body.idDestinataire + `) OR (idEnvoyeur= ` + req.body.idDestinataire + ` AND idDestinataire= ` + req.body.idExpediteur + `) ORDER BY date_ecriture ASC`;
  config.connection.query (sql, function(err, results){
    if(err){
      res.status(500).json({err});
    }else{
      res.status(200).json(results);
    }
  })
}

exports.modifyPost = (req, res, next) => { // Modifier le contenu d'un post, et remettre son statut de modération à 0
  let sql = `UPDATE posts SET contenu = '` + req.body.modif + `', statut_moderation = '0' WHERE id= `+req.params.id;
  config.connection.query (sql, function(err, results){
    if(err){
      res.status(500).json({err});
    }else{
      res.status(200).json(results);
    }
  })
}

exports.adminPanel = (req, res, next) => { // Afficher les informations du panel du modérateur : Le nombre d'utilisateurs, de posts, et de commentaires, les 5 derniers posts, et les 5 derniers commentaires.
  let sql = `SELECT (SELECT COUNT(*) FROM users) as nbUser, (SELECT COUNT(*) FROM posts) as nbPosts, (SELECT COUNT(*) FROM comments) as nbComments`;
  let sql2 = `SELECT users.nom, users.prenom, users.url_photo_profil, posts.id, posts.contenu, posts.urls_images, posts.date_ecriture, posts.tableau_users_like, posts.statut_moderation FROM posts INNER JOIN users ON posts.idUser = users.id ORDER BY posts.date_ecriture DESC LIMIT 5`;
  let sql3 = `SELECT comments.id AS commentsId, comments.idUser AS commentsIdUser, comments.idPost AS commentsIdPost, comments.nom AS commentsNom, comments.prenom AS commentsPrenom, comments.date_ecriture AS commentsDateEcriture, comments.contenu AS commentsContenu, comments.statut_moderation AS commentsStatutModeration, posts.contenu AS postsContenu, posts.urls_images AS postsUrlImages, posts.date_ecriture AS postsDateEcriture, users.nom AS usersNom, users.prenom AS usersPrenom, users.url_photo_profil AS usersUrlPhotoProfil FROM (comments INNER JOIN posts ON comments.idPost = posts.id) INNER JOIN users ON posts.idUser = users.id ORDER BY comments.date_ecriture DESC LIMIT 5`;
  let sendObject = {}
  config.connection.query (sql, function(err, results){
    if(err){
      res.status(500).json({err});
      console.log(err)
    }else{
      sendObject.nbUser = results[0].nbUser;
      sendObject.nbPosts = results[0].nbPosts;
      sendObject.nbComments = results[0].nbComments;

      config.connection.query (sql2, function(err, results){
        if(err){
          res.status(500).json({err});
          console.log(err)
        }else{
          sendObject.tableauPubli = results;
          config.connection.query (sql3, function(err, results){
            if(err){
              res.status(500).json({err});
              console.log(err)
            }else{
              sendObject.tableauComments = results;
              res.status(200).json(sendObject)
            }
          })
        }
      })
    }
  })
}

exports.adminPanelPubli = (req, res, next) => { // Afficher toutes les informations necessaires à l'admin concernant les posts déjà modérés
  let sql = `SELECT users.nom, users.prenom, users.url_photo_profil, posts.id, posts.contenu, posts.urls_images, posts.date_ecriture, posts.tableau_users_like, posts.statut_moderation FROM posts INNER JOIN users ON posts.idUser = users.id WHERE posts.statut_moderation = 1 ORDER BY posts.date_ecriture DESC`;
  config.connection.query (sql, function(err, results){
    if(err){
      res.status(500).json({err});
      console.log(err)
    }else{
      res.status(200).json(results)
    }
  })
}

exports.adminPanelPubliAttente = (req, res, next) => { // Afficher toutes les informations necessaires à l'admin concernant les posts en attente de modération
  let sql = `SELECT users.nom, users.prenom, users.url_photo_profil, posts.id, posts.contenu, posts.urls_images, posts.date_ecriture, posts.tableau_users_like, posts.statut_moderation FROM posts INNER JOIN users ON posts.idUser = users.id WHERE posts.statut_moderation = 0 ORDER BY posts.date_ecriture DESC`;
  config.connection.query (sql, function(err, results){
    if(err){
      res.status(500).json({err});
      console.log(err)
    }else{
      res.status(200).json(results)
    }
  })
}

exports.adminModeratePost = (req, res, next) => { // Valider un post en mettant son statut de moderation à 1
  let sql = `UPDATE posts SET statut_moderation = 1 WHERE id= ` + req.params.id ;
  config.connection.query (sql, function(err, results){
    if(err){
      res.status(500).json({err});
      console.log(err)
    }else{
      res.status(200).json(results)
    }
  })
}

exports.adminPanelComments = (req, res, next) => { // Afficher toutes les informations necessaires à l'admin concernant les commentaires déjà modérés
  let sql = `SELECT comments.id AS commentsId, comments.idUser AS commentsIdUser, comments.idPost AS commentsIdPost, comments.nom AS commentsNom, comments.prenom AS commentsPrenom, comments.date_ecriture AS commentsDateEcriture, comments.contenu AS commentsContenu, comments.statut_moderation AS commentsStatutModeration, posts.contenu AS postsContenu, posts.urls_images AS postsUrlImages, posts.date_ecriture AS postsDateEcriture, users.nom AS usersNom, users.prenom AS usersPrenom, users.url_photo_profil AS usersUrlPhotoProfil FROM (comments INNER JOIN posts ON comments.idPost = posts.id) INNER JOIN users ON posts.idUser = users.id WHERE comments.statut_moderation = 1 ORDER BY comments.date_ecriture DESC`;
  config.connection.query (sql, function(err, results){
    if(err){
      res.status(500).json({err});
      console.log(err)
    }else{
      res.status(200).json(results)
    }
  })
}

exports.adminPanelCommentsAttente= (req, res, next) => { // Afficher toutes les informations necessaires à l'admin concernant les commentaires en attente de modération
  let sql = `SELECT comments.id AS commentsId, comments.idUser AS commentsIdUser, comments.idPost AS commentsIdPost, comments.nom AS commentsNom, comments.prenom AS commentsPrenom, comments.date_ecriture AS commentsDateEcriture, comments.contenu AS commentsContenu, comments.statut_moderation AS commentsStatutModeration, posts.contenu AS postsContenu, posts.urls_images AS postsUrlImages, posts.date_ecriture AS postsDateEcriture, users.nom AS usersNom, users.prenom AS usersPrenom, users.url_photo_profil AS usersUrlPhotoProfil FROM (comments INNER JOIN posts ON comments.idPost = posts.id) INNER JOIN users ON posts.idUser = users.id WHERE comments.statut_moderation = 0 ORDER BY comments.date_ecriture DESC`;
  config.connection.query (sql, function(err, results){
    if(err){
      res.status(500).json({err});
      console.log(err)
    }else{
      res.status(200).json(results)
    }
  })
}

exports.adminModerateCom = (req, res, next) => { // Valider un commentaire en mettant son statut de moderation à 1
  let sql = `UPDATE comments SET statut_moderation = 1 WHERE id= ` + req.params.id ;
  config.connection.query (sql, function(err, results){
    if(err){
      res.status(500).json({err});
      console.log(err)
    }else{
      res.status(200).json(results)
    }
  })
}

exports.deleteCom = (req, res, next) => { // Supprimer un commentaire
  let sql = `DELETE FROM comments WHERE id= ` + req.params.id;
  config.connection.query (sql, function(err, results){
    if(err){
      res.status(500).json({err});
      console.log(err)
    }else{
      res.status(200).json(results)
    }
  })
}

exports.adminPanelUsers = (req, res, next) => { // Afficher toutes les informations de tout les utilisateurs
  let sql = `SELECT * FROM users`;
  config.connection.query (sql, function(err, results){
    if(err){
      res.status(500).json({err});
      console.log(err)
    }else{
      res.status(200).json(results)
    }
  })
}