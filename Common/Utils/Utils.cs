using System;
using System.Collections.Generic;
using System.Linq;

namespace Common.Utils
{
    public static class Utils
    {
        public static T ParseEnum<T>(string name)
        {
            return (T) Enum.Parse(typeof (T), name);
        }

        static Random random = new Random();

        public static T Random<T>(this List<T> items)
        {
            var n = random.Next(items.Count);
            return items[n];
        }
    }
}