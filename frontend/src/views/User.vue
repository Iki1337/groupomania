<template>
<FingerprintSpinner v-if = "this.loading == true"></FingerprintSpinner>
  <div class="user" v-if = "this.loading == false">
    <div id="imgMur">
      <img :src="this.dataProfil.url_photo_mur" alt="mur">
    </div>

    <div id="imgProfil">
      <img :src="this.dataProfil.url_photo_profil" alt="photo de profil">
    </div>

    <div id="identite">
      <hr class="case1Hr">
      <h2>{{dataProfil.prenom}} {{dataProfil.nom}}</h2>
      <hr class="case1Hr">
    </div>

    <div class="corps">

      <div class="case" v-if = "this.$store.state.userId == dataProfil.id">
        <textarea id="uploadPublication" placeholder="Que voulez vous publier ?" v-model="textPublication"></textarea>
        <span @click="envoiPublication"><i class="fas fa-paper-plane"></i></span>
        <hr class="case1Hr">
        <div class="btnUploadImg">
          <label for="uploadImg"><i class="fas fa-images"></i> Photos</label>
        </div>
        <input type="file" id="uploadImg" name="uploadImg" accept="image/png, image/jpeg" style="visibility:hidden;" multiple @change="handleFiles()">
        <div id="preview"></div>
      </div>

      <div class="case casePublication" v-for="publication in dataProfil.publications" :key="publication">
        <h2>{{dataProfil.prenom}} {{dataProfil.nom}}</h2><div v-if = "this.$store.state.userId == dataProfil.id" class="dropPubli" @click="supprPublication(publication.id)"><i class="fas fa-trash-alt"></i></div><div v-if = "this.$store.state.userId == dataProfil.id" class="dropPubli" @click="editPublication(publication.id, publication.contenu)"><i class="far fa-edit"></i></div>
        <p class="datePublication">{{ new Date(publication.date_ecriture).toLocaleString('fr-FR', { hour12: false }) }}</p>
        <hr class="case1Hr">
        <p class="italique" v-if="publication.statut_moderation === 0">EN ATTENTE DE MODERATION</p>
        <p>{{ publication.contenu }}</p>
        <div class="conteneurVFor">
          <div class="conteneurImg" v-for="(images, index) in JSON.parse(publication.urls_images)" :key="index">
            <img :id="'img'+index" :src="images" :alt="publication.contenu" @click="zoom(images, publication.contenu)">
          </div>
        </div>
        <hr class="case1Hr">
         <div class="like">
          <div @click="like(publication.id, publication.tableau_users_like)"><span class="likeNb" v-if = "publication.tableau_users_like !== null && JSON.parse(publication.tableau_users_like).length > 0">{{ JSON.parse(publication.tableau_users_like).length }}</span><i v-if="publication.tableau_users_like !== null && JSON.parse(publication.tableau_users_like).length > 0 && JSON.parse(publication.tableau_users_like).find(element => element == this.$store.state.userId) !== undefined" class="fas fa-thumbs-up likeActive"></i><i v-else class="fas fa-thumbs-up"></i></div>
        </div>
        <hr class="case1Hr">
        <div class="affichageCommentaires">
          <div class="boxComm" v-for="comment in publication.comments" :key="comment">
            <p class="identiteComm" >{{ comment.prenom }} {{ comment.nom }}</p>
            <p class="contenuComm">{{ comment.contenu }}</p>
          </div>
        </div>
        <div class="commentsBox">
          <textarea class="uploadComments" :id="'uploadComments'+publication.id" placeholder="Ecrivez votre commentaire..."></textarea><span @click="envoiCommetaire(publication.id)"><i class="fas fa-share"></i></span>
        </div>
      </div>

      <div class="containerGalery">
        <span onclick="this.parentElement.style.display='none'" class="closebtn">&times;</span>
        <img id="expandedImg">
        <div id="imgtext"></div>
      </div>

    </div>

    <div class="containerDateInscription">
      <p class="dateInscription">Inscription le {{ new Date(dataProfil.date_inscription).toLocaleString('fr-FR', { hour12: false })}}</p>
    </div>

    <div id="containerModal">
      <span onclick="this.parentElement.style.display='none'" class="closebtn">&times;</span>
      <div id="contenuModal">
        <hr class="case1Hr">
        <h2>Edition de la publication</h2>
        <hr class="case1Hr">

        <div id="containerTextarea"></div>
        <span @click="envoiModifPubli()"><i class="fas fa-share"></i></span>
      </div>
    </div>

  </div>
