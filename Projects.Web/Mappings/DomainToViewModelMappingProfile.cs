using AutoMapper;
using Projects.Entities.Membership;
using Projects.Entities.MasterData;
using Projects.Web.Models;
using Projects.Entities.Projects;

namespace Projects.Web.Mappings
{
    public class DomainToViewModelMappingProfile : Profile
    {
        public override string ProfileName
        {
            get { return "DomainToViewModelMappings"; }
        }

        protected override void Configure()
        {
            Mapper.CreateMap<tbl_tenant, TenantViewModel>();
            Mapper.CreateMap<tbl_user, UsersViewModel>();
            Mapper.CreateMap<tbl_roles, RolesViewModel>();
            Mapper.CreateMap<tbl_login_track, LoginTrackViewModel>();
            Mapper.CreateMap<tbl_menu, MenuViewModel>();
            Mapper.CreateMap<tbl_menu_access, MenuAccessViewModel>();
            Mapper.CreateMap<tbl_error, ErrorLogViewModel>();

            Mapper.CreateMap<tbl_reference_master, referencemasterViewModel>();
            Mapper.CreateMap<tbl_country, CountryViewModel>();
            Mapper.CreateMap<tbl_state, StatesViewModel>();
            Mapper.CreateMap<tbl_city, CityViewModel>();

            Mapper.CreateMap<tbl_products, nProductViewModel>();
            Mapper.CreateMap<tbl_addstock_invoice, AddStockInvocieViewModel>();
            Mapper.CreateMap<tbl_addstock_items, AddStockItemsViewModel>();

            //var config = new MapperConfiguration(cfg =>
            //{
            //    cfg.CreateMap<UsersViewModel, tbl_user>();

            //    cfg.CreateMap<tbl_tenant, TenantViewModel>();
            //    cfg.CreateMap<tbl_user, UsersViewModel>();
            //    cfg.CreateMap<tbl_roles, RolesViewModel>();
            //    cfg.CreateMap<tbl_login_track, LoginTrackViewModel>();
            //    cfg.CreateMap<tbl_menu, MenuViewModel>();
            //    cfg.CreateMap<tbl_menu_access, MenuAccessViewModel>();
            //    cfg.CreateMap<tbl_error, ErrorLogViewModel>();
            //    cfg.CreateMap<tbl_reference_master, referencemasterViewModel>();
            //    cfg.CreateMap<tbl_country, CountryViewModel>();
            //    cfg.CreateMap<tbl_state, StatesViewModel>();
            //    cfg.CreateMap<tbl_city, CityViewModel>();

            //    cfg.CreateMap<tbl_products, nProductViewModel>();
            //    cfg.CreateMap<tbl_addstock_invoice, AddStockInvocieViewModel>();
            //    cfg.CreateMap<tbl_addstock_items, AddStockItemsViewModel>();
            //});
        }
    }
}