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
    
    public partial class Notification
    {
        public int NotificationID { get; set; }
        public Nullable<int> UserID { get; set; }
        public Nullable<int> TriggeringUserID { get; set; }
        public Nullable<int> PostID { get; set; }
        public string NotificationType { get; set; }
        public string NotificationText { get; set; }
        public Nullable<System.DateTime> NotificationDate { get; set; }
    
        public virtual PostUpload PostUpload { get; set; }
        public virtual UserDetail UserDetail { get; set; }
        public virtual UserDetail UserDetail1 { get; set; }
    }
}
