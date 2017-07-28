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
    public class tbl_rate_chart:IEntityBase
    {
        [Key]
        public int id { get; set; }
        public int product { get; set; }
        public string brand { get; set; }
        public string model { get; set; }
        public int sale_price { get; set; }
        public string units { get; set; }
        public DateTime modified_date { get; set; }
        public int modified_by { get; set; }
    }
}
