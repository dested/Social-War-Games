using System;
using System.Collections.Generic;
using Common.Data;
using Common.GameLogic;

namespace Common.BoardUtils
{
    public static class HexUtils
    {
        public static IEnumerable<VectorHex> ToHexMap(this string hex)
        {
            var zs = hex.Split('|');
            for (var z = 0; z < zs.Length; z++)
            {
                var yItem = zs[z].ToCharArray();
                for (var x = 0; x < yItem.Length; x++)
                {
                    var xItem = int.Parse(yItem[x].ToString());
                    yield return new VectorHex()
                    {
                        X = x,
                        Z = z,
                        Item = xItem
                    };
                }
            }
        }
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

        public static Direction GetDirection(GridHexagon p1, GridHexagon p2)
        {
            // console.log('x1', p1.x, 'x2', p2.x, 'y1', p1.z, 'y2', p2.z);
            string upDown = null;
            string leftRight = null;


            if (p1.X % 2 == 0)
            {
                if (p1.Z == p2.Z)
                {
                    upDown = "up";
                }
                else if (p1.Z < p2.Z)
                {
                    upDown = "down";
                }
                else if (p1.Z > p2.Z)
                {
                    upDown = "up";
                }
            }
            else
            {
                if (p1.Z == p2.Z)
                {
                    upDown = "down";
                }
                else if (p1.Z < p2.Z)
                {
                    upDown = "down";
                }
                else if (p1.Z > p2.Z)
                {
                    upDown = "up";
                }
            }


            if (p1.X < p2.X)
            {
                leftRight = "right";
            }
            else if (p1.X > p2.X)
            {
                leftRight = "left";
            }
            else
            {
                leftRight = "neither";
            }
            switch (leftRight)
            {
                case "left":
                    switch (upDown)
                    {
                        case "up":
                            return Direction.TopLeft;
                        case "down":
                            return Direction.BottomLeft;
                    }
                    break;
                case "right":
                    switch (upDown)
                    {
                        case "up":
                            return Direction.TopRight;
                        case "down":
                            return Direction.BottomRight;
                    }
                    break;
                case "neither":
                    switch (upDown)
                    {
                        case "up":
                            return Direction.Top;
                        case "down":
                            return Direction.Bottom;
                    }
                    break;
            }
            return Direction.Top;
        }

    }
}