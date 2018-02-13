<template>
  <div class="posts-page">
    <div class="posts-list">
      <PostList
        :posts="loadedPosts"
      />
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      loadedPosts() {
        return this.$store.getters.loadedPosts;
      }
    }
  }

</script>

<style scoped>
  .posts-page {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
