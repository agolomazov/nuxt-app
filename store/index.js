import Vuex from 'vuex';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
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
      addPost({commit}, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        };
        return this.$axios.$post('/posts.json', createdPost).then(res => {
          commit('addPost', {
            ...createdPost,
            id: res.name
          })
        }).catch(err => {
          console.log(err);
        });
      },
      editPost({ commit }, editedPost) {
        return this.$axios.$put(`/posts/${editedPost.id}.json`, editedPost).then((res) => {
          commit('editPost', editedPost);
        }).catch(err => console.log(err));
      }
    },
    getters: {
      loadedPosts (state) {
        return state.loadedPosts
      }
    }
  });
};

export default createStore;
