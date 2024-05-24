//--------------------------LOGIN ----------------------------------

function LoginClick() {
    var usernamePattern = /^[a-zA-Z0-9 _-]{3,16}$/; // Letters, numbers, underscores, hyphens, length between 3-16
    var passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // At least one number, one lowercase, one uppercase, length between 6-20

    $('.error').text('');
    var username = $("#username").val().trim();
    var password = $("#password").val().trim();

    var valid = true;
        
    if (username === "") {
        $('#usernameError').text('Username is required');
        valid = false;
    } else if (!usernamePattern.test(username)) {
        $('#usernameError').text('Invalid username length between 3-16');
        valid = false;
    }

    if (password === "") {
        $('#passwordError').text('Password is required');
        valid = false;
    } else if (!passwordPattern.test(password)) {
        $('#passwordError').text('Password must be 6-20 characters long, include at least one number, one lowercase and one uppercase letter');
        valid = false;
    }

    
    if (valid) {
        $('.error').text('');
        var obj = {
            UserName: username,
            Password: password
        }
        $.ajax({
            url: "/api/InstagramApi/LoginUser",
            method: "POST",
            data: obj,
            success: function (data) {
                $('#username').text('');
                $('#password').text('');
                window.location.href = '/InstagramMvc/CreateSession?id=' + data;

            },
            error: function (data) {
                $("#usernameError").text("username is incorrect");
                $("#passwordError").text("password is incorrect");

            }
        })

    }
    
}

// SIGNUP -------------------------
function SignUpClick() {
   
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    var namePattern = /^[a-zA-Z\s]{1,30}$/; // Only letters and spaces, max length 50
    var usernamePattern = /^[a-zA-Z0-9 _-]{3,16}$/; // Letters, numbers, underscores, hyphens, length between 3-16
    var passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // At least one number, one lowercase, one uppercase, length between 6-20

    $('.error').text('');
    var name = $("#name").val().trim();
    var email = $("#email").val().trim();
    var username = $("#username").val().trim();
    var password = $("#password").val().trim();

    var valid = true;

    // Name validation
    if (name === "") {
        $('#nameError').text('Name is required');
        valid = false;
    } else if (!namePattern.test(name)) {
        $('#nameError').text('Invalid name only letters and length upto 50');
        valid = false;
    }

    // Email validation
    if (email === "") {
        $('#emailError').text('Email is required');
        valid = false;
    } else if (!emailPattern.test(email)) {
        $('#emailError').text('Invalid email format');
        valid = false;
    }

    // Username validation
    if (username === "") {
        $('#usernameError').text('Username is required');
        valid = false;
    } else if (!usernamePattern.test(username)) {
        $('#usernameError').text('Invalid username length between 3-16');
        valid = false;
    }

    // Password validation
    if (password === "") {
        $('#passwordError').text('Password is required');
        valid = false;
    } else if (!passwordPattern.test(password)) {
        $('#passwordError').text('Password must be 6-20 characters long, include at least one number, one lowercase and one uppercase letter');
        valid = false;
    }

    // If all fields are valid, submit the form
    if (valid) {
        $('.error').text('');
        
        var obj = {
            Name: name,
            Email: email,
            UserName: username,
            Password: password
        }
            $.ajax({
                url: "/api/InstagramApi/SignUpUser",
                method: "POST",
                data: obj,
                success: function (data) {
                    alert("User Successfully SignIn");
                    
                    $('#name').text('');
                    $('#email').text('');
                    $('#username').text('');
                    $('#password').text('');
                    window.location.href = '/InstagramMvc/LoginPage'
                },
                error: function (data) {
                    alert("Submit Error  Side" + data);
                }
            })
    }

   
}

function Logout() {
    window.location.href = '/InstagramMvc/LogoutSession';
}
//--------------------------LOGIN OVER----------------------------------

