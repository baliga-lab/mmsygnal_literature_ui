<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h1>mmSYGNAL Literature Exploration</h1>
      </div>

      <v-spacer></v-spacer>

      <span class="mr-2">Prototype version</span>
    </v-app-bar>

    <v-container fluid>
      <router-view />
    </v-container>
  </v-app>
</template>

<script>

export default {
    name: 'App',
    data: () => ({
    }),
    created: function() {
        document.title = 'mmSYGNAL Literature Exploration';
    },
    mounted: function() {
        this.$router.push('/home', () => {});
    }
};
</script>
