<template>
  <header>
    <div id="nav" v-if="$store.state.connexion == true">
      <ul>
        <li>
          <a href="#">
            <span class="iconLogo"><img src="./assets/logo.png" alt=""></span>
            <span class="titleLogo">Groupomania</span>
          </a>
        </li>

        <li>
          <router-link to="/home">
            <span class="icon"><i class="fa fa-home"></i></span>
            <span class="title">Accueil</span>
          </router-link>
        </li>

        <li>
          <div id="search">
            <span class="icon"><i class="fas fa-search"></i></span>
            <input class="inputSearch" type="search" placeholder="Rechercher un utilisateur" @keyup.enter="checkResearch" v-model="userSearch">
          </div>
        </li>

        <li>
          <router-link :to="'/user/' + this.$store.state.userId">
            <span class="iconProfil"><img :src="this.$store.state.urlPhotoProfil" alt=""></span>
            <span class="title">Profil</span>
          </router-link>
        </li>

        <li>
          <router-link to="/messages">
            <span class="icon"><i class="fa fa-comment"></i></span>
            <span class="title">Messagerie</span>
          </router-link>
        </li>

        <li>
          <router-link to="/settings">
            <span class="icon"><i class="fa fa-cog"></i></span>
            <span class="title">Paramètres</span>
          </router-link>
        </li>

        <li>
          <router-link to="/auth">
            <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
            <span class="title">Déconnexion</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="navAdmin" v-if="$store.state.connexionAdmin == true">
      <router-link to="/admin/panel/publications">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Publications
      </router-link>

      <router-link to="/admin/panel/publications_en_attente" class="enAttente">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Publications (en attente)
      </router-link>

      <router-link to="/admin/panel/commentaires">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Commentaires
      </router-link>

       <router-link to="/admin/panel/commentaires_en_attente" class="enAttente">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Commentaires (en attente)
      </router-link>

      <router-link to="/admin/panel/users">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Utilisateurs
      </router-link>
    </div>
  </header>
  <div id="toggleMenu" @click="toogleMenu" v-if="$store.state.connexion == true"><i class="fas fa-ellipsis-h"></i></div>
  <div id="profilAdmin" v-if="$store.state.connexionAdmin == true">
    <img :src="this.$store.state.urlPhotoProfil" alt=""> Admin : {{ identite }} <span class="iconProfil"></span>
  </div>

  <div class="homeAdmin" v-if="$store.state.connexionAdmin == true">
    <router-link to="/admin/panel">
      <i class="fa fa-home"></i>
    </router-link>

    <router-link to="/admin">
      <i class="fa fa-sign-out-alt"></i>
    </router-link>
  </div>

  <fingerprint-spinner v-if="this.chargement == false"
    :animation-duration="1500"
    :size="64"
    color="#ff1d5e"
  />

  <div id="conteneur">
    <!--<transition appear name="fade" mode="out-in">-->
      <router-view/>
    <!--</transition>-->
  </div>

</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inconsolata&display=swap');

body{
  margin: 0;
  padding: 0;
  background-color: #303030;
}

header{
  min-height: 1px;
}

/* Style du menu Nav ---------------------------------------*/

#nav{
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  position:fixed;
  width: 60px;
  height:100%;
  background-color: rgba(0, 0, 0, 0.8);
  transition: 0.5s;
  overflow: hidden;
  z-index: 10;
}

#nav:hover, .navActive{
  width: 300px!important;
}

#nav ul{
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  color: #ffffff;
}

#nav ul li{
  position:relative;
  width: 100%;
  list-style: none;
}

#nav ul li a, #search{
  position: relative;
  display: block;
  width: 100%;
  display: flex;
  text-decoration: none;
  color: #ffffff;
}

#nav ul li a:hover, #search:hover{
  color: rgb(255, 106, 0);
}

#nav ul li a .icon, #search .icon{
  position: relative;
  display: block;
  min-width: 40px;
  height: 60px;
  line-height: 60px;
  margin-left: -19px;
}

#nav ul li a .iconLogo{
  position: relative;
  display: block;
  min-width: 40px;
  height: 60px;
  line-height: 60px;
  margin-left: -19px;
}

#nav ul li a .iconProfil{
  position: relative;
  display: block;
  min-width: 40px;
  line-height: 60px;
  margin-left: -19px;
}

#nav ul li a .iconLogo img{
  width: 35px;
  margin-left: -10px;
}

#nav ul li a .iconProfil img{
  width: 30px;
  height: 30px;
  margin-left: -7px;
  border:solid white 1px;
  border-radius: 100px;
  vertical-align: middle;
}

#nav ul li a .title{
  position: relative;
  display: block;
  padding: 0 10px;
  height: 60px;
  line-height: 60px;
  text-align: start;
  white-space: nowrap;
}