//---------------------------MODAL Story  PART------------------------------
function ShowPreview(input) {
    var div = document.getElementById("image");
    div.style.display = "block";
    if (input.files && input.files[0]) {
        var ImageDir = new FileReader();
        ImageDir.onload = function (e) {
            $('#ImagePreview').attr('src', e.target.result);
        }
        ImageDir.readAsDataURL(input.files[0]);
    }
}
function showhide() {
    var div = document.getElementById("image");
    var image = document.getElementById("ImageUpload");
    if (div.style.display !== "none") {
        div.style.display = "none";
        image.value = "";
    }
}
function modalclose() {
    $('#ImageUpload').val(''); 
    $('#image').hide(); 
    $('#ImagePreview').attr('src', '');
    $('#fileError').text(' ');
    $('#StoryModal').modal('hide');
    //$('#StoryModal').attr('data-dismiss','modal');
}
function modalStoryOpen() {
   $('#StoryModal').css('display', 'block').modal('show');
}
//---------------------- Upload Story  --------------------------------
function UploadStory() {

    $('#fileError').text('');


    var fileInput = $('#ImageUpload').val();
    var valid = true;

    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i; 
    if (fileInput === "") {
        $('#fileError').text('File is required');
        valid = false;
    } else if (!allowedExtensions.exec(fileInput)) {
        $('#fileError').text(' ');
        $('#ImageUpload').val('');
        $('#fileError').text('Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.');
       
        valid = false;
    }

    if (valid) {
        var ImageUpload = $('#ImageUpload').get(0).files[0];
        var formData = new FormData();
        formData.append('ImageUpload', ImageUpload);
        alert("Story Uploaded");
            $.ajax({
                url: "/InstagramMvc/StoryUpload",
                method: "POST",
                contentType: false, // Specify content type
                processData: false,
                data: formData, // Convert obj to JSON string
                success: function (data) {
                    modalclose();
                    if (data.success) {
                        var story = data.story.StoryImage;
                        console.log("Story Image: " + story.StoryImage);
                        var storyHtml = `
                                        <span class="stories-scroll">
                                            <a href="#" class="link-color">
                                                <img src="${story}" alt="Profile" class="div-profile-image-1">
                                            </a>
                                        </span>
                                    `;
                        $('#story-upload').prepend(storyHtml);
                    }
                },
                error: function (data) {
                    //alert(" Error Side: " + JSON.stringify(xhr.responseText));
                }
            })
    }

}


//----------------------Story Retrival --------------------------
$(document).ready(function () {
    $.ajax({
        url: '/api/InstagramApi/GetStory',
        method: 'GET',
        success: function (data) {
            data.forEach(function (story) {
                var storyHtml = `
                    <span class="stories-scroll mt-2">
                        <a href="#" class="link-color">
                            <img src="${story.Stories}" alt="Profile" class="div-profile-image-1">
                        </a>
                    </span>
                `;
                $('#story-upload').prepend(storyHtml);
            });
        },
        error: function (err) {
            console.error("Error fetching stories:", err);
        }
    });
    
});


//---------------------------MODALPOST PART------------------------------
function ShowPostPreview(input) {
    var div = document.getElementById("imagePost");
    div.style.display = "block";
    if (input.files && input.files[0]) {
        var ImageDir = new FileReader();
        ImageDir.onload = function (e) {
            $('#ImagePostPreview').attr('src', e.target.result);
        }
        ImageDir.readAsDataURL(input.files[0]);
    }
}
function showPosthide() {
    var div = document.getElementById("imagePost");
    var image = document.getElementById("ImagePostUpload");
    if (div.style.display !== "none") {
        div.style.display = "none";
        image.value = "";
    }
}
function modalPostOpen() {
    $('#PostModal').css('display', 'block').modal('show');
}
function modalPostclose() {
    $('#ImagePostUpload').val('');
    $('#imagePost').hide();
    $('#ImagePostPreview').attr('src', '');
    $('#Caption').val('');
    $('#fileErrorPost').text('');
    $('#PostModal').modal('hide');
}

