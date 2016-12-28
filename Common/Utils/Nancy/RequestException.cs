using System;

namespace Common.Utils.Nancy
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