using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Projects.Entities;

namespace Projects.Web.Models
{
    public class AddStockItemsViewModel: IEntityBase
    {
        public int id { get; set; }        
        public int invoice_id { get; set; }
        public int product_id { get; set; }
        public int price { get; set; }
        public string brand_name { get; set; }
        public string model_name { get; set; }
        public string units_in { get; set; }
        public int quantity { get; set; }        
    }
}