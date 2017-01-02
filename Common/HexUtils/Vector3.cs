namespace Common.HexUtils
{
    public class Vector3
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }
    }
    public class Vector2
    {
        public Vector2()
        {
        }

        public Vector2(int x, int z)
        {
            X = x;
            Z = z;
        }

        public int X { get; set; }
        public int Z { get; set; }
    }
    public struct VectorHex
    {
        public VectorHex(int x, int z, int item)
        {
            X = x;
            Z = z;
            Item = item;
        }

        public int X { get; set; }
        public int Z { get; set; }
        public int Item { get; set; }
    }

}