// POST INSERT PART 
function UploadPost() {
    
    var div = document.getElementById("imagePost");
    $('#fileErrorPost').text('');

    var fileInput = $('#ImagePostUpload').val();
    var valid = true;

    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (fileInput === "") {
        $('#fileErrorPost').text('File is required');
        valid = false;
    } else if (!allowedExtensions.exec(fileInput)) {
        $('#fileErrorPost').text('Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.');
        div.style.display = "none";
        $('#ImagePostUpload').val('');
        valid = false;
    }

    if (valid) {
        
        var ImageUpload = $('#ImagePostUpload').get(0).files[0];
        var Caption = $('#Caption').val();
        var formData = new FormData();
        formData.append('ImageUpload', ImageUpload);
        formData.append('Caption', Caption);

        $.ajax({
            url: "/InstagramMvc/PostUpload",
            method: "POST",
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                modalPostclose();
                if (data.success) {
                    
                    console.log(" idsfdsnklsdnlkda" + data.post.UserName);
                    var formattedDate = moment(data.post.PostDate).format('MM DD YY');
                    alert("POST UPLOADED");
                    //alert("inside if");
                    var cardHtml = `
                                    <div class="card mb-3" id="post-${data.post.PostId}">
                                                             <div class="d-flex align-items-center">
                                                                    <a class="link-color">
                                                                        <img src="${data.post.UserProfileImage}" alt="Profile" onerror="this.src='/Images/admin.jpg';" class="div-profile-image-username mt-1 ms-1 mb-1">
                                                                    </a>
                                                                    <span class="p-1 profile-name">${data.post.UserName}</span>
                                                                    <small class="text-muted text-end ms-auto me-2 ps-1 ">${formattedDate}</small>
                                                            </div>
                                                            <img src="${data.post.PostImage}" class="card-img-top" alt="...">
                                                            <div class="card-body">
                                                                <div class="icon-div mb-2">
                                                                     <button class="btn btn-white btn-icon" onclick="PostLike(this)"  data-post-id="${data.post.PostId}" title="Like"><span class="fa fa-heart icon" data-post-id="${data.post.PostId}" ></span></button><span class="comments-count-${data.post.PostId} ">${data.post.LikesCount} Likes</span>
                                                                     <button class="btn btn-white btn-icon" onclick="toggleComments(${data.post.PostId})" title="Comment"><span class="fa fa-comment"></span></button>  <span class="icon-comments-count-${data.post.PostId}"></span>
                                                                    
                                                                </div>
                                                                <span id="likes-count-${data.post.PostId}">${data.post.LikesCount} Likes</span>
                                                                <p class="card-text mb-0">
                                                                    <b><span class="profile-name">${data.post.UserName}</span></b>
                                                                    ${data.post.PostCaption}
                                                                </p>
                                                               
                                                            </div>


                                                                 <span class="ms-2 fs-6" id="comments-count-${data.post.PostId}"></span>
                                                            <!-- Comment Input -->
                                                            <div class="input-group mb-3 mt-1 ps-1" data-post-id="${data.post.PostId}">
                                                                <input type="text" class="form-control border-0 comment-input" placeholder="Add a Comment">
                                                                <button class="btn btn-white btn-icon share-button" data-post-id="${data.post.PostId}" title="Share" onclick="postComment(this)">
                                                                    <span class="fa fa-share" data-post-id="${data.post.PostId}"></span>
                                                                </button>
                                                            </div>

                                                            <!-- Comments Section -->
                                                            <div id="comments-${data.post.PostId}" class="comments">
                                                                <!-- Comments will be dynamically loaded here -->
                                                            </div>
                                                        </div>
                                                    `;

                    $('#post-upload').prepend(cardHtml);
                    
                }

            },
            error: function (data) {
                //alert(" Error Side: " + JSON.stringify(xhr.responseText));
            }
        })
    }
}
// POST RETRIEVE PART 

