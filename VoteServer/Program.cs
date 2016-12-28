using System;
using Common.Utils.Redis;
using Nancy.Hosting.Self;

namespace VoteServer
{
    class Program
    {
        static void Main(string[] args)
        {
            var uri = new Uri("http://localhost:3568");
            HostConfiguration hostConfigs = new HostConfiguration();
            hostConfigs.UrlReservations.CreateAutomatically = true;
            PubSub = new PubSub();
            PubSub.Subscribe("bar", (msg) =>
            {
                Console.WriteLine("bar" + msg);
            });
            using (var host = new NancyHost(uri,new Bootstrapper(), hostConfigs))
            {
                host.Start();

                Console.WriteLine("Your application is running on " + uri);
                Console.WriteLine("Press any [Enter] to close the host.");
                Console.ReadLine();
            }
        }

        public static PubSub PubSub { get; set; }
    }
}