.inputSearch{
  padding: 0 10px;
  height: 30px;
  margin-top: 15px;
  text-align: start;
  border: none;
  border-radius: 50px;
  width: 58%;
  color: #ffffff;
  background-color:#494949;
}

#nav ul li a .titleLogo{
  position: relative;
  font-size: 30px;
  white-space: nowrap;
}

#nav a.router-link-exact-active{
  color: rgb(255, 110, 5);
}

#toggleMenu{
  position: fixed;
  top: 65px;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
  cursor: pointer;
  transition: 0.3s;
  z-index: 2;
}

#toggleMenu svg{
  color: white;
  font-size: 35px;
  transition: .3s;
}

#toggleMenu svg:hover{
  color: rgb(255, 106, 0);
}

.toogleMenuActive{
  transform: rotate(90deg);
}

.toogleMenuActive svg{
  color: rgb(255, 106, 0)!important;
}

/* Style du menu Nav Admin ---------------------------------------*/
.navAdmin{
  text-align: center;
  margin-top: 10px;
}

.navAdmin a{
  font-family: 'Inconsolata', monospace;
  position: relative;
  display: inline-block;
  padding: 15px 30px;
  color: #52b1ff;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-decoration: none;
  font-size: 15px;
  overflow:hidden;
  transition: 0.2s;
}

.navAdmin a:hover{
  color: #255784;
  background: #2196f3;
  box-shadow: 0 0 10px #2196f3, 0 0 40px #2196f3, 0 0 80px #2196f3;
  transition-delay: 1s;
}

.navAdmin a span{
  position: absolute;
  display: block;
}

.navAdmin a span:nth-child(1){
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #2196f3);
}

.navAdmin a:hover span:nth-child(1){
  left: 100%;
  transition: 1s;
}

.navAdmin a span:nth-child(2){
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #2196f3);
}

.navAdmin a:hover span:nth-child(2){
  top: 100%;
  transition: 1s;
  transition-delay: 0.25s;
}

.navAdmin a span:nth-child(3){
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #2196f3);
}

.navAdmin a:hover span:nth-child(3){
  right: 100%;
  transition: 1s;
  transition-delay: 0.5s;
}

.navAdmin a span:nth-child(4){
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #2196f3);
}

.navAdmin a:hover span:nth-child(4){
  bottom: 100%;
  transition: 1s;
  transition-delay: 0.75s;
}

/* classe .enAttente */

.navAdmin .enAttente{
  font-family: 'Inconsolata', monospace;
  position: relative;
  display: inline-block;
  padding: 15px 30px;
  color:  rgb(255, 106, 0);
  text-transform: uppercase;
  letter-spacing: 2px;
  text-decoration: none;
  font-size: 15px;
  overflow:hidden;
  transition: 0.2s;
}

.navAdmin .enAttente:hover{
  color: #660000;
  background:  rgb(255, 106, 0);
  box-shadow: 0 0 10px  rgb(255, 106, 0), 0 0 40px  rgb(255, 106, 0), 0 0 80px  rgb(255, 106, 0);
  transition-delay: 1s;
}

.navAdmin .enAttente span{
  position: absolute;
  display: block;
}

.navAdmin .enAttente span:nth-child(1){
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent,  rgb(255, 106, 0));
}

.navAdmin .enAttente:hover span:nth-child(1){
  left: 100%;
  transition: 1s;
}

.navAdmin .enAttente span:nth-child(2){
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent,  rgb(255, 106, 0));
}

.navAdmin .enAttente:hover span:nth-child(2){
  top: 100%;
  transition: 1s;
  transition-delay: 0.25s;
}

.navAdmin .enAttente span:nth-child(3){
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent,  rgb(255, 106, 0));
}

.navAdmin .enAttente:hover span:nth-child(3){
  right: 100%;
  transition: 1s;
  transition-delay: 0.5s;
}

.navAdmin .enAttente span:nth-child(4){
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent,  rgb(255, 106, 0));
}

.navAdmin .enAttente:hover span:nth-child(4){
  bottom: 100%;
  transition: 1s;
  transition-delay: 0.75s;
}

/* #profilAdmin */

#profilAdmin{
  position: fixed;
  right: 0;
  top: 200px;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
  color: #ffffff;
  font-family: 'Inconsolata', monospace;
  font-size: 15px;
  z-index: 5;
}

#profilAdmin img{
  width: 30px;
  height: 30px;
  margin-left: -7px;
  border:solid white 1px;
  border-radius: 100px;
  vertical-align: middle;
}

/* .homeAdmin */

.homeAdmin{
  position: fixed;
  right: 0;
  top: 90px;
  background-color: rgba(0, 0, 0, 0.8);
  font-family: 'Inconsolata', monospace;
  font-size: 15px;
  z-index: 5;
}

.homeAdmin a{
  text-decoration: none;
  color: #ffffff;
  font-size: 25px;
  display: block;
  margin: 15px 10px;
  transition: .5s;
}

.homeAdmin a:hover{
  color: rgb(255, 106, 0);
}

