using System;
using System.Threading.Tasks;
using Common.Data;

namespace MasterVoteServer
{
    public class Program
    {
        public static void Main()
        {
//            MasterVoteServerLogic.startNewGame();
            MongoServerLog.AddServerLog("Master.Start", "1", "1");
            MasterVoteServerLogic.GetServerLogic();
            Console.WriteLine("Press enter to die");
            Console.ReadLine();

        }
    }
}