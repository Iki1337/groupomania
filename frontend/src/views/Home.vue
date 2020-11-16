<template>
<FingerprintSpinner v-if = "this.loading == true"></FingerprintSpinner>
  <div class="home" v-if = "this.loading == false">
    <div class="head">
      <h1><i class="far fa-newspaper"></i><span>Fil d'actualité</span></h1>
    </div>

    <div class="corps">
      <div class="case">
        <textarea id="uploadPublication" placeholder="Que voulez vous publier ?" v-model="textPublication"></textarea>
        <span @click="envoiPublication"><i class="fas fa-paper-plane" @click="envoiPublication"></i></span>
        <hr class="case1Hr">
        <div class="btnUploadImg">
          <label for="uploadImg"><i class="fas fa-images"></i> Photos</label>
        </div>
        <input type="file" id="uploadImg" name="uploadImg" accept="image/png, image/jpeg" style="visibility:hidden;" multiple @change="handleFiles()">
        <div id="preview"></div>
      </div>

      <div class="case casePublication" v-for="publication in publications" :key="publication">
        <h2>{{ publication.prenom }} {{ publication.nom }}</h2>
        <p class="datePublication">{{ new Date(publication.date_ecriture).toLocaleString('fr-FR', { hour12: false }) }}</p>
        <hr class="case1Hr">
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
  </div>
</template>

<style scoped>

.head{
  margin: auto;
  width: 80%;
  border-bottom: solid 1px rgb(255, 106, 0);
  font-family: 'Open Sans', sans-serif;
  color: rgb(255, 106, 0);
}

.head h1 svg{
  font-size: 50px;
}

.head h1{
  width: 100%;
}

.head h1 span{
  font-size: 20px;
  vertical-align:text-top;
  margin-left: 30px;
}
</style>

<script>
import axios from 'axios'
import FingerprintSpinner from '../components/fingerprint-spinner'

export default {
  name: 'Home',
  components: {
    FingerprintSpinner,
  },
  data() {
    return {
      loading: true,
      textPublication:"",
      publications: null,
      userFind: false,
    }
  },
  beforeMount() {
    if(this.$store.state.connexion == true){
      document.getElementById("conteneur").style.marginLeft = "60px";
    }else{
      this.$router.push({ name: 'Auth' });
    }

  },
  mounted() { // Requete pour récupérer toutes les publications
    axios
      .get('http://localhost:3000/api/stuff/' , {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(response => {
        this.publications = response.data;
        this.loading = false;
        console.log(this.publications[1].comments);
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
          setTimeout(() => {  window.location.reload() }, 100),
        )
        .catch(function (error) {
          console.log(error);
        });

      }
    },
    zoom(src, txt){ // Permet d'afficher un zoom sur les immages d'une publication
      var expandImg = document.getElementById("expandedImg");
      var imgText = document.getElementById("imgtext");
      expandImg.src = src;
      imgText.innerHTML = txt;
      expandImg.parentElement.style.display = "block";
    },
  },
}
</script>