//------------------------------USER PROFILE--------------------------
function UserAllPost() {
    window.location.href = '/InstagramMvc/ArchivePage';
}
function RedirectProfilePage() {
    window.location.href = '/InstagramMvc/ProfilePage';
}
function RedirectToEditPage(){
    window.location.href = '/InstagramMvc/EditProfilePage';
}
//---------------------------------FETCH USER PROFILE --------------------------------------
function fetchUserDetail() {
    $.ajax({
        url: '/InstagramMvc/UserProfile',
        method: 'GET',
        success: function (data) {
            if (data.success) {
                console.log(data.usersNotFollowed);
               // console.log(data.userdetail.userfollowingdetails)
                var storyHtml = `
                                <div class="cart">
                                        <div class="img">
                                            <img src="${data.userdetail.UserProfile}" onerror="this.src='/Images/admin.jpg';"  class="img-fluid rounded-circle" style="width: 200px; height: 200px;" alt="Upload Image">
                                        </div>
                                        <div class="info">

                                            <p class="name">
                                                ${data.userdetail.Name}
                                                <button class="edit_profile" onclick="RedirectToEditPage()">
                                                    Edit profile
                                                </button>
                                                <button class="edit_profile" onclick="UserAllPost()">
                                                    Archived Post
                                                </button>
                                            </p>

                                            <div class="general_info">
                                                    <p><span>${data.userdetail.TotalPost}</span> post</p>
                                                    <p><a class="text-decoration-none text-dark" onclick="FollowModalList()">${data.userdetail.userfollowersdetails} followers</a></p>
                                                    <p><a class="text-decoration-none text-dark" onclick="FollowingModalList()">${data.userdetail.userfollowingdetails} following</a></p>
                                            </div>

                                            <p class="nick_name mb-1"> ${data.userdetail.UserName}</p>
                                            <p class="nick_name mb-1"> ${data.userdetail.Email}</p>
                                           ${data.userdetail.Gender ?
                                                `<p class="nick_name mb-1">${data.userdetail.Gender}</p>` :
                                                ' '}
                                                
                                            <p class="desc">
                                                <br>
                                            </p>

                                        </div>
                                    </div>
                                    `;
                $('#user-Profile').append(storyHtml);

            }
        },
        error: function (err) {
            console.error("Error fetching stories:", err);
        }
    });
}


//------------------------------ARCHIEVE POST DELETE POST -----------------------------------
function ArchivePost(id) {
    var archivedpostid = id;

    var obj = {
        PostId: archivedpostid
    }
    $.ajax({
        url: "/InstagramMvc/SetPostArchive",
        method: "POST",
        data: obj,
        success: function (data) {
            $('#posts_sec').empty();
            if (data.success) {
               
                
                console.log(data);
                console.log(data.post);
                data.post.forEach(function (story) {
                    var storyHtml = `
                                        <div class="item">
                                            <div class="small-buttons">
                                                <button title="Like" class="d-block">
                                                    <span class='fa fa-heart fs-6'>${story.Postlike}</span>
                                                    <span class="action-count text-dark"></span>
                                                </button>
                                                <button title="Comment" class="d-block">
                                                    <span class='fa fa-comment fs-6'>${story.CommentCount}</span>
                                                    <span class="action-count text-dark"></span>
                                                </button>
                                                <button title="Archive" onclick="ArchivePost('${story.postid}')">
                                                    <span class='fa fa-archive fs-6'></span>
                                                </button>
                                                <button title="Delete" onclick="DeletePost('${story.postid}')">
                                                    <span class='fa fa-trash fs-6'></span>
                                                </button>
                                            </div>
                                            <img class="img-fluid item_img" src="${story.Posts}" alt="">
                                        </div>
                                    `;
                    $('#posts_sec').prepend(storyHtml);
                });

                $('#user-Profile').empty();
                fetchUserDetail();
            }
        },
        error: function (data) {
            alert("Submit Error  Side" + data);
        }
    })
}

