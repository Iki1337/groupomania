const express = require('express');
const router = express.Router();

const StuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, StuffCtrl.createPost);
router.get('/', auth, StuffCtrl.getAllPosts);
router.delete('/:id', auth, StuffCtrl.deletePost);
router.delete('/:id/deleteUser', auth, StuffCtrl.deleteUser);
router.get('/:id', auth, StuffCtrl.getOneUser);
router.put('/:id', auth, multer, StuffCtrl.modifyUser);
router.put('/:id/like', auth, StuffCtrl.like);
router.post('/:id/comments', auth, StuffCtrl.createComments);
router.get('/:id/search', auth, StuffCtrl.searchUser);
router.post('/messages', auth, StuffCtrl.sendMessage);
router.post('/recup_messages', auth, StuffCtrl.recupMessage);
router.put('/:id/modif_post', auth, StuffCtrl.modifyPost);
router.get('/admin/panel', auth, StuffCtrl.adminPanel);
router.get('/admin/panel_publications', auth, StuffCtrl.adminPanelPubli);
router.get('/admin/panel_publications_attente', auth, StuffCtrl.adminPanelPubliAttente);
router.put('/:id/admin/validatePost', auth, StuffCtrl.adminModeratePost);
router.get('/admin/panel_commentaires', auth, StuffCtrl.adminPanelComments);
router.get('/admin/panel_commentaires_attente', auth, StuffCtrl.adminPanelCommentsAttente);
router.put('/:id/admin/validateCom', auth, StuffCtrl.adminModerateCom);
router.delete('/:id/supprCom', auth, StuffCtrl.deleteCom);
router.get('/admin/panel_users', auth, StuffCtrl.adminPanelUsers);

module.exports = router;