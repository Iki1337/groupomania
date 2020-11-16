<template>
  <div class="messages">
    <aside class="rechercheConv">
      <input class="inputSearch" type="search" placeholder="Rechercher un utilisateur" v-model="searchInput" @keyup.enter="checkResearch">
      <div class="caseConv" v-for="user in usersResults" :key="user" @click="captureId(user.id, user.nom, user.prenom, user.url_photo_profil)">
        <img class="imgProfilConv" :src="user.url_photo_profil" alt="">
        <p class="identiteUserConv">{{ user.prenom }} {{ user.nom }}</p>
      </div>
    </aside>

    <div class="convCentrale">
      <div class="conteneurConv" v-if="this.destinataireId && this.destinataireImgPrfil && this.destinataireNom && this.destinatairePrenom">
        <div class="entete">
          <img class="imgProfilConv" :src="this.destinataireImgPrfil + '?rnd=' + cacheKey" alt="">
          <router-link :to="'/user/' + this.destinataireId"><p class="identiteUserConv">{{ destinatairePrenom }} {{ destinataireNom }}</p></router-link>
        </div>
        <hr class="case1Hr">
        <div class="contMessages" id="contMessages">
          <div class="bullesMessages" v-for="message in messages" :key="message" :class="{'messageExp':(message.idEnvoyeur === this.$store.state.userId), 'messageDest':(message.idEnvoyeur !== this.$store.state.userId)}">
            <p class="dateMessage">{{ new Date(message.date_ecriture).toLocaleString('fr-FR', { hour12: false }) }}</p>
            <p>{{ message.contenu }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="conteneurClavier" v-if="this.destinataireId && this.destinataireImgPrfil && this.destinataireNom && this.destinatairePrenom">
      <textarea class="clavier" id="uploadMessage" placeholder="Votre message..."></textarea><div class="conteneurIco" @click="captureMessage()"><i class="far fa-paper-plane"></i></div>
    </div>

    <div class="refreshConv" @click="refreshConv()"><i class="fas fa-sync-alt"></i></div>
  </div>
</template>

<style scoped>
.messages{
  margin-left: 15px;
}

.rechercheConv{
  width: 25%;
  height: 95vh;
  border: solid 2px #595959;
  border-radius: 15px;
  padding: 10px;
  float: left;
}

.inputSearch{
  width: 100%;
  margin-bottom: 15px;
}

.caseConv{
  background-color: #595959;
  border-radius: 15px;
  padding-left: 8px;
  padding-top: 6px;
  padding-bottom: 6px;
  cursor: pointer;
  margin-bottom: 7px;
}

.caseConv:hover{
  background-color: #797979;
}

.imgProfilConv{
  width: 50px;
  height: 50px;
  border: solid 2px white;
  border-radius: 100px;
  vertical-align:middle;
}

.identiteUserConv{
  display: inline-block;
  font-family: 'Open Sans', sans-serif;
  font-size: 15px;
  color: white;
  margin-left: 10%;
}

.convCentrale{
  width: 60%;
  margin-left: 7%;
  height: 85vh;
  border: solid 2px #595959;
  border-radius: 15px;
  float: left;
}

.conteneurConv{
  height: 100%;
  position: relative;
}

.contMessages{
  position: absolute;
  overflow-y: scroll;
  min-height:200px;
  height:75%;
  width: 100%;
  bottom:10px;
  scrollbar-color: #777777 #303030;
  scrollbar-width: thin;
}

.entete{
  padding: 10px;
  text-align: center;
}

.conteneurClavier{
  width: 60%;
  float: left;
  margin-top: 30px;
  margin-left: 7%;
}

.clavier{
  width: 70%;
  height: 60px;
  background-color:#777777;
  padding: 10px;
  border: none;
  border-radius: 15px;
  font-family: 'Open Sans', sans-serif;
  font-size: 18px;
  color: white;
  transition: .3s;
}

.clavier:focus{
  background-color:#000000;
  }

.conteneurClavier svg{
  font-size: 40px;
  color: #ffffff;
  transition: .3s;
  cursor: pointer;
}

.conteneurClavier svg:hover{
  color: rgb(255, 106, 0);
}

.conteneurIco{
  float: right;
  margin-top: 22px;
}

.bullesMessages{
  color: white;
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  width: 51%;
  margin: 5px;
  border-radius: 20px;
}

.messageExp{
  background-color:#5f5f5f;
  float: right;
}

.messageDest{
  background-color:#000000;
  float: left;
}

.bullesMessages .messageExp p{
  background-color:#777777;
}

.dateMessage{
  font-size: 11px;
  font-style: italic;
}

.refreshConv{
  position: fixed;
  top: 0px;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.refreshConv svg{
  color: white;
  font-size: 35px;
  transition: .3s;
}

.refreshConv svg:hover{
  color: rgb(255, 106, 0);
}

@media screen and (max-width: 450px) {
  .rechercheConv {
    width: 60px;
    padding: 4px;
  }

  .caseConv{
    padding: 2px;
  }

  .identiteUserConv{
    display: none;
  }

  .rechercheConv{
    height: 83vh;
  }

  .conteneurClavier svg{
    font-size: 25px;
  }
}
</style>

<script>
import axios from 'axios'

export default {
  name: 'Messages',
  data() {
    return {
      searchInput: null,
      usersResults: null,

      destinataireId: null,
      destinataireImgPrfil: null,
      destinataireNom: null,
      destinatairePrenom: null,

      messages: null,

      interval: undefined,
      cacheKey: +new Date(),
    }
  },
  beforeMount() {
    if(this.$store.state.connexion == true){
      document.getElementById("conteneur").style.marginLeft = "60px";
    }else{
      this.$router.push({ name: 'Auth' });
    }

  },
  created() {
    /*this.interval = setInterval(() => {
      this.cacheKey = +new Date();
    }, 60 * 1000);*/
  },
  mounted() {
    window.setInterval(function(){}, 2000);
  },
  unmounted() {
    clearInterval(this.interval);
  },
  methods:{
    checkResearch(){ // Recherche du destinataire
      axios
      .get('http://localhost:3000/api/stuff/' + this.searchInput + '/search', {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          "Content-Type": "application/json",
        }
      })
      .then(response => {
        this.usersResults = response.data;
        this.searchInput = null;
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    captureId(destinataireId, destinataireNom, destinatairePrenom, destinataireUrl_photo_profil){ // Récupération de données du profil du destinataire
      this.destinataireId = destinataireId;
      this.destinataireNom = destinataireNom;
      this.destinatairePrenom = destinatairePrenom;
      this.destinataireImgPrfil = destinataireUrl_photo_profil;

      let sendObject = {
        idExpediteur: this.$store.state.userId,
        idDestinataire: this.destinataireId,
      };

      this.requeteMessage(sendObject);

      /*this.interval = setInterval(() => {
        this.requeteMessage(sendObject);
      }, 3000);*/
    },
    refreshConv(){ // Obtenir une version plus récente de la conversation
      let sendObject = {
        idExpediteur: this.$store.state.userId,
        idDestinataire: this.destinataireId,
      };

      this.requeteMessage(sendObject);
    },
    requeteMessage(sendObject){ // Récupérer les messages d'une conversation grâce à une requete POST, qui (contrairement a une requete GET) va nous permettre d'envoyer un formData dans lequel on va trouver tout les paramètres dont le backend aura besoin 
      axios
        .post('http://localhost:3000/api/stuff/recup_messages',sendObject, {
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            "Content-Type": "application/json",
          }
        })
        .then(response => {
          this.messages = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });

      var elementScroll = document.getElementById('contMessages');
      if(elementScroll){
        elementScroll.scrollTop = elementScroll.scrollHeight;
      }
    },
    captureMessage(){ // Récupère le message qui vient d'être crée et l'envoie par requete POST
      let message = document.getElementById('uploadMessage').value;
      let sendObject = {
        idExpediteur: this.$store.state.userId,
        idDestinataire: this.destinataireId,
        contenu: message
      };

      axios
        .post('http://localhost:3000/api/stuff/messages',sendObject, {
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            "Content-Type": "application/json",
          }
        })
        .then(
         document.getElementById('uploadMessage').value = null,
         this.refreshConv()
        )
        .catch(function (error) {
          console.log(error);
        });
    },
  },
}
</script>