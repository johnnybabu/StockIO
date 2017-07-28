using System;
using Projects.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class nProductViewModel:IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public string product_name { get; set; }
        public string product_code { get; set; }
        public string category { get; set; }
        public string sub_category { get; set; }
        public DateTime created_date { get; set; }
        public int created_by { get; set; }
        public DateTime modified_date { get; set; }
        public int modified_by { get; set; }
    }
}