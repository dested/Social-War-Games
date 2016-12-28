using System.Collections.Generic;

namespace Hex
{
    public class GridHexagon
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }
        public int Height { get; set; }

        public List<GridHexagon> GetNeighbors()
        {
            var neighbors = new List<GridHexagon>();

            if ((this.X % 2 == 0))
            {
                neighbors.Add(new GridHexagon() { X = this.X - 1, Y = this.Z });
                neighbors.Add(new GridHexagon() { X = this.X, Y = this.Z - 1 });
                neighbors.Add(new GridHexagon() { X = this.X + 1, Y = this.Z });

                neighbors.Add(new GridHexagon() { X = this.X - 1, Y = this.Z + 1 });
                neighbors.Add(new GridHexagon() { X = this.X, Y = this.Z + 1 });
                neighbors.Add(new GridHexagon() { X = this.X + 1, Y = this.Z + 1 });
            }
            else
            {
                neighbors.Add(new GridHexagon() { X = this.X - 1, Y = this.Z - 1 });
                neighbors.Add(new GridHexagon() { X = this.X, Y = this.Z - 1 });
                neighbors.Add(new GridHexagon() { X = this.X + 1, Y = this.Z - 1 });

                neighbors.Add(new GridHexagon() { X = this.X - 1, Y = this.Z });
                neighbors.Add(new GridHexagon() { X = this.X, Y = this.Z + 1 });
                neighbors.Add(new GridHexagon() { X = this.X + 1, Y = this.Z });
            }
            return neighbors;

        }
    }
}