const LOCAL_POSTS_KEY = 'localPosts';
let postsDT;
let postsData = []; // merged API + local

function loadLocalPosts() {
  return JSON.parse(localStorage.getItem(LOCAL_POSTS_KEY) || '[]');
}
function saveLocalPosts(arr) {
  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(arr));
}

async function loadPosts() {
  const [apiPosts, users] = await Promise.all([fetchJSON(API.posts), fetchJSON(API.users)]);
  if (!apiPosts || !users) return;
  const usersById = Object.fromEntries(users.map(u => [u.id, u]));
  const localPosts = loadLocalPosts();

  // Merge API posts with local posts
  const merged = [...apiPosts, ...localPosts].map(p => ({
    id: p.id,
    title: p.title,
    body: p.body,
    userId: p.userId,
    user: usersById[p.userId]?.username || `user-${p.userId}`,
    isLocal: !!p.isLocal,
  }));

  postsData = merged;
  postsDT = $('#postsTable').DataTable({
    data: postsData,
    columns: [
      { data: 'id' },
      { data: 'title' },
      { data: 'body' },
      { data: 'user' },
      { data: 'id', render: id => postActions(id), orderable: false }
    ],
    order: [[0,'asc']],
    pageLength: 10,
    responsive: true
  });
}

function postActions(id){
  return `<div style="display:flex;gap:6px;">
    <button class="btn secondary" data-comments="${id}">Comments</button>
    <button class="btn" data-pedit="${id}">Edit</button>
    <button class="btn secondary" data-pdelete="${id}">Delete</button>
  </div>`;
}

function openPostModal(title='Add Post'){ $('#postModalTitle').text(title); $('#postModal').addClass('show'); }
function closePostModal(){ $('#postModal').removeClass('show'); $('#postForm')[0].reset(); $('#postId').val(''); }

$('#addPostBtn').on('click', () => {
  openPostModal('Add Post');
});

$('#savePostBtn').on('click', () => {
  const idVal = $('#postId').val();
  const title = $('#postTitle').val().trim();
  const body = $('#postBody').val().trim();
  const userId = parseInt($('#postUserId').val());
  if (!title || !body || !userId) { toastr.error('Fill all fields'); return; }

  let locals = loadLocalPosts();
  if (idVal) {
    // Edit existing local post
    const id = parseInt(idVal);
    const idxLocal = locals.findIndex(p => p.id === id);
    if (idxLocal !== -1) {
      locals[idxLocal] = { id, title, body, userId, isLocal: true };
      saveLocalPosts(locals);
      const idxData = postsData.findIndex(p => p.id === id);
      if (idxData !== -1) postsData[idxData] = { id, title, body, userId, isLocal: true, user: postsData[idxData].user };
      postsDT.clear().rows.add(postsData).draw(false);
      toastr.success('Post updated (local)');
    } else {
      toastr.error('Only local posts are editable');
    }
  } else {
    // Add new local post with unique id
    const maxId = Math.max(...postsData.map(p => p.id), 0);
    const newPost = { id: maxId + 1, title, body, userId, isLocal: true };
    locals.push(newPost);
    saveLocalPosts(locals);
    postsData.push({ ...newPost, user: postsData.find(p => p.userId === userId)?.user || `user-${userId}` });
    postsDT.clear().rows.add(postsData).draw(false);
    toastr.success('Post added (local)');
  }
  closePostModal();
});

$(document).on('click', '[data-pedit]', function(){
  const id = parseInt($(this).data('pedit'));
  const p = postsData.find(x => x.id === id);
  if (!p) return;
  if (!p.isLocal) { toastr.warning('Only locally added posts can be edited'); return; }
  $('#postId').val(p.id);
  $('#postTitle').val(p.title);
  $('#postBody').val(p.body);
  $('#postUserId').val(p.userId);
  openPostModal('Edit Post');
});

$(document).on('click', '[data-pdelete]', function(){
  const id = parseInt($(this).data('pdelete'));
  const idxData = postsData.findIndex(x => x.id === id);
  if (idxData === -1) return;
  const p = postsData[idxData];
  if (p.isLocal) {
    // remove from locals too
    const locals = loadLocalPosts().filter(x => x.id !== id);
    saveLocalPosts(locals);
    toastr.warning('Local post deleted');
  } else {
    toastr.info('API posts removed only from the table (not from server)');
  }
  postsData.splice(idxData, 1);
  postsDT.clear().rows.add(postsData).draw(false);
});

// Comments flow
$(document).on('click', '[data-comments]', async function(){
  const id = parseInt($(this).data('comments'));
  $('#commentsList').empty();
  $('#commentsTitle').text(`Comments for Post #${id}`);
  $('#commentsModal').addClass('show');
  const comments = await fetchJSON(API.comments(id));
  if (!comments) return;
  if (!comments.length) {
    $('#commentsList').append('<li>No comments.</li>');
  } else {
    comments.forEach(c => {
      $('#commentsList').append(`<li><strong>${c.email}</strong><br>${c.body}</li>`);
    });
  }
});

$(function(){ loadPosts(); });
