using System;
using Common.Utils.Nancy;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Json;
using Nancy.Responses.Negotiation;
using Nancy.TinyIoc;

namespace VoteServer
{
    public class Bootstrapper : DefaultNancyBootstrapper
    {
        public Bootstrapper()
        {
            JsonSettings.MaxJsonLength = Int32.MaxValue;
        }

        protected override void RequestStartup(TinyIoCContainer container, IPipelines pipelines, NancyContext requestContext)
        {
            pipelines.AfterRequest.AddItemToEndOfPipeline((ctx) =>
            {
                ctx.Response.WithHeader("Access-Control-Allow-Origin", "*")
                                .WithHeader("Access-Control-Allow-Methods", "POST,GET")
                                .WithHeader("Access-Control-Allow-Headers", "Accept, Origin, Content-type");

            });

            pipelines.OnError.AddItemToEndOfPipeline((context, exception) =>
            {
                if (exception is RequestException)
                {
                    var hyException = (RequestException)exception;
                    Negotiator negotiator;
                    switch (hyException.Type)
                    {
                        case RequestExceptionType.Validation:
                            var hyRequestValidationException = (RequestValidationException)hyException;
                            negotiator = new Negotiator(context);
                            negotiator.ValidationError(hyRequestValidationException.Errors);
                            return container.Resolve<IResponseNegotiator>().NegotiateResponse(negotiator, context);
                        case RequestExceptionType.ServerError:
                            var hyServerErrorException = (ServerErrorException)hyException;
                            negotiator = new Negotiator(context);
                            negotiator.ServerError(hyServerErrorException.Errors);
                            return container.Resolve<IResponseNegotiator>().NegotiateResponse(negotiator, context);
                        case RequestExceptionType.Unauthorized:
                            negotiator = new Negotiator(context);
                            negotiator.Unauthorized();
                            return container.Resolve<IResponseNegotiator>().NegotiateResponse(negotiator, context);
                        default:
                            throw new ArgumentOutOfRangeException();
                    }
                }
                else
                {
                    var negotiator = new Negotiator(context);
                    negotiator.ServerError(exception.Message);
                    return container.Resolve<IResponseNegotiator>().NegotiateResponse(negotiator, context);
                }
            });

            base.RequestStartup(container, pipelines, requestContext);
        }


    }
}