function fetchUserArchievePosts(){
    
    $.ajax({
        url: '/InstagramMvc/UserAllArchievePosts',
        method: 'GET',
        success: function (data) {
            $('#unarchieve_sec').empty();
            if (data.success) {
                console.log(data);
                console.log(data.post);
                data.post.forEach(function (story) {
                    var storyHtml = `
                                        <div class="item">
                                            <div class="small-buttons">
                                                <button title="Like" class="d-block">
                                                    <span class='fa fa-heart fs-6'>${story.Postlike}</span>
                                                    <span class="action-count text-dark"></span>
                                                </button>
                                                <button title="Comment" class="d-block">
                                                    <span class='fa fa-comment fs-6'>${story.CommentCount}</span>
                                                    <span class="action-count text-dark"></span>
                                                </button>
                                                <button title="UnArchive" onclick="UnArchivePost('${story.postid}')">
                                                    <span class='fa fa-upload fs-6'></span>
                                                    </button>
                                                <button title="Delete" onclick="DeletePost('${story.postid}')">
                                                    <span class='fa fa-trash fs-6'></span></button>
                                            </div>
                                            <img class="img-fluid item_img" src="${story.Posts}" alt="">
                                        </div>
                                    `;
                    $('#unarchieve_sec').prepend(storyHtml);
                });

                $('#user-Profile').empty();
                fetchUserDetail();
            }
        },
        error: function (err) {
            console.error("Error fetching stories:", err);
        }
    });


}


function DeletePost(id) {
    var Deletedpostid = id;

    var obj = {
        PostId: Deletedpostid
    }
    $.ajax({
        url: "/InstagramMvc/DeletePost",
        method: "POST",
        data: obj,
        success: function (data) {
            $('#posts_sec').empty();
            if (data.success) {
                alert("POST DELETED ");
                //window.location.href = '/InstagramMvc/ArchivePage';

                //var allPosts = data.post; // Assuming data.post is an array of objects
                //var archivedid, archivedpost

                console.log(data);
                console.log(data.post);
                data.post.forEach(function (story) {
                    var storyHtml = `
                                        <div class="item">
                                            <div class="small-buttons">
                                                <button title="Like" class="d-block">
                                                    <span class='fa fa-heart fs-6'>${story.Postlike}</span>
                                                    <span class="action-count text-dark"></span>
                                                </button>
                                                <button title="Comment" class="d-block">
                                                    <span class='fa fa-comment fs-6'>${story.CommentCount}</span>
                                                    <span class="action-count text-dark"></span>
                                                </button>
                                                <button title="Archive" onclick="ArchivePost('${story.postid}')">
                                                    <span class='fa fa-archive fs-6'></span>
                                                </button>
                                                <button title="Delete" onclick="DeletePost('${story.postid}')">
                                                    <span class='fa fa-trash fs-6'></span>
                                                </button>
                                            </div>
                                            <img class="img-fluid item_img" src="${story.Posts}" alt="">
                                        </div>
                                    `;
                    $('#posts_sec').prepend(storyHtml);
                });
                $('#user-Profile').empty();
                fetchUserDetail();
                


            }
        },
        error: function (data) {
            alert("Submit Error  Side" + data);
        }
    })
}

function UnArchivePost(id) {
    var UnArchivedpostid = id;

    var obj = {
        PostId: UnArchivedpostid
    }
    $.ajax({
        url: "/InstagramMvc/SetPostUnArchive",
        method: "POST",
        data: obj,
        success: function (data) {
            $('#unarchieve_sec').empty();
            if (data.success) {
                
                console.log(data);
                console.log(data.post);
                data.post.forEach(function (story) {
                    var storyHtml = `
                                        <div class="item">
                                            <div class="small-buttons">
                                                <button title="Like" class="d-block">
                                                    <span class='fa fa-heart fs-6'>${story.Postlike}</span>
                                                    <span class="action-count text-dark"></span>
                                                </button>
                                                <button title="Comment" class="d-block">
                                                    <span class='fa fa-comment fs-6'>${story.CommentCount}</span>
                                                    <span class="action-count text-dark"></span>
                                                </button>
                                                <button title="UnArchive" onclick="UnArchivePost('${story.postid}')">
                                                    <span class='fa fa-upload fs-6'></span>
                                                    </button>
                                                <button title="Delete" onclick="DeletePost('${story.postid}')">
                                                    <span class='fa fa-trash fs-6'></span></button>
                                            </div>
                                            <img class="img-fluid item_img" src="${story.Posts}" alt="">
                                        </div>
                                    `;
                    $('#unarchieve_sec').prepend(storyHtml);
                });
                $('#user-Profile').empty();
                fetchUserDetail();


            }
        },
        error: function (data) {
            alert("Submit Error  Side" + data);
        }
    })
}

