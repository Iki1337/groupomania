<template>
<FingerprintSpinner v-if = "this.loading == true"></FingerprintSpinner>
  <div id="settings" v-if = "this.loading == false">

    <ul class="menuSelectionSettings">
      <li class="onglet" @click="this.fenetreModif = 0">Informations générales</li>
      <li>|</li>
      <li class="onglet" @click="this.fenetreModif = 1">Photo de profil</li>
      <li>|</li>
      <li class="onglet" @click="this.fenetreModif = 2">Photo de couverture</li>
      <li>|</li>
      <li class="onglet" @click="this.fenetreModif = 3">Mot de passe</li>
      <li>|</li>
      <li class="onglet supprCompteTitre" @click="this.fenetreModif = 4"><span style="color:red;">Supprimer le compte</span></li>
    </ul>

    <transition appear name="fade" mode="out-in">
    <div class="box" v-if="fenetreModif == 0" key="modifProfil">
      <h2>Informations générales</h2>
      <form name="modifProfilForm" onsubmit="return false;">

        <div class="inputBox">
          <input type="text" v-model="nom" id="nom">
          <label>Nom</label>
        </div>

        <div class="inputBox">
          <input type="text" v-model="prenom" id="prenom">
          <label>Prénom</label>
        </div>

        <div class="inputBox">
          <select class="menuGenre" v-model="genre">
            <option value="0">Homme 👦</option>
            <option value="1">Femme 👩</option>
            <option value="2">Autre</option>
          </select>
          <label>Genre</label>
        </div>

        <input type="submit" name="" value="Valider" @click="recuperationModifProfilForm">

      </form>
      
    </div>

    <div class="box" v-else-if="fenetreModif == 1" key="modifPhotoProfil">
      <h2><i class="fas fa-images"></i> Nouvelle photo de profil</h2>
      <form name="modifPhotoProfilForm" onsubmit="return false;">

        <div class="inputBox boxPhotoProfil">

          <input type="file" id="uploadImg" name="uploadImg" accept="image/png, image/jpeg" @change="handleFiles()">
        </div>
        <div id="previewSettings"></div>

        <input type="submit" name="" value="Valider" @click="envoiModifPhotoProfil">

      </form>
      
    </div>

    <div class="box" v-else-if="fenetreModif == 2" key="modifPhotoMur">
      <h2><i class="fas fa-images"></i >Photo de couverture</h2>
      <form name="modifPhotoMurForm" onsubmit="return false;">

        <div class="inputBox boxPhotoMur">

          <input type="file" id="uploadImg" name="uploadImg" accept="image/png, image/jpeg" @change="handleFiles()">
        </div>
        <div id="previewSettings"></div>

        <input type="submit" name="" value="Valider" @click="envoiModifPhotoMur">

      </form>
      
    </div>

    <div class="box" v-else-if="fenetreModif == 3" key="modifPassword">
      <h2>Nouveau mot de passe</h2>
      <form name="modifPasswordForm" onsubmit="return false;">

        <div class="inputBox">
          <input type="password" v-model="password" id="password">
          <label>Nouveau mot de passe</label>
        </div>

        <input type="submit" name="" value="Valider" @click="recuperationModifPasswordForm">

      </form>
      
    </div>

    <div class="box" v-else-if="fenetreModif == 4" key="deleteUser">
      <h2>Supprimer le compte</h2>
      <form name="deleteUserForm" onsubmit="return false;">

        <div class="inputBox inputDelete">
          <input id="deleteUser" type="submit" value="Supprimer" @click="deleteUser">
          <label style="color:red;">Cette action est irreversible.</label>
        </div>

      </form>
      
    </div>
    </transition>
  </div>
</template>

<style scoped>

.menuSelectionSettings{
  color: white;
  list-style: none;
  text-align: center;
  font-family: 'Poppins', sans-serif;
}

.menuSelectionSettings li{
  display:inline-block;
  margin: auto 5px;
  transition: .5s;
}

.menuSelectionSettings .onglet:hover{
  color: rgb(255, 106, 0);
  cursor: pointer;
}

