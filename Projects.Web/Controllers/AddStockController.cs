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
    [RoutePrefix("api/addstock")]
    public class AddStockController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_addstock_invoice> _addstockinvoiceRepository;
        public readonly IEntityBaseRepository<tbl_addstock_items> _addstockitemsRepository;
        public readonly IEntityBaseRepository<tbl_current_stock> _currentstockRepository;
        public readonly IEntityBaseRepository<tbl_rate_chart> _ratechartRepository;        


        public AddStockController(IEntityBaseRepository<tbl_addstock_invoice> addstockinvoiceRepository,
            IEntityBaseRepository<tbl_addstock_items> addstockitemsRepository,
            IEntityBaseRepository<tbl_current_stock> currentstockRepository,
            IEntityBaseRepository<tbl_rate_chart> ratechartRepository,
                IEntityBaseRepository<tbl_error> _errorsRepository, IUnitOfWork _unitOfWork)
                : base(_errorsRepository, _unitOfWork)
        {
            _addstockinvoiceRepository = addstockinvoiceRepository;
            _addstockitemsRepository = addstockitemsRepository;
            _currentstockRepository = currentstockRepository;
            _ratechartRepository = ratechartRepository;
        }

        [HttpPost]
        [Route("SaveStock")]
        public HttpResponseMessage SaveStock(HttpRequestMessage request, AddStockInvocieViewModel stockin)
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
                    var newStock = new tbl_addstock_invoice();
                    newStock.tenant_id = stockin.tenant_id;
                    newStock.invoice_no = stockin.invoice_no;
                    newStock.purchase_date = stockin.purchase_date;
                    newStock.supplier = stockin.supplier;
                    newStock.items_due = stockin.items_due;
                    newStock.itmes_due_amount = stockin.itmes_due_amount;
                    newStock.transport_charges = stockin.transport_charges;
                    newStock.trans_due = stockin.trans_due;
                    newStock.trans_due_amount = stockin.trans_due_amount;
                    newStock.labour_charges = stockin.labour_charges;
                    newStock.labor_due = stockin.labor_due;
                    newStock.labor_due_amount = stockin.labor_due_amount;
                    newStock.other_charges = stockin.other_charges;
                    newStock.other_due = stockin.other_due;
                    newStock.other_due_amount = stockin.other_due_amount;                    
                    newStock.created_by = stockin.tenant_id;
                    newStock.created_date = DateTime.Now;
                    newStock.modified_by = stockin.tenant_id;
                    newStock.modified_date = DateTime.Now;

                    _addstockinvoiceRepository.Add(newStock);

                    for (var i=0;i<stockin.addstockitems.Count();i++)
                    {
                        var newStockItems = new tbl_addstock_items();
                        newStockItems.invoice_id = newStock.id;
                        newStockItems.product_id = stockin.addstockitems[i].product_id;
                        newStockItems.price = stockin.addstockitems[i].price;
                        newStockItems.brand_name = stockin.addstockitems[i].brand_name;
                        newStockItems.model_name = stockin.addstockitems[i].model_name;
                        newStockItems.units_in = stockin.addstockitems[i].units_in;
                        newStockItems.quantity = stockin.addstockitems[i].quantity;

                        _addstockitemsRepository.Add(newStockItems);
                    }

                    var CurrentStock = _currentstockRepository.GetAll().ToList();
                    var newCurrentStock = new tbl_current_stock();
                    var newRateChart = new tbl_rate_chart();

                    for(var i=0;i<stockin.addstockitems.Count();i++)
                    {
                        bool canUpdate = false;
                        int updateRecordId = -1;

                        for (var j=0;j<CurrentStock.Count();j++)
                        {
                            if(stockin.addstockitems[i].product_id==CurrentStock[j].product)
                            {
                                if(stockin.addstockitems[i].brand_name==CurrentStock[j].brand)
                                {
                                    if (stockin.addstockitems[i].model_name == CurrentStock[j].model)
                                    {
                                        canUpdate = true;
                                        updateRecordId = j;
                                        break;
                                    }
                                }
                            }                            
                        }
                        if (canUpdate == false)
                        {
                            newCurrentStock.product = stockin.addstockitems[i].product_id;
                            newCurrentStock.brand = stockin.addstockitems[i].brand_name;
                            newCurrentStock.model = stockin.addstockitems[i].model_name;
                            newCurrentStock.quantity = stockin.addstockitems[i].quantity;
                            newCurrentStock.units = stockin.addstockitems[i].units_in;
                            newCurrentStock.modified_date = DateTime.Now;
                            newCurrentStock.modified_by = stockin.tenant_id;

                            _currentstockRepository.Add(newCurrentStock);                           

                            newRateChart.product = stockin.addstockitems[i].product_id;
                            newRateChart.brand = stockin.addstockitems[i].brand_name;
                            newRateChart.model = stockin.addstockitems[i].model_name;
                            newRateChart.sale_price = 0;
                            newRateChart.units = stockin.addstockitems[i].units_in;
                            newRateChart.modified_date = DateTime.Now;
                            newRateChart.modified_by = stockin.tenant_id;

                            _ratechartRepository.Add(newRateChart);
                            _unitOfWork.Commit(); //not recommended...
                        }
                        else
                        {
                            var existingRec = _currentstockRepository.GetSingle(updateRecordId+1);
                            existingRec.quantity += stockin.addstockitems[i].quantity;

                            _currentstockRepository.Edit(existingRec);
                        }
                    }
                                        
                    _unitOfWork.Commit();
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
                }

                return response;
            });
        }

        [Route("GetRawStockList/{tennat_id:int}")]
        public IHttpActionResult GetProductsList(HttpRequestMessage request, int tennat_id)
        {
            DBConnect dbContext = new DBConnect();
            var RawStockList = from a in dbContext.AddStockInvoiceSet
                               join i in dbContext.AddStockItems on a.id equals i.invoice_id
                               select new
                               {
                                   id=a.id,
                                   invoice_no=a.invoice_no,
                                   purchase_date=a.purchase_date,
                                   supplier=a.supplier,
                                   product_id=i.product_id,
                                   brand_name=i.brand_name,
                                   model_name = i.model_name,
                                   price = i.price,
                                   quantity = i.quantity,
                                   units_in = i.units_in,
                                   itmes_due_amount = a.itmes_due_amount,
                                   trans_due_amount = a.trans_due_amount,
                                   labor_due_amount = a.labor_due_amount,
                                   other_due_amount = a.other_due_amount
                               };
            if (RawStockList != null) { return Ok(RawStockList); }
            else { return NotFound(); }
        }

        //[HttpPost]
        //[Route("UpdateProduct")]
        //public HttpResponseMessage UpdateProduct(HttpRequestMessage request, nProductViewModel product)
        //{
        //    return CreateHttpResponse(request, () =>
        //    {
        //        HttpResponseMessage response = null;

        //        if (!ModelState.IsValid)
        //        {
        //            response = request.CreateResponse(HttpStatusCode.BadRequest, new { success = false });
        //        }
        //        else
        //        {
        //            var existProduct = _productsRepository.GetSingle(product.id);
        //            existProduct.product_name = product.product_name;
        //            existProduct.product_code = product.product_code;
        //            existProduct.category = product.category;
        //            existProduct.sub_category = product.sub_category;
        //            existProduct.modified_by = product.tenant_id;
        //            existProduct.modified_date = DateTime.Now;

        //            _productsRepository.Edit(existProduct);
        //            _unitOfWork.Commit();
        //            response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
        //        }

        //        return response;
        //    });
        //}

        //[HttpPost]
        //[Route("DeleteProduct")]
        //public HttpResponseMessage DeleteProduct(HttpRequestMessage request, nProductViewModel product)
        //{
        //    return CreateHttpResponse(request, () =>
        //    {
        //        HttpResponseMessage response = null;

        //        if (!ModelState.IsValid)
        //        {
        //            response = request.CreateResponse(HttpStatusCode.BadRequest, new { success = false });
        //        }
        //        else
        //        {
        //            var existProduct = _productsRepository.GetSingle(product.id);
        //            _productsRepository.Delete(existProduct);
        //            _unitOfWork.Commit();
        //            response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
        //        }

        //        return response;
        //    });
        //}

        //[Route("GetCurrentStockList/{tennat_id:int}")]
        //public IHttpActionResult GetCurrentStockList(HttpRequestMessage request, int tennat_id)
        //{
        //    DBConnect dbContext = new DBConnect();
        //    var CurrentStockList = from a in dbContext.CurrentStockSet   
        //                           join p in dbContext.ProductSet on a.product equals p.id
        //                       select new
        //                       {
        //                           id=a.id,
        //                           product=a.product,
        //                           brand=a.brand,
        //                           model=a.model,
        //                           quantity=a.quantity,
        //                           units=a.units,
        //                           category=p.category,
        //                           sub_category=p.sub_category
        //                       };
        //    if (CurrentStockList != null) { return Ok(CurrentStockList); }
        //    else { return NotFound(); }
        //}

        [Route("GetRateChartList/{tennat_id:int}")]
        public IHttpActionResult GetRateChartList(HttpRequestMessage request, int tennat_id)
        {
            DBConnect dbContext = new DBConnect();
            var CurrentStockList = from a in dbContext.RateChartSet                                   
                                   select new
                                   {
                                       id = a.id,
                                       product = a.product,
                                       brand = a.brand,
                                       model = a.model,
                                       sale_price=a.sale_price,
                                       units = a.units
                                   };
            if (CurrentStockList != null) { return Ok(CurrentStockList); }
            else { return NotFound(); }
        }

        public class RateChartViewModel
        {
            public int id { get; set; }
            public int rate { get; set; }
        }

        [HttpPost]
        [Route("UpdateRateChart")]
        public HttpResponseMessage UpdateRateChart(HttpRequestMessage request, RateChartViewModel ratechart)
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
                    var existRate = _ratechartRepository.GetSingle(ratechart.id);
                    existRate.sale_price = ratechart.rate;
                    existRate.modified_date = DateTime.Now;

                    _ratechartRepository.Edit(existRate);
                    _unitOfWork.Commit();
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
                }

                return response;
            });
        }


        [Route("GetCurrentStockList/{pageIndex:int}/{pageSize:int}/{tennat_id:int}")]
        public IHttpActionResult GetCurrentStockList(HttpRequestMessage request,int pageIndex,int pageSize, int tennat_id)
        {
            DBConnect dbContext = new DBConnect();
            var CurrentStockList = from a in dbContext.CurrentStockSet
                                   join p in dbContext.ProductSet on a.product equals p.id
                                   select new
                                   {
                                       id = a.id,
                                       product = a.product,
                                       brand = a.brand,
                                       model = a.model,
                                       quantity = a.quantity,
                                       units = a.units,
                                       category = p.category,
                                       sub_category = p.sub_category
                                   };
            var pagedList = CurrentStockList.OrderBy(i=>i.id).Skip(pageIndex * pageSize).Take(pageSize);
            //if (CurrentStockList != null) { return Ok(CurrentStockList); }            
            //else { return NotFound(); }
            return Ok(pagedList);
        }
    }
}