function EditProfile() {
    $('#profileForm').submit(function (event) {
        event.preventDefault(); // Prevent the default form submission


        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        var namePattern = /^[a-zA-Z\s]{1,30}$/; // Only letters and spaces, max length 50
        var usernamePattern = /^[a-zA-Z0-9 _-]{3,16}$/; // Letters, numbers, underscores, hyphens, length between 3-16
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;



        var name = $("#name").val().trim();
        var email = $("#email").val().trim();
        var username = $("#username").val().trim();
        var gender = $('input[name="gender"]:checked').val();
        var fileInput = $('#avatar').val();
        var ImageUpload = $('#avatar').get(0).files[0];

        $('.error').text('');
        var valid = true;

        // Name validation
        if (name === "") {
            $('#nameError').text('Name is required');
            valid = false;
        } else if (!namePattern.test(name)) {
            $('#nameError').text('Invalid name only letters and length upto 50');
            valid = false;
        }

        // Email validation
        if (email === "") {
            $('#emailError').text('Email is required');
            valid = false;
        } else if (!emailPattern.test(email)) {
            $('#emailError').text('Invalid email format');
            valid = false;
        }

        // Username validation
        if (username === "") {
            $('#usernameError').text('Username is required');
            valid = false;
        } else if (!usernamePattern.test(username)) {
            $('#usernameError').text('Invalid username length between 3-16');
            valid = false;
        }

        if (!gender) {
            $('#genderError').text('Please select a gender');
            valid = false;
        }


        if (fileInput === "") {
            $('#fileErrorPost').text('File is required');
            valid = false;
        } else if (!allowedExtensions.exec(fileInput)) {
            $('#fileErrorPost').text(' ');
            $('#avatar').val('');
            $('#fileErrorPost').text('Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.');

            valid = false;
        }


        // If all fields are valid, submit the form
        if (valid) {
            $('.error').text('');
              var formData = new FormData();
        formData.append('ImageUpload', ImageUpload);
        formData.append('Name', name);
        formData.append('Username', username);
        formData.append('Email', email);
        formData.append('Gender', gender);

        $.ajax({
            url: "/InstagramMvc/UserUpdateProfile",
            method: "POST",
            data: formData,
            processData: false,  // Prevent jQuery from processing the data
            contentType: false,
            success: function (data) {
                alert("User Profile Updated");
                $("#name").val('');
                $("#email").val('');
                $("#username").val('');
                $('input[name="gender"]:checked').val('');
                $('#avatar').val('');
                window.location.href = '/InstagramMvc/ProfilePage'
            },
            error: function (data) {
                alert("Submit Error  Side" + data);
            }
        })

        }  
        });
}
// ON CLICK FOLLOW BUTTON
function Followbtn(id) {

            $.ajax({
                url: "/InstagramMvc/FollowingUser/" + id,
                method: "GET",
                success: function (data) {
                    
                   
                    $('#suggestions').empty();
                    FetchAllSuggestionUsers();

                },
                error: function (data) {
                    alert("Submit Error  Side" + data);
                }
            }) 
}

function FetchAllSuggestionUsers() {
        $.ajax({
            url: '/InstagramMvc/GetAllUser',
            method: 'GET',
            success: function (data) {
                console.log(data.usersNotFollowed);
                data.user.forEach(function (story) {
                    var storyHtml = `
                                    <div class="cart">
                                        <div>
                                            <div class="img">
                                                <img src="${story.UserProfilePicture}" onerror="this.src='/Images/admin.jpg';" class="img-fluid rounded-circle" style="width: 60px; height: 60px;" alt="">
                                            </div>
                                            <div class="info">
                                                <p class="name">${story.UserName}</p>
                                                <p class="second_name">${story.Name}</p>
                                            </div>
                                        </div>
                                        <div class="switch">
                                            <button class="follow_text" id="${story.UserName}" onclick="Followbtn(${story.Id})" href="#">follow</button>
                                        </div>
                                    </div>
                                                        `;
                    $('#suggestions').append(storyHtml);
                });
            },
            error: function (err) {
                console.error("Error fetching stories:", err);
            }
        });
}

