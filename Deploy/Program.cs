using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Renci.SshNet;

namespace Deploy
{
    class Program
    {

        public static string User => ConfigurationManager.AppSettings["aws-user"];
        public static PrivateKeyFile Password => new PrivateKeyFile(ConfigurationManager.AppSettings["aws-password"]);

        static void Main(string[] args)
        {
//            SetupServer("ec2-35-165-5-132.us-west-2.compute.amazonaws.com");
//            SetupServer("ec2-35-162-125-29.us-west-2.compute.amazonaws.com");

            List<FileInfo> files = new List<FileInfo>();
            files.AddRange(new DirectoryInfo("../../../VoteServer/bin").GetFiles());
            files.AddRange(new DirectoryInfo("../../../MasterVoteServer/bin").GetFiles());
            files.AddRange(new DirectoryInfo("../../../UserServer/bin").GetFiles());
            files = files
                .Where(a => a.Extension != ".xml" && a.Extension != ".pdb")
                .GroupBy(a => a.Name).Select(a => a.First())
                .ToList();

            Task.WaitAll(
                Task.Run(() => UploadFiles("ec2-35-160-122-186.us-west-2.compute.amazonaws.com", files)),
                Task.Run(() => UploadFiles("ec2-35-165-5-132.us-west-2.compute.amazonaws.com", files)),
                Task.Run(() => UploadFiles("ec2-35-162-125-29.us-west-2.compute.amazonaws.com", files))
                );

//            StartApplication("ec2-35-160-122-186.us-west-2.compute.amazonaws.com", "MasterVoteServer");
//            StartApplication("ec2-35-165-5-132.us-west-2.compute.amazonaws.com", "VoteServer");
//            StartApplication("ec2-35-162-125-29.us-west-2.compute.amazonaws.com", "VoteServer");

        }

        private static void StartApplication(string address, string server)
        {

            using (var client = new SshClient(address, User, Password))
            {
                client.Connect();
                client.ErrorOccurred += (e, b) =>
                {
                    Console.WriteLine(b.Exception);
                };
                var output = client.RunCommand("sudo pkill mono");
                Console.WriteLine("--" + output.Error + " " + output.Result);
                  output = client.RunCommand("sudo mono socialwargames/" + server + ".exe &");
                Console.WriteLine("--" + output.Error + " " + output.Result);
                client.Disconnect();
            }
            Console.WriteLine("--done");

        }

        public static void SetupServer(string address)
        {
            using (var client = new SshClient(address, User, Password))
            {
                client.Connect();
                client.ErrorOccurred += (e, b) =>
                {
                    Console.WriteLine(b.Exception);
                };
                var lines = File.ReadAllLines("../../install-mono.sh");
                foreach (var line in lines)
                {
                    Console.WriteLine(line);
                    var output = client.RunCommand(line);
                    Console.WriteLine("--" + output.Error + " " + output.Result);
                }
                client.Disconnect();
            }
            Console.WriteLine("--done");
        }

        private static void UploadFiles(string address, List<FileInfo> files)
        {
            var client = new SftpClient(address, 22, User, Password);
            client.Connect();
            client.BufferSize = 4 * 1024;
            if (!client.Exists("/home/ec2-user/socialwargames/"))
            {
                client.CreateDirectory("/home/ec2-user/socialwargames/");
            }
            List<Task> tasks = new List<Task>();
            for (var index = 0; index < files.Count; index++)
            {
                var fileInfo = files[index];
                tasks.Add(Task.Factory.FromAsync((callback, stateObject) =>
             {

                 //                 Console.WriteLine($"{fileInfo.Name} {index}/{files.Count}");
                 return client.BeginUploadFile(fileInfo.OpenRead(), "/home/ec2-user/socialwargames/" + fileInfo.Name, true, callback, stateObject);
             }, (result) =>
               {
                   Console.WriteLine($"Uploading {fileInfo.Name} Done {address }");
                   client.EndUploadFile(result);
               }, null));

            }
            Task.WaitAll(tasks.ToArray());
            client.Disconnect();
            client.Dispose();
        }
    }
}
