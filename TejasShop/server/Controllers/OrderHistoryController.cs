using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderHistoryController : ControllerBase
    {
        private readonly DataContex _contex;

        public OrderHistoryController(DataContex contex)
        {
            _contex = contex;
        }

        [HttpGet]
        [Route("get-All_Users-Orders")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllUserOrders()
        {
            var orders = await _contex.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ToListAsync();
                
            return Ok(orders);
        }
    }
}