export default {
  nameSpace: 'app',
  state: {
    loading: '',
  },
  reducers: {
    showLoading(state, { payload }) {
      console.log(payload)
      state.loading = true;
    },
    hideLoading(state) {
      state.loading = false;
    },
  },
};
