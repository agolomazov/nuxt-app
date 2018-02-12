<template>
  <div class="single-post-page">
    <section class="post">
      <h1 class="post-title">{{ loadedPost.title }}</h1>
      <div class="post-details">
        <div class="post-detail">Last updated on {{ updatedPost}}</div>
        <div class="post-detail">Written by {{ loadedPost.author }}</div>
      </div>
      <img
        :src="loadedPost.thumbnail"
        alt=""
        width="300"
      >
      <p class="post-content">{{ loadedPost.content }}</p>
    </section>
    <section class="post-feedback">
      <p>Let me know what you think about the post, send a mail to <a href="mailto:my-awesome-domain.com">my-awesome-domain.com</a>
      </p>
    </section>
  </div>
</template>

<script>
  import axios from 'axios';
  import moment from 'moment';

  export default {
    asyncData(context) {
      return axios.get(`https://nuxt-blog-9c349.firebaseio.com/posts/${context.params.id}.json`).then(res => {
        return {
          loadedPost: res.data,
          title: res.data.title
        }
      })
    },
    computed: {
      updatedPost () {
        return moment(this.loadedPost.updatedDate).format('DD-MM-YYYY H:m');
      }
    },
    head() {
      return {
        title: `Super title || ${this.title}`
      }
    }
  }
</script>

<style scoped>
  .single-post-page {
    padding: 30px;
    text-align: center;
    box-sizing: border-box;
  }

  .post {
    width: 100%;
  }

  @media (min-width: 768px) {
    .post {
      width: 600px;
      margin: auto;
    }
  }

  .post-title {
    margin: 0;
  }

  .post-details {
    padding: 10px;
    box-sizing: border-box;
    border-bottom: 3px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  @media (min-width: 768px) {
    .post-details {
      flex-direction: row;
    }
  }

  .post-detail {
    color: rgb(88, 88, 88);
    margin: 0 10px;
  }

  .post-feedback a {
    color: red;
    text-decoration: none;
  }

  .post-feedback a:hover,
  .post-feedback a:active {
    color: salmon;
  }
</style>
