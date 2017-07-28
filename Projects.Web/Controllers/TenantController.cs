using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities.Membership;
//using Projects.Entities.Projects;
using Projects.Web.Models;
using Projects.Services.Utilities;
using Projects.Web.Infrastructure;
using Projects.Web.Infrastructure.Core;
using Projects.Services;
using System.Data.Entity.Infrastructure;
using System.Web;
using Projects.Data;
using System.Collections.Generic;
using System.Linq;
using System;
using System.IO;
using System.Configuration;
using System.Web.Hosting;

namespace Projects.Web.Controllers
{
    [RoutePrefix("api/Tenant")]
    public class TenantController : ApiControllerBase
    {
        private readonly IMembershipService _membershipService;
        public readonly IEntityBaseRepository<tbl_tenant> _tenantRepository;
        public readonly IEntityBaseRepository<tbl_user> _userRepository;

        public TenantController(IMembershipService membershipService, 
            IEntityBaseRepository<tbl_tenant> tenantRepository,
            IEntityBaseRepository<tbl_user> userRepository,
            IEntityBaseRepository<tbl_error> _errorReposity,
            IUnitOfWork _iUnitOfWork) : base(_errorReposity, _iUnitOfWork)
        {
            _membershipService = membershipService;
            _tenantRepository = tenantRepository;
            _userRepository = userRepository;
        }


        [HttpPost]
        [Route("CreateTenant")]
        public HttpResponseMessage CreateTenant(HttpRequestMessage request, TenantViewModel tenant)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, new { success = false });
                }
                else
                {
                    var existingTenant = _tenantRepository.GetAll().FirstOrDefault(x => x.tenant_name == tenant.tenant_name);
                    GlobalVars.gvTenantKey = tenant.tenant_key;

                    if (existingTenant != null)
                    {
                        
                        throw new Exception("Tenant is already Exist!");
                    }

                    _membershipService.CreateTenant(tenant.tenant_key, tenant.tenant_name, tenant.tenant_type, tenant.contact_person,
                        tenant.email, tenant.contact_no, tenant.alt_contact_no, tenant.tenant_key, new int[] { 1 });

                    _membershipService.Assignmenu(tenant.tenant_key);

                    string vSubject = "Welcome to Projects Automation!";
                    string vBody = File.ReadAllText(HttpContext.Current.Server.MapPath("~") + "/Templates/Email/tenant_registration_email.html");
                    vBody = vBody.Replace("!Tenant", tenant.contact_person.ToString());
                    vBody = vBody.Replace("!uid", tenant.tenant_key.ToString());
                    vBody = vBody.Replace("!pwd", tenant.tenant_key.ToString());

                    Library.Email vEmail = new Library.Email();
                    bool emailsent = vEmail.SendMail(tenant.email, Convert.ToString(ConfigurationManager.AppSettings["FromEmail"]), "Projects Automation",
                        Convert.ToString(ConfigurationManager.AppSettings["CCEmail"]), vSubject, vBody);

                    response = request.CreateResponse(HttpStatusCode.OK, new { success = true });

                }

                return response;
            });
        }

        [HttpPost]
        [Route("UpdateTenant")]
        public HttpResponseMessage UpdateTenant(HttpRequestMessage request, TenantViewModel tenant)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, new { success = false });
                }
                else
                {
                    var existingTenant = _tenantRepository.GetAll().FirstOrDefault(x => x.tenant_key == tenant.tenant_key);

                    var oTenant = new TenantViewModel();

                    _membershipService.UpdateTenant(tenant.tenant_key, tenant.domain, tenant.contact_person, tenant.pan, tenant.tin, tenant.vat,
            tenant.email, tenant.contact_no, tenant.alt_contact_no, tenant.finance_start_month, tenant.bank_account_no, tenant.bank_name,
            tenant.bank_branch, tenant.ifsc_code, tenant.address, tenant.city, tenant.state, tenant.country, tenant.zip, tenant.comments, tenant.logo, tenant.logo_image_type);

                    response = request.CreateResponse(HttpStatusCode.OK, new { success = true });

                }

                return response;
            });
        }

        [Route("GetTenant/{tenantid:int}")]
        public HttpResponseMessage GetTenant(HttpRequestMessage request, int tenantid)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var tenants = _tenantRepository.GetAll().Where(x => x.id == tenantid);
                IEnumerable<TenantViewModel> tenantvm = Mapper.Map<IEnumerable<tbl_tenant>, IEnumerable<TenantViewModel>>(tenants);
                response = request.CreateResponse<IEnumerable<TenantViewModel>>(HttpStatusCode.OK, tenantvm);
                return response;

            });

        }

        [Route("GetTenants")]
        public HttpResponseMessage GetTenants(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var tenants = _tenantRepository.GetAll().Where(x => x.id != 1);
                IEnumerable<TenantViewModel> tenantvm = Mapper.Map<IEnumerable<tbl_tenant>, IEnumerable<TenantViewModel>>(tenants);
                response = request.CreateResponse<IEnumerable<TenantViewModel>>(HttpStatusCode.OK, tenantvm);
                return response;

            });

        }

        [Route("GetMyProfile")]
        public HttpResponseMessage GetMyProfile(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                DBConnect contextObj = new DBConnect();

                var vMyProfile = (from tenant in contextObj.tenants
                                  join usr in contextObj.UserSet on tenant.id equals usr.tenant_id
                                  where tenant.tenant_key == GlobalVars.gvTenantKey && usr.id == GlobalVars.gvUserID
                                  select new
                                  {
                                      tenant_key = tenant.tenant_key,
                                      tenant_name = tenant.tenant_name,
                                      domain = tenant.domain,
                                      email = usr.email,
                                      contact_no = tenant.contact_no,
                                      alt_contact_no = tenant.alt_contact_no
                                  });

                response = request.CreateResponse(HttpStatusCode.OK, vMyProfile);
                return response;
            });
        }

    }
}