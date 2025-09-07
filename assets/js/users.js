// LocalStorage helpers for favorites and local edits
const FAV_KEY = 'favUsers';
const favUsers = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'));
function saveFavs() { localStorage.setItem(FAV_KEY, JSON.stringify([...favUsers])); }

let usersDT;
let usersData = [];

function favStar(id) {
  const isFav = favUsers.has(id);
  return `<button class="btn secondary star" data-id="${id}" title="Toggle favorite">${isFav ? '⭐' : '☆'}</button>`;
}

function actionsBtns(id) {
  return `
    <div class="row-actions" style="display:flex;gap:6px;">
      <button class="btn secondary" data-view="${id}">View</button>
      <button class="btn" data-edit="${id}">Edit</button>
      <button class="btn secondary" data-delete="${id}">Delete</button>
    </div>`;
}

async function loadUsers() {
  const data = await fetchJSON(API.users);
  if (!data) return;
  usersData = data.map(u => ({
    id: u.id, name: u.name, username: u.username, email: u.email, city: u.address?.city || ''
  }));

  usersDT = $('#usersTable').DataTable({
    data: usersData,
    columns: [
      { data: 'id', render: id => favStar(id), orderable: false },
      { data: 'name' },
      { data: 'username' },
      { data: 'email' },
      { data: 'city' },
      { data: 'id', render: id => actionsBtns(id), orderable: false }
    ],
    order: [[1,'asc']],
    pageLength: 8,
    responsive: true
  });
}

function openModal() { $('#userModal').addClass('show'); }
function closeModal() { $('#userModal').removeClass('show'); $('#userForm')[0].reset(); $('#userDetails').addClass('hidden').empty(); $('#userForm').removeClass('hidden'); $('#saveUserBtn').show(); }

$(document).on('click', '.star', function(){
  const id = parseInt($(this).data('id'));
  if (favUsers.has(id)) { favUsers.delete(id); toastr.info('Removed from favorites'); }
  else { favUsers.add(id); toastr.success('Added to favorites'); }
  saveFavs();
  // Update button content
  $(this).text(favUsers.has(id) ? '⭐' : '☆');
});

$(document).on('click', '[data-view]', function(){
  const id = parseInt($(this).data('view'));
  const u = usersData.find(x => x.id === id);
  if (!u) return;
  $('#userModalTitle').text('User Details');
  $('#userDetails').removeClass('hidden').html(`
    <div class="grid" style="grid-template-columns:1fr 1fr;">
      <div><strong>Name:</strong> ${u.name}</div>
      <div><strong>Username:</strong> ${u.username}</div>
      <div><strong>Email:</strong> ${u.email}</div>
      <div><strong>City:</strong> ${u.city}</div>
    </div>`);
  $('#userForm').addClass('hidden');
  $('#saveUserBtn').hide();
  openModal();
});

$(document).on('click', '[data-edit]', function(){
  const id = parseInt($(this).data('edit'));
  const u = usersData.find(x => x.id === id);
  if (!u) return;
  $('#userModalTitle').text('Edit User');
  $('#userId').val(u.id);
  $('#name').val(u.name);
  $('#username').val(u.username);
  $('#email').val(u.email);
  $('#city').val(u.city);
  $('#userDetails').addClass('hidden').empty();
  $('#userForm').removeClass('hidden');
  $('#saveUserBtn').show();
  openModal();
});

$(document).on('click', '[data-delete]', function(){
  const id = parseInt($(this).data('delete'));
  const idx = usersData.findIndex(x => x.id === id);
  if (idx === -1) return;
  usersData.splice(idx, 1);
  usersDT.clear().rows.add(usersData).draw();
  toastr.warning('User removed locally');
});

$('#saveUserBtn').on('click', function(){
  const id = parseInt($('#userId').val());
  const payload = {
    name: $('#name').val().trim(),
    username: $('#username').val().trim(),
    email: $('#email').val().trim(),
    city: $('#city').val().trim(),
  };
  if (!payload.name || !payload.username || !payload.email || !payload.city) {
    toastr.error('Please fill all fields'); return;
  }
  const u = usersData.find(x => x.id === id);
  if (u) {
    Object.assign(u, payload);
    usersDT.clear().rows.add(usersData).draw(false);
    toastr.success('User updated locally');
  }
  closeModal();
});

$(function(){ loadUsers(); });
