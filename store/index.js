import Vuex from 'vuex';
import axios from 'axios';

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
      nuxtServerInit(vuexContext, context) {
        return axios.get('https://nuxt-blog-9c349.firebaseio.com/posts.json').then(res => {
          const posts = [];
          if (res.data) {
            Object.keys(res.data).map(key => {
              posts.push({
                ...res.data[key],
                id: key
              })
            });
            vuexContext.commit('setPosts', posts);
          }
        });
      },
      setPosts({commit}, posts) {
        commit('setPosts', posts)
      },
      addPost(vuexContext, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        };
        return axios.post('https://nuxt-blog-9c349.firebaseio.com/posts.json', createdPost).then(result => {
          vuexContext.commit('addPost', {
            ...createdPost,
            id: result.data.name
          })
        }).catch(err => {
          console.log(err);
        });
      },
      editPost(vuexContext, editedPost) {
        return axios.put(`https://nuxt-blog-9c349.firebaseio.com/posts/${editedPost.id}.json`, editedPost).then((res) => {
          vuexContext.commit('editPost', editedPost);
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
