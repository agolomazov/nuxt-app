import Vuex from 'vuex';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts
      },
      addPost(state, post) {
        state.loadedPosts = [
          ...state.loadedPosts,
          post
        ];
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(post => post.id === editedPost.id)
        state.loadedPosts[postIndex] = editedPost;
      },
      setToken(state, token) {
        state.token = token;
      },
      clearToken (state) {
        state.token = null;
      }
    },
    actions: {
      nuxtServerInit({ commit }, { app }) {
        return app.$axios.$get(`/posts.json`).then(res => {
          const posts = [];
          if (res) {
            Object.keys(res).map(key => {
              posts.push({
                ...res[key],
                id: key
              })
            });
            commit('setPosts', posts);
          }
        });
      },
      setPosts({commit}, posts) {
        commit('setPosts', posts)
      },
      addPost({commit, state}, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        };
        return this.$axios.$post(`/posts.json?auth=${state.token}`, createdPost).then(res => {
          commit('addPost', {
            ...createdPost,
            id: res.name
          })
        }).catch(err => {
          console.log(err);
        });
      },
      editPost({ commit, state }, editedPost) {
        return this.$axios.$put(`/posts/${editedPost.id}.json?auth=${state.token}`, editedPost).then((res) => {
          commit('editPost', editedPost);
        }).catch(err => console.log(err));
      },
      authenticateUser({ commit, dispatch }, authData) {
        let url = '';
        if (!authData.isLogin) {
          url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${process.env.fbAPIkey}`;
        } else {
          url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${process.env.fbAPIkey}`;
        }
        return this.$axios.$post(url, {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        }).then(res => {
          commit('setToken', res.idToken);
          dispatch('setLogoutTime', res.expiresIn * 1000);
        });
      },
      setLogoutTime({ commit }, duration) {
        setTimeout(() => {
          commit('clearToken');
        }, duration)
      }
    },
    getters: {
      loadedPosts (state) {
        return state.loadedPosts
      },
      isAuthenticated (state) {
        return state.token !== null
      }
    }
  });
};

export default createStore;
