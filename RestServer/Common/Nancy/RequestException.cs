using System;

namespace RestServer.Common.Nancy
{
    public abstract class RequestException : Exception
    {
        public RequestExceptionType Type { get; set; }

        protected RequestException(RequestExceptionType type)
        {
            Type = type;
        }
    }
}