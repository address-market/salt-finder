<template>
  <MetaMask/>
  <!-- <ConnectButton msg="Welcome to Your Vue.js App"/>
  <status-container/> -->
</template>

<script>
import MetaMask from './components/MetaMask.vue'
// import ConnectButton from './components/ConnectButton.vue'
// import StatusContainer from './components/StatusContainer.vue'

export default {
  name: 'App',
  components: {
    MetaMask
    // ConnectButton,
    // StatusContainer
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
