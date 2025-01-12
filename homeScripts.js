 //================================================== pagination=================//
    let currentPage = 1;
    let lastPage = 1;
    // infinite scroll for posts================ //
    window.addEventListener('scroll', function () {
      const endOfPage =
        window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

      if (endOfPage && currentPage < lastPage) {
        currentPage = currentPage + 1;
        getPosts(false, currentPage);
      }
    });

    // ===========//End infinite scroll for posts//========= //
    setUpUI();
    getPosts();

   function getPosts(reload = true, page = 1) {
  axios.get(`${baseUrl}/posts?limit=2&page=${page}`).then((response) => {
    const posts = response.data.data;
    lastPage = response.data.meta.last_page;
    if (reload) {
      document.getElementById('posts').innerHTML = '';
    }

    for ( let post of posts) {
      const author = post.author;
      let postTitle = ""
      if(post.title != null){
        postTitle = post.title;
        }
      // let user = getCurrentUser();
      // let isMyPost = user != null && post.author.id === user.id;
      // let editButtonContent = '';

      if (true) {
        editButtonContent = `<button class="btn btn-secondary" style="float: right" onclick="editPostBtnClicked('${encodeURIComponent(
          JSON.stringify(post)
        )}')">Edit</button>`;
      }

      let content = `<div class="card shadow">
                <div class="card-header">
                  <img
                    class="rounded-circle border border-1"
                    src="${author.profile_image}"
                    alt=""
                    style="width: 40px; height: 40px"
                  />
                  <span>@${author.username}</span>
                  ${editButtonContent}
                </div>
                <div class="card-body" onclick="viewPost(${post.id})" style="cursor: pointer">
                  <img class="w-100" src="${post.image}" alt="" />
                  <h6 style="color: rgb(93, 96, 100)" class="mt-1">${post.created_at}</h6>
                  <h5>${post.title}</h5>
                  <p>${post.body}</p>
                  <hr />
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                      <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                    </svg>
                    <span>(${post.comments_count}) Comments
                      <span id="postsTags-${post.id}"></span>
                    </span>
                  </div>
                </div>
              </div>`;

      document.getElementById('posts').innerHTML += content;

      const currentPostTags = `postsTags-${post.id}`;
      const tagsContainer = document.getElementById(currentPostTags);
      if (tagsContainer) {
        tagsContainer.innerHTML = '';
        for (const tag of post.tags) {
          let tagContent = `<button class="btn btn-sm rounded-5" style="background-color: gray; color:white">${tag.name}</button>`;
          tagsContainer.innerHTML += tagContent;
        }
      }
    }
  });
}


   function createPostBtnClicked() {
  let postId = document.getElementById('postIdInput').value;
  let isCreate = postId == null || postId === '';

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

  const url = isCreate
    ? `${baseUrl}/posts`
    : `${baseUrl}/posts/${postId}`;

  const request = isCreate
    ? axios.post(url, formData, { headers })
    : axios.put(url, formData, { headers });

  request
    .then((response) => {
      const modal = document.getElementById('createPostModal');
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert(isCreate ? 'Post created successfully' : 'Post updated successfully', 'success');
      getPosts();
    })
    .catch((error) => {
      const message = error.response?.data?.message || 'An error occurred';
      showAlert(message, 'danger');
    });
}


    function viewPost(postId) {
      // alert(postId);
      window.location.href = `postDetails.html?postId=${postId}`;
    }

    function editPostBtnClicked(postObj) {
      let post = JSON.parse(decodeURIComponent(postObj));
      

      document.getElementById('postModalSubmitBtn').innerHTML = 'Update';
      document.getElementById("postIdInput").value = post.id;
      document.getElementById('exampleCreatePostModalLabel').innerHTML =
        'Edit Post';
      document.getElementById('TitleInput').value = post.title;
      document.getElementById('descriptionInput').value = post.body;
      // document.getElementById('pictureInput').value = post.image;
      let postModal = new bootstrap.Modal(
        document.getElementById('createPostModal'),
        {
          // keyboard: false,
        }
      );
      postModal.toggle();
    }
    // Call the function