import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const types = {
  SET_IS_AUTNENTIATED: "SET_IS_AUTNENTIATED", // 是否认证通过
  SET_USER: "SET_USER", // 用户信息
};

const state = {
  // 需要维护的状态
  isAutnenticated: false, // 是否认证
  user: {}, // 存储用户信息
  _defaultMapView: "", //默认地图view
  setChartConfig: {},
};

const getters = {
  isAutnenticated: (state) => state.isAutnenticated,
  user: (state) => state.user,
  _getDefaultMapView: (state) => state._defaultMapView,
  getChartConfig: state => state.setChartConfig,
};

const mutations = {
  [types.SET_IS_AUTNENTIATED](state, isAutnenticated) {
    if (isAutnenticated) state.isAutnenticated = isAutnenticated;
    else state.isAutnenticated = false;
  },
  [types.SET_USER](state, user) {
    if (user) state.user = user;
    else state.user = {};
  },
  _setDefaultMapView(state, value) {
    state._defaultMapView = value;
  },
  setChartConfig(state, payload) {
    state.setChartConfig = payload;
  }

};

const actions = {
  setIsAutnenticated: ({ commit }, isAutnenticated) => {
    commit(types.SET_IS_AUTNENTIATED, isAutnenticated);
  },
  setUser: ({ commit }, user) => {
    commit(types.SET_USER, user);
  },
  clearCurrentState: ({ commit }) => {
    commit(types.SET_IS_AUTNENTIATED, false);
    commit(types.SET_USER, null);
  },
  setDefaultMapView: ({ commit }, value) => {
    commit("_setDefaultMapView", value);
  },
  setChartConfig: ({ commit }, value) => {
    commit("setChartConfig", value);
  },
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
