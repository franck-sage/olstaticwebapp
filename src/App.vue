<template>
  <div>Hello {{ value }}
    <div>
      <div v-for="equipe in this.equipes" :key="equipe.id">
        
          {{equipe.Code}} - {{equipe.Nom}}
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
      host:process.env.VUE_APP_STRAPI_API
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
    }

  },
  created(){
    this.authenticate();
    
  },
  mounted(){
   
  }
};
</script>
