using System;
using Nancy.Hosting.Self;

namespace DataServer
{
    class Program
    {
        static void Main(string[] args)
        {
            var uri = new Uri("http://localhost:3569");
            HostConfiguration hostConfigs = new HostConfiguration();
            hostConfigs.UrlReservations.CreateAutomatically = true;

            using (var host = new NancyHost(uri,new Bootstrapper(), hostConfigs))
            {
                host.Start();

                Console.WriteLine("Your application is running on " + uri);
                Console.WriteLine("Press any [Enter] to close the host.");
                Console.ReadLine();
            }
        }
    }
}
