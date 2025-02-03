namespace server.Entities
{
    public class Address : AuditBaseEntity
    {
        public int Id { get; set; }
        public string FirstName { get; set;}
        public string LastName { get; set;}
        public string AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }

        // Optional reference to the user or other related entity
        public int? UserId { get; set; }
        public User? User { get; set; } 

    }
}