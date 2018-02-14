import Vuex from 'vuex';
import Cookie from 'js-cookie';

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
      },
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
          localStorage.setItem('token', res.idToken);
          localStorage.setItem('tokenExpiration', new Date().getTime() + Number.parseInt(res.expiresIn) * 1000);
          Cookie.set('jwt', res.idToken);
          Cookie.set('expirationDate', new Date().getTime() + Number.parseInt(res.expiresIn) * 1000);
        });
      },
      initAuth ({ commit, dispatch }, req) {
        let token;
        let expirationDate;
        if (req) {
          if(!req.headers.cookie) {
            return;
          }
          const jwtCookie = req.headers.cookie
                              .split(';')
                              .find(c => c.trim().startsWith('jwt='));
          if (!jwtCookie) {
            return;
          }
          token = jwtCookie.split('=')[1];
          expirationDate = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('expirationDate='))
            .split('=')[1];
        } else {
          token = localStorage.getItem('token');
          expirationDate = localStorage.getItem('tokenExpiration');
        }

        if (new Date().getTime() > +expirationDate || !token) {
          console.log('No token or invalid token');
          dispatch('logout');
          return;
        }
        commit('setToken', token);
      },
      logout ({ commit, isClient }) {
        commit('clearToken');
        Cookie.remove('jwt');
        Cookie.remove('expirationDate');
        if(isClient) {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiration');
        }
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
