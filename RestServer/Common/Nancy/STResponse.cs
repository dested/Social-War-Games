namespace RestServer.Common.Nancy
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
    }
}