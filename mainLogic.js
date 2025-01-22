const baseUrl = 'https://tarmeezacademy.com/api/v1';

function profileClicked() {
  const user = getCurrentUser();
  // alert(user.id);
  const userId = user.id;
  window.location = `profile.html?userid=${userId}`;
  // alert(userId);
}

function setUpUI() {
  const token = localStorage.getItem('token');
  const loginDiv = document.getElementById('login-div');
  const logoutDiv = document.getElementById('logout-div');
  // add btn
  const addBtn = document.getElementById('add-btn');

  if (token == null) {
    if (addBtn != null) {
      addBtn.style.setProperty('display', 'none', 'important');
    }
    loginDiv.style.setProperty('display', 'flex', 'important');
    logoutDiv.style.setProperty('display', 'none', 'important');
  } else {
    if (addBtn != null) {
      addBtn.style.setProperty('display', 'block', 'important');
    }
    loginDiv.style.setProperty('display', 'none', 'important');
    logoutDiv.style.setProperty('display', 'flex', 'important');
    userTitleInfo();
  }
}

function loginBtnClicked() {
  const username = document.getElementById('Username-name').value;
  const password = document.getElementById('Password-name').value;
  axios
    .post(`${baseUrl}/login`, {
      username: username,
      password: password,
    })
    .then((response) => {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      const modal = document.getElementById('loginModal');
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("You've been logged in", 'success');
      // alert('You have been logged in');
      setUpUI();
    })
    .catch((error) => {
      console.log(error);
      showAlert('Invalid username or password', 'danger');
    });
}

function registerBtnClicked() {
  const name = document.getElementById('RegNameInput').value;
  const username = document.getElementById('regUsernameInput').value;
  const password = document.getElementById('regPasswordInput').value;
  const profileImg = document.getElementById('registerProfilePic').files[0];

  let formData = new FormData();
  formData.append('name', name);
  formData.append('username', username);
  formData.append('password', password);
  formData.append('image', profileImg);

  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  axios
    .post(`${baseUrl}/register`, formData, {
      headers: headers,
    })
    .then((response) => {
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      const modal = document.getElementById('registerModal');
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("You've been registered successfully", 'success');
      setUpUI();
    })
    .catch((error) => {
      const errorData = error.response.data.message;
      showAlert(errorData, 'danger');
    });
}
function logoutBtnClicked() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showAlert("You've been logged out", 'success');
  // alert('You have been logged out');
  setUpUI();
}
function showAlert(customMessage, type) {
  const alertPlaceholder = document.getElementById('successAlert');

  const alert = (message, type) => {
    const wrapper = document.createElement('div');
    wrapper.className = `alert alert-${type} alert-dismissible fade show`;
    wrapper.role = 'alert';

    wrapper.innerHTML = [
      `<div>${message}</div>`,
      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    ].join('');

    alertPlaceholder.append(wrapper);

    // Automatically hide the alert after 2 seconds
    setTimeout(() => {
      wrapper.classList.remove('show');
      wrapper.classList.add('fade'); // Use Bootstrap's fade-out animation
      setTimeout(() => {
        wrapper.classList.add('d-none'); // Hide it visually
      }, 150); // Allow time for the fade-out effect
    }, 2000);
  };

  alert(customMessage, type);
}
function userTitleInfo() {
  // Retrieve user data from local storage
  let userD = null;
  const storageUserD = localStorage.getItem('user');
  if (storageUserD != null) {
    userD = JSON.parse(storageUserD);
  } else {
    console.error('User data not found in local storage!');
    return;
  }

  console.log(userD);

  // Create the profile title HTML
  let profileTitle = `
      <div id="profileTitle" class="d-flex align-items-center justify-content-center">
        <img
          id="profile-pic"
          src="${userD.profile_image}"
          alt="Profile Picture"
          class="rounded-circle"
          style="
            width: 40px;
            height: 40px;
            margin-right: 5px;

          "
        />
        <span
          id="user-name"
          class=" text-align-bottom"
          style="margin-right:auto; font-size: 1.2rem; font-weight: bold;"
        >
          ${userD.username}
        </span>
      </div>
    `;

  // Inject the profile title into the DOM
  const profileTitleContainer = document.getElementById('profileTitle');
  if (profileTitleContainer) {
    profileTitleContainer.innerHTML = profileTitle;
  } else {
    console.error("Element with ID 'profileTitle' not found!");
  }
}
function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem('user');
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  } else {
    console.error('User data not found in local storage!');
    return;
  }
  return user;
}

function editPostBtnClicked(postObj) {
  let post = JSON.parse(decodeURIComponent(postObj));
  // console.log(post);
  document.getElementById('exampleCreatePostModalLabel').innerHTML =
    'Edit Post'; //this is for the modal title
  document.getElementById('postIdInput').value = post.id;
  document.getElementById('postIdInput').value = post.id;
  document.getElementById('TitleInput').value = post.title;
  document.getElementById('descriptionInput').value = post.body;
  document.getElementById('postModalSubmitBtn').innerHTML = 'Update';

  // document.getElementById('pictureInput')innerHTML.file[0] = post.image;
  let postModal = new bootstrap.Modal(
    document.getElementById('createPostModal'),
    {
      // keyboard: false,
    }
  );
  postModal.toggle();
}
function deletePostBtnClicked(postObj) {
  let post = JSON.parse(decodeURIComponent(postObj));
  document.getElementById('deletePostIdInput').value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById('deletePostModal'),
    {
      // keyboard: false,
    }
  );
  postModal.toggle();
}
function confirmPostDelete() {
  let postId = document.getElementById('deletePostIdInput').value;
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'multipart/form-data',
    authorization: `Bearer ${token}`,
  };
  axios
    .delete(`${baseUrl}/posts/${postId}`, { headers: headers })
    .then((response) => {
      const modal = document.getElementById('deletePostModal');
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert('Post deleted successfully', 'success');
      getPosts();
    })
    .catch((error) => {
      const message =
        error.response?.data?.message ||
        'You are not authorized to perform this action';
      showAlert(message, 'danger');
    });
}

function createPostBtnClicked() {
  let postId = document.getElementById('postIdInput').value;
  let isCreate = postId == null || postId == '';

  const title = document.getElementById('TitleInput').value;
  const description = document.getElementById('descriptionInput').value;
  const image = document.getElementById('pictureInput').files[0];
  const token = localStorage.getItem('token');

  let formData = new FormData();
  const headers = {
    'Content-Type': 'multipart/form-data',
    authorization: `Bearer ${token}`,
  };

  formData.append('body', description);
  formData.append('title', title);
  formData.append('image', image);

  let url = ``;
  if (isCreate) {
    url = `${baseUrl}/posts`;
  } else {
    formData.append('_method', 'PUT'); // this is for laravel to know
    //  that we are updating a post and not creating a new one turning around the post request to a put request
    url = `${baseUrl}/posts/${postId}`;
  }
  axios
    .post(url, formData, { headers: headers })
    .then((response) => {
      const modal = document.getElementById('createPostModal');
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert(
        isCreate ? 'Post created successfully' : 'Post updated successfully',
        'success'
      );
      getPosts();
    })
    .catch((error) => {
      const message =
        error.response?.data?.message ||
        'You are not authorized to perform this action';
      showAlert(message, 'danger');
    });
}
