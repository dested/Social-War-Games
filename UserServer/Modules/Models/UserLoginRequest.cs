namespace UserServer.Modules.Models
{
    public class UserLoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public int Faction { get; set; }
    }
}