/* Styles généraux ---------------------------------------*/

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

.corps{
  margin: 50px auto 0 auto;
  width: 80%;
}

.corps .case{
  background-color:#494949;
  margin: auto;
  border-radius: 10px;
  width: 70%;
}

@media screen and (max-width: 640px) {
  .corps {
    width:100%;
  }

  .corps .case{
    width:90%;
  }
}

.corps .case #uploadPublication{
  background-color:#777777;
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

.casePublication .uploadComments{
  background-color:#777777;
  padding: 10px;
  width: 70%;
  margin: 12px;
  height: 25px;
  border: none;
  border-radius: 15px;
  font-family: 'Open Sans', sans-serif;
  font-size: 13px;
  color: white;
}

.casePublication .fa-share{
  font-size: 20px;
  vertical-align: top;
  margin-top: 28px;
  margin-right: 4%;
  float: right;
  transition: .5s;
  cursor:pointer;
}

.casePublication .fa-share:hover{
  color:  rgb(255, 106, 0);
}

.corps .case .fa-paper-plane{
  font-size: 50px;
  vertical-align: top;
  margin-top: 28px;
  margin-right: 4%;
  float: right;
  color:  rgb(255, 106, 0);
  transition: .5s;
  cursor:pointer;
}

.corps .case .fa-paper-plane:hover{
  opacity: 0.5;
}

.case1Hr{
  height: 1px;
  background-color:#777777;
  border: none;
  width: 90%;
}

.btnUploadImg{
  width: 20%;
  transition: .2s;
  padding: 5px;
  text-align: center;
  font-family: 'Open Sans', sans-serif;
  font-size: 15px;
  color: white;
  margin: 20px auto 0;
  border-radius: 7px;
  cursor:pointer;
}

.btnUploadImg svg{
  color: rgb(255, 106, 0);
  font-size: 20px;
  cursor:pointer;
}

.btnUploadImg:hover{
  background-color:#777777;
}

#preview{
  width: 100%;
  text-align: center;
}

#preview img{
  width: 20%;
  vertical-align: middle;
  margin: 10px;
  border: 5px white solid;
  box-shadow: black 5px 5px 5px;
}

.casePublication{
  color: white;
  font-family: 'Open Sans', sans-serif;
  padding-top: 5px;
  padding-bottom: 15px;
  margin: 20px auto!important;
}

.casePublication > h2, p{
  margin-left: 15px;
  margin-right: 15px;
}

.casePublication .datePublication{
  font-size: 13px;
}

.conteneurVFor{
  text-align: center;
}

.conteneurImg{
  display: inline-block;
  width: 20%;
  margin: 15px;
}

.conteneurImg img{
  width: 100%;
  transition: 0.3s;
  cursor:pointer;
}

.conteneurImg img:hover{
  opacity: 0.7;
  transform: scale(1.2);
}

.casePublication .like{
  width: 100%;
  text-align: end;
}

.casePublication .like div{
  width: 60px;
  margin-left: 70%;
}

.casePublication .like svg{
  font-size: 30px;
  transition: .3s;
  cursor: pointer;
}

.casePublication .like svg:hover, .likeActive{
  color:  rgb(255, 106, 0);
}

.casePublication .like .likeNb{
  margin-right: 10px;
}

.boxComm{
  margin: 25px;
  padding: 2px;
  background-color: rgb(0, 0, 0);
  border-radius: 18px;
}

.identiteComm{
  font-size: 14px;
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
}

/* Style de la gallerie --------------------------------------------*/

.containerGalery{
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

.containerGalery img{
  width: 20%!important;
  overflow: auto;
  margin: 7% auto;
}

@media screen and (max-width: 640px) {
  .containerGalery img{
  width: 70%!important;
  }
}

.closebtn {
  color: #ffffff;
  float: right;
  margin-right: 15px;
  font-size: 50px;
  font-weight: bold;
  cursor: pointer;
}

#imgtext {
  position: absolute;
  color: white;
  left: 10%;
  right: 10%;
  font-size: 18px;
  font-family: 'Open Sans', sans-serif;
}
</style>

<script>
import { FingerprintSpinner } from 'epic-spinners'

export default {
  components: {FingerprintSpinner},
  name:'App',
  data() {
    return {
      chargement: false,
      userSearch: null,
      identite: this.$store.state.prenom + " " + this.$store.state.nom,
    }
  },
  mounted(){
    this.chargement = true;
  },
  methods: {
    checkResearch(){ // Recherche d'utilisateur
      this.$router.push({name: 'Search', params: { id: this.userSearch }});
      this.userSearch = null;      
    },
    toogleMenu(){ // Déploiement du menu nav
      let menu = document.getElementById('nav');
      let btn = document.getElementById('toggleMenu');
      menu.classList.toggle("navActive");
      btn.classList.toggle("toogleMenuActive");
    }
  },
}
</script>
