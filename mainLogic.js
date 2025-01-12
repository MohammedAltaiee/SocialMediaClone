
const baseUrl = 'https://tarmeezacademy.com/api/v1';

function setUpUI() {
      const token = localStorage.getItem('token');
      const loginDiv = document.getElementById('login-div');
      const logoutDiv = document.getElementById('logout-div');
      // add btn
      const addBtn = document.getElementById('add-btn');

      
      if (token == null) {
          if (addBtn!=null) {
            addBtn.style.setProperty('display', 'none', 'important');
            }
        loginDiv.style.setProperty('display', 'flex', 'important');
        logoutDiv.style.setProperty('display', 'none', 'important');
      } else {
         if (addBtn!=null) {
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
