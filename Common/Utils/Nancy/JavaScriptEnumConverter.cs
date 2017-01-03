using System;
using System.Collections.Generic;
using Nancy.Json;

namespace Common.Utils.Nancy
{
    public class JavaScriptEnumConverter : JavaScriptPrimitiveConverter
    {
        public override IEnumerable<Type> SupportedTypes
        {
            get
            {
                return new[] { typeof(Enum) };
            }
        }

        public override object Deserialize(object primitiveValue, Type type, JavaScriptSerializer serializer)
        {
            // cannot determine the concrete enumeration type from parameters
            return null;
        }

        public override object Serialize(object obj, JavaScriptSerializer serializer)
        {
            return obj.ToString();
        }
    }
}