function PostLike(button) {
    
    var $button = $(button);
    var postId = $button.data('post-id');
    var $icon = $button.find('.icon[data-post-id="' + postId + '"]');

    $.ajax({
        url: '/InstagramMvc/PostLiked?postId=' + postId,
        method: 'GET',
        success: function (data) {
            //if ($icon.hasClass('fa fa-heart-o')) {
            //    $icon.removeClass('fa fa-heart-o').addClass('fa fa-heart');
            //    $icon.css('color', 'red');
            //    } else {
            //        $icon.removeClass('fa fa-heart').addClass('fa fa-heart-o');
            //        $icon.css('color', ''); s
            //}
           // alert(data.user);
            
            
          //  $('#likes-count-' + postId).empty();
            console.log('#likes-count'); 
            var likesCountSpan = $('#likes-count-' + postId);
            likesCountSpan.text(data.user + ' Likes');
        },
        error: function (data) {
            alert("Submit Error  Side" + data);
        }
    });
}
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function postComment(button) {
   
    var postId = $(button).data('post-id');
    var commentInput = $(button).siblings('.comment-input').val();
    var escapedCommentInput = escapeHtml(commentInput);
    var obj = {
        PostId: postId,
        CommentText: escapedCommentInput
    }
   
    $.ajax({
        url: '/InstagramMvc/PostComment/', 
        method: 'POST',
        data: obj,
        success: function (data) {
           
            var commentHtml = `
                        <div class="cart" id="comment-${data.user.commentid}" data-post-id="${data.user.postId}">
                            <div>
                                <div class="img ms-2">
                                    <img src="${data.user.userImage}" onerror="this.src='/Images/admin.jpg';" class="img-fluid rounded-circle" style="width: 40px; height: 40px;" alt="">
                                </div>
                                <div class="info">
                                    <p class="name h6">${data.user.userName}</p>
                                    <p class="second_name mt-1 mb-1 text-dark">${data.user.commentinput}</p>
                                    <p class="name" ><a class="link-color fw-bold" data-comment-id="${data.user.commentid}" onclick="replyComment(this, ${data.user.postId})" >Reply</a></p>
                                </div>
                            </div>   
                        </div>
                         <div class="replies ms-5" id="replies-${data.user.commentid}"></div>
                    `;
            $('#comments-' + postId).prepend(commentHtml);
            $(button).siblings('.comment-input').val('');
            
            
            var totalcomment = data.user.commentcount;
            $('#comments-count-' + data.user.postId).text('View all ' + totalcomment + ' comments');
            $('.comments-count-' + data.user.postId).text(totalcomment );
            $('.icon-comments-' + data.user.postId).text(totalcomment + ' Comments');
            $('#comments-' + postId).show();
        },
        error: function (xhr, status, error) {
            alert("ERROR SIED " + data);; 
        }
    });



}

function replyComment(a, PostId) {
    var commentId = $(a).data('comment-id');
    
    $('#parentCommentId').val(commentId);// Add a hidden input for parentCommentId in your modal
    $('#postId').val(PostId); // Add a hidden input for postId in your modal
    $('#replyModal').modal('show');
}
function SaveCommentReply() {
    var parentCommentId = $('#parentCommentId').val().trim();
    var postId = $('#postId').val().trim();
    var replyText = $('#replyText').val();

    if (replyText === '') {
        alert('Reply cannot be empty');
        return;
    }
    $.ajax({
        url: '/InstagramMvc/CommentReply',
        method: 'POST',
        data: {
            parentCommentId: parentCommentId,
            replyText: replyText,
            postId: postId
        },
        success: function (data) {
            //onclick="replyComment(this, ${data.user.postId})" FUTURE USE

            var replyHtml = `
                            <div class="cart" id="comment-${data.user.commentId}" data-post-id="${data.user.postId}">
                                <div class="d-flex align-items-start ms-2">
                                    <div class="img">
                                        <img src="${data.user.userImage}" onerror="this.src='/Images/admin.jpg';" class="img-fluid rounded-circle" style="width: 30px; height: 30px;" alt="">
                                    </div>
                                    <div class="info ms-3">
                                        <p class="name h6">${data.user.userName}</p>
                                        <p class="second_name mt-1 mb-1 text-dark">${data.user.commentinput}</p>
                                        <p class="name">
                                            <a class="link-color fw-bold" data-comment-id="${data.user.commentId}" ></a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        `;

            $('#replies-' + data.user.parentCommentId).prepend(replyHtml);
            $('#replyText').val('');
            var totalcomment = data.user.commentcount;
            $('#comments-count-' + data.user.postId).text('View all ' + totalcomment + ' comments');
            $('#replyModal').modal('hide');
           
        },
        error: function () {
            alert('Error submitting reply');
        }
    });
}