</template>

<style scoped>
#imgMur{
  width: 100%;
  min-height: 168px;
  max-height: 350px;
  overflow: hidden;
  z-index: -50;
}

#imgMur img{
  width: 100%;
  margin-top: -12%;
}

#imgProfil{
  width: 100%;
  text-align: center;
  margin-top: -120px;
}

#imgProfil img{
  width: 200px;
  height: 200px;
  border: solid white 5px;
  border-radius: 100%;
}

#identite{
  text-align: center;
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
  font-size: 20px;
}

.containerDateInscription{
  width: 100%;
  text-align: center;
}

.dateInscription{
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
  font-size: 20px;
}

.dropPubli{
  float:right;
  margin-right: 50px;
}

.dropPubli svg{
  cursor: pointer;
  transition: .3s;
}

.dropPubli svg:hover{
  color: rgb(255, 106, 0);
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
}

#containerModal h2{
  color: white;
  font-family: 'Open Sans', sans-serif;
}

#containerModal .fa-share{
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: .3s;
}

#containerModal .fa-share:hover{
  color:  rgb(255, 106, 0);
}

#contenuModal{
  width: 70%;
  background-color: #494949;
  margin: 50px auto;
  padding: 20px;
  border-radius: 10px;
}

#contenuModal >>> textarea{
  background-color: #777777;
  padding: 10px;
  width: 60%;
  margin: 12px;
  height: 60px;
  border: none;
  border-radius: 15px;
  font-family: 'Open Sans', sans-serif;
  font-size: 18px;
  color: white;
}

.italique{
  font-size: 11px;
  color:  rgb(255, 162, 96);
  font-style: italic;
}
</style>

<script>
import axios from 'axios'
import FingerprintSpinner from '../components/fingerprint-spinner'

