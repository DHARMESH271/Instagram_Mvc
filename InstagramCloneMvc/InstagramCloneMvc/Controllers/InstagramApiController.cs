using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace InstagramCloneMvc.Controllers
{
    public class InstagramApiController : ApiController
    {
        
        InstagramEntities dbcontext = new InstagramEntities();

        [HttpPost]
        [Route("api/InstagramApi/LoginUser")]
        public IHttpActionResult LoginUser(UserDetail u)
        {
            try
            {
                var result = dbcontext.Database.SqlQuery<int>("EXEC SpUserLogin @UserName, @UserPassword",
                  new SqlParameter("@UserName", u.UserName),
                  new SqlParameter("@UserPassword", u.Password))
                  .FirstOrDefault();

                if (result >= 1)
                {
                    return Ok(result);
                }
                else if (result == 0)
                {
                    return BadRequest();
                }
                else
                {
                    return InternalServerError(new Exception("An error occurred during login."));
                }

            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }


        }

        [HttpPost]
        [Route("api/InstagramApi/SignUpUser")]
        public IHttpActionResult SignUpUser(UserDetail u)
        {
            try
            {
                //int? userID = _session["UserID"] as int?;
                var name = new SqlParameter("@Name", u.Name);
                var email = new SqlParameter("@Email", u.Email);
                var userName = new SqlParameter("@UserName", u.UserName);
                var password = new SqlParameter("@Password", u.Password);


                dbcontext.Database.ExecuteSqlCommand("EXEC SpUserSignIn @Name, @Email, @UserName, @Password",
                    name, email, userName, password);

                return Ok("User signed in successfully.");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }

        }

        [HttpPost]
        [Route("api/InstagramApi/StoryUpload")]
        public IHttpActionResult StoryUpload(StoryUpload s)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");

            try
            {
                dbcontext.StoryUploads.Add(new StoryUpload()
                {
                    Id = s.Id,
                    StoryImage = s.StoryImage,
                    StoryDate = DateTime.Now
                });
                dbcontext.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {

                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("api/InstagramApi/GetStory")]
        public IHttpActionResult GetStory()
        {
            //.OrderByDescending(story => story.StoryId)


            try
            {
                var stories = dbcontext.StoryUploads
                    .Select(story => new
                {
                    Stories = story.StoryImage
                }).ToList();
                
                return Ok(stories);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [HttpGet]
        [Route("api/InstagramApi/GetPost")]
        public IHttpActionResult GetPost()
        {
            try
            {

                var postDetails = from p in dbcontext.PostUploads
                                  join u in dbcontext.UserDetails on p.Id equals u.Id into userGroup
                                  from u in userGroup.DefaultIfEmpty()
                                  where p.IsArchieve == false && p.IsDeleted == false
                                  select new
                                  {
                                      p.PostId,
                                      p.PostImage,
                                      p.PostCaption,
                                      p.PostDate,
                                      p.Id,
                                      UserName = u.UserName,
                                      UserProfileImage = u.UserProfileImage,
                                      LikesCount = dbcontext.Likeds.Count(l => l.PostId == p.PostId),
                                      CommentCount = dbcontext.Comments.Count(c => c.PostId == p.PostId && c.ParentCommentId == null),
                                      Comments = (
                                            from c in dbcontext.Comments
                                            where c.PostId == p.PostId  
                                            select new
                                            {
                                                c.PostId,
                                                c.CommentId,
                                                c.ParentCommentId,
                                                UserImage = dbcontext.UserDetails
                                                    .Where(user => user.Id == c.UserId)
                                                    .Select(user => user.UserProfileImage)
                                                    .FirstOrDefault(),
                                                UserName = dbcontext.UserDetails
                                                    .Where(user => user.Id == c.UserId)
                                                    .Select(user => user.UserName)
                                                    .FirstOrDefault(),
                                                CommentText = c.CommentText,
                                                Replies = (
                                                  from r in dbcontext.Comments
                                                  where r.ParentCommentId == c.CommentId
                                                  select new
                                                  {
                                                      r.PostId,
                                                      r.CommentId,
                                                      r.UserId,
                                                      UserImage = dbcontext.UserDetails
                                                          .Where(user => user.Id == r.UserId)
                                                          .Select(user => user.UserProfileImage)
                                                          .FirstOrDefault(),
                                                      UserName = dbcontext.UserDetails
                                                          .Where(user => user.Id == r.UserId)
                                                          .Select(user => user.UserName)
                                                          .FirstOrDefault(),
                                                      CommentText = r.CommentText
                                                  }
                                              ).ToList()
                                            }
                                        ).ToList()
                                  };
               // var likescount = dbcontext.Likeds.Count(l => l.PostId == p.PostId);
                var postDetailsList = postDetails.ToList();
                return Ok(postDetails);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("api/InstagramApi/GetAllUser")]
        public IHttpActionResult GetAllUser()
        {
            try
            {
                var stories = dbcontext.StoryUploads.Select(story => new
                {
                    Stories = story.StoryImage
                }).ToList();

                return Ok(stories);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }






















    }
    }
    