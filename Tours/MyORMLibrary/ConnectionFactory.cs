using Npgsql;
using System.Data;

namespace MyORMLibrary
{
    public class ConnectionPostgresFactory : IConnectionFactory
    {
        private readonly string _connectionString;

        public ConnectionPostgresFactory(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IDbConnection CreateConnection()
        {
            return new NpgsqlConnection(_connectionString);
        }
    }
}
