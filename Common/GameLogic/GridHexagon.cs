using System.Collections.Generic;
using Common.BoardUtils;

namespace Common.GameLogic
{
    public class GridHexagon
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }
        public int Height { get; set; }
        public int Faction { get; set; }

        public List<Vector2> GetNeighbors()
        {
            var neighbors = new List<Vector2>();

            if ((this.X % 2 == 0))
            {
                neighbors.Add(new Vector2() { X = this.X - 1, Z = this.Z });
                neighbors.Add(new Vector2() { X = this.X, Z = this.Z - 1 });
                neighbors.Add(new Vector2() { X = this.X + 1, Z = this.Z });
                                  
                neighbors.Add(new Vector2() { X = this.X - 1, Z = this.Z + 1 });
                neighbors.Add(new Vector2() { X = this.X, Z = this.Z + 1 });
                neighbors.Add(new Vector2() { X = this.X + 1, Z = this.Z + 1 });
            }                     
            else                  
            {                     
                neighbors.Add(new Vector2() { X = this.X - 1, Z = this.Z - 1 });
                neighbors.Add(new Vector2() { X = this.X, Z = this.Z - 1 });
                neighbors.Add(new Vector2() { X = this.X + 1, Z = this.Z - 1 });
                                  
                neighbors.Add(new Vector2() { X = this.X - 1, Z = this.Z });
                neighbors.Add(new Vector2() { X = this.X, Z = this.Z + 1 });
                neighbors.Add(new Vector2() { X = this.X + 1, Z = this.Z });
            }
            return neighbors;

        }
    }
}