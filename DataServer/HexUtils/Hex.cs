using System;
using System.Collections.Generic;

namespace DataServer.HexUtils
{
    struct Hex
    {
        public Hex(int q, int r, int s)
        {
            this.q = q;
            this.r = r;
            this.s = s;
        }
        public readonly int q;
        public readonly int r;
        public readonly int s;

        static public Hex Add(Hex a, Hex b)
        {
            return new Hex(a.q + b.q, a.r + b.r, a.s + b.s);
        }


        static public Hex Subtract(Hex a, Hex b)
        {
            return new Hex(a.q - b.q, a.r - b.r, a.s - b.s);
        }


        static public Hex Scale(Hex a, int k)
        {
            return new Hex(a.q * k, a.r * k, a.s * k);
        }

        static public List<Hex> directions = new List<Hex> { new Hex(1, 0, -1), new Hex(1, -1, 0), new Hex(0, -1, 1), new Hex(-1, 0, 1), new Hex(-1, 1, 0), new Hex(0, 1, -1) };

        static public Hex Direction(int direction)
        {
            return Hex.directions[direction];
        }


        static public Hex Neighbor(Hex hex, int direction)
        {
            return Hex.Add(hex, Hex.Direction(direction));
        }

        static public List<Hex> diagonals = new List<Hex> { new Hex(2, -1, -1), new Hex(1, -2, 1), new Hex(-1, -1, 2), new Hex(-2, 1, 1), new Hex(-1, 2, -1), new Hex(1, 1, -2) };

        static public Hex DiagonalNeighbor(Hex hex, int direction)
        {
            return Hex.Add(hex, Hex.diagonals[direction]);
        }


        static public int Length(Hex hex)
        {
            return (int)((Math.Abs(hex.q) + Math.Abs(hex.r) + Math.Abs(hex.s)) / 2);
        }


        static public int Distance(Hex a, Hex b)
        {
            return Hex.Length(Hex.Subtract(a, b));
        }

    }
}