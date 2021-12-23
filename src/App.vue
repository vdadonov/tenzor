<template>
  <div id="app">
    <div class="content">
      <drop-dashboard
        :rows="rows"
        :tasks="tasks"
        @rowMove="rowMove"
        @columnOrderTask="onDrop"
        @onDrop="onDrop"
      />
    </div>
  </div>
</template>

<script>
import dropDashboard from './components/dropDashboard.vue';

export default {
  name: 'App',
  components: {
    dropDashboard,
  },
  data() {
    return {
      rows: [
        { id: 1, label: 'В план' },
        { id: 2, label: 'В процессе' },
        { id: 3, label: 'Готовы' },
      ],
      tasks: [
        {
          id: 1,
          label: 'HTML',
          boardID: 1,
        },
        {
          id: 2,
          label: 'CSS',
          boardID: 1,
        },
        {
          id: 3,
          label: 'JavaScript',
          boardID: 1,
        },
        {
          id: 4,
          label: 'TypeScript',
          boardID: 1,
        },
        {
          id: 5,
          label: 'Git',
          boardID: 1,
        },
      ],
    };
  },
  methods: {
    rowMove(data) {
      let numberOfDeletedElm = 1;
      const elm = this.tasks.splice(data.from, numberOfDeletedElm)[0];
      numberOfDeletedElm = 0;
      this.tasks.splice(data.to, numberOfDeletedElm, elm);
    },
    onDrop(data) {
      const elm = this.tasks.find((item) => item.id === data.id);
      elm.boardID = data.board;
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
}

.content {
  max-width: 760px;
  width: 100%;
  margin-top: 50px;
}
</style>
