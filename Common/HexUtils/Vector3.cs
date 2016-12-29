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

        public Vector2(int x, int y)
        {
            X = x;
            Y = y;
        }

        public int X { get; set; }
        public int Y { get; set; }
    }
}