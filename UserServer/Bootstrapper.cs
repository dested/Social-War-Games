using Common.Utils.Nancy;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.TinyIoc;

namespace UserServer
{
    public class Bootstrapper : DefaultNancyBootstrapper
    {
        private readonly BaseBootstrapper bootstrap;

        public Bootstrapper()
        {
            bootstrap = new BaseBootstrapper();
        }

        protected override void RequestStartup(TinyIoCContainer container, IPipelines pipelines, NancyContext requestContext)
        {
            bootstrap.RequestStartup(container, pipelines, requestContext);
            base.RequestStartup(container, pipelines, requestContext);
        }
    }
}