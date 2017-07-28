namespace Projects.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tbl_current_stock : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.tbl_current_stock",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        product = c.Int(nullable: false),
                        brand = c.String(),
                        model = c.String(),
                        quantity = c.Int(nullable: false),
                        units = c.String(),
                        modified_date = c.DateTime(nullable: false),
                        modified_by = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "dbo.tbl_rate_chart",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        product = c.Int(nullable: false),
                        brand = c.String(),
                        model = c.String(),
                        sale_price = c.Int(nullable: false),
                        units = c.String(),
                        modified_date = c.DateTime(nullable: false),
                        modified_by = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.tbl_rate_chart");
            DropTable("dbo.tbl_current_stock");
        }
    }
}
