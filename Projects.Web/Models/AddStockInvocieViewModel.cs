using System;
using Projects.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Projects.Web.Models
{
    public class AddStockInvocieViewModel : IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public string invoice_no { get; set; }
        public DateTime purchase_date { get; set; }
        public string supplier { get; set; }
        public bool items_due { get; set; }
        public int itmes_due_amount { get; set; }
        public int transport_charges { get; set; }
        public bool trans_due { get; set; }
        public int trans_due_amount { get; set; }
        public int labour_charges { get; set; }
        public bool labor_due { get; set; }
        public int labor_due_amount { get; set; }
        public int other_charges { get; set; }
        public bool other_due { get; set; }
        public int other_due_amount { get; set; }
        public DateTime created_date { get; set; }
        public int created_by { get; set; }
        public DateTime modified_date { get; set; }
        public int modified_by { get; set; }
        public List<AddStockItemsViewModel> addstockitems { get; set; }
    }
}