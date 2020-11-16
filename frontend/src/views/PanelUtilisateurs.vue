<template>
<FingerprintSpinner v-if = "this.loading == true"></FingerprintSpinner>
  <div class="panelUtilisateurs" v-if = "this.loading == false">
    <div class="inputSearchBox">
      <input id="inputSearchAdmin" type="search" placeholder="Rechercher un utilisateur" v-model="searchUser">
    </div>
    <ul class="tableauUsers">
      <li class="ligneTableau" v-for="user in usersSearched" :key="user" @click="modaleAdmin(user.id, user.prenom, user.nom, user.url_photo_mur, user.url_photo_profil, user.email, user.sexe, user.date_inscription, user.derniere_connexion)">
        <p>ID: {{ user.id }}</p><span class="photoProfil"><img :src="user.url_photo_profil" alt=""></span> <p class="prenom">{{ user.prenom }}</p> <p class="nom">{{ user.nom }}</p><p class="date">{{ new Date(user.date_inscription).toLocaleString('fr-FR', { hour12: false }) }}</p>
      </li>
    </ul>

    <div class="containerTriangle" v-if = "this.users.length == 0">
      <i class="fas fa-exclamation-triangle"></i>
      <p>Rien à afficher pour le moment...</p>
    </div>

    <div id="containerModal">
      <span onclick="this.parentElement.style.display='none'" class="closebtn">&times;</span>
      <div id="contenuModal">
        <div id="containerPhotoMur"></div>
        <div id="containerPhotoProfil"></div>

        <hr class="case1Hr">
        <h2 id="containerTitre"></h2>
        <hr class="case1Hr">

        <div id="containerGeneral"></div>

        <div id="containerCom"></div>
        <span @click="supprUser()"><i class="fas fa-ban"></i></span>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
.inputSearchBox{
  width: 100%;
  text-align:center;
}

#inputSearchAdmin{
  width: 50%;
  padding: 0 10px;
  height: 30px;
  text-align: start;
  border: none;
  border-radius: 50px;
  color: #ffffff;
  background-color:#494949;
}

.tableauUsers{
  width: 70%;
  margin: 50px auto;
  list-style: none;
  font-family: 'Inconsolata', monospace;
  color: white;
}

.ligneTableau{
  width: 100%;
  margin: 20px auto;
  background-color: #494949;
  cursor: pointer;
  transition: .3s;
}

.ligneTableau:hover{
  background-color: #616161;
  box-shadow: 0 0 10px #2196f3, 0 0 40px #2196f3, 0 0 80px  #2196f3;
}

.ligneTableau p{
  display: inline-block;
}

.photoProfil{
  display: inline-block;
  text-align: center;
  margin-left: 10px;
  width: 5%;
  min-width: 60px;
}

.photoProfil img{
  width: 30px;
  height: 30px;
  border:solid white 1px;
  border-radius: 100px;
  vertical-align: middle;
}

.prenom, .nom{
  min-width: 5%;
  width: 7%;
}

.date{
  float: right;
}

#containerModal{
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.9);
  overflow-y: scroll;
}

#containerModal h2{
  color: white;
  font-family: 'Open Sans', sans-serif;
}

#contenuModal{
  width: 70%;
  background-color: #494949;
  margin: 50px auto;
  padding: 20px;
  border-radius: 10px;
}

#containerPhotoMur{
  width: 100%;
}

#containerPhotoMur >>> img{
  width: 60%;
}

#containerPhotoProfil >>> img{
  width: 150px;
  height: 150px;
  border-radius: 500px;
  border: white 5px solid;
  margin-top: -90px;
}

#containerCom >>> p{
  font-family: 'Open Sans', sans-serif;
  color: white;
}

#containerModal .fa-ban{
  color: white;
  font-size: 70px;
  cursor: pointer;
  transition: .3s;
  margin: 20px 50px;
}

#containerModal .fa-ban:hover{
  color:  rgb(200, 0, 0);
}

#containerGeneral{
  margin: 40px auto;
  color: white;
  font-family: 'Open Sans', sans-serif;
  font-size: 20px;
  width: 100%;
  text-align: center;
}