.box{
  margin: 50px auto;
  width: 375px;
  padding: 40px;
  background: rgba(0, 0, 0, 0.8);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  font-family: 'Open Sans', sans-serif;
}

@media screen and (max-width: 640px) {
  .box {
    width: 100%;
    font-size:13px
  }
}

.box h2{
  margin: 0 0 30px;
  padding: 0;
  color: #ffffff;
  text-align: center;
  font-family: 'Poppins', sans-serif;
}

.box .inputBox{
  position: relative;
}

.box .inputBox input{
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #ffffff;
  letter-spacing: 1px;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #ffffff;
  outline: none;
  background: transparent;
}

.box .inputBox label{
  position: absolute;
  top:-27px;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #ffffff;
  pointer-events: none;
  transition: .5s;
}

.box .photoMur{
  width: 100%;
  margin: 20px auto;
  border: 3px solid white;
}

.box .inputBox .menuGenre{
  transition: .5s;
  padding: 10px 20px;
  width: 100%;
  background: transparent;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #ffffff;
  outline: none;
  font-size: 16px;
  color: #ffffff;
}

.box .inputBox input:focus ~ label, .box .inputBox .menuGenre:focus ~ label{
  left: 0;
  color: rgb(255, 106, 0);
  font-size: 12px;
}

.box input[type="submit"]{
  background: transparent;
  border:none;
  outline:none;
  color: #000000;
  background: rgb(255, 106, 0);
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.5s;
}

.box input[type="submit"]:hover{
  opacity: 0.7;
}

.box .formP{
  color: #ffffff;
  font-size: 12px;
}

.box .formP .lienOrange{
  color: rgb(255, 106, 0);
  cursor: pointer;
}

#previewSettings{
  width: 100%;
  text-align: center;
}

#previewSettings >>> .previewSettingsImg{
  width: 300px;
  margin: 20px auto;
  border: 5px solid white;
}

.inputDelete{
  text-align: center;
}

#deleteUser{
  width: 120px;
  margin-top: 70px;
  background-color: red;
}

.supprCompteTitre{
  background-color: #000;
  box-shadow: black 0px 0px 5px;
  padding: 5px;
}

.fade-enter-active{
  animation: fade 0.7s;
}

.fade-leave-active {
  animation: fade 0.7s reverse;
}

@keyframes fade {
  0% {
    opacity: 0;
  }100% {
    opacity: 1;
  }
}
  
</style>

<script>
import axios from 'axios'
import FingerprintSpinner from '../components/fingerprint-spinner'