export default {
  name: 'User',
  components: {
    FingerprintSpinner,
  },
  data() {
    return {
      loading: true,
      textPublication:null,
      dataProfil: null,
      modificationPublication : null,
    }
  },
  beforeMount() {
    if(this.$store.state.connexion == true){
      document.getElementById("conteneur").style.marginLeft = "60px";
    }else{
      this.$router.push({ name: 'Auth' });
    }
  },
  watch: { 
    $route(to, from) {
      // react to route changes...
      if(to !== from){
        location.reload();
      }
    }
  },
  mounted() { // Requete pour récupérer toutes les publications de l'utilisateur
    axios
      .get("http://localhost:3000/api/stuff/" + this.$route.params.id, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(response => {
        this.dataProfil = response.data;
        console.log(this.dataProfil);
        this.loading = false;
        if (this.$route.params.id == this.$store.state.userId) { // Si l'utilisateur renseigné dans l'URL n'est pas l'utilisateur courant, on fait appel à triPublications(). 
         //
        }else{ // Si on ne met pas cet appel dans un else, triPublications() ne sera pas appelé.
          this.triPublications();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods:{
    handleFiles(){ // Cette fonction permet d'avoir une miniature des fichiers qui vont être uploadés même si ils ne possèdent pas encore d'URLs
      document.getElementById("preview").innerHTML="";
      let files = document.getElementById("uploadImg").files;
      for (let i = 0; i < files.length; i++) {
        let img = document.createElement("img");
        img.classList.add("previewImg");
        img.file = files[i];
        document.getElementById("preview").appendChild(img);
        var reader = new FileReader();
        reader.onload = ( function(aImg) {
          return function(e) {
            aImg.src = e.target.result; 
          };
        })(img);
        reader.readAsDataURL(files[i]);
      }
    },
    envoiPublication(){ // Récupère les données de la nouvelle publication créée, et les envoie par une requete post
      if (this.textPublication != "") {

        let input = document.getElementById("uploadImg");
        let file = input.files;

        let formData = new FormData();
        formData.append('userId', this.$store.state.userId);
        formData.append('contenu', this.textPublication);
        for (let i = 0; i < file.length; i++) {
          formData.append('image', file[i]);
        }

        axios
        .post('http://localhost:3000/api/stuff/',formData, {
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            "Content-Type": "application/json",
          }
        })
        .then(
          alert("Publication envoyée !"),
          setTimeout(() => {  window.location.reload() }, 1000),
        )
        .catch(function (error) {
          console.log(error);
        });

      }else{
        alert("Cette publication est vide !");
      }
    },
    like(idPubli, tableau_users_like){ // Permet de liker une publication en vérifiant si tableau_users_like est vide ou non, et si l'utilisateur en cours figure parmis ceux ayant déjà liké ou non
      let tableauLike = JSON.parse(tableau_users_like);
      if (tableau_users_like != null) {
        for (let i = 0; i < tableauLike.length; i++) {
          if(tableauLike[i] == this.$store.state.userId){
            this.userFind = true;
          }
        }
        if (this.userFind == true) {
          this.envoiLike(idPubli, -1);
          window.location.reload();
        }else{
          this.envoiLike(idPubli, 1);
          window.location.reload();
        }
      }else{
        this.envoiLike(idPubli, 1);
        window.location.reload();
      }
    },
    envoiLike(idPubli, statLike){ // Envoie le résultat de la fonction au dessus via une requete PUT
      let formData = new FormData();
      formData.append('idUser', this.$store.state.userId);
      formData.append('statutLike', statLike);
      let sendObject = {
        idUser: this.$store.state.userId,
        statutLike: statLike,
      }

      axios
      .put("http://localhost:3000/api/stuff/"  + idPubli + "/like", sendObject, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(
        console.log("Modifications sauvegardées !"),
      )
      .catch(function (error) {
        console.log(error); 
      });
    },
    envoiCommetaire(idPubli){ // Récupère les données d'un nouveau commentaire et les envoie par une requete POST
      let idUploadComments = "uploadComments"+idPubli;
      let divUploadComments = document.getElementById(idUploadComments);

      if(divUploadComments.value != ""){

        let sendObject = {
          idUser: this.$store.state.userId,
          nom: this.$store.state.nom,
          prenom: this.$store.state.prenom,
          contenu: divUploadComments.value,
        }

        axios
        .post('http://localhost:3000/api/stuff/' + idPubli + "/comments",sendObject, {
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            "Content-Type": "application/json",
          }
        })
        .then(
          alert("Commentaire envoyé !"),
          setTimeout(() => {  window.location.reload() }, 1000),
        )
        .catch(function (error) {
          console.log(error);
        });

        console.log(sendObject);

      }
    },
    supprPublication(idPubli){ // Supprime la publication séléctionnée via une requete DELETE
      axios
      .delete('http://localhost:3000/api/stuff/' + idPubli, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(
        alert("Publication supprimée"),
        setTimeout(() => {  window.location.reload() }, 1000),
      )
      .catch(function (error) {
        console.log(error);
      });
    },
    zoom(src, txt){ // Permet d'afficher un zoom sur les images d'une publication
      var expandImg = document.getElementById("expandedImg");
      var imgText = document.getElementById("imgtext");
      expandImg.src = src;
      imgText.innerHTML = txt;
      expandImg.parentElement.style.display = "block";
    },
    editPublication(publicationId, publicationContenu){ // Création d'une modale qui va permettre la modification de la publication séléctionnée
      this.modificationPublication = publicationId;
      document.getElementById('containerModal').style.display='block';
      var modal = document.getElementById("containerTextarea");
      modal.innerHTML= "";
      var textarea = document.createElement("textarea");
      textarea.id = "publiModif";
      textarea.innerHTML= publicationContenu;
      modal.appendChild(textarea);
    },
    envoiModifPubli(){ // Récupère les modifications liées a une publication et les envoie via une requete PUT
      var publi = document.getElementById('publiModif');
      var publiValue = publi.value;

      let sendObject = {
        modif: publiValue,
      }
      console.log(sendObject);

      axios
      .put("http://localhost:3000/api/stuff/"  + this.modificationPublication + "/modif_post", sendObject, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(
        alert("Modifications sauvegardées !"),
        setTimeout(() => {  window.location.reload() }, 1000),
      )
      .catch(function (error) {
        console.log(error); 
      });
    },
    triPublications(){ // Lorsque cette fonction est appelée, les publications sont triées selon leurs statuts de modération. Un utilisateur visitant le profil d'un autre ne verra pas les publication pas encore modérées.
      for (let i = 0; i < this.dataProfil.publications.length; i++) {
        if (this.dataProfil.publications[i].statut_moderation === 0) {
          this.dataProfil.publications.splice(i, 1);
          i--; //Pour avoir l'index correct
        }
      }
    },
  },
}
</script>