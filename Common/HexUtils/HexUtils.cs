using System;

namespace Common.HexUtils
{
    public class HexUtils
    {
        public static int Distance(GridHexagon p1, GridHexagon p2)
        {
            var x1 = p1.X;
            var y1 = p1.Z;

            var x2 = p2.X;
            var y2 = p2.Z;

            var du = x2 - x1;
            var dv = (y2 + ((x2 / 2) | 0)) - (y1 + ((x1 / 2) | 0));
            if ((du >= 0 && dv >= 0) || (du < 0 && dv < 0))
                return Math.Max(Math.Abs(du), Math.Abs(dv));
            else
                return Math.Abs(du) + Math.Abs(dv);
        }
    }
}