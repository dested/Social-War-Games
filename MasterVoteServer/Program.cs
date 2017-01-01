using System;
using System.Threading.Tasks;
using Common.Data;
using MasterVoteServer.Modules;

namespace MasterVoteServer
{
    public class Program
    {
        public static void Main()
        {
            Task.Run(async () =>
            {
                await GameModule.startNewGame();
            });


            Console.WriteLine("Start");
            MongoServerLog.AddServerLog("Master.Start", "1", "1");
            MasterVoteServerLogic.GetServerLogic();
            Console.WriteLine("Press enter to die");
            Console.ReadLine();

        }
    }
}