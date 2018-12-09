export default {
  nameSpace: 'app',
  state: {
    loading: '',
    tool: true,
  },
  reducers: {
    showLoading(state, { payload }) {
      state.loading = payload.loading;
    },
    hideLoading(state) {
      state.loading = '';
    },
  },
};
