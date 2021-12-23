<template>
  <div class="drop-wrapper">
    <div class="drop-row" v-for="(row, key) in rows" :key="key">
      <div class="label">
        {{ row.label }}
      </div>
      <ul
        class="drop-area"
        :class="[{ 'drop-area-active': dragging && dragging.boardID !== row.id }]"
        @drop="drop(row.id)"
        @dragover.prevent
        @dragenter.prevent
      >
        <li
          class="drop-task"
          :class="[{ 'active-drop-task': task.id === activeTask.id }]"
          v-for="(task, k) in getRowTasks(row.id)"
          :key="k"
          draggable="true"
          @dragstart="startDrag($event, task, k)"
          @dragend="stopDrag()"
          @drop="dropRow(k)"
          @click="setActiveTask(task)"
        >
          <span class="task-label">{{ task.label }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dropDashboard',
  props: {
    rows: {
      type: Array,
      default() {
        return [];
      },
    },
    tasks: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      activeTask: {},
      dragging: null,
    };
  },
  created() {
    if (this.tasks.length > 0) {
      this.setActiveTask(this.tasks[0]);
    }

    const self = this;
    window.addEventListener('keyup', (event) => {
      if (['ArrowDown', 'ArrowUp'].includes(event.code)) {
        self.rowOrderTask(event.code);
      }

      if (event.shiftKey && ['ArrowRight', 'ArrowLeft'].includes(event.code)) {
        self.columnOrderTask(event.code);
      }
    });
  },
  methods: {
    getRowTasks(id) {
      let list = [];
      if (id) {
        list = this.tasks.filter((item) => item.boardID === id);
      }
      return list;
    },
    setActiveTask(task) {
      this.activeTask = task;
    },
    rowOrderTask(direction) {
      const list = this.getRowTasks(this.activeTask.boardID);

      const currentLocalIndex = list.findIndex((task) => task.id === this.activeTask.id);
      if (this.isCanMovetoRow(currentLocalIndex, list.length, direction)) {
        const currentIndex = this.tasks.findIndex((task) => task.id === this.activeTask.id);

        const nextElement = direction === 'ArrowUp' ? list[currentLocalIndex - 1] : list[currentLocalIndex + 1];
        const nextIndex = this.tasks.findIndex((task) => task.id === nextElement.id);
        return this.rowMove(currentIndex, nextIndex);
      }

      return false;
    },
    isCanMovetoRow(index, listLength, direction) {
      return !((index === 0 && direction === 'ArrowUp') || (index === listLength - 1 && direction === 'ArrowDown'));
    },
    rowMove(from, to) {
      this.$emit('rowMove', { from, to });
    },
    columnOrderTask(direction) {
      const boardPosition = this.rows.findIndex((row) => row.id === this.activeTask.boardID);
      if (direction === 'ArrowRight' && this.rows.length - 1 > boardPosition) {
        const nextBoard = this.rows[boardPosition + 1];
        this.$emit('onDrop', { board: nextBoard.id, id: this.activeTask.id });
      }

      if (direction === 'ArrowLeft' && boardPosition > 0) {
        const nextBoard = this.rows[boardPosition - 1];
        this.$emit('onDrop', { board: nextBoard.id, id: this.activeTask.id });
      }

      return false;
    },
    startDrag($event, task, position) {
      const event = $event;
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      this.dragging = task;
      this.dragging.position = position;
    },
    stopDrag() {
      this.dragging = null;
    },
    drop(board) {
      const params = {
        id: this.dragging.id,
        board,
      };
      this.$emit('onDrop', params);
    },
    dropRow(newPosition) {
      const list = this.getRowTasks(this.dragging.boardID);
      const oldElementOnNewPosition = list[newPosition];
      const currentIndex = this.tasks.findIndex((task) => task.id === this.dragging.id);
      const newIndex = this.tasks.findIndex((task) => task.id === oldElementOnNewPosition.id);

      this.$emit('rowMove', { from: currentIndex, to: newIndex });
    },
  },
};
</script>

<style scoped>
.drop-wrapper {
  --border-color: #e0e0e0;
  --active-background-color: #f9f9f9;
  --hover-font-color: #6b6b6b;
  --bage-color: #ff7539;
}
.drop-wrapper {
  display: flex;
  justify-content: space-between;
}

.drop-row {
  width: 200px;
}

.label {
  text-align: center;
}

.drop-area {
  padding: 16px 0;
  min-height: 50px;
}

.drop-area-active {
  background-color: var(--active-background-color);
  border-radius: 6px;
}

.drop-task {
  width: 100%;
  height: 40px;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  list-style-type: none;
  position: relative;
  overflow: hidden;
  cursor: move;
  box-sizing: border-box;
  background: #fff;
}

.drop-task:hover {
  background-color: var(--active-background-color);
  color: var(--hover-font-color);
}

.drop-task:not(:first-child) {
  margin-top: -1px;
}

.drop-task:first-child {
  border-radius: 6px 6px 0 0;
}

.drop-task:last-child {
  border-radius: 0 0 6px 6px;
}

.drop-task:first-child:last-child {
  border-radius: 6px;
}

.task-label {
  margin-left: 16px;
}

.active-drop-task:before {
  content: '';
  width: 4px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: var(--bage-color);
}
</style>
