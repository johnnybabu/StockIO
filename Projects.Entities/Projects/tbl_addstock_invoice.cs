using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Projects.Entities.MasterData;

namespace Projects.Entities.Projects
{
    public class tbl_addstock_invoice : IEntityBase
    {
        public tbl_addstock_invoice()
        {
            addstockitems = new HashSet<tbl_addstock_items>();
        }

        [Key]
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
        public virtual ICollection<tbl_addstock_items> addstockitems { get; set; }
    }
}
