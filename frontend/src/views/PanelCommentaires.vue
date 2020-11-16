<template>
<FingerprintSpinner v-if = "this.loading == true"></FingerprintSpinner>
  <div class="panelCommentaires" v-if = "this.loading == false">
    <ul class="tableauArticle">
      <li class="ligneTableau" v-for="commentaire in commentaires" :key="commentaire" @click="modaleAdmin(commentaire.commentsId, commentaire.commentsPrenom, commentaire.commentsNom, commentaire.commentsContenu, commentaire.commentsStatutModeration, commentaire.postsContenu, commentaire.postsDateEcriture, commentaire.postsUrlImages, commentaire.usersNom, commentaire.usersPrenom)">
        <p class="prenom">{{ commentaire.commentsPrenom }}</p> <p class="nom">{{ commentaire.commentsNom }}</p> <p class="contenu">{{ commentaire.commentsContenu.substr(0, 20) }}...</p> <p class="date">{{ new Date(commentaire.commentsDateEcriture).toLocaleString('fr-FR', { hour12: false }) }}</p>
      </li>
    </ul>

    <div class="containerTriangle" v-if = "this.commentaires.length == 0">
      <i class="fas fa-exclamation-triangle"></i>
      <p>Rien à afficher pour le moment...</p>
    </div>

    <div id="containerModal">
      <span onclick="this.parentElement.style.display='none'" class="closebtn">&times;</span>
      <div id="contenuModal">
        <hr class="case1Hr">
        <h2 id="containerTitre"></h2>
        <hr class="case1Hr">

        <div class="containerGeneral">
          <div id="containerPublication"></div>
          <div id="containerImg"></div>
        </div>

        <div id="containerCom"></div>
        <span @click="validerCom()"><i class="fas fa-check"></i></span><span @click="supprCom()"><i class="fas fa-times"></i></span>
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

#containerCom >>> p{
  font-family: 'Open Sans', sans-serif;
  color: white;
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

.containerGeneral{
  width: 50%;
  border: solid 5px #ffffff;
  margin: 40px auto;
  color: white;
  font-family: 'Open Sans', sans-serif;
  font-size: 13px;
}

.containerGeneral >>> img{
  width: 20%;
  margin: 5px;
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
  name: 'AdminPanelCommentaires',
  components: {
    FingerprintSpinner,
  },
  data() {
    return {
      loading: true,
      commentaires: [],
      idCommentaires: null,
      commentairesStatutModeration: null,
    }
  },
  beforeMount() {
    if(this.$store.state.connexionAdmin == false){
      this.$router.push({ name: 'Auth' });
    }

  },
  mounted(){ // Obtenir tout les commentaires déjà validés 
    axios
    .get('http://localhost:3000/api/stuff/admin/panel_commentaires/', {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(response => {
        this.loading = false;
        this.commentaires = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods:{
    modaleAdmin(commentaireId, commentairePrenom, commentaireNom, commentaireContenu, commentaireStatutModeration, commentairePostsContenu, commentairePostsDateEcriture, commentairePostsUrlImages, commentaireUsersNom, commentaireUsersPrenom){ // Crée une modale en HTML dans laquelle on va obtenir plus d'info sur le commentaire
      this.idCommentaires = commentaireId;
      this.commentairesStatut_moderation = commentaireStatutModeration;

      document.getElementById('containerModal').style.display='block';

      var containerTitre = document.getElementById("containerTitre");
      containerTitre.innerHTML= commentairePrenom + " " + commentaireNom;

      var containerPublication = document.getElementById("containerPublication");
      containerPublication.innerHTML= "";
      var p1 = document.createElement("p");
      var p2 = document.createElement("p");
      var p3 = document.createElement("p");
      p1.innerHTML= commentaireUsersPrenom + " " + commentaireUsersNom;
      p2.innerHTML= new Date(commentairePostsDateEcriture).toLocaleString('fr-FR', { hour12: false });
      p3.innerHTML= commentairePostsContenu;
      containerPublication.appendChild(p1);
      containerPublication.appendChild(p2);
      containerPublication.appendChild(p3);

      var containerImg = document.getElementById("containerImg");
      containerImg.innerHTML= "";
      var images = JSON.parse(commentairePostsUrlImages);
      for (let i = 0; i < images.length; i++) {
        var img = document.createElement("img");
        img.setAttribute("src", images[i]);
        img.setAttribute("alt", "image publication");
        img.setAttribute("class", "imagePublication");
        containerImg.appendChild(img);
      }
      
      var containerCom = document.getElementById("containerCom");
      containerCom.innerHTML= "";
      var p = document.createElement("p");
      p.innerHTML= commentaireContenu;
      containerCom.appendChild(p);
    },
    validerCom(){ // Modifie le statut de modération à 1 du commentaire via une requete PUT

      let sendObject = {
        commentairesStatutModeration: this.commentairesStatutModeration,
      }

      axios
      .put("http://localhost:3000/api/stuff/"  + this.idCommentaires + "/admin/validateCom", sendObject,{
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(
        alert("Commentaire validé !"),
        document.getElementById('containerModal').style.display='none',
        setTimeout(() => {  window.location.reload() }, 1000),
      )
      .catch(function (error) {
        console.log(error); 
      });
    },
    supprCom(){ // Supprime le commentaire via une requete delete

      axios
      .delete('http://localhost:3000/api/stuff/' + this.idCommentaires + "/supprCom", {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(
        alert("Commentaire supprimé !"),
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