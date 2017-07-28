namespace Projects.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tbl_addstock_invoice : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.tbl_junctionComponents", "junction_id", "dbo.tbl_junction");
            DropIndex("dbo.tbl_junctionComponents", new[] { "junction_id" });
            CreateTable(
                "dbo.tbl_addstock_invoice",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        tenant_id = c.Int(nullable: false),
                        invoice_no = c.String(),
                        purchase_date = c.DateTime(nullable: false),
                        supplier = c.String(),
                        items_due = c.Boolean(nullable: false),
                        itmes_due_amount = c.Int(nullable: false),
                        transport_charges = c.Int(nullable: false),
                        trans_due = c.Boolean(nullable: false),
                        trans_due_amount = c.Int(nullable: false),
                        labour_charges = c.Int(nullable: false),
                        labor_due = c.Boolean(nullable: false),
                        labor_due_amount = c.Int(nullable: false),
                        other_charges = c.Int(nullable: false),
                        other_due = c.Boolean(nullable: false),
                        other_due_amount = c.Int(nullable: false),
                        created_date = c.DateTime(nullable: false),
                        created_by = c.Int(nullable: false),
                        modified_date = c.DateTime(nullable: false),
                        modified_by = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "dbo.tbl_addstock_items",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        invoice_id = c.Int(nullable: false),
                        product_id = c.Int(nullable: false),
                        price = c.Int(nullable: false),
                        brand_name = c.String(),
                        model_name = c.String(),
                        units_in = c.String(),
                        quantity = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("dbo.tbl_addstock_invoice", t => t.invoice_id, cascadeDelete: true)
                .Index(t => t.invoice_id);
            
            DropTable("dbo.tbl_junctionComponents");
            DropTable("dbo.tbl_junction");
            DropTable("dbo.tbl_project_components");
        }
        
        public override void Down()
        {
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
                .PrimaryKey(t => t.id);
            
            DropForeignKey("dbo.tbl_addstock_items", "invoice_id", "dbo.tbl_addstock_invoice");
            DropIndex("dbo.tbl_addstock_items", new[] { "invoice_id" });
            DropTable("dbo.tbl_addstock_items");
            DropTable("dbo.tbl_addstock_invoice");
            CreateIndex("dbo.tbl_junctionComponents", "junction_id");
            AddForeignKey("dbo.tbl_junctionComponents", "junction_id", "dbo.tbl_junction", "id", cascadeDelete: true);
        }
    }
}
