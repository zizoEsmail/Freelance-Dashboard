$(async function () {
  const users = await fetchJSON(API.users);
  const posts = await fetchJSON(API.posts);
  const comments = await fetchJSON(API.comments());

  if (users) $('#stat-users').text(users.length);
  if (posts) $('#stat-posts').text(posts.length);
  if (comments) $('#stat-comments').text(comments.length);

  // Subtle pulse when loaded
  $('.card .stat').addClass('animate__animated animate__pulse');
  setTimeout(() => $('.card .stat').removeClass('animate__animated animate__pulse'), 1200);
});
