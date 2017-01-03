using System;
using System.Threading.Tasks;
using Common.Data;
using Common.Utils.JsonUtils;

namespace MasterVoteServer
{
    public class Program
    {
        public static void Main()
        {
            MasterVoteServerLogic.startNewGame();
            MongoServerLog.AddServerLog("Master.Start", "1", "1");
            var logic=MasterVoteServerLogic.GetServerLogic();
            while (true)
            {
                Console.WriteLine("Press enter to die");
                Console.ReadLine();
                logic.gameTick(null);
            }

        }
    }
}