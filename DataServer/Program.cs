using System;
using Common.Data;
using Common.Utils.Mongo;
using Common.Utils.Nancy;
using Common.Utils.Redis;
using Nancy.Hosting.Self;

namespace DataServer
{
    public class Program
    {
        static void Main(string[] args)
        {
            var uri = new Uri("http://localhost:3569");
            HostConfiguration hostConfigs = new HostConfiguration();
            hostConfigs.UrlReservations.CreateAutomatically = true;
            using (var host = new NancyHost(uri, new Bootstrapper(), hostConfigs))
            {
                host.Start();

                Console.WriteLine("Your application is running on " + uri);
                Console.WriteLine("Press any [Enter] to close the host.");
                Console.ReadLine();
            }
        }
    }
}

