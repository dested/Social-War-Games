using System;
using System.Diagnostics;
using System.Threading;
using Common.Utils.Nancy;
using Nancy.Hosting.Self;

namespace VoteServer
{
    public class Program
    {
        private static Timer timer;

        static void Main(string[] args)
        {
            var uri = new Uri("http://localhost:3568");
            HostConfiguration hostConfigs = new HostConfiguration();
            hostConfigs.UrlReservations.CreateAutomatically = true;

            Stopwatch sw = new Stopwatch();
            sw.Start();
            timer = new Timer((s) =>
              {
                  Console.WriteLine($"{BaseBootstrapper.start} Started - {BaseBootstrapper.finish} Finished   Diff: {BaseBootstrapper.finish - BaseBootstrapper.start}");
                  BaseBootstrapper.start = 0;
                  BaseBootstrapper.finish = 0;
                  sw.Restart();
              }, null, 1000, 1000);

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