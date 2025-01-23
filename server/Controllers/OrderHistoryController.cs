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
        public async Task<ActionResult<IEnumerable<object>>> GetAllUserOrders([FromQuery] int months = 0)
        {   
            var query = _contex.Orders
                .Include(o => o.OrderItems) 
                .AsQueryable();
            if (months > 0)
            {
                var cutoffDate = DateTime.UtcNow.AddMonths(-months);
                query = query.Where(o => o.OrderDate >= cutoffDate);
            }
            var orders = await query.Select(o => new
            {
                o.Id,
                o.UserId,
                o.OrderDate,
                o.TotalPriceAfterDiscount,
                o.Status   // Order status

            }).ToListAsync();
        
        return Ok(orders);

        }
    }
}