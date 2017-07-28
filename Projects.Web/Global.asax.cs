using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Http;
using Projects.Web.App_Start;
using System.Web.Optimization;
using Projects.Web;
using System.Timers;

namespace Projects.Web
{
    public class Global : HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            var config = GlobalConfiguration.Configuration;

            AreaRegistration.RegisterAllAreas();
            WebApiConfig.Register(config);
            Bootstrapper.Run();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            GlobalConfiguration.Configuration.EnsureInitialized();
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            //var myTimer = new Timer();
            //myTimer.Elapsed += new ElapsedEventHandler(myEvent);
            //myTimer.Interval = 5000;
            //myTimer.Enabled = true;
            //void myEvent(object s, ElapsedEventArgs ev)
            //{
            //    int x = 10;
            //    x++;
            //}
        }
    }
}