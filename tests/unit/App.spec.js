import { shallowMount } from '@vue/test-utils';
import AppComponent from '@/App.vue';

describe('App.vue', () => {
  let wrapper;
  let vm;

  beforeEach(async () => {
    wrapper = shallowMount(AppComponent);
    vm = wrapper.vm;
  });

  test('is a Vue instance, check props default values', () => {
    expect(wrapper).toBeTruthy();
  });

  test('onDrop', () => {
    const data = vm.tasks.find((task) => task.id === 1);
    expect(data.boardID).toEqual(1);
    vm.onDrop({ id: 1, board: 2 });
    expect(data.boardID).toEqual(2);
  });

  test('rowMove', () => {
    let firstIndex = vm.tasks.findIndex((task) => task.id === 1);
    let secondIndex = vm.tasks.findIndex((task) => task.id === 2);

    expect(firstIndex).toEqual(0);
    expect(secondIndex).toEqual(1);
    vm.rowMove({ from: 0, to: 1 });

    firstIndex = vm.tasks.findIndex((task) => task.id === 1);
    secondIndex = vm.tasks.findIndex((task) => task.id === 2);

    expect(firstIndex).toEqual(1);
    expect(secondIndex).toEqual(0);
  });
});
