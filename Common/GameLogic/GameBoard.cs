using System;
using System.Collections.Generic;
using Common.Data;
using Common.HexUtils;

namespace Common.GameLogic
{
    public class GameBoard
    {
        public List<GridHexagon> HexList { get; }
        private Dictionary<int, GridHexagon> HexBoard { get; }
        public Size BoardSize { get; set; }
        public GameBoard(MongoGameState.Terrain board)
        {
            BoardSize = new Size();
            HexList = new List<GridHexagon>();
            HexBoard = new Dictionary<int, GridHexagon>();
            var str = board.BoardStr;
            this.SetSize(board.Width, board.Height);

            var zs = str.Split('|');
            for (var z = 0; z < board.Height; z++)
            {
                var yItem = zs[z].ToCharArray();
                for (var x = 0; x < board.Width; x++)
                {
                    var xItem = int.Parse(yItem[x].ToString());

                    var gridHexagon = new GridHexagon();
                    gridHexagon.X = x;
                    gridHexagon.Y = 0;
                    gridHexagon.Z = z;
                    gridHexagon.Height = xItem == 0 ? 0 : xItem;
                    this.Add(gridHexagon);
                }
            }
        }

        public GridHexagon GetHexagon(int x, int z)
        {
            return this.HexBoard[x + z * 5000];
        }
        public void SetSize(int width, int height)
        {
            this.BoardSize.Width = width;
            this.BoardSize.Height = height;
        }

        public List<GridHexagon> FindAvailableSpots(int radius, GridHexagon center)
        {
            var items = new List<GridHexagon>();
            for (var q = 0; q < this.HexList.Count; q++)
            {
                var item = this.HexList[q];

                if (HexUtils.HexUtils.Distance(center, item) <= radius)
                {
                    items.Add(item);
                }
            }
            return items;
        }

        public IEnumerable<GridHexagon> GetSpots(int radius, GridHexagon center)
        {
            var spots = this.FindAvailableSpots(radius, center);
            for (var i = 0; i < spots.Count; i++)
            {
                var spot = spots[i];
                if (spot == center) continue;
                var path = this.PathFind(center, spot);
                if (path.Count > 1 && path.Count <= radius + 1)
                {
                    yield return spot;
                }
            }
        }
        public List<GridHexagon> PathFind(GridHexagon start, GridHexagon finish)
        {
            Node myPathStart = new Node(null, start);
            Node myPathEnd = new Node(null, finish);
            HashSet<int> aStar = new HashSet<int>();
            List<Node> open = new List<Node>() { myPathStart };
            List<Node> closed = new List<Node>();
            var result = new List<GridHexagon>();
            Node node;
            Node path;
            int length, max, min, i, j;
            while (open.Count > 0)
            {
                length = open.Count;
                max = Int32.MaxValue;
                min = -1;
                for (i = 0; i < length; i++)
                {
                    if (open[i].F < max)
                    {
                        max = open[i].F;
                        min = i;
                    }
                }
                node = open[0];
                open.RemoveAt(0);
                if (node.X == myPathEnd.X && node.Y == myPathEnd.Y)
                {
                    closed.Add(node);
                    path = node;
                    do
                    {
                        result.Add(path.Item);
                        path = path.Parent;
                    }
                    while (path != null);
                    closed = open = new List<Node>();
                    aStar = new HashSet<int>();
                    result.Reverse();
                }
                else
                {
                    List<Vector2> neighbours = node.Item.GetNeighbors();
                    for (i = 0, j = neighbours.Count; i < j; i++)
                    {
                        var n = GetHexagon(neighbours[i].X, neighbours[i].Y);
                        if (n == null) continue;
                        if (Math.Abs((node.Item.Y + node.Item.Height) - (n.Y + n.Height)) >= 2)
                            continue;
                        path = new Node(node, n);
                        if (!aStar.Contains(path.Value()))
                        {
                            path.G = node.G + HexUtils.HexUtils.Distance(n, node.Item) + (Math.Abs((node.Item.Y + node.Item.Height) - (n.Y + n.Height)) * 2);
                            path.F = path.G + HexUtils.HexUtils.Distance(n, finish);
                            open.Add(path);
                            aStar.Add(path.Value());
                        }
                    }
                    closed.Add(node);
                }
            }
            return result;
        }

        public void Add(GridHexagon hexagon)
        {
            this.HexList.Add(hexagon);
            this.HexBoard[hexagon.X + hexagon.Z * 5000] = hexagon;
        }
    }
}