<template>
  <div class="admin-new-post-page">
    <section class="new-post-form">
      <AdminPostForm
        @submit="onSubmitted"
      />
    </section>
  </div>
</template>

<script>
  import AdminPostForm from '~/components/Admin/AdminPostForm'

  export default {
    name: 'NewPost',
    layout: 'admin',
    components: {
      AdminPostForm
    },
    methods: {
      onSubmitted (payload) {
//        console.log(payload);
        this.$store.dispatch('addPost', payload).then(() => {
//          this.$router.push('/admin');
        });
      }
    },
    head: {
      title: 'Создание нового поста'
    }
  }
</script>

<style scoped>
  .new-post-form {
    width: 90%;
    margin: 20px auto;
  }

  @media (min-width: 768px) {
    .new-post-form {
      width: 500px;
    }
  }
</style>
