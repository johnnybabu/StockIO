using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities.Membership;
using Projects.Entities.Projects;
using Projects.Web.Infrastructure.Core;
using Projects.Web.Infrastructure.Extensions;
using Projects.Web.Models;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using Projects.Data;
using iTextSharp;
using ClosedXML.Excel;
using System.IO;
using System.Reflection;
using iTextSharp.text;
using iTextSharp.text.pdf;

namespace Projects.Web.Controllers
{
    [RoutePrefix("api/Dashboard")]
    public class DashboardController : ApiControllerBase
    {
        //public readonly IEntityBaseRepository<tbl_employee> _EmployeeRepository;
        public readonly IEntityBaseRepository<tbl_settings> _settingsRepository;


        public DashboardController(IEntityBaseRepository<tbl_settings> settingsRepository,
                //IEntityBaseRepository<tbl_employee> EmployeeRepository,
                IEntityBaseRepository<tbl_error> _errorsRepository, IUnitOfWork _unitOfWork)
                : base(_errorsRepository, _unitOfWork)
        {
           // _EmployeeRepository = EmployeeRepository;
            _settingsRepository = settingsRepository;

        }

        

        

        
       

        //[HttpGet]
        //[Route("LabourTestCertificates/{project_id:int}")]
        //public IHttpActionResult LabourTestCertificates(HttpRequestMessage request,int project_id)
        //{
        //    DBConnect contextObj = new DBConnect();
        //    var TestCertificatesList = (from lb in contextObj.labourset.Where(x=>x.project_id==project_id)
        //                                group lb by lb.subcontractor_id into g
        //                                select new
        //                                {
        //                                    sc_id=g.Key,
        //                                    sc_name=contextObj.subcontractorset.Where(s=>s.id==g.Key).Select(X => X.subcontractor_name),
        //                                    medicalTestDone = g.Count(m => m.check_medical_certificate == true),
        //                                    medicalTestNotDone=g.Count(m=>m.check_medical_certificate==false),
        //                                    eyeTestDone=g.Count(e=>e.check_eye_certificate==true),
        //                                    eyeTestNotDone = g.Count(e => e.check_eye_certificate == false)

        //                                });

        //    return Ok(TestCertificatesList);
        //}

        //[HttpGet]
        //[Route("WorkProgressVerifList/{project_id:int}")]
        //public IHttpActionResult WorkProgressVerifList(HttpRequestMessage request, int project_id)
        //{
        //    DBConnect contextObj = new DBConnect();
        //    var TestCertificatesList = (from wv in contextObj.workverificationSet.Where(x => x.project_id == project_id)
        //                                group wv by wv.junction_id into g
        //                                select new
        //                                {
        //                                    jn_id = g.Key,
        //                                    jn_name = contextObj.junctionset.Where(s => s.id == g.Key).Select(X => X.junction_name),
        //                                    approvedWork = g.Count(m => m.verification_status == 55),
        //                                    NotConfirmedWork = g.Count(m => m.verification_status == 57)                                            

        //                                });

        //    return Ok(TestCertificatesList);
        //}

        

        //[HttpGet]
        //[Route("SCTotalMaterials/{project_id:int}")]
        //public IHttpActionResult SCTotalMaterials(HttpRequestMessage request, int project_id)
        //{
        //    DBConnect contextObj = new DBConnect();

        //    var SubcontractorIndentDetails = (from ih in contextObj.indentheader.Where(x => x.project_id == project_id)
        //                                   join id in contextObj.indentdetails on ih.indent_no equals id.indent_no
        //                                   join ids in contextObj.IndentStatus on id.indent_no equals ids.indent_no
        //                                   select new
        //                                   {
        //                                       sc_id = ih.SubContractor_id,
        //                                       sc_name = contextObj.subcontractorset.Where(s => s.id == ih.SubContractor_id).Select(s => s.subcontractor_name),
        //                                       indent_no = ih.indent_no,
        //                                       material_name = id.material_name,
        //                                       indent_status = ids.indentstatus,
        //                                       material_cost = id.material_price,
        //                                       given_quantity = id.given_quantity
        //                                   }).Where(c => c.indent_status == "Given");

        //    var Total_Materials_count = (from scid in SubcontractorIndentDetails
        //                      group scid by scid.sc_id into k
        //                      select new
        //                      {
        //                          sc_id = k.Select(c => c.sc_id),
        //                          sc_name = k.Select(c => c.sc_name),
        //                          total_given_quantity = k.Sum(c => c.given_quantity)
        //                      }
        //        );
        //    return Ok(Total_Materials_count);
        }

        //[HttpGet]
        //[Route("SCWiseTotalMaterialsList/{project_id:int}")]
        //public IHttpActionResult SCWiseTotalMaterialsList(HttpRequestMessage request, int project_id)
        //{
        //    DBConnect contextObj = new DBConnect();
        //    var SCWiseTotalmaterialsList = (from ih in contextObj.indentheader.Where(x => x.project_id == project_id)
        //                                   join id in contextObj.indentdetails on ih.indent_no equals id.indent_no
        //                                   join ids in contextObj.IndentStatus on id.indent_no equals ids.indent_no
        //                                   select new
        //                                   {
        //                                       sc_id = ih.SubContractor_id,
        //                                       sc_name = contextObj.subcontractorset.Where(s => s.id == ih.SubContractor_id).Select(s => s.subcontractor_name),
        //                                       indent_no = ih.indent_no,
        //                                       material_name = id.material_name,
        //                                       indent_status = ids.indentstatus,
        //                                       material_cost = id.material_price,
        //                                       given_quantity = id.given_quantity
        //                                   }
        //                                   ).Where(c => c.indent_status == "Given");
        //    return Ok(SCWiseTotalmaterialsList);
        //}


    
}