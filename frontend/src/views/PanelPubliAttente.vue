<template>
<FingerprintSpinner v-if = "this.loading == true"></FingerprintSpinner>
  <div class="panelPubliAttente" v-if = "this.loading == false">
    <ul class="tableauArticle">
      <li class="ligneTableau" v-for="publication in publications" :key="publication" @click="modaleAdmin(publication.id, publication.prenom, publication.nom, publication.contenu, publication.urls_images, publication.statut_moderation)">
        <span class="photoProfil"><img :src="publication.url_photo_profil" alt=""></span> <p class="prenom">{{ publication.prenom }}</p> <p class="nom">{{ publication.nom }}</p> <p class="contenu">{{ publication.contenu.substr(0, 20) }}...</p> <p class="date">{{ new Date(publication.date_ecriture).toLocaleString('fr-FR', { hour12: false })}}</p>
      </li>
    </ul>

    <div class="containerTriangle" v-if = "this.publications.length == 0">
      <i class="fas fa-exclamation-triangle"></i>
      <p>Rien à afficher pour le moment...</p>
    </div>

    <div id="containerModal">
      <span onclick="this.parentElement.style.display='none'" class="closebtn">&times;</span>
      <div id="contenuModal">
        <hr class="case1Hr">
        <h2 id="containerTitre"></h2>
        <hr class="case1Hr">

        <div id="containerPublication"></div>
        <div id="containerImg"></div>
        <span @click="validerPubli()"><i class="fas fa-check"></i></span><span @click="supprPubli()"><i class="fas fa-times"></i></span>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
.tableauArticle{
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
  box-shadow: 0 0 10px rgb(255, 106, 0), 0 0 40px rgb(255, 106, 0), 0 0 80px rgb(255, 106, 0);
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

#containerPublication >>> p{
  font-family: 'Open Sans', sans-serif;
  color: white;
}

#containerImg >>> .imagePublication{
  width: 20%;
}

#containerModal .fa-check, #containerModal .fa-times{
  color: white;
  font-size: 70px;
  cursor: pointer;
  transition: .3s;
  margin: 20px 50px;
}

#containerModal .fa-check:hover{
  color:  rgb(0, 150, 0);
}

#containerModal .fa-times:hover{
  color:  rgb(200, 0, 0);
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
  name: 'AdminPanelPubliAttente',
  components: {
    FingerprintSpinner,
  },
  data() {
    return {
      loading: true,
      publications: [],
      idPublication: null,
      publicationStatut_moderation: null,
    }
  },
  beforeMount() {
    if(this.$store.state.connexionAdmin == false){
      this.$router.push({ name: 'Auth' });
    }

  },
  mounted(){ // Obtenir tout les posts pas encore validés 
    axios
    .get('http://localhost:3000/api/stuff/admin/panel_publications_attente/', {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(response => {
        this.loading = false;
        this.publications = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods:{
    modaleAdmin(publicationId, publicationPrenom, publicationNom, publicationContenu, publicationUrls_images, publicationStatut_moderation){ // Crée une modale en HTML dans laquelle on va obtenir plus d'info sur le post
      this.idPublication = publicationId;
      this.publicationStatut_moderation = publicationStatut_moderation;

      document.getElementById('containerModal').style.display='block';

      var containerTitre = document.getElementById("containerTitre");
      containerTitre.innerHTML= publicationPrenom + " " + publicationNom;
      
      var containerPublication = document.getElementById("containerPublication");
      containerPublication.innerHTML= "";
      var p = document.createElement("p");
      p.innerHTML= publicationContenu;
      containerPublication.appendChild(p);

      var containerImg = document.getElementById("containerImg");
      containerImg.innerHTML= "";
      var images = JSON.parse(publicationUrls_images);
      for (let i = 0; i < images.length; i++) {
        var img = document.createElement("img");
        img.setAttribute("src", images[i]);
        img.setAttribute("alt", "image publication");
        img.setAttribute("class", "imagePublication");
        containerImg.appendChild(img);
      }
    },
    validerPubli(){ // Modifie le statut de modération à 1 du post via une requete PUT

      let sendObject = {
        publicationStatut_moderation: this.publicationStatut_moderation,
      }

      axios
      .put("http://localhost:3000/api/stuff/"  + this.idPublication + "/admin/validatePost", sendObject,{
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(
        alert("Publication validée !"),
        document.getElementById('containerModal').style.display='none',
        setTimeout(() => {  window.location.reload() }, 1000),
      )
      .catch(function (error) {
        console.log(error); 
      });
    },
    supprPubli(){ // Supprime le post via une requete delete

      axios
      .delete('http://localhost:3000/api/stuff/' + this.idPublication, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(
        alert("Publication supprimée !"),
        document.getElementById('containerModal').style.display='none',
        setTimeout(() => {  window.location.reload() }, 1000),
      )
      .catch(function (error) {
        console.log(error); 
      });
    },
  },
}
</script>