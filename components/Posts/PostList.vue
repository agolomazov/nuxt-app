<template>
  <section class="posts-list">
    <PostPreview
      v-for="post in posts"
      :key="post.id"
      :id="post.id"
      :is-admin="isAdmin"
      :title="post.title"
      :previewText="post.previewText"
      :thumbnail="post.thumbnail"
    />
  </section>
</template>

<script>
  import PostPreview from './PostPreview'

  export default {
    name: 'PostList',
    props: {
      isAdmin: {
        type: Boolean,
        default: false
      },
      posts: {
        type: Array,
        required: true
      }
    },
    components: {
      PostPreview
    }
  }
</script>

<style scoped>
  .posts-list {
    display: flex;
    padding: 20px;
    box-sizing: border-box;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
  }
</style>
