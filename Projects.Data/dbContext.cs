using Projects.Data.Configurations;
using Projects.Entities.Projects;
using Projects.Entities.Membership;
using Projects.Entities.MasterData;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using tapClouds.Data.Configurations;

namespace Projects.Data
{
    public class DBConnect : DbContext
    {
        public DBConnect() : base("DBConnect")
        {
            Database.SetInitializer<DBConnect>(new CreateDatabaseIfNotExists<DBConnect>());
            Database.SetInitializer<DBConnect>(new DropCreateDatabaseIfModelChanges<DBConnect>());
            //Database.SetInitializer<DBConnect>(new DropCreateDatabaseAlways<DBConnect>());
            Database.SetInitializer<DBConnect>(new MasterDataInitializer()); 
            //Disable initializer
            //Database.SetInitializer<DBConnect>(null);
        }

        #region Entity Sets
        public IDbSet<tbl_user> UserSet { get; set; }
        public IDbSet<tbl_roles> RoleSet { get; set; }
        public IDbSet<tbl_user_role> UserRoleSet { get; set; }
        public IDbSet<tbl_login_track> LoginTrack { get; set; }
        public IDbSet<tbl_error> ErrorSet { get; set; }
        public IDbSet<tbl_tenant> tenants { get; set; }
        public IDbSet<tbl_tenant_accounts_details> tenantAccountsDetails { get; set; }
        public IDbSet<tbl_menu> MenuSet { get; set; }
        public IDbSet<tbl_menu_access> MenuAccess { get; set; }

        public DbSet<tbl_module_master> modules { get; set; }
        public DbSet<tbl_reference_group_master> refgroup { get; set; }
        public DbSet<tbl_reference_master> refmaster { get; set; }
        public DbSet<tbl_country> countryset { get; set; }
        public DbSet<tbl_state> stateset { get; set; }
        public DbSet<tbl_city> cityset { get; set; }
        
        public DbSet<tbl_settings> Settingset { get; set; }
        public DbSet<tbl_products> ProductSet { get; set; }        
        public DbSet<tbl_addstock_invoice> AddStockInvoiceSet { get; set; }
        public DbSet<tbl_addstock_items> AddStockItems { get; set; }
        public DbSet<tbl_current_stock> CurrentStockSet { get; set; }
        public DbSet<tbl_rate_chart> RateChartSet { get; set; }

        #endregion

        public virtual void Commit()
        {
            base.SaveChanges();
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            modelBuilder.Configurations.Add(new UserConfiguration());
            modelBuilder.Configurations.Add(new LoginTrackConfiguration());
            modelBuilder.Configurations.Add(new TenantConfiguration());
            modelBuilder.Configurations.Add(new TenantAccountsDetailsConfiguration());
            modelBuilder.Configurations.Add(new UserRoleConfiguration());
            modelBuilder.Configurations.Add(new RoleConfiguration());
            modelBuilder.Configurations.Add(new MenuConfiguration());

            modelBuilder.Configurations.Add(new CountryConfiguration());
            modelBuilder.Configurations.Add(new StateConfiguration());
            modelBuilder.Configurations.Add(new CityConfiguration());
            modelBuilder.Configurations.Add(new ReferenceGroupMasterConfiguration());
            modelBuilder.Configurations.Add(new ReferenceMasterConfiguration());


        }
    }
}
