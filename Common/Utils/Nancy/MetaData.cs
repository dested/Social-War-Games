namespace Common.Utils.Nancy
{
    public abstract class MetaData
    {
        protected MetaData(MetaDataType type)
        {
            Type = type;
        }

        private MetaDataType Type { get; set; }
    }
}