using Newtonsoft.Json;

namespace Common.Utils.Nancy
{
    public class STResponse
    {
        public STResponse(object data, MetaData meta)
        {
            Data = data;
            Meta = meta;
        }

        public MetaData Meta { get; set; }
        public object Data { get; set; }
        public override string ToString()
        {
            return JsonConvert.SerializeObject(Data, Formatting.Indented);
        }
    }
}