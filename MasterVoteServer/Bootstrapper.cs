using System;
using Common.Utils.Nancy;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Json;
using Nancy.Responses.Negotiation;
using Nancy.TinyIoc;

namespace MasterVoteServer
{
    public class Bootstrapper : DefaultNancyBootstrapper
    {
        private readonly BaseBootstrapper bootstrap;
        public Bootstrapper()
        {
            MasterVoteServerLogic.GetServerLogic();
            bootstrap = new BaseBootstrapper();
        }

        protected override void RequestStartup(TinyIoCContainer container, IPipelines pipelines, NancyContext requestContext)
        {
            bootstrap.RequestStartup(container, pipelines, requestContext);
            base.RequestStartup(container, pipelines, requestContext);
        }
    }
}