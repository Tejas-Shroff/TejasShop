
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Interface.Repository;

namespace server.Repository
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        private readonly DataContex _contex;
        public OrderRepository(DataContex contex) : base(contex)
        {
            this._contex = contex;
        }

        public async Task<IEnumerable<Order>> GetAllAsyncByUserId(int userId, DateTime? startDate, DateTime? endDate)
        {
            var query = _contex.Orders.Where(o => o.UserId == userId);

            if (startDate.HasValue)
            {
                query = query.Where(o => o.OrderDate >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(o => o.OrderDate <= endDate.Value);
            }

            query = query.OrderByDescending(o => o.OrderDate);

        return await query.ToListAsync();
        }
    }
}