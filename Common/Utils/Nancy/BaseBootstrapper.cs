using System;
using Common.Data;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Json;
using Nancy.Responses.Negotiation;
using Nancy.TinyIoc;

namespace Common.Utils.Nancy
{
    public class BaseBootstrapper  : DefaultNancyBootstrapper
    {
        public BaseBootstrapper()
        {
            JsonSettings.MaxJsonLength = Int32.MaxValue;
            JsonSettings.RetainCasing = false;
        }

        protected override void RequestStartup(TinyIoCContainer container, IPipelines pipelines, NancyContext requestContext)
        {
            pipelines.AfterRequest.AddItemToEndOfPipeline((ctx) =>
            {
                Console.WriteLine("Request made: " + ctx.Request.Path + " " + ctx.Request.Method);
                ctx.Response.WithHeader("Access-Control-Allow-Origin", "*")
                                .WithHeader("Access-Control-Allow-Methods", "POST,GET")
                                .WithHeader("Access-Control-Allow-Headers", "Accept, Origin, Content-type");

            });

            pipelines.OnError.AddItemToEndOfPipeline((context, exception) =>
            {
                Response response;
                MongoServerLog.AddServerLog("Error", exception, context.Request.Path);
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
                            response= container.Resolve<IResponseNegotiator>().NegotiateResponse(negotiator, context);
                            break;
                        case RequestExceptionType.ServerError:
                            var hyServerErrorException = (ServerErrorException)hyException;
                            negotiator = new Negotiator(context);
                            negotiator.ServerError(hyServerErrorException.Errors);
                            response= container.Resolve<IResponseNegotiator>().NegotiateResponse(negotiator, context);
                            break;
                        case RequestExceptionType.Unauthorized:
                            negotiator = new Negotiator(context);
                            negotiator.Unauthorized();
                            response= container.Resolve<IResponseNegotiator>().NegotiateResponse(negotiator, context);
                            break;
                        default:
                            throw new ArgumentOutOfRangeException();
                    }
                }
                else
                {
                    var negotiator = new Negotiator(context);
                    negotiator.ServerError(exception.Message);
                    response= container.Resolve<IResponseNegotiator>().NegotiateResponse(negotiator, context);
                }

                return response.WithHeader("Access-Control-Allow-Origin", "*")
                                .WithHeader("Access-Control-Allow-Methods", "POST,GET")
                                .WithHeader("Access-Control-Allow-Headers", "Accept, Origin, Content-type");
            });
        }


    }
}