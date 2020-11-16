<template>
  <div class="adminSignUp">

    <transition appear name="fade" mode="out-in">

    <div class="container">
      <div class="form">
        <h2>Connexion Admin</h2>
        <form>

          <div class="inputBox">
            <input type="text" name="" placeholder="Email" v-model="email" id="email">
          </div>

          <div class="inputBox">
            <input type="password" name="" placeholder="Mot de passe" v-model="password" id="password">
          </div>

          <div class="inputBox">
            <div class="submit" @click="submitAdmin()">Valider</div>
          </div>

        </form>
      </div>
    </div>

    </transition>

    <router-link to="/auth" class="userLink">
      <span class="userIcon"><i class="fa fa-user"></i></span>
    </router-link>
  </div>
</template>

<style scoped>
.adminSignUp{
  background-color: #000;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: sans-serif;
}

.container{
  position: relative;
  width: 450px;
  min-height: 300px;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 1);
}

.container:before{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  pointer-events: none;
}

.container:after{
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: linear-gradient(45deg, #ff0047, #6eff00);
  pointer-events: none;
  animation: animate 10s linear infinite;
}

.form{
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  z-index: 1;
}

.form h2{
  margin: 0;
  padding: 0;
  color: #fff;
  font-size: 24px;
}

.form .inputBox{
  width: 100%;
  margin-top:20px;
}

.form .inputBox input{
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 2px solid #fff;
  outline: none;
  font-size: 18px;
  color:#fff;
  padding: 5px 0;
  font-family: sans-serif;
}

::placeholder{
  color: #eee;
}

.form .inputBox .submit{
  background: #fff;
  color: #000;
  border: none;
  max-width: 100px;
  cursor: pointer;
  text-align: center;
  padding: 5px;
}

.userLink{
  width: 25px;
  text-align: center;
  position: absolute;
  text-decoration: none;
  color: #fff;
  font-size: 20px;
  top: 10px;
  left: 10px;
  transition: .3s;
  background: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border: #fff 2px solid;
  border-radius: 50%;
}

.userLink:hover{
  color: rgb(255, 106, 0);
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

@keyframes animate{
  0%{
    filter: blur(60px) hue-rotate(0deg);
  }

  100%{
    filter: blur(60px) hue-rotate(360deg);
  }
}

</style>

<script>

import axios from 'axios'

export default {
  name: 'AdminSignUp',
  data() {
    return {
      email: null,
      password: null,
      emailValideConnexion: false,
      passwordValideConnexion: false,
      sendConnexion: {},
    }
  },
  beforeMount(){ // Reset des variables dans le store
    this.$store.commit('MUTATION_CONNEXION', false);
    this.$store.commit('MUTATION_CONNEXION_ADMIN', false);
    this.$store.commit('MUTATION_USERID', null);
    this.$store.commit('MUTATION_TOKEN', null);
  },
  methods: {
    submitAdmin(){ // Vérification des données du formulaire
      if (this.email && this.password){
        if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
          this.emailValideConnexion = true;
        }else{
          document.getElementById("email").setCustomValidity("Champ invalide");
          this.emailValideConnexion = false;
        }
        if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(this.password)) {
          this.passwordValideConnexion = true;
        }else{
          document.getElementById("password").setCustomValidity("Votre mot de passe doit comporter au moins huit caractères, une lettre et un chiffre");
          this.passwordValideConnexion = false;
        }
      }

      if (!this.email) {
        document.getElementById("email").setAttribute("required", "");
      }
      if (!this.password) {
        document.getElementById("password").setAttribute("required", "");
      }

      if(this.emailValideConnexion && this.passwordValideConnexion){
        this.sendConnexion = {email : this.email, password : this.password}
        this.authAdmin(this.sendConnexion);
      }

    },
    authAdmin(objetSend){ // Requète pour la connexion de l'admin
      axios
      .post('http://localhost:3000/api/auth/admin/login', objetSend, {
        headers:{
          "Content-Type": "application/json",
        }
      })
      .then(response => {
        if (response.data.statut == "error" || response.data.statut =="inconnu"|| response.data.statut =="pwdInvalide") {
          alert(response.data.message);          
        }else if(response.data.statut == "OK"){
          alert(response.data.message);
          this.fenetreSignUp = 0;
        }else if(response.data.statut == "profilValide"){ // Les variables dans le store sont modifiées 
          this.$store.commit('MUTATION_USERID', response.data.userId);
          this.$store.commit('MUTATION_TOKEN', response.data.token);
          this.$store.commit('MUTATION_CONNEXION_ADMIN', true);
          this.$store.commit('MUTATION_NOM', response.data.nom);
          this.$store.commit('MUTATION_PRENOM', response.data.prenom);
          this.$store.commit('MUTATION_URL_PHOTO_PROFIL', response.data.urlPhotoProfil);
          this.$router.push({ name: 'AdminPanel' });
        }else{
          throw new Error("Valeurs non reconnues");
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
  },
}
</script>
