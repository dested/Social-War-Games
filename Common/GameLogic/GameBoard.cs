using System;
using System.Collections.Generic;
using System.Text;
using BoardUtils;
using Common.Data;
using Common.BoardUtils;

namespace Common.GameLogic
{
    public class GameBoard
    {
        public MongoGameState.GameState GameState { get; set; }
        public List<GridHexagon> HexList { get; }
        private Dictionary<int, GridHexagon> HexBoard { get; }
        public Size BoardSize { get; set; }
        public GameBoard(MongoGameState.GameState gameState)
        {
            GameState = gameState;
            BoardSize = new Size();
            HexList = new List<GridHexagon>();
            HexBoard = new Dictionary<int, GridHexagon>();
            var str = GameState.Terrain.BoardStr;
            SetSize(GameState.Terrain.Width, GameState.Terrain.Height);

            foreach (var vectorHex in str.ToHexMap())
            {
                var gridHexagon = new GridHexagon();
                gridHexagon.X = vectorHex.X;
                gridHexagon.Z = vectorHex.Z;
                gridHexagon.Height = vectorHex.Item;
                Add(gridHexagon);
            }

            if (GameState.FactionData != null)
            {
                foreach (var vectorHex in GameState.FactionData.ToHexMap())
                {
                    GetHexagon(vectorHex.X, vectorHex.Z).Faction = vectorHex.Item;
                }
            }
        }

        public GridHexagon GetHexagon(int x, int z)
        {
            GridHexagon hex;
            this.HexBoard.TryGetValue(x + z * 5000, out hex);
            return hex;
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

                if (BoardUtils.HexUtils.Distance(center, item) <= radius)
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
                node = open[min];
                open.RemoveAt(min);
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
                        var n = GetHexagon(neighbours[i].X, neighbours[i].Z);
                        if (n == null) continue;
                /*        if (Math.Abs(( node.Item.Height) - ( n.Height)) >= 2)
                            continue;*/
                        path = new Node(node, n);
                        if (!aStar.Contains(path.Value()))
                        {
                            path.G = node.G + BoardUtils.HexUtils.Distance(n, node.Item) /*+ (Math.Abs((node.Item.Height) - (n.Height)) * 2)*/;
                            path.F = path.G + BoardUtils.HexUtils.Distance(n, finish);
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

        public string ToFactionData(MongoGameState.Terrain terrain)
        {
            StringBuilder sb = new StringBuilder(terrain.BoardStr.Length);
            int curZ = 0;
            foreach (var gridHexagon in HexList)
            {
                if (gridHexagon.Z != curZ)
                {
                    sb.Append("|");
                    curZ = gridHexagon.Z;
                }
                sb.Append(gridHexagon.Faction.ToString());
            }
            return sb.ToString();
        }
    }
}