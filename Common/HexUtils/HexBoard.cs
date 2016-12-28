using System;
using System.Collections.Generic;
using System.Text;

namespace Hex
{
    public class HexBoard
    {
        public static HexBoardModel GenerateBoard()
        {
            var board = new HexBoardModel();
            StringBuilder sb = new StringBuilder(board.Height * (board.Width + 1));
            board.Width = 84 * 5;
            board.Height = 84 * 5;
            var random = new Random();
            Simplex.Noise.Seed = random.Next();
            for (var y = 0; y < board.Height; y++)
            {
                for (var x = 0; x < board.Width; x++)
                {
                    var value = Math.Abs(Simplex.Noise.Generate(x / 90f, y / 90f)) * 90f;
                    sb.Append(Math.Round(value / 15f));
                }
                sb.Append("|");
            }
            board.BoardStr = sb.ToString();
            return board;
        }

        List<GridHexagon> hexList { get; set; } = new List<GridHexagon>();
        private Dictionary<int, GridHexagon> hexBlock { get; set; } = new Dictionary<int, GridHexagon>();
        public Size boardSize { get; set; }
        public HexBoard(HexBoardModel board)
        {
            var str = board.BoardStr;
            this.SetSize(board.Width, board.Height);



            var ys = str.Split('|');
            for (var y = 0; y < board.Height; y++)
            {
                var yItem = ys[y].ToCharArray();
                for (var x = 0; x < board.Width; x++)
                {
                    var xItem = int.Parse(yItem[x].ToString());

                    var gridHexagon = new GridHexagon();
                    gridHexagon.X = x;
                    gridHexagon.Y = 0;
                    gridHexagon.Z = y;
                    gridHexagon.Height = xItem == 0 ? 0 : xItem;
                    if (xItem == 0)
                        this.addHexagon(gridHexagon);
                }
            }
        }

        GridHexagon XYToHexIndex(int x, int y)
        {
            return this.hexBlock[x + y * 5000];
        }
        public void SetSize(int width, int height)
        {
            this.boardSize.Width = width;
            this.boardSize.Height = height;
        }

        public List<GridHexagon> FindAvailableSpots(int radius, GridHexagon center)
        {
            var items = new List<GridHexagon>();
            for (var q = 0; q < this.hexList.Count; q++)
            {
                var item = this.hexList[q];

                if (HexUtils.Distance(center, item) <= radius)
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
            List<GridHexagon> neighbours;
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
                    neighbours = node.Item.GetNeighbors();
                    for (i = 0, j = neighbours.Count; i < j; i++)
                    {
                        var n = this.XYToHexIndex(neighbours[i].X, neighbours[i].Y);
                        if (n == null) continue;
                        if (Math.Abs((node.Item.Y + node.Item.Height) - (n.Y + n.Height)) >= 2)
                            continue;
                        path = new Node(node, n);
                        if (!aStar.Contains(path.Value()))
                        {
                            path.G = node.G + HexUtils.Distance(n, node.Item) + (Math.Abs((node.Item.Y + node.Item.Height) - (n.Y + n.Height)) * 2);
                            path.F = path.G + HexUtils.Distance(n, finish);
                            open.Add(path);
                            aStar.Add(path.Value());
                        }
                    }
                    closed.Add(node);
                }
            }
            return result;
        }

        public void addHexagon(GridHexagon hexagon)
        {
            this.hexList.Add(hexagon);
            this.hexBlock[hexagon.X + hexagon.Z * 5000] = hexagon;
        }
    }
}