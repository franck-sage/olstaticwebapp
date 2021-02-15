<template>
  <div>
    <div>
      Appel &aacute; l'application Strapi
      <table id="TeamTable">
          <tr class="TeamHeader">
          <th style="width:60%;">Code</th>
          <th style="width:40%;">Nom</th>
        </tr>
        <tr v-for="equipe in this.equipes" :key="equipe.id">
            <td>{{equipe.Code}}</td><td>{{equipe.Nom}}</td>
        </tr>
      </table>
    </div>
    <hr/>
    <div>
      Comptes Sociaux
      <div>
        <div v-if="socialNetworkUserInfo == null" class="col">
          <a href="/.auth/login/aad" class="windows btn"><i class="fa fa-windows fa-fw"></i> Login with Microsoft</a>
          
          <a href="/.auth/login/google" class="google btn"><i class="fa fa-google fa-fw"></i> Login with Google</a>
          
          <a href="/.auth/login/twitter" class="twitter btn"><i class="fa fa-twitter fa-fw"></i> Login with Twitter</a>
          
          <a href="/.auth/login/facebook" class="fb btn"> <i class="fa fa-facebook fa-fw"></i> Login with Facebook</a>
        </div>
        <div v-else>
          Connect&eacute; en tant que 
          <span v-if="socialNetworkUserInfo.identityProvider == 'google'" class="btn google">
            <i class="fa fa-google fa-fw"></i> {{socialNetworkUserInfo.userDetails}}
          </span>
          <span v-if="socialNetworkUserInfo.identityProvider == 'aad'" class="btn windows" >
            <i   class="fa fa-windows fa-fw"></i> {{socialNetworkUserInfo.userDetails}}
          </span>
          <span v-if="socialNetworkUserInfo.identityProvider == 'twitter'" class="btn twitter">
            <i   class="fa fa-twitter fa-fw"></i> {{socialNetworkUserInfo.userDetails}}
          </span>
          <span v-if="socialNetworkUserInfo.identityProvider == 'facebook'" class="btn fb">
            <i class="fa fa-facebook fa-fw"></i>  {{socialNetworkUserInfo.userDetails}}
          </span>
          
          <a class="btn" href="/.auth/logout">Se Deconnecter</a> 
          
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
    <hr/>
    <div>
      Appel &aacute; l'API de cette application
        <table id="TeamTable">
          <tr class="TeamHeader">
          <th style="width:25%;">Partition</th>
          <th style="width:25%;">Row</th>
          <th style="width:25%;">Data1</th>
          <th style="width:25%;">Data2</th>
        </tr>
        <tr v-for="datares in this.apidataresult" :key="datares.RowKey">
            <td>{{datares.PartitionKey}}</td><td>{{datares.RowKey}}</td><td>{{datares.data1}}</td><td>{{datares.data2}}</td>
        </tr>
      </table>
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
      socialNetworkUserInfo: null,
      config:null,
      apidataresult:null
    };
  },
  methods:{
    getInitialConfig(){
      var userId = process.env.VUE_APP_STRAPI_USER;
      var userPassword = process.env.VUE_APP_STRAPI_PASSWORD;
      var host = process.env.VUE_APP_STRAPI_API;
      if(userId && userPassword && host){
        this.config = {
          login:userId,
          password: userPassword,
          host: host    
        }
        this.authenticate();
      }else {
        var self = this;
        fetch('/api/config', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }).then(response => response.json())
        .then(data => {
          self.config = data;
          self.authenticate();
        });
      }
    },
    authenticate(){
      var self = this;
      if(!self.isLogged){
        fetch(self.config.host+'/auth/local', {
          method: 'POST',
          body: JSON.stringify({
            identifier: self.config.login,
            password:self.config.password}),
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
        fetch(self.config.host +'/equipes',{
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
    },
    fetchdata(){
      var self = this;
      fetch("/api/data").then(
        response => response.json()
      ).then(
        data => {self.apidataresult = data;}
      )
    }


  },
  created(){
    this.getInitialConfig();
    this.getSocialUserInfo();
    this.fetchdata();
    
  },
  mounted(){
   
  },
  computed:{
  }
};
</script>

<style>
body {
  font-family: Arial, Helvetica, sans-serif;
}

* {
  box-sizing: border-box;
}

#TeamTable {
  border-collapse: collapse; /* Collapse borders */
  width: 100%; /* Full-width */
  border: 1px solid #ddd; /* Add a grey border */
  font-size: 18px; /* Increase font-size */
}

#TeamTable th, #TeamTable td {
  text-align: left; /* Left-align text */
  padding: 12px; /* Add padding */
}

#TeamTable tr {
  /* Add a bottom border to all table rows */
  border-bottom: 1px solid #ddd;
}

#TeamTable tr.TeamHeader, #TeamTable tr:hover {
  /* Add a grey background color to the table header and on hover */
  background-color: #f1f1f1;
}

/* style inputs and link buttons */
input,
.btn {
  width: 100%;
  max-width: 250px;
  padding: 12px;
  border: none;
  border-radius: 4px;
  margin: 5px 5px;
  opacity: 0.85;
  display: inline-block;
  font-size: 17px;
  line-height: 20px;
  text-decoration: none; /* remove underline from anchors */
}

/* add appropriate colors to fb, twitter and google buttons */
.fb {
  background-color: #3B5998;
  color: white;
}

.twitter {
  background-color: #55ACEE;
  color: white;
}

.google {
  background-color: #dd4b39;
  color: white;
}

.windows {
  background-color: #00C3F4;
  color: white;  
}

.logout {
  background-color: #cecece3f;
  color: white;  
}
</style>
