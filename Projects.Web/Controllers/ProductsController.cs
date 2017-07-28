using Projects.Data;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities;
using Projects.Entities.MasterData;
using Projects.Entities.Membership;
using Projects.Services;
using Projects.Services.Utilities;
using Projects.Web.Infrastructure.Core;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using Projects.Entities.Projects;
using Projects.Web.Infrastructure.Extensions;
using System.Web.Http.Cors;

namespace Projects.Web.Controllers
{
    //[EnableCors(origins: "http://example.com", headers: "*", methods: "*")]
    [RoutePrefix("api/products")]
    public class ProductsController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_products> _productsRepository;


        public ProductsController(IEntityBaseRepository<tbl_products> productsRepository,
                IEntityBaseRepository<tbl_error> _errorsRepository, IUnitOfWork _unitOfWork)
                : base(_errorsRepository, _unitOfWork)
        {
            _productsRepository = productsRepository;

        }

        [HttpPost]
        [Route("SaveProduct")]
        public HttpResponseMessage SaveProduct(HttpRequestMessage request,nProductViewModel product)
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
                    var newProduct = new tbl_products();
                    newProduct.tenant_id = product.tenant_id;
                    newProduct.product_name = product.product_name;
                    newProduct.product_code = product.product_code;
                    newProduct.category = product.category;
                    newProduct.sub_category = product.sub_category;
                    newProduct.created_by = product.tenant_id;
                    newProduct.created_date = DateTime.Now;
                    newProduct.modified_by = product.tenant_id;
                    newProduct.modified_date = DateTime.Now;

                    _productsRepository.Add(newProduct);
                    _unitOfWork.Commit();
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
                }

                return response;
            });
        }

        [Route("GetProductsList/{tennat_id:int}")]
        public HttpResponseMessage GetProductsList(HttpRequestMessage request,int tennat_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var products = _productsRepository.GetAll().Where(x=>x.tenant_id==tennat_id);
                IEnumerable<nProductViewModel> productsvm = Mapper.Map<IEnumerable<tbl_products>, IEnumerable<nProductViewModel>>(products);
                response = request.CreateResponse<IEnumerable<nProductViewModel>>(HttpStatusCode.OK, productsvm);
                return response;

            });

        }

        [HttpPost]
        [Route("UpdateProduct")]
        public HttpResponseMessage UpdateProduct(HttpRequestMessage request, nProductViewModel product)
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
                    var existProduct = _productsRepository.GetSingle(product.id);
                    existProduct.product_name = product.product_name;
                    existProduct.product_code = product.product_code;
                    existProduct.category = product.category;
                    existProduct.sub_category = product.sub_category;
                    existProduct.modified_by = product.tenant_id;
                    existProduct.modified_date = DateTime.Now;

                    _productsRepository.Edit(existProduct);
                    _unitOfWork.Commit();
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
                }

                return response;
            });
        }

        [HttpPost]
        [Route("DeleteProduct")]
        public HttpResponseMessage DeleteProduct(HttpRequestMessage request, nProductViewModel product)
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
                    var existProduct = _productsRepository.GetSingle(product.id);
                    _productsRepository.Delete(existProduct);
                    _unitOfWork.Commit();
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
                }

                return response;
            });
        }
    }
}