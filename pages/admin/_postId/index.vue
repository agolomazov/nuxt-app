<template>
  <div class="admin-post-page">
    <div class="update-form">
      <AdminPostForm
        :post="loadedPost"
        @submit="onSubmitted"
      />
    </div>
  </div>
</template>

<script>
  import AdminPostForm from '~/components/Admin/AdminPostForm';
  import axios from 'axios';

  export default {
    layout: 'admin',
    asyncData(context) {
      return axios.get(`https://nuxt-blog-9c349.firebaseio.com/posts/${context.params.postId}.json`).then(res => {
        return {
          loadedPost: res.data
        }
      });
    },
    methods: {
      onSubmitted (payload) {
        this.$store.dispatch('editPost', {
          ...payload,
          id: this.$route.params.postId
        }).then(() => {
          this.$router.push('/admin');
        });
      }
    },
    components: {
      AdminPostForm
    }
  }
</script>

<style scoped>
  .update-form {
    width: 90%;
    margin: 20px auto;
  }

  @media (min-width: 768px) {
    .update-form {
      width: 500px;
    }
  }
</style>
