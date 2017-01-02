using System;
using Common.Utils.Nancy;
using Nancy.Hosting.Self;

namespace UserServer
{
    public class Program
    {
        static void Main(string[] args)
        {
            var uri = new Uri("http://localhost:3569");
            HostConfiguration hostConfigs = new HostConfiguration();
            hostConfigs.UrlReservations.CreateAutomatically = true;
            using (var host = new NancyHost(uri, new BaseBootstrapper(), hostConfigs))
            {
                host.Start();

                Console.WriteLine("Your application is running on " + uri);
                Console.WriteLine("Press any [Enter] to close the host.");
                Console.ReadLine();
            }
        }
    }
}