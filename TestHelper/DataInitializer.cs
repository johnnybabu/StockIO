using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Projects.Entities.Projects;

namespace TestHelper
{
    public class DataInitializer
    {
        public static List<tbl_employee> GetAllEmployees()
        {
            var emps = new List<tbl_employee>
            {
                new tbl_employee(){ emp_code="OAK-450",emp_name="SUKHADEV",Designation="Driver",date_created=DateTime.Parse("2017-04-24T12:20:27.18"),CreatedBy="Admin"},
                new tbl_employee(){ emp_code="OAK-451",emp_name="MANOJ KUMAR",Designation="Driver",date_created=DateTime.Parse("2017-04-24T12:22:27.013"),CreatedBy="Admin"},
                new tbl_employee(){ emp_code="OAK-452",emp_name="NARASIMHA",Designation="Driver",date_created=DateTime.Parse("2017-04-24T12:25:41.847"),CreatedBy="Admin"},
                new tbl_employee(){ emp_code="OAK-453",emp_name="VENKAT RANGA",Designation="Driver",date_created=DateTime.Parse("2017-04-24T12:27:21.043"),CreatedBy="Admin"}
            };
            return emps;
        }
    }
}
