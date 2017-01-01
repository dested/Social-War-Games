using Common.Utils.Nancy;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.TinyIoc;

namespace VoteServer
{
    public class Bootstrapper : DefaultNancyBootstrapper
    {
        private readonly BaseBootstrapper _bootstrap;

        public Bootstrapper()
        {
            _bootstrap = new BaseBootstrapper();
        }

        protected override void RequestStartup(TinyIoCContainer container, IPipelines pipelines, NancyContext requestContext)
        {

            _bootstrap.RequestStartup(container, pipelines, requestContext);
            base.RequestStartup(container, pipelines, requestContext);
        }
    }
}