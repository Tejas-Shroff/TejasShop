using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Dto.Order
{
    public class UpdateOrderStatusDTO
    {
        public int OrderId { get; set; }
        public string Status { get; set; }
    }
}