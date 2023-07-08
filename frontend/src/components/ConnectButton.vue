<template>
  <div id="connectButton">

      // close init connect
      <vue-metamask ref="metamask" :initConnect="false"></vue-metamask>
      
      // click button call Init
      <button @click="connect">connect</button>
  </div>
</template>

<script>
    import VueMetamask from 'vue-metamask';
    export default {
        components: {
            VueMetamask,
        },
        methods:{
            connect() {
                this.$refs.metamask.init();
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
