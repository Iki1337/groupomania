<template>
<FingerprintSpinner v-if = "this.loading == true"></FingerprintSpinner>
  <div class="search" v-if = "this.loading == false">
    <div class="corps">
      <div class="noResults" v-if = "users.length == 0">
        <p>Désolé, votre recherche n'a pas aboutie.</p>
      </div>
      <div class="case" v-for="user in users" :key="user">
        <img class="imgProfil" :src="user.url_photo_profil" alt="">
        <router-link :to="'/user/' + user.id"><p class="identiteUserSearch">{{ user.prenom }} {{ user.nom }}</p></router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.noResults{
  width: 50%;
  margin: auto;
  color: white;
  text-align: center;
}

.noResults p{
  font-size: 20px;
  font-family: 'Poppins', sans-serif;
}

.case{
  padding: 10px;
  width: 50%;
  margin-bottom: 10px;
}

.imgProfil{
  width: 60px;
  height: 60px;
  border: solid 3px white;
  border-radius: 100px;
  vertical-align:middle;
}

.identiteUserSearch{
  display: inline-block;
  font-family: 'Open Sans', sans-serif;
  font-size: 20px;
  color: white;
  margin-left: 10%;
}
</style>

<script>
import axios from 'axios'
import FingerprintSpinner from '../components/fingerprint-spinner'

export default {
  name:'Search',
  components: {
    FingerprintSpinner,
  },
  data() {
    return {
      loading: true,
      users: null,
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
  mounted(){ // Envoie une requete GET pour obtenir l'utilisateur renseigné dans l'URL
    axios
      .get('http://localhost:3000/api/stuff/' + this.$route.params.id + '/search', {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(response => {
        this.users = response.data;
        this.loading = false;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
</script>