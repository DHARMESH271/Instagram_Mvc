using System;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;

namespace InstagramCloneMvc.Controllers
{
    public class InstagramMvcController : Controller
    {
        
           InstagramEntities dbcontext = new InstagramEntities();
        public ActionResult HomePage()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("LoginPage");
            }
            int userID = Convert.ToInt32(Session["UserID"]);
            return View();
        }

        public ActionResult CreateSession(int id )
        {
            Session["UserId"] = id;
            return RedirectToAction("HomePage");
        }

        public ActionResult LogoutSession()
        {
            Session.Clear();
            Session.Abandon();
            return RedirectToAction("LoginPage");
        }

        public ActionResult LoginPage()
        {
            return View();
        }

        public ActionResult SignUpPage()
        {
            return View();
        }

        public ActionResult EditProfilePage()
        {
           if (Session["UserId"] == null)
            {
                return RedirectToAction("LoginPage");
            }

            return View();
        }

        public ActionResult ProfilePage()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("LoginPage");
            }

            return View();
        }

        public ActionResult ArchivePage()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("LoginPage");
            }

            return View();
        }

        public ActionResult StoryUpload(StoryUpload s, HttpPostedFileBase ImageUpload)
        {
            HttpClient client = new HttpClient();
            
            int userID = Convert.ToInt32(Session["UserID"]);
            s.Id = userID;

            string imageName = System.IO.Path.GetFileName(ImageUpload.FileName);
            string physicalPath = Server.MapPath("~/Upload/"+ imageName);
            ImageUpload.SaveAs(physicalPath);
            s.StoryImage= VirtualPathUtility.ToAbsolute("~/Upload/"+imageName);


            try
            {
              var stories = dbcontext.StoryUploads.Add(new StoryUpload()
                {
                    Id = s.Id,
                    StoryImage = s.StoryImage,
                    StoryDate = DateTime.Now
                });
                dbcontext.SaveChanges();

                return Json(new { success = true, story = stories }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        public ActionResult PostUpload(PostUpload s, HttpPostedFileBase ImageUpload , UserDetail u , Liked like)
        {
         
            int userID = Convert.ToInt32(Session["UserID"]);
            var username = GetUserName(userID);
            var userProfileImage = GetUserProfileImage(userID);
            s.Id  = userID;
            string postCaption = Request.Form["Caption"];
            string imageName = System.IO.Path.GetFileName(ImageUpload.FileName);
            string physicalPath = Server.MapPath("~/Upload/" + imageName);
            ImageUpload.SaveAs(physicalPath);
            s.PostImage = VirtualPathUtility.ToAbsolute("~/Upload/" + imageName);

            try
            {
              var posts =   dbcontext.PostUploads.Add(new PostUpload()
                {
                    Id = s.Id,
                    PostImage= s.PostImage,
                    PostDate = DateTime.Now,
                    IsArchieve = false,
                    IsDeleted = false,  
                    PostCaption = postCaption
                });
                dbcontext.SaveChanges();
                var  LikesCounts = dbcontext.Likeds.Count(l => l.PostId == posts.PostId);

                var postDto = new
                {
                    PostId = posts.PostId,
                    PostImage = posts.PostImage,
                    PostDate = posts.PostDate,
                    PostCaption = posts.PostCaption,
                    UserName = username,
                    UserProfileImage= userProfileImage,
                    LikesCount= LikesCounts
                };

                return Json(new { success = true, post = postDto }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex )
            {

                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        public string GetUserName(int id)
        {
            var user = dbcontext.UserDetails.FirstOrDefault(u => u.Id == id);
            var username = user.UserName;

            return username;
        }
        public string GetUserProfileImage(int id)
        {
            var user = dbcontext.UserDetails.FirstOrDefault(u => u.Id == id);
            var userProfileImage = user.UserProfileImage;

            return userProfileImage;
        }


        public ActionResult GetAllUser()
        {
            int userID = Convert.ToInt32(Session["UserID"]);

            try
            {
                // IMP QURIES IT SHOW ONLY USER WHICH I DONT FOLLOW
                var stories = dbcontext.UserDetails
                        .Where(user => !dbcontext.Followers
                                          .Where(follower => follower.FollowerUserId == userID)
                                          .Select(follower => follower.FollowingUserId)
                                          .Contains(user.Id) && user.Id != userID)
                        .Select(user => new
                        {
                            Id = user.Id,
                            Name = user.Name,
                            UserName = user.UserName,
                            UserProfilePicture = user.UserProfileImage
                        })
                        .ToList();

                return Json(new { success = true, user = stories }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }




        public ActionResult UserAllPosts()
        {
            int userID = Convert.ToInt32(Session["UserID"]);

            try
            {
                var allpost = dbcontext.PostUploads.Where(s => s.Id == userID && s.IsArchieve == false && s.IsDeleted == false ).Select(post => new
                {
                    postid = post.PostId,
                    Posts = post.PostImage,
                    Postlike =  dbcontext.Likeds.Count(l => l.PostId == post.PostId),
                    CommentCount = dbcontext.Comments.Count(c => c.PostId == post.PostId && c.ParentCommentId == null)
            }).ToList();

                return Json(new { success = true, post = allpost }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        
        public ActionResult UserAllArchievePosts()
        {
            int userID = Convert.ToInt32(Session["UserID"]);

            try
            {
                var allpost = dbcontext.PostUploads.Where(s => s.Id == userID && s.IsArchieve == true && s.IsDeleted == false).Select(post => new
                {
                    postid = post.PostId,
                    Posts = post.PostImage,
                    Postlike = dbcontext.Likeds.Count(l => l.PostId == post.PostId),
                    CommentCount = dbcontext.Comments.Count(c => c.PostId == post.PostId && c.ParentCommentId == null),
                }).ToList();

                return Json(new { success = true, post = allpost }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult UserAllDeletedPosts()
        {
            int userID = Convert.ToInt32(Session["UserID"]);    
            try
            {
                var allpost = dbcontext.PostUploads.Where(s => s.Id == userID &&  s.IsDeleted == true).Select(post => new
                {
                    postid = post.PostId,
                    Posts = post.PostImage,
                    Postlike = dbcontext.Likeds.Count(l => l.PostId == post.PostId),
                    CommentCount = dbcontext.Comments.Count(c => c.PostId == post.PostId && c.ParentCommentId == null),
                }).ToList();

                return Json(new { success = true, post = allpost }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult SetPostArchive(PostUpload p)
        {
            try
            {
            int userID = Convert.ToInt32(Session["UserID"]);
            var PostArchieveid = p.PostId;

            var postToUpdate = dbcontext.PostUploads.FirstOrDefault(post => post.PostId == PostArchieveid);

                if(postToUpdate != null)
                {
                    postToUpdate.IsArchieve = true;   
                    dbcontext.SaveChanges();
                }

                var allpost = dbcontext.PostUploads.Where(s => s.Id == userID && s.IsArchieve == false && s.IsDeleted == false).Select(post => new
                {
                    postid = post.PostId,
                    Posts = post.PostImage,
                    Postlike = dbcontext.Likeds.Count(l => l.PostId == post.PostId),
                    CommentCount = dbcontext.Comments.Count(c => c.PostId == post.PostId && c.ParentCommentId == null),
                }).ToList();

                return Json(new { success = true, post = allpost }, JsonRequestBehavior.AllowGet);

                
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult SetPostUnArchive(PostUpload p)
        {
            try
            {
                int userID = Convert.ToInt32(Session["UserID"]);
                var PostUnArchieveid = p.PostId;

                var postUnArchieveUpdate = dbcontext.PostUploads.FirstOrDefault(post => post.PostId == PostUnArchieveid);

                if (postUnArchieveUpdate != null)
                {
                    postUnArchieveUpdate.IsArchieve = false;
                    dbcontext.SaveChanges();
                }

                var allpost = dbcontext.PostUploads.Where(s => s.Id == userID && s.IsArchieve == true && s.IsDeleted == false).Select(post => new
                {
                    postid = post.PostId,
                    Posts = post.PostImage,
                    Postlike = dbcontext.Likeds.Count(l => l.PostId == post.PostId),
                    CommentCount = dbcontext.Comments.Count(c => c.PostId == post.PostId && c.ParentCommentId == null),
                }).ToList();

                return Json(new { success = true, post = allpost }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult DeletePost(PostUpload p)
        {
            try
            {
                int userID = Convert.ToInt32(Session["UserID"]);
                var DeletePostid = p.PostId;

                var postDelete = dbcontext.PostUploads.FirstOrDefault(post => post.PostId == DeletePostid);

                if (postDelete != null)
                {
                    postDelete.IsDeleted  = true;
                    dbcontext.SaveChanges();
                }

                var allpost = dbcontext.PostUploads.Where(s => s.Id == userID && s.IsArchieve == false && s.IsDeleted == false).Select(post => new
                {
                    postid = post.PostId,
                    Posts = post.PostImage,
                    Postlike = dbcontext.Likeds.Count(l => l.PostId == post.PostId),
                    CommentCount = dbcontext.Comments.Count(c => c.PostId == post.PostId && c.ParentCommentId == null),
                }).ToList();

                return Json(new { success = true, post = allpost }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult UserProfile()
        {
            int userID = Convert.ToInt32(Session["UserID"]);
            try
            {
                var userdetails = dbcontext.UserDetails.FirstOrDefault(u => u.Id == userID);
                var postdetails = dbcontext.PostUploads.Count(s => s.Id == userID && s.IsDeleted != true && s.IsArchieve != true);
                    // GET THE LIST OF FOLLOWERS OF LOGGED ID   
                var userfollowersdetails = dbcontext.Followers.Count(f => f.FollowingUserId == userID);
                // GET THE LIST OF FOLLOWING OF LOGGED ID 
                var userfollowingdetails = dbcontext.Followers.Count(f => f.FollowerUserId == userID);

                var postDto = new
                {
                    Name = userdetails.Name,
                    UserName = userdetails.UserName,
                    UserId = userdetails.Id,
                    Email = userdetails.Email,
                    UserProfile = userdetails.UserProfileImage,
                    Gender = userdetails.Gender,
                    TotalPost = postdetails,
                    userfollowersdetails = userfollowersdetails,
                    userfollowingdetails = userfollowingdetails
                };

                if (postDto != null)
                {
                    return Json(new { success = true, userdetail = postDto }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = false, error = "User details not found" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult UserEditProfile()
        {
            int userID = Convert.ToInt32(Session["UserID"]);
            try
            {
                var userdetails = dbcontext.UserDetails.FirstOrDefault(u => u.Id == userID);

                var postDto = new
                {
                    Name = userdetails.Name,
                    UserName = userdetails.UserName,
                    UserId = userdetails.Id,
                    Email = userdetails.Email,
                    UserProfileImage = userdetails.UserProfileImage,
                    Gender = userdetails.Gender
                };

                if (postDto != null)
                {
                    return Json(new { success = true, userdetail = postDto }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = false, error = "User details not found" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult UserUpdateProfile(UserDetail s, HttpPostedFileBase ImageUpload)
        {

            int userID = Convert.ToInt32(Session["UserID"]);

            string name = Request.Form["Name"];
            string email = Request.Form["Email"];
            string username = Request.Form["Username"];
            string gender = Request.Form["Gender"];
            string imageName = System.IO.Path.GetFileName(ImageUpload.FileName);
            string physicalPath = Server.MapPath("~/Upload/" + imageName);
            ImageUpload.SaveAs(physicalPath);
            s.UserProfileImage  = VirtualPathUtility.ToAbsolute("~/Upload/" + imageName);

            try
            {
                var userDetailUpdate = dbcontext.UserDetails.FirstOrDefault(u => u.Id == userID);

                if (userDetailUpdate != null)
                {
                    userDetailUpdate.Name = name;
                    userDetailUpdate.Email = email;
                    userDetailUpdate.UserName = username;
                    userDetailUpdate.Gender = gender;
                    userDetailUpdate.UserProfileImage = s.UserProfileImage;
                    //postDelete.IsDeleted = true;
                    dbcontext.SaveChanges();
                }

                //var allpost = dbcontext.PostUploads.Where(s => s.Id == userID && s.PostId == PostArchieveid).Select(post => new
                //{
                //    postid = post.PostId,
                //    Posts = post.PostImage
                //}).ToList();

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        public ActionResult FollowingUser(int id)
        {
            int userID = Convert.ToInt32(Session["UserID"]);
            int followingId = id;
            try
            {
                var following = dbcontext.Followers.Add(new Follower()
                {
                    FollowerUserId = userID,
                    FollowingUserId = followingId,
                    FollowDate = DateTime.Now
                });
                dbcontext.SaveChanges();


                var notification = dbcontext.Notifications.Add(new Notification
                {
                    UserID = followingId,
                    TriggeringUserID = userID,
                    NotificationType = "Followed",
                    NotificationText = "Started Following You",
                    NotificationDate = DateTime.Now
                });

                dbcontext.SaveChanges();

                return Json(new { success = true, user = following }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }  
        }

        public ActionResult PostLiked(int postId)
        {
            int userID = Convert.ToInt32(Session["UserID"]);
            int postid = postId;
            try
            {
                var like = dbcontext.Likeds.FirstOrDefault(l => l.PostId == postId && l.UserId == userID);

                if (like == null)
                {
                    dbcontext.Likeds.Add(new Liked
                    {
                        PostId = postId,
                        UserId = userID,
                        LikeDate = DateTime.Now
                    }) ;

                        var post = dbcontext.PostUploads.FirstOrDefault(p => p.PostId == postId && p.Id != userID);
                        if (post != null)
                        {

                        var userpost = dbcontext.PostUploads.Where(p => p.PostId == postId).Select(p => p.Id).FirstOrDefault();
                        var notification = dbcontext.Notifications.Add(new Notification
                                {
                                    UserID = userpost,
                                    TriggeringUserID = userID,
                                    PostID = postId,
                                    NotificationType = "LIKE",
                                    NotificationText = "Liked Your Post",
                                    NotificationDate = DateTime.Now
                                });

                                dbcontext.SaveChanges();
                         }

                }
                else
                {
                    dbcontext.Likeds.Remove(like);
                }
                dbcontext.SaveChanges();

                var likescount = dbcontext.Likeds.Count(l => l.PostId == postId);
                return Json(new { success = true, user = likescount }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        
        }


        public ActionResult PostComment(Comment c )
        {
            int userID = Convert.ToInt32(Session["UserID"]);
           
            try
            {
                int postid = (int)c.PostId;
                string comment = c.CommentText;

                var post = dbcontext.PostUploads.Find(postid);

                if (post == null)
                {
                    return Json(new { success = false, message = "Post not found." });
                }

                var commentinsert = new Comment {
                            PostId = postid,
                            UserId = userID,
                            CommentText = comment,
                            CommentDate = DateTime.Now
                        };
                dbcontext.Comments.Add(commentinsert);
                dbcontext.SaveChanges();

                var posts = dbcontext.PostUploads.FirstOrDefault(p => p.PostId == postid && p.Id != userID);
                if (posts != null)
                {
                    var userpost = dbcontext.PostUploads.Where(p => p.PostId == postid).Select(p => p.Id).FirstOrDefault();
                    
                    var notification = dbcontext.Notifications.Add(new Notification
                    {
                        UserID = userpost,
                        PostID = postid,
                        NotificationType = "Comment",
                        TriggeringUserID = userID,
                        NotificationText = "Commented On Your Post",
                        NotificationDate = DateTime.Now
                    });

                    dbcontext.SaveChanges();
                }


                var commentdetails = new
                {
                    postId = commentinsert.PostId,
                    userImage = dbcontext.UserDetails.Where(u => u.Id == commentinsert.UserId).Select(u => u.UserProfileImage).FirstOrDefault(),
                    userName = dbcontext.UserDetails.Where(u => u.Id == commentinsert.UserId).Select(u => u.UserName).FirstOrDefault(),
                    commentid = commentinsert.CommentId,
                    commentinput = commentinsert.CommentText,
                    commentcount = dbcontext.Comments.Count(com => com.PostId == postid && c.ParentCommentId == null) 
            };


                return Json(new { success = true, user = commentdetails }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        public ActionResult CommentReply(int parentCommentId, string replyText, int postId)
        {
            int userID = Convert.ToInt32(Session["UserID"]);

            try
            {
                //int postid = (int)PostId;
                //string comment = c.CommentText;

                var post = dbcontext.PostUploads.Find(postId);

                if (post == null)
                {
                    return Json(new { success = false, message = "Post not found." });
                }
                var user = dbcontext.UserDetails.Find(userID);

                var commentinsert = new Comment
                {
                    ParentCommentId = parentCommentId,
                    PostId = postId,
                    UserId = userID,
                    CommentText = replyText,
                    CommentDate = DateTime.Now
                };
                dbcontext.Comments.Add(commentinsert);
                dbcontext.SaveChanges();


                var commentdetails = new
                {
                    postId = commentinsert.PostId,
                    userImage = dbcontext.UserDetails.Where(u => u.Id == commentinsert.UserId).Select(u => u.UserProfileImage).FirstOrDefault(),
                    userName = dbcontext.UserDetails.Where(u => u.Id == commentinsert.UserId).Select(u => u.UserName).FirstOrDefault(),
                    commentid = commentinsert.CommentId,
                    commentinput = commentinsert.CommentText,
                    parentCommentId = commentinsert.ParentCommentId,
                    commentcount = dbcontext.Comments.Count(com => com.PostId == postId && com.ParentCommentId == null)
                    //  commentcount = dbcontext.Comments.Count(com => com.PostId == postid)
                };


                return Json(new { success = true, user = commentdetails }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

        }


        public ActionResult UserFollowingList()
        {
            int userID = Convert.ToInt32(Session["UserID"]);
            try
            {
                var followingUserIds = dbcontext.Followers.Where(f => f.FollowerUserId == userID).Select(f => f.FollowingUserId).ToList();

                var userListFollwing = dbcontext.UserDetails.Where(u => followingUserIds.Contains(u.Id)).Select(u => new
                {
                    UserId = u.Id,
                    UserName = u.UserName,
                    Name = u.Name,
                    UserImage = u.UserProfileImage
                }).ToList();

                return Json(new { success = true, user = userListFollwing }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
                       
        }

        public ActionResult UserFollowList()
        {
            int userID = Convert.ToInt32(Session["UserID"]);
            try
            {
                var followUserIds = dbcontext.Followers.Where(f => f.FollowingUserId == userID).Select(f => f.FollowerUserId).ToList();

                var userListFollow = dbcontext.UserDetails.Where(u => followUserIds.Contains(u.Id)).Select(u => new
                {
                    UserId = u.Id,
                    UserName = u.UserName,
                    Name = u.Name,
                    UserImage = u.UserProfileImage
                }).ToList();

                return Json(new { success = true, user = userListFollow }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

        }



        public ActionResult UnFollowingUser(int id)
        {
            int userID = Convert.ToInt32(Session["UserID"]);
            int followingId = id;

            try
            {
                var followersToDelete = dbcontext.Followers.Where(f => f.FollowerUserId == userID && f.FollowingUserId == followingId);

                dbcontext.Followers.RemoveRange(followersToDelete);
                dbcontext.SaveChanges();

                return Json(new { success = true, user = followersToDelete }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult AllNotificationDetails()
        {
            int loggedId = Convert.ToInt32(Session["UserID"]);
            try
            {
                var notifications = from n in dbcontext.Notifications
                            where n.UserID == loggedId
                            join receivingUser in dbcontext.UserDetails on n.UserID equals receivingUser.Id
                            join triggeringUser in dbcontext.UserDetails on n.TriggeringUserID equals triggeringUser.Id
                            join post in dbcontext.PostUploads on n.PostID equals post.PostId into postGroup
                            from post in postGroup.DefaultIfEmpty()
                            where post == null || (post.IsArchieve  == false && post.IsDeleted == false)
                            select new
                            { 
                                NotificationID = n.NotificationID,
                                TriggeringUserName = triggeringUser.UserName,
                                TriggeringUserImage = triggeringUser.UserProfileImage,
                                NotificationText = n.NotificationText,
                                PostImage = post != null ? post.PostImage : null
                            };

                var result = notifications.ToList();

                return Json(new { success = true  ,user = notifications }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                return Json(new { success = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

        }       
    }
}