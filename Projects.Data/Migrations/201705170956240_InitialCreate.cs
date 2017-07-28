namespace Projects.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.tbl_city",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        state_id = c.Int(nullable: false),
                        city_name = c.String(nullable: false, maxLength: 50),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("dbo.tbl_state", t => t.state_id, cascadeDelete: true)
                .Index(t => t.state_id);
            
            CreateTable(
                "dbo.tbl_state",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        country_id = c.Int(nullable: false),
                        state_name = c.String(nullable: false, maxLength: 100),
                        capital = c.String(maxLength: 100),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("dbo.tbl_country", t => t.country_id, cascadeDelete: true)
                .Index(t => t.country_id);
            
            CreateTable(
                "dbo.tbl_country",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        iso_code = c.String(nullable: false, maxLength: 2),
                        country_name = c.String(nullable: false, maxLength: 50),
                        capital = c.String(maxLength: 50),
                        country_code = c.String(maxLength: 10),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "dbo.tbl_error",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        tenant_key = c.String(maxLength: 20),
                        user_id = c.Int(nullable: false),
                        message = c.String(maxLength: 500),
                        stacktrace = c.String(),
                        date_Created = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "dbo.tbl_junctionComponents",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        tenant_id = c.Int(nullable: false),
                        project_id = c.Int(nullable: false),
                        junction_id = c.Int(nullable: false),
                        component = c.String(),
                        quantity = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("dbo.tbl_junction", t => t.junction_id, cascadeDelete: true)
                .Index(t => t.junction_id);
            
            CreateTable(
                "dbo.tbl_junction",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        tenant_id = c.Int(nullable: false),
                        project_id = c.Int(nullable: false),
                        ps_id = c.Int(nullable: false),
                        junction_name = c.String(),
                        created_date = c.DateTime(nullable: false),
                        created_by = c.Int(nullable: false),
                        modified_date = c.DateTime(nullable: false),
                        modified_by = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "dbo.tbl_login_track",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        tenant_key = c.String(nullable: false, maxLength: 20),
                        user_id = c.Int(nullable: false),
                        login_time = c.DateTime(nullable: false),
                        login_ip = c.String(maxLength: 20),
                        location = c.String(maxLength: 30),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "dbo.tbl_menu_access",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        menu_id = c.Int(nullable: false),
                        user_id = c.Int(nullable: false),
                        tenant_id = c.Int(nullable: false),
                        is_active = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("dbo.tbl_menu", t => t.menu_id, cascadeDelete: true)
                .ForeignKey("dbo.tbl_tenant", t => t.tenant_id, cascadeDelete: true)
                .Index(t => t.menu_id)
                .Index(t => t.tenant_id);
            
            CreateTable(
                "dbo.tbl_menu",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        name = c.String(nullable: false, maxLength: 50),
                        url = c.String(maxLength: 100),
                        icon = c.String(maxLength: 100),
                        tooltip = c.String(maxLength: 100),
                        menu_order = c.Int(nullable: false),
                        category = c.String(maxLength: 100),
                        menu_for = c.String(maxLength: 100),
                        parent_menu = c.Int(),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "dbo.tbl_tenant",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        tenant_key = c.String(nullable: false, maxLength: 20),
                        tenant_type = c.Int(nullable: false),
                        tenant_name = c.String(nullable: false, maxLength: 30),
                        domain = c.String(maxLength: 30),
                        pan = c.String(maxLength: 20),
                        tin = c.String(maxLength: 20),
                        vat = c.String(maxLength: 20),
                        finance_start_month = c.Int(),
                        bank_account_no = c.String(maxLength: 20),
                        bank_name = c.String(maxLength: 30),
                        bank_branch = c.String(maxLength: 30),
                        ifsc_code = c.String(maxLength: 15),
                        contact_person = c.String(maxLength: 30),
                        email = c.String(maxLength: 30),
                        contact_no = c.String(maxLength: 20),
                        alt_contact_no = c.String(maxLength: 20),
                        address = c.String(maxLength: 150),
                        city = c.Int(),
                        state = c.Int(),
                        country = c.Int(),
                        zip = c.Int(),
                        logo = c.Binary(),
                        logo_image_type = c.String(maxLength: 20),
                        comments = c.String(maxLength: 300),
                        IsLocked = c.Boolean(nullable: false),
                        account_valid_till = c.DateTime(nullable: false),
                        date_created = c.DateTime(nullable: false),
                        created_by = c.Int(nullable: false),
                        date_modified = c.DateTime(nullable: false),
                        modified_by = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "dbo.tbl_user",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        tenant_id = c.Int(nullable: false),
                        userid = c.String(nullable: false, maxLength: 20),
                        user_name = c.String(nullable: false, maxLength: 50),
                        email = c.String(nullable: false, maxLength: 50),
                        password = c.String(nullable: false, maxLength: 200),
                        salt = c.String(nullable: false, maxLength: 200),
                        is_locked = c.Boolean(nullable: false),
                        is_tenant = c.Boolean(nullable: false),
                        date_created = c.DateTime(nullable: false),
                        date_modified = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("dbo.tbl_tenant", t => t.tenant_id, cascadeDelete: true)
                .Index(t => t.tenant_id);
            
            CreateTable(
                "dbo.tbl_user_role",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        RoleId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("dbo.tbl_roles", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.tbl_user", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.tbl_roles",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 50),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "dbo.tbl_module_master",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        module_name = c.String(),
                        description = c.String(),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "dbo.tbl_products",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        tenant_id = c.Int(nullable: false),
                        product_name = c.String(),
                        product_code = c.String(),
                        category = c.String(),
                        sub_category = c.String(),
                        created_date = c.DateTime(nullable: false),
                        created_by = c.Int(nullable: false),
                        modified_date = c.DateTime(nullable: false),
                        modified_by = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "dbo.tbl_project_components",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        tenant_id = c.Int(nullable: false),
                        project_id = c.Int(nullable: false),
                        component = c.String(),
                        description = c.String(),
                        uom = c.String(),
                        created_date = c.DateTime(nullable: false),
                        modified_date = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "dbo.tbl_reference_group_master",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        group_id = c.Int(nullable: false),
                        reference_item = c.String(nullable: false, maxLength: 100),
                        description = c.String(maxLength: 200),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "dbo.tbl_reference_master",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        group_id = c.Int(nullable: false),
                        reference_item = c.String(nullable: false, maxLength: 100),
                        reference_value = c.String(nullable: false, maxLength: 100),
                        description = c.String(maxLength: 200),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("dbo.tbl_reference_group_master", t => t.group_id, cascadeDelete: true)
                .Index(t => t.group_id);
            
            CreateTable(
                "dbo.tbl_settings",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        tenant_id = c.Int(nullable: false),
                        emp_code = c.String(),
                        code_seperation = c.String(),
                        emp_num = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "dbo.tbl_tenant_accounts_details",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        tenant_id = c.Int(nullable: false),
                        amount_paid = c.Single(nullable: false),
                        fin_year = c.String(nullable: false, maxLength: 9),
                        paid_date = c.DateTime(nullable: false),
                        payment_note = c.String(maxLength: 9),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("dbo.tbl_tenant", t => t.tenant_id, cascadeDelete: true)
                .Index(t => t.tenant_id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.tbl_tenant_accounts_details", "tenant_id", "dbo.tbl_tenant");
            DropForeignKey("dbo.tbl_reference_master", "group_id", "dbo.tbl_reference_group_master");
            DropForeignKey("dbo.tbl_menu_access", "tenant_id", "dbo.tbl_tenant");
            DropForeignKey("dbo.tbl_user_role", "UserId", "dbo.tbl_user");
            DropForeignKey("dbo.tbl_user_role", "RoleId", "dbo.tbl_roles");
            DropForeignKey("dbo.tbl_user", "tenant_id", "dbo.tbl_tenant");
            DropForeignKey("dbo.tbl_menu_access", "menu_id", "dbo.tbl_menu");
            DropForeignKey("dbo.tbl_junctionComponents", "junction_id", "dbo.tbl_junction");
            DropForeignKey("dbo.tbl_city", "state_id", "dbo.tbl_state");
            DropForeignKey("dbo.tbl_state", "country_id", "dbo.tbl_country");
            DropIndex("dbo.tbl_tenant_accounts_details", new[] { "tenant_id" });
            DropIndex("dbo.tbl_reference_master", new[] { "group_id" });
            DropIndex("dbo.tbl_user_role", new[] { "RoleId" });
            DropIndex("dbo.tbl_user_role", new[] { "UserId" });
            DropIndex("dbo.tbl_user", new[] { "tenant_id" });
            DropIndex("dbo.tbl_menu_access", new[] { "tenant_id" });
            DropIndex("dbo.tbl_menu_access", new[] { "menu_id" });
            DropIndex("dbo.tbl_junctionComponents", new[] { "junction_id" });
            DropIndex("dbo.tbl_state", new[] { "country_id" });
            DropIndex("dbo.tbl_city", new[] { "state_id" });
            DropTable("dbo.tbl_tenant_accounts_details");
            DropTable("dbo.tbl_settings");
            DropTable("dbo.tbl_reference_master");
            DropTable("dbo.tbl_reference_group_master");
            DropTable("dbo.tbl_project_components");
            DropTable("dbo.tbl_products");
            DropTable("dbo.tbl_module_master");
            DropTable("dbo.tbl_roles");
            DropTable("dbo.tbl_user_role");
            DropTable("dbo.tbl_user");
            DropTable("dbo.tbl_tenant");
            DropTable("dbo.tbl_menu");
            DropTable("dbo.tbl_menu_access");
            DropTable("dbo.tbl_login_track");
            DropTable("dbo.tbl_junction");
            DropTable("dbo.tbl_junctionComponents");
            DropTable("dbo.tbl_error");
            DropTable("dbo.tbl_country");
            DropTable("dbo.tbl_state");
            DropTable("dbo.tbl_city");
        }
    }
}
