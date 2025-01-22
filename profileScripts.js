setUpUI();
getUser();
getPosts();

function getCurrentUserId() {
  const urlPostId = new URLSearchParams(window.location.search).get('userid');
  return urlPostId;
}

function getUser() {
  const id = getCurrentUserId();
  axios.get(`${baseUrl}/users/${id}`).then((response) => {
    const user = response.data.data;
    // console.log(user);
    document.getElementById('mainInfoEmail').innerHTML = user.email;
    document.getElementById('mainInfoName').innerHTML = user.name;
    document.getElementById('usernameTitle').innerHTML = user.username;
    document.getElementById('mainInfoUsername').innerHTML = user.username;
    document.getElementById('postsCount').innerHTML = user.posts_count;
    document.getElementById('commentsCount').innerHTML = user.comments_count;
    document.getElementById('mainProfilePic').src = user.profile_image;
  });
}

function getPosts() {
  const id = getCurrentUserId();
  // const id = '2';
  axios.get(`${baseUrl}/users/${id}/posts`).then((response) => {
    const posts = response.data.data;
    document.getElementById('userPosts').innerHTML = '';
    for (post of posts) {
      const author = post.author;
      let postTitle = '';
      // show or hide (edit button based on the user)
      let user = getCurrentUser();
      let isMyPost = user != null && post.author.id == user.id;
      let editButtonContent = ``;

      if (isMyPost) {
        editButtonContent = `
        <button class="btn btn-danger" style="margin-left:3px; float: right" onclick="deletePostBtnClicked('${encodeURIComponent(
          JSON.stringify(post)
        )}')">Delete</button>
        <button class="btn btn-secondary" style="float: right" onclick="editPostBtnClicked('${encodeURIComponent(
          JSON.stringify(post)
        )}')">Edit</button>
        `;
      }
      if (post.title != null) {
        postTitle = post.title;
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
      document.getElementById('userPosts').innerHTML += content;

      // let currentPostTagsId = `postsTags-${post.id}`;
      // console.log(post.tags);
      // document.getElementById('currentPostTagsId').innerHTML = '';
      // for (tag of post.tags) {
      //   console.log(tag.name);
      //   let tagsContent = `<button class="btn btn-sm rounded-5" style="background-color: gray; color:white">${tag.name}</button>`;
      //   document.getElementById(`postsTags-${post.id}`).innerHTML +=
      //     tagsContent;
      // }
    }
  });
}