export default {
  name: 'Settings',
  components: {
    FingerprintSpinner,
  },
  data() {
    return {
      loading: true,
      fenetreModif: 0,

      nom: null,
      prenom: null,
      password: null,
      genre: null,
      url_photo_mur: null,
      url_photo_profil: null,

      nomValide: false,
      prenomValide: false,
      passwordValide: false,

      sendModifProfil: {},
      sendModifPassword: {},
    }
  },
  beforeMount() {
    if(this.$store.state.connexion == true){
      document.getElementById("conteneur").style.marginLeft = "60px";
    }else{
      this.$router.push({ name: 'Auth' });
    }
  },
  mounted() { // Récupération de données du profil de l'utilisateur
    axios
      .get("http://localhost:3000/api/stuff/" + this.$store.state.userId, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(response => {
        this.nom = response.data.nom;
        this.prenom = response.data.prenom;
        this.genre = response.data.sexe;
        this.url_photo_mur = response.data.url_photo_mur;
        this.url_photo_profil = response.data.url_photo_profil;

        this.loading = false;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods: {
    handleFiles(){ // Cette fonction permet d'avoir une miniature des fichiers qui vont être uploadés même si ils ne possèdent pas encore d'URLs
      document.getElementById("previewSettings").innerHTML="";
      let files = document.getElementById("uploadImg").files;
      for (let i = 0; i < files.length; i++) {
        let img = document.createElement("img");
        img.classList.add("previewSettingsImg");
        img.file = files[i];
        document.getElementById("previewSettings").appendChild(img);
        var reader = new FileReader();
        reader.onload = ( function(aImg) {
          return function(e) {
            aImg.src = e.target.result; 
          };
        })(img);
        reader.readAsDataURL(files[i]);
      }
    },
    recuperationModifProfilForm(){ // On récupère les informations du profil et on vérifie qu'elles sont conformes
      if (this.nom && this.prenom) {

         if (/^([a-zA-Z]){2,15}$/.test(this.nom)) {
           this.nomValide = true;
         }else{
           document.getElementById("nom").setCustomValidity("Champ invalide");
           this.nomValide = false;
         }

         if (/^([a-zA-Z]){2,15}$/.test(this.prenom)) {
           this.prenomValide = true;
         }else{
           document.getElementById("prenom").setCustomValidity("Champ invalide");
           this.prenomValide = false;
         }
         
         if(this.nomValide && this.prenomValide){
           this.sendModifProfil = {nom : this.nom, prenom : this.prenom, genre: this.genre}
           this.envoiModifProfil();
          }         
      }
    },
    recuperationModifPasswordForm(){ // On récupère le nouveau mdp et on vérifie qu'il soit conforme
      if (this.password) {
        if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(this.password)) {
           this.passwordValide = true;
        }else{
           document.getElementById("password").setCustomValidity("Votre mot de passe doit comporter au moins huit caractères, une lettre et un chiffre");
           this.passwordValide = false;
        }

        if(this.passwordValide){
          this.sendModifPassword = {password: this.password}
          this.envoiModifPassword();
        }       
         
      }
    },
    envoiModifProfil(){ // Envoi des modifications du profil via une requete PUT
      let formData = new FormData();
      formData.append('modif', 0);
      formData.append('nom', this.sendModifProfil.nom);
      formData.append('prenom', this.sendModifProfil.prenom);
      formData.append('genre', this.sendModifProfil.genre);

      axios
      .put("http://localhost:3000/api/stuff/"  + this.$store.state.userId, formData, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(
        alert("Modifications sauvegardées !"),
        window.location.reload()
      )
      .catch(function (error) {
        console.log(error); 
      });
    },
    envoiModifPhotoProfil(){ // Envoi des modifications de la photo de profil via une requete PUT
      let input = document.getElementById("uploadImg");
      let file = input.files;
      let formData = new FormData();
      formData.append('modif', 1);
      formData.append('image', file[0]);

      axios
      .put("http://localhost:3000/api/stuff/"  + this.$store.state.userId, formData, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(
        alert("Modifications sauvegardées !"),
        window.location.reload()
      )
      .catch(function (error) {
        console.log(error); 
      });
    },

    envoiModifPhotoMur(){ // Envoi des modifications de la photo du mur via une requete PUT
      console.log("Coucou !")
      let input = document.getElementById("uploadImg");
      let file = input.files;
      let formData = new FormData();
      formData.append('modif', 2);
      formData.append('image', file[0]);

      axios
      .put("http://localhost:3000/api/stuff/"  + this.$store.state.userId, formData, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(
        alert("Modifications sauvegardées !"),
        window.location.reload()
      )
      .catch(function (error) {
        console.log(error); 
      });
    },
    envoiModifPassword(){ // Envoi des modifications du mdp via une requete PUT
      let formData = new FormData();
      formData.append('modif', 3);
      formData.append('password', this.sendModifPassword.password);

      axios
      .put("http://localhost:3000/api/stuff/"  + this.$store.state.userId, formData, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(
        alert("Modifications sauvegardées !"),
        window.location.reload()
      )
      .catch(function (error) {
        console.log(error); 
      });
    },
    deleteUser(){ // Supression d'un utilisateur via une requete DELETE
      console.log(this.$store.state.userId)
      axios
      .delete('http://localhost:3000/api/stuff/' + this.$store.state.userId + '/deleteUser', {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(
        alert("Compte supprimée"),
        this.$router.push({ name: 'Auth' })
      )
      .catch(function (error) {
        console.log(error);
      });
    },
  },
  
}
</script>