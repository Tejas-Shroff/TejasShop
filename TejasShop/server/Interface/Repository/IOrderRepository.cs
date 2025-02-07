using server.Entities;

namespace server.Interface.Repository
{
    public interface IOrderRepository:IGenericRepository<Order>
    {
        Task<IEnumerable<Order>> GetAllAsyncByUserId(int userId, DateTime? startDate, DateTime? endDate);
    }
}