#containerGeneral >>> ul{
  list-style:none;
  text-align: left;
  width: 50%;
  margin: auto;
}

.containerTriangle{
  width: 100%;
  text-align: center;
  color: #ffffff;
}

.fa-exclamation-triangle{
  font-size: 18em;
}

.containerTriangle p{
  font-size: 30px;
  font-family: 'Open Sans', sans-serif;
}

@media screen and (max-width: 1000px) {
  .date{
    float: inherit;
  }
}
</style>


<script>
import axios from 'axios'
import FingerprintSpinner from '../components/fingerprint-spinner'

export default {
  name: 'AdminPanelUtilisateurs',
  components: {
    FingerprintSpinner,
  },
  data() {
    return {
      loading: true,
      users: [],
      searchUser:'',
      idUser: null,
    }
  },
  beforeMount() {
    if(this.$store.state.connexionAdmin == false){
      this.$router.push({ name: 'Auth' });
    }

  },
  mounted(){ // Obtenir les informations des utilisateurs
    axios
    .get('http://localhost:3000/api/stuff/admin/panel_users/', {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(response => {
        this.loading = false;
        this.users = response.data;
        console.log(this.users)
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods:{
    modaleAdmin(userId, userPrenom, userNom, userUrlPhotoMur, userUrlPhotoProfil, userEmail, userSexe, userDateInscription, userDerniereConnexion){ // Crée une modale en HTML dans laquelle on va obtenir plus d'info sur l'utilisateur
      this.idUser = userId;
      document.getElementById('containerModal').style.display='block';

      var containerPhotoMur = document.getElementById("containerPhotoMur");
      containerPhotoMur.innerHTML= "";
      var img = document.createElement("img");
      img.setAttribute("src", userUrlPhotoMur);
      img.setAttribute("alt", "image Mur");
      img.setAttribute("class", "imageMur");
      containerPhotoMur.appendChild(img);

      var containerPhotoProfil = document.getElementById("containerPhotoProfil");
      containerPhotoProfil.innerHTML= "";
      var img2 = document.createElement("img");
      img2.setAttribute("src", userUrlPhotoProfil);
      img2.setAttribute("alt", "image profil");
      img2.setAttribute("class", "imageProfil");
      containerPhotoProfil.appendChild(img2);

      var containerTitre = document.getElementById("containerTitre");
      containerTitre.innerHTML= userPrenom + " " + userNom;

      var containerGeneral = document.getElementById("containerGeneral");
      containerGeneral.innerHTML= "";
      var ul = document.createElement("ul");
      var li1 = document.createElement("li");
      li1.innerHTML= "Email : " + userEmail;
      ul.appendChild(li1);
      var li2 = document.createElement("li");
      switch (userSexe) {
        case 0:
          li2.innerHTML= "Sexe : Homme";
          break;
        
        case 1:
          li2.innerHTML= "Sexe : Femme";
          break;
        
        case 2:
          li2.innerHTML= "Sexe : Autre";
          break;
      
        default:
          break;
      }
      ul.appendChild(li2);
      var li3 = document.createElement("li");
      li3.innerHTML= "Date d'inscription : " + new Date(userDateInscription).toLocaleString('fr-FR', { hour12: false });
      ul.appendChild(li3);
      var li4 = document.createElement("li");
      li4.innerHTML= "Derniere connexion : " + new Date(userDerniereConnexion).toLocaleString('fr-FR', { hour12: false });
      ul.appendChild(li4);
      containerGeneral.appendChild(ul);
    },
    supprUser(){ // Supprime l'utilisateur via une requete delete

      axios
      .delete('http://localhost:3000/api/stuff/' + this.idUser + "/deleteUser", {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(
        alert("Compte supprimé !"),
        document.getElementById('containerModal').style.display='none',
        setTimeout(() => {  window.location.reload() }, 1000),
      )
      .catch(function (error) {
        console.log(error); 
      });
    },
  },
  computed: {
    usersSearched : function(){ // Filtrage des utilisateurs en fonction du nom tapé par le modérateur dans la barre de recherche
      return this.users.filter(user => {
        return user.nom.toLowerCase().includes(this.searchUser.toLowerCase())
      })
    }
  },
}
</script>