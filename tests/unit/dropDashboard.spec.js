import { shallowMount } from '@vue/test-utils';
import dropDashboard from '@/components/dropDashboard.vue';

describe('dropDashboard.vue', () => {
  let wrapper;
  let vm;

  beforeEach(async () => {
    wrapper = shallowMount(dropDashboard);
    vm = wrapper.vm;
  });

  test('is a Vue instance, check props default values', () => {
    expect(wrapper).toBeTruthy();
    expect(vm.rows).toEqual([]);
    expect(vm.tasks).toEqual([]);
    expect(vm.activeTask).toEqual({});
  });

  test('getRowTasks', async () => {
    expect(vm.getRowTasks()).toEqual([]);
    await wrapper.setProps({
      tasks: [
        { boardID: 1, label: 1 },
        { boardID: 1, label: 2 },
        { boardID: 2, label: 3 },
      ],
    });
    expect(vm.getRowTasks(1)).toEqual([
      { boardID: 1, label: 1 },
      { boardID: 1, label: 2 },
    ]);
    expect(vm.getRowTasks(2)).toEqual([{ boardID: 2, label: 3 }]);
  });

  test('setActiveTask', () => {
    expect(vm.activeTask).toEqual({});
    vm.setActiveTask({ boardID: 1, label: 1, id: 10 });
    expect(vm.activeTask).toEqual({ boardID: 1, label: 1, id: 10 });
  });

  test('rowMove', () => {
    const emitted = wrapper.emitted();
    vm.rowMove(0, 10);
    // eslint-disable-next-line
    expect(emitted).toHaveBeenCalled;
    expect(emitted.rowMove).toEqual([[{ from: 0, to: 10 }]]);
  });

  test('stopDrag', () => {
    vm.dragging = { id: 1 };
    vm.stopDrag();
    expect(vm.dragging).toEqual(null);
  });

  test('drop', () => {
    vm.dragging = { id: 1 };
    const emitted = wrapper.emitted();
    vm.drop(10);
    // eslint-disable-next-line
    expect(emitted).toHaveBeenCalled;
    expect(emitted.onDrop).toEqual([[{ id: 1, board: 10 }]]);
  });

  test('startDrag', async () => {
    const $event = {
      dataTransfer: {
        dropEffect: null,
        effectAllowed: null,
      },
    };

    vm.startDrag($event, { id: 1, label: 'css' }, 10);
    expect(vm.dragging).toEqual({ id: 1, label: 'css', position: 10 });
  });

  test('dropRow', async () => {
    const emitted = wrapper.emitted();
    await wrapper.setProps({
      tasks: [
        { id: 1, boardID: 1, label: 1 },
        { id: 2, boardID: 1, label: 2 },
        { id: 3, boardID: 1, label: 3 },
      ],
    });

    vm.dragging = { id: 1, boardID: 1 };
    vm.dropRow(2);
    // eslint-disable-next-line
    expect(emitted).toHaveBeenCalled;
    expect(emitted.rowMove).toEqual([[{ from: 0, to: 2 }]]);
  });

  test('isCanMovetoRow', () => {
    expect(vm.isCanMovetoRow(0, 2, 'ArrowDown')).toEqual(true);
    expect(vm.isCanMovetoRow(1, 2, 'ArrowDown')).toEqual(false);
    expect(vm.isCanMovetoRow(1, 2, 'ArrowUp')).toEqual(true);
    expect(vm.isCanMovetoRow(0, 2, 'ArrowUp')).toEqual(false);
  });

  describe('rowOrderTask', () => {
    test('ArrowDown(can down)', async () => {
      await wrapper.setProps({
        tasks: [
          { id: 1, boardID: 1, label: 1 },
          { id: 2, boardID: 1, label: 2 },
          { id: 3, boardID: 1, label: 3 },
        ],
      });

      vm.activeTask = { id: 1, boardID: 1, label: 1 };
      const emitted = wrapper.emitted();
      vm.rowOrderTask('ArrowDown');

      expect(emitted.rowMove).toEqual([[{ from: 0, to: 1 }]]);
    });

    test('ArrowDown(no down)', async () => {
      await wrapper.setProps({
        tasks: [
          { id: 1, boardID: 1, label: 1 },
          { id: 2, boardID: 1, label: 2 },
          { id: 3, boardID: 1, label: 3 },
        ],
      });

      vm.activeTask = { id: 3, boardID: 1, label: 1 };
      expect(vm.rowOrderTask('ArrowDown')).toEqual(false);
    });

    test('ArrowUp(can up)', async () => {
      await wrapper.setProps({
        tasks: [
          { id: 1, boardID: 1, label: 1 },
          { id: 2, boardID: 1, label: 2 },
          { id: 3, boardID: 1, label: 3 },
        ],
      });

      vm.activeTask = { id: 2, boardID: 1, label: 1 };
      const emitted = wrapper.emitted();
      vm.rowOrderTask('ArrowUp');

      expect(emitted.rowMove).toEqual([[{ from: 1, to: 0 }]]);
    });

    test('ArrowUp(no up)', async () => {
      await wrapper.setProps({
        tasks: [
          { id: 1, boardID: 1, label: 1 },
          { id: 2, boardID: 1, label: 2 },
          { id: 3, boardID: 1, label: 3 },
        ],
      });

      vm.activeTask = { id: 1, boardID: 1, label: 1 };
      expect(vm.rowOrderTask('ArrowUp')).toEqual(false);
    });
  });

  describe('columnOrderTask', () => {
    test('ArrowRight(can right)', async () => {
      await wrapper.setProps({
        tasks: [
          { id: 1, boardID: 1, label: 1 },
          { id: 2, boardID: 2, label: 2 },
          { id: 3, boardID: 3, label: 3 },
        ],
        rows: [{ id: 1 }, { id: 2 }, { id: 3 }],
      });

      vm.activeTask = { id: 1, boardID: 1, label: 1 };
      const emitted = wrapper.emitted();
      vm.columnOrderTask('ArrowRight');

      expect(emitted.onDrop).toEqual([[{ board: 2, id: 1 }]]);
    });

    test('ArrowRight(no right)', async () => {
      await wrapper.setProps({
        tasks: [
          { id: 1, boardID: 1, label: 1 },
          { id: 2, boardID: 2, label: 2 },
          { id: 3, boardID: 3, label: 3 },
        ],
        rows: [{ id: 1 }, { id: 2 }, { id: 3 }],
      });

      vm.activeTask = { id: 3, boardID: 3, label: 3 };
      expect(vm.columnOrderTask('ArrowRight')).toEqual(false);
    });

    test('ArrowRight(can left)', async () => {
      await wrapper.setProps({
        tasks: [
          { id: 1, boardID: 1, label: 1 },
          { id: 2, boardID: 2, label: 2 },
          { id: 3, boardID: 3, label: 3 },
        ],
        rows: [{ id: 1 }, { id: 2 }, { id: 3 }],
      });

      vm.activeTask = { id: 2, boardID: 2, label: 2 };
      const emitted = wrapper.emitted();
      vm.columnOrderTask('ArrowLeft');

      expect(emitted.onDrop).toEqual([[{ board: 1, id: 2 }]]);
    });

    test('ArrowLeft(no left)', async () => {
      await wrapper.setProps({
        tasks: [
          { id: 1, boardID: 1, label: 1 },
          { id: 2, boardID: 2, label: 2 },
          { id: 3, boardID: 3, label: 3 },
        ],
        rows: [{ id: 1 }, { id: 2 }, { id: 3 }],
      });

      vm.activeTask = { id: 1, boardID: 1, label: 1 };
      expect(vm.columnOrderTask('ArrowLeft')).toEqual(false);
    });
  });
});
