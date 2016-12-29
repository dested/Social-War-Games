using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using JWT;
using Nancy;
using Nancy.Extensions;

namespace Common.Utils.Nancy
{
    public static class ModuleSecurity
    {
        /// <summary>
        /// This module requires authentication
        /// </summary>
        /// <param name="module">Module to enable</param>
        public static void RequiresAuthentication(this NancyModule module)
        {
            module.AddBeforeHookOrExecute(RequiresAuthentication);
        }

        /// <summary>
        /// This module requires authentication and certain claims to be present.
        /// </summary>
        /// <param name="module">Module to enable</param>
        /// <param name="requiredClaims">Claim(s) required</param>
        public static void RequiresClaims(this NancyModule module, IEnumerable<string> requiredClaims)
        {
            module.Before.AddItemToEndOfPipeline(RequiresAuthentication);
            module.Before.AddItemToEndOfPipeline(RequiresClaims(requiredClaims));
        }

        /// <summary>
        /// This module requires claims to be validated
        /// </summary>
        /// <param name="module">Module to enable</param>
        /// <param name="isValid">Claims validator</param>
        public static void RequiresValidatedClaims(this NancyModule module, Func<IEnumerable<string>, bool> isValid)
        {
            module.Before.AddItemToStartOfPipeline(RequiresValidatedClaims(isValid));
            module.Before.AddItemToStartOfPipeline(RequiresAuthentication);
        }

        /// <summary>
        /// Ensure that the module requires authentication.
        /// </summary>
        /// <param name="context">Current context</param>
        /// <returns>Unauthorized response if not logged in, null otherwise</returns>
        public static Response RequiresAuthentication(NancyContext context)
        {
            try
            {
                var token = context.Request.Headers.Authorization;

                var decodedtoken =JsonWebToken.DecodeToObject(token, ConfigurationManager.AppSettings["jwt:cryptkey"]) as Dictionary<string, object>;

                if (decodedtoken != null)
                {
                    var jwt = new UserJwtModel();
                    jwt.HydrateFromJwt(decodedtoken);
                    context.Items.Add("User", jwt);
                }
            }
            catch (Exception exc)
            {
                Console.Out.WriteLine("Exception! " + exc.Message);
                throw new RequestUnauthorizedException("Invalid Authorization Token");
            }

            return null;
        }

        /// <summary>
        /// Gets a request hook for checking claims
        /// </summary>
        /// <param name="claims">Required claims</param>
        /// <returns>Before hook delegate</returns>
        private static Func<NancyContext, Response> RequiresClaims(IEnumerable<string> claims)
        {
            return (ctx) =>
            {
                Response response = null;
                if (ctx.CurrentUser == null
                    || ctx.CurrentUser.Claims == null
                    || claims.Any(c => !ctx.CurrentUser.Claims.Contains(c)))
                {
                    response = new Response { StatusCode = HttpStatusCode.Forbidden };
                }

                return response;
            };
        }

        /// <summary>
        /// Gets a pipeline item for validating user claims
        /// </summary>
        /// <param name="isValid">Is valid delegate</param>
        /// <returns>Pipeline item delegate</returns>
        private static Func<NancyContext, Response> RequiresValidatedClaims(Func<IEnumerable<string>, bool> isValid)
        {
            return (ctx) =>
            {
                Response response = null;
                var userClaims = ctx.CurrentUser.Claims;
                if (ctx.CurrentUser == null || ctx.CurrentUser.Claims == null || !isValid(ctx.CurrentUser.Claims))
                {
                    response = new Response { StatusCode = HttpStatusCode.Forbidden };
                }

                return response;
            };
        }
    }
}