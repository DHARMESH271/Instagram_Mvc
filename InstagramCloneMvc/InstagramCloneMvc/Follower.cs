//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace InstagramCloneMvc
{
    using System;
    using System.Collections.Generic;
    
    public partial class Follower
    {
        public int FollowerId { get; set; }
        public int FollowerUserId { get; set; }
        public int FollowingUserId { get; set; }
        public Nullable<System.DateTime> FollowDate { get; set; }
    
        public virtual UserDetail UserDetail { get; set; }
        public virtual UserDetail UserDetail1 { get; set; }
    }
}
