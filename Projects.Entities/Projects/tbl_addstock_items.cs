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
    public class tbl_addstock_items:IEntityBase
    {
        public int id { get; set; }
        [ForeignKey("addstockinvoice"), DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int invoice_id { get; set; }
        public int product_id { get; set; }
        public int price { get; set; }
        public string brand_name { get; set; }
        public string model_name { get; set; }
        public string units_in { get; set; }
        public int quantity { get; set; }
        public virtual tbl_addstock_invoice addstockinvoice { get; set; }
    }
}
