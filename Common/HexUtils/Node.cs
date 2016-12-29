using Common.GameLogic;

namespace Common.HexUtils
{
    class Node
    {
        public Node Parent = null;
        public int X = 0;
        public int Y = 0;
        public GridHexagon Item;
        public int F = 0;
        public int G = 0;

        public Node(Node parent, GridHexagon piece)
        {
            this.Parent = parent;
            // array index of this Node in the world linear array

            // the location coordinates of this Node
            this.X = piece.X;
            this.Y = piece.Z;
            this.Item = piece;
            // the distanceFunction cost to get
            // TO this Node from the START
            this.F = 0;
            // the distanceFunction cost to get
            // from this Node to the GOAL
            this.G = 0;
        }

        public int Value()
        {
            return this.X + (this.Y * 5000);
        }
    }
}