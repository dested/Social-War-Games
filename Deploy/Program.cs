using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Amazon.CloudFront;
using Amazon.CloudFront.Model;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Renci.SshNet;

namespace Deploy
{
    class Program
    {

        public static string User => ConfigurationManager.AppSettings["aws-user"];
        public static PrivateKeyFile Password => new PrivateKeyFile(ConfigurationManager.AppSettings["aws-password"]);

        static void Main(string[] args)
        {
//            UploadWeb();

             
            //SetupServer("ec2-35-165-5-132.us-west-2.compute.amazonaws.com");
            //SetupServer("ec2-35-162-125-29.us-west-2.compute.amazonaws.com");

            List<FileInfo> files = new List<FileInfo>();


            var cDebug = File.GetLastWriteTime("../../../VoteServer/bin/Debug/VoteServer.exe");
            var cRelease = File.GetLastWriteTime("../../../VoteServer/bin/Release/VoteServer.exe");
            if (cDebug < cRelease)
            {
                Console.WriteLine("Release");
                files.AddRange(new DirectoryInfo("../../../VoteServer/bin/Release").GetFiles());
                files.AddRange(new DirectoryInfo("../../../MasterVoteServer/bin/Release").GetFiles());
                files.AddRange(new DirectoryInfo("../../../UserServer/bin/Release").GetFiles());
            }
            else
            {
                Console.WriteLine("Debug");
                files.AddRange(new DirectoryInfo("../../../VoteServer/bin/Debug/").GetFiles());
                files.AddRange(new DirectoryInfo("../../../MasterVoteServer/bin/Debug/").GetFiles());
                files.AddRange(new DirectoryInfo("../../../UserServer/bin/Debug/").GetFiles());
            }
            files = files
                .Where(a => a.Extension != ".xml" && a.Extension != ".pdb" && a.Extension != ".config")
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

        private static void UploadWeb()
        {
            var path = "../../../Web/";
            try
            {
                Console.WriteLine("Starting Web Upload");
                TransferUtility directoryTransferUtility = new TransferUtility(new AmazonS3Client(Amazon.RegionEndpoint.USWest2), new TransferUtilityConfig()
                {
                    ConcurrentServiceRequests = 50,
                });
                var transferUtilityUploadDirectoryRequest = new TransferUtilityUploadDirectoryRequest()
                {
                    Directory = path,
                    BucketName = "socialwargames.com",
                    SearchPattern = "*.*",
                    SearchOption = SearchOption.AllDirectories,
                    UploadFilesConcurrently = true,
                    CannedACL = S3CannedACL.PublicRead
                };
                transferUtilityUploadDirectoryRequest.UploadDirectoryProgressEvent += (sender, e) =>
                     {
                         Console.WriteLine("Files Uploaded: " + e.NumberOfFilesUploaded);
                     };



                directoryTransferUtility.UploadDirectory(transferUtilityUploadDirectoryRequest);
                Console.WriteLine("Starting Invalidate");


                AmazonCloudFrontClient oClient = new AmazonCloudFrontClient(Amazon.RegionEndpoint.USWest2);
                CreateInvalidationRequest oRequest = new CreateInvalidationRequest();
                oRequest.DistributionId = "E34LW6CB5ZCWQU";
                oRequest.InvalidationBatch = new InvalidationBatch
                {
                    CallerReference = DateTime.Now.Ticks.ToString(),
                    Paths = new Paths() { Items = new List<string>() { "/*" }, Quantity = 1 }
                };

                CreateInvalidationResponse oResponse = oClient.CreateInvalidation(oRequest);
                oClient.Dispose();
                Console.WriteLine("Done Web Upload");
            }

            catch (AmazonS3Exception e)
            {
                Console.WriteLine(e.Message, e.InnerException);
            }
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
            var count = 0;
            for (var index = 0; index < files.Count; index++)
            {
                var fileInfo = files[index];
                tasks.Add(Task.Factory.FromAsync((callback, stateObject) =>
             {

                 //                 Console.WriteLine($"{fileInfo.Name} {index}/{files.Count}");
                 return client.BeginUploadFile(fileInfo.OpenRead(), "/home/ec2-user/socialwargames/" + fileInfo.Name, true, callback, stateObject);
             }, (result) =>
                {
                    count++;
                    Console.WriteLine($"{address} {count}/{files.Count}");
                    client.EndUploadFile(result);
                }, null));

            }
            Task.WaitAll(tasks.ToArray());
            client.Disconnect();
            client.Dispose();
        }
    }
}
