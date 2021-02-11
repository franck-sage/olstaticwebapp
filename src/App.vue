<template>
  <div>Hello {{ value }}
    <div>
      <div v-for="equipe in this.equipes" :key="equipe.id">
        
          {{equipe.Code}} - {{equipe.Nom}}
      </div>
    </div>
    <hr/>
    <div>
      Comptes Sociaux
      <div>
        <div v-if="socialNetworkUserInfo == null">
          <div>
            <a href="/.auth/login/google">Login with Google</a>
          </div>
          <div>
            <a href="/.auth/login/twitter">Login with Twitter</a>
          </div>
          <div>
            <a href="/.auth/login/facebook">Login with Facebook</a>
          </div>
        </div>
        <div v-else>
          <div>{{socialNetworkUserInfo.userDetails}} </div>
          <div>{{socialNetworkUserInfo.identityProvider}} </div>
          <div>{{socialNetworkUserInfo.userId}} </div>
          <div>{{socialNetworkUserInfo.userRoles}} </div>
          <div>
            <a href="/.auth/logout">Log out</a> 
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "App",
  data() {
    return {
      value: "World",
      isLogged: false,
      token: "",
      user: null,
      equipes:null, 
      host:process.env.VUE_APP_STRAPI_API,
      socialNetworkUserInfo: null
    };
  },
  methods:{
    authenticate(){
      var self = this;
      if(!self.isLogged){
        fetch(self.host+'/auth/local', {
          method: 'POST',
          body: JSON.stringify({
            identifier:'franck.sage@free.fr',
            password:'Pa$$w0rd'}),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => response.json())
        .then(data => {
                  
                  self.token = data.jwt;
                  self.user = data.user;
                  self.fetchequipe();}
        );
      }
    },
    fetchequipe(){
      var self = this;
      if (self.equipes==null){
        fetch(self.host+'/equipes',{
          method:'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+self.token
          }
        }).then(response => response.json())
        .then(data => {
          self.equipes = data;
        });
      }
    },
    getSocialUserInfo(){
      var self = this;
      fetch("/.auth/me").then(
        response => response.json()
      ).then(data => self.socialNetworkUserInfo = data.clientPrincipal);
    }

  },
  created(){
    this.authenticate();
    this.getSocialUserInfo();
    
  },
  mounted(){
   
  },
  computed:{
  }
};
</script>
