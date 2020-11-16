<template>
<FingerprintSpinner v-if = "this.loading == true"></FingerprintSpinner>
  <div class="panel" v-if = "this.loading == false">

    <div id="clock">
      <p class="time">{{ hours }}:{{ minutes }}:{{ seconds }}</p>
    </div>

    <div class="box box1">
      <div class="glass"></div>
      <div class="content">
        <h2>{{ data.nbPosts }}</h2>
        <p>POSTS</p>
        <i class="svg fas fa-feather-alt"></i>
      </div>
    </div>

    <div class="box box2">
      <div class="glass"></div>
      <div class="content">
        <h2>{{ data.nbComments }}</h2>
        <p>COMMENTAIRES</p>
        <i class="svg fas fa-comments"></i>
      </div>
    </div>

    <div class="box box3">
      <div class="glass"></div>
      <div class="content">
        <h2>{{ data.nbUser }}</h2>
        <p>UTILISATEURS</p>
        <i class="svg fas fa-user"></i>
      </div>
    </div>

    <div class="containerParticipations">
      <ul class="lastPost">
        <li class="lastPostP">Les 5 dernières publications :</li>
        <li class="ligneTableau ligneTableauPosts" v-for="publi in data.tableauPubli" :key="publi">
          <p class="date">{{ new Date(publi.date_ecriture).toLocaleString('fr-FR', { hour12: false })}}</p> <span class="photoProfil"><img :src="publi.url_photo_profil" alt=""></span> <p class="prenom">{{ publi.prenom }}</p> <p class="nom">{{ publi.nom }}</p> <p class="contenu">{{ publi.contenu }}</p> <br> <p>Statut modération : {{ publi.statut_moderation }}</p>
        </li>
      </ul>
      <ul class="lastComments">
        <li class="lastCommentsP">Les 5 derniers commentaires :</li>
        <li class="ligneTableau ligneTableauComments" v-for="comment in data.tableauComments" :key="comment">
          <p class="underline">Sur le post de {{ comment.usersPrenom }} {{ comment.usersNom }} du {{ new Date(comment.postsDateEcriture).toLocaleString('fr-FR', { hour12: false }) }} : </p> <br> <p class="date">{{ new Date(comment.commentsDateEcriture).toLocaleString('fr-FR', { hour12: false }) }}</p> <p class="prenom">{{ comment.commentsPrenom }}</p> <p class="nom">{{ comment.commentsNom }}</p> <p class="contenu">{{ comment.commentsContenu }}</p> <br> <p>Statut modération : {{ comment.commentsStatutModeration }}</p>
        </li>
      </ul>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.panel{
  width: 100%;
  text-align: center;
}

#clock{
  margin-top: 2%;
  background: radial-gradient(ellipse at center,  #0a2e38  0%, #00000000 70%);
  background-size: 100%;
  padding: 30px;
}

.time{
  color: #daf6ff;
  text-shadow: 0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0);
  font-family: 'Inconsolata', monospace;
  font-size: 100px;
  font-family: 'Share Tech Mono', monospace;
}

.box{
  position: relative;
  display: inline-block;
  width: 200px;
  justify-content: center;
  background: #060c21;
  margin: 40px;
  font-family: 'Share Tech Mono', monospace;
}

.box:before{
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: #fff;
  z-index: -1;
}

.box:after{
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: #fff;
  z-index: -1;
  filter: blur(40px);
}

.box1:before, .box1:after{
  background: linear-gradient(235deg, #89ff00, #010615, #00bcd4);
}

.box2:before, .box2:after{
  background: linear-gradient(235deg, #ff005e, #010615, #fbff00);
}

.box3:before, .box3:after{
  background: linear-gradient(235deg, #772aff, #010615, #2196f3);
}

.box .glass {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  display: block;
  background: rgba(255, 255, 255, .1);
}

.box .content{
  padding: 20px;
  color: #ffffff;
}

.svg{
  font-size: 50px;
}

.containerParticipations{
  width: 100%;
  margin: 0;
  padding: 0;
  text-align: center;
}

.lastPost, .lastComments{
  width: 40%;
  margin: 50px 0;
  list-style: none;
  font-family: 'Inconsolata', monospace;
  color: white;
  text-align: left;
  display: inline-block;
  vertical-align: top;
}

.ligneTableau{
  width: 100%;
  margin: 20px auto;
  background-color: #494949;
  transition: .3s;
}

.ligneTableauPosts:hover{
  background-color: #616161;
  box-shadow: 0 0 10px #2196f3, 0 0 40px #2196f3, 0 0 80px  #2196f3;
}

.ligneTableauComments:hover{
  background-color: #616161;
  box-shadow: 0 0 10px rgb(255, 106, 0), 0 0 40px rgb(255, 106, 0), 0 0 80px  rgb(255, 106, 0);
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

.contenu{
  font-size: 12px;
}

.lastPostP{
color: #4fb0ff;
}

.lastCommentsP{
color:  rgb(255, 106, 0);
}

.underline{
  text-decoration: underline;
}

@media screen and (max-width: 550px) {
  #clock{
    padding: 50px 0;
  }

  .time {
    font-size: 50px;
  }
}

@media screen and (max-width: 600px) {
  .lastPost, .lastComments{
    width: 80%;
    display: block;
  }
}


</style>


<script>
import axios from 'axios'
import FingerprintSpinner from '../components/fingerprint-spinner'

const date = new Date();

export default {
  name: 'AdminPanel',
  components: {
    FingerprintSpinner,
  },
  data() {
    return {
      loading: true,

      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      data:{},
    }
  },
  beforeMount() {
    if(this.$store.state.connexionAdmin == false){
      this.$router.push({ name: 'Auth' });
    }

  },
  mounted(){ // On va récupérer toutes les informations dont le panel de l'admin a besoin. (Les dernières participations, quelques statisitques, etc...)
    axios
    .get('http://localhost:3000/api/stuff/admin/panel/', {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(response => {
        this.loading = false;
        this.interval = setInterval(this.updateClock, 1000);
        this.data = response.data;
        console.log(this.data);
      })
      .catch(function (error) {
        console.log(error);
      });
      
  },
  methods:{
    updateClock() { // Création d'une horloge
      const date = new Date();

      this.hours = date.getHours();
      this.minutes = date.getMinutes();
      this.seconds = date.getSeconds();

      this.minutes = this.checkTime(this.minutes);
      this.seconds = this.checkTime(this.seconds);
    },
    checkTime(i) { // Formatage des données de l'horloge
      if (i < 10) {i = "0" + i}  // Ajouter un zero si < 10
      return i;
    }
  },
}
</script>