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

  export default {
    layout: 'admin',
    asyncData({ app, params }) {
      return app.$axios.$get(`/posts/${params.postId}.json`).then(res => {
        return {
          loadedPost: res
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
    },
    head: {
      title: 'Редактирование поста'
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
