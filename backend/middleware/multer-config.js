const multer = require('multer');

const MIME_TYPES = { // Types d'images reconnues
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => { // Va stocker les images dans un dossier "images"
    callback(null, 'images');
  },
  filename: (req, file, callback) => { // Configure le nom des fichiers
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//module.exports = multer({storage: storage}).single('image');
module.exports = multer({storage: storage}).array('image',10); // Tableau appelé image, capacité maximale de 10 images. Le FormData qui enverra l' (les) image(s) par requette POST doit donc l'integrer de cette manière : formData.append('image', file); L'attribut 'image' du formData faisant echo au [...].array('image', 10) de multer.