// Will USE AFTERWARDS

function cart(){
    var html = '<div class="switch me-3">'
       ' < button class="btn btn-white btn-icon" data - post - id="${data.user}" title = "Delete" >'
        '    <span class="fa fa-trash" data-post-id="${data.user}"></span>'
       ' </button >'
    '</div >;'
}

// USED FOR TOGGLING THE COMMENTS
function toggleComments(postId) {
    $('#comments-' + postId).toggle();
}
//FOR  FOLLOWING
function FollowingModalList() {
    $('#FollowingModal').modal('show');
    showFollowingList();
}

function showFollowingList() {
    $.ajax({
        url: '/InstagramMvc/UserFollowingList/',
        method: 'GET',
        success: function (response) {
            $('#following-list').empty();
            if (response.success) {
                var userList = response.user; // Assuming 'user' is the key in your JSON result
                $.each(userList, function (index, user) {
                    var storyHtml = `
                                    <div class="cart">
                                        <div>
                                            <div class="img">
                                                <img src="${user.UserImage}" onerror="this.src='/Images/admin.jpg';" class="img-fluid rounded-circle" style="width: 60px; height: 60px;" alt="">
                                            </div>
                                            <div class="info">
                                                <p class="name">${user.UserName}</p>
                                                <p class="second_name">${user.Name}</p>
                                            </div>
                                        </div>
                                        <div class="switch">
                                            <button class="btn btn-danger"  onclick="UnFollowbtn(${user.UserId})" href="#">unfollow</button>
                                        </div>
                                    </div>
                                                        `;
                    $('#following-list').append(storyHtml);
                });
            }


        },
        error: function (data) {
            alert("Submit Error  Side" + data);
        }
    })
}

function UnFollowbtn(id) {
    $.ajax({
        url: "/InstagramMvc/UnFollowingUser/" + id,
        method: "GET",
        success: function (data) {
            console.log(data.user);
            $('#following-list').empty();
            showFollowingList();

        },
        error: function (data) {
            alert("Submit Error  Side" + data);
        }
    })
}

//FOR  FOLLOW
function FollowModalList() {
    $('#FollowModal').modal('show');
    showFollowList();
}

function showFollowList() {
    $.ajax({
        url: '/InstagramMvc/UserFollowList/',
        method: 'GET',
        success: function (response) {
            $('#follow-list').empty();
            if (response.success) {
                var userList = response.user; // Assuming 'user' is the key in your JSON result
                $.each(userList, function (index, user) {
                    var storyHtml = `
                                    <div class="cart">
                                        <div>
                                            <div class="img">
                                                <img src="${user.UserImage}" onerror="this.src='/Images/admin.jpg';" class="img-fluid rounded-circle" style="width: 60px; height: 60px;" alt="">
                                            </div>
                                            <div class="info">
                                                <p class="name">${user.UserName}</p>
                                                <p class="second_name">${user.Name}</p>
                                            </div>
                                        </div>
                                        
                                    </div>
                                                        `;
                    $('#follow-list').append(storyHtml);
                });
            }


        },
        error: function (data) {
            alert("Submit Error  Side" + data);
